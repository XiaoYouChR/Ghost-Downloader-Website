/**
 * Translate .zh.mdx docs to English using DeepSeek API.
 *
 * Usage:
 *   DEEPSEEK_API_KEY=sk-xxx node scripts/translate.mjs                # all files
 *   DEEPSEEK_API_KEY=sk-xxx node scripts/translate.mjs overview       # single file (stem match)
 *   DEEPSEEK_API_KEY=sk-xxx node scripts/translate.mjs --dry-run      # preview without writing
 */

import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from 'fs';
import { join, basename, dirname } from 'path';
import { execFile } from 'child_process';
import { tmpdir } from 'os';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FILTER = args.find(a => !a.startsWith('--'));

if (!API_KEY) {
  console.error('Set DEEPSEEK_API_KEY');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Glossary — extracted from GD3 CONTEXT.md Language section.
// The translation agent sees this on every call.
// ---------------------------------------------------------------------------

const GLOSSARY = `
## Glossary — use these terms consistently

Task: A user-visible download item. States: WAITING, RUNNING, PAUSED, COMPLETED, FAILED. Avoid: download, job.
Task Files: The download files and chunk temp files a Task produces. Avoid: confusing with Selectable File.
Pausable: Whether a Task can be paused (derived from whether the current Step supports byte-range resume).
Task Error: A known failure during Task execution carrying a user-visible message template.
Selectable File: A checkable download unit inside a multi-file Task. Avoid: confusing with Task Files.
Revive: A COMPLETED Task returning to download state because newly selected files have pending work.
Task Options: Application-level options for parsing, creating, or editing a Task. Avoid: payload.
Task Parser: A FeaturePack capability that converts Task Options into a Task.
Task Draft: An unconfirmed task state before user confirmation. Contains Draft Items (Parsing / Resolved / Failed).
Resource: A downloadable item captured by the browser extension. Avoid: confusing with generic "resource".
Task Run: The current execution of a Task in the download loop. A Task has zero or one active Task Run.
Task Step: An executable step within a Task. A Task may have one or more Steps. Avoid: stage, phase, action.
Subworker: A chunk transfer unit within an HTTP or FTP Step, responsible for one byte-range. Avoid: worker, thread, chunk.
Task Service: The sole public entry point for user-visible task workflow.
Feature Service: Owns pack discovery, parser priority routing, and pack lifecycle.
FeaturePack: A plugin package. Avoid: module, extension.
Binary Runtime: An external executable family a FeaturePack can probe or install.
Browser Service: The browser extension's protocol adapter.
Category: Download classification and target directory rule. Avoid: group, tag, type.
Coroutine Runner: The application actor that runs async work and bridges back to the UI thread.
Speed Meter: Global download speed monitor with rate limiting.
Signal Bus: Process-level event bus for cross-module application events only.
Client: HTTP client with optional TLS fingerprint emulation.
Plan: "Do X after all tasks complete" intent (shutdown, restart, hibernate, open file).
Settings: Application-level user configuration. Avoid: options (options is per-Task input).
`.trim();

// ---------------------------------------------------------------------------
// System prompt — the agent's full context
// ---------------------------------------------------------------------------

const SYSTEM = `You translate Ghost Downloader documentation from Chinese to English.

Ghost Downloader is a multi-protocol download manager built with PySide6. Desktop (Windows, macOS, Linux) and Android share one business engine. A browser extension captures resources and sends them to the desktop app.

## Rules

Translate prose. Preserve structure:
- MDX frontmatter: translate title and description values only. Keep all other YAML keys and values as-is.
- Component tags (<Steps>, <Step>, <Tab>, <Tabs>, <Callout>, <Cards>, <Card>, <Accordion>, <Accordions>, <TypeTable>, <GithubInfo>, <ImageZoom>): keep exactly as-is, including all props.
- Code blocks, file paths, URLs, command-line examples: keep exactly as-is.
- Internal links like [中文文本](./path): translate the link text, keep the path unchanged.
- Image alt text: translate to English.
- Table structure (pipes and alignment): preserve exactly.
- HTML entities and special characters: preserve.

## Style

Write like an engineer's reference:
- Direct statements. No narration ("Let's look at...", "It's worth noting...", "In this section we will...").
- Periods and commas for pauses. No em-dashes (—).
- Short, technical sentences.
- Preserve the original meaning exactly. No additions, no omissions, no reinterpretation.
- Match the register of the Chinese: if it is terse, be terse; if it explains a reason, keep the reason.

${GLOSSARY}

## Output

Return ONLY the translated MDX content. No wrapping, no explanation, no markdown fences around the whole output.`;

// ---------------------------------------------------------------------------
// Find all .zh.mdx files
// ---------------------------------------------------------------------------

function findZhFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findZhFiles(full));
    } else if (entry.endsWith('.zh.mdx')) {
      results.push(full);
    }
  }
  return results.sort();
}

