import { en } from './en';
import { zh } from './zh';
import type { CopyTable } from './types';

export type { Translate } from './types';

const tables: Record<string, CopyTable> = { en, zh };

export function createTranslator(lang: string) {
  const table = tables[lang] ?? en;

  return (key: keyof typeof en) => table[key];
}