// ---------------------------------------------------------------------------
// Call DeepSeek API
// ---------------------------------------------------------------------------

let tmpCounter = 0;

async function translate(zhContent) {
  const payload = JSON.stringify({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: zhContent },
    ],
    max_tokens: 65536,
    thinking: { type: 'enabled' },
  });

  const tmpFile = join(tmpdir(), `gd-translate-${process.pid}-${tmpCounter++}.json`);
  writeFileSync(tmpFile, payload);

  try {
    const { stdout } = await execFileAsync('curl', [
      '-s', '--max-time', '120',
      `${BASE_URL}/chat/completions`,
      '-H', 'Content-Type: application/json',
      '-H', `Authorization: Bearer ${API_KEY}`,
      '-d', `@${tmpFile}`,
    ], { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });

    const json = JSON.parse(stdout);
    if (json.error) throw new Error(json.error.message);
    return json.choices[0].message.content.trim();
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}

async function pool(items, concurrency, fn) {
  const results = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

// ---------------------------------------------------------------------------
// Validate translated output
// ---------------------------------------------------------------------------

function validate(zh, en) {
  const issues = [];

  // Frontmatter present
  if (!en.startsWith('---')) {
    issues.push('Missing frontmatter');
  }

  // Component tag count check
  const tagRe = /<\/?(Steps|Step|Tabs|Tab|Callout|Cards|Card|Accordions?|TypeTable|GithubInfo|ImageZoom)\b/g;
  const zhTags = (zh.match(tagRe) || []).length;
  const enTags = (en.match(tagRe) || []).length;
  if (zhTags !== enTags) {
    issues.push(`Component tag count mismatch: zh=${zhTags} en=${enTags}`);
  }

  // Code block count check
  const codeRe = /```/g;
  const zhCode = (zh.match(codeRe) || []).length;
  const enCode = (en.match(codeRe) || []).length;
  if (zhCode !== enCode) {
    issues.push(`Code block fence count mismatch: zh=${zhCode} en=${enCode}`);
  }

  // Link path preservation
  const linkPathRe = /\]\(\.\/[^)]+\)/g;
  const zhLinks = new Set((zh.match(linkPathRe) || []).map(s => s));
  const enLinks = new Set((en.match(linkPathRe) || []).map(s => s));
  for (const l of zhLinks) {
    if (!enLinks.has(l)) {
      issues.push(`Link path missing in translation: ${l}`);
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const DOCS_DIR = join(import.meta.dirname, '..', 'content', 'docs');
const allFiles = findZhFiles(DOCS_DIR);

const files = FILTER
  ? allFiles.filter(f => basename(f, '.zh.mdx').includes(FILTER))
  : allFiles;

const CONCURRENCY = parseInt(process.env.CONCURRENCY || '52', 10);

console.log(`Found ${files.length} file(s) to translate${DRY_RUN ? ' (dry run)' : ` (concurrency: ${CONCURRENCY})`}\n`);

if (DRY_RUN) {
  for (const zhPath of files) {
    const rel = zhPath.replace(DOCS_DIR + '/', '');
    console.log(`  ${rel} → ${basename(zhPath, '.zh.mdx')}.mdx (skip)`);
  }
  console.log(`\nDone: ${files.length} listed`);
} else {
  let ok = 0;
  let fail = 0;

  await pool(files, CONCURRENCY, async (zhPath) => {
    const stem = basename(zhPath, '.zh.mdx');
    const enPath = join(dirname(zhPath), `${stem}.mdx`);
    const rel = zhPath.replace(DOCS_DIR + '/', '');

    try {
      const zhContent = readFileSync(zhPath, 'utf-8');
      const enContent = await translate(zhContent);
      const issues = validate(zhContent, enContent);

      const warn = issues.length > 0 ? ` WARN: ${issues.join('; ')}` : '';
      writeFileSync(enPath, enContent + '\n', 'utf-8');
      console.log(`  ✓ ${rel} → ${stem}.mdx (${enContent.split('\n').length} lines)${warn}`);
      ok++;
    } catch (err) {
      console.log(`  ✗ ${rel} FAIL: ${err.message}`);
      fail++;
    }
  });

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}
