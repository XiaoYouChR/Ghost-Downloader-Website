// 首页「浏览器层」截图，cwd 为本目录:
// 1. ./prep.sh
// 2. python3 server.py &                                                         同名限速假 ISO，14392
//    (cd /tmp/gd-browser/app-work && <GD3>/.venv/bin/python <本目录>/desktop.py &)   桌面端，Browser Service 在 14391
// 3. for t in light dark; do node shoot.mjs $t takeover && node shoot.mjs $t media; done
// 产出 ../out/browser-<theme>/，deviceScaleFactor 2：
//   media    page.png button.png popup.png        B 站视频页 + 「下载此媒体」按钮 + 弹窗资源页
//   takeover takeover-page.png takeover-moment.png  Ubuntu 镜像目录页 + 接管后自动弹出的弹窗任务页
//   layers.json 记录各文件逻辑尺寸和坐标（两种模式各自合并写入）
//
// 品牌版 Chrome 137+ 不认 --load-extension，扩展经 CDP Extensions.loadUnpacked 装载（需要 pipe 连接，Playwright 默认就是）
// B 站深色主题只对「已登录」生效：判断依据是 DedeUserID cookie 存在。这里只放一个假的 DedeUserID 让主题样式加载，不登录
import { chromium } from "/Users/xiaoyouchr/.npm/_npx/705bc6b22212b352/node_modules/playwright-core/index.mjs";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const [THEME, MODE] = process.argv.slice(2);
const WORK = "/tmp/gd-browser";
const OUT = new URL(`../out/browser-${THEME}/`, import.meta.url).pathname;
const VIEW = { width: 1440, height: 900 };
const POPUP = { width: 455, height: 600 };

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });
rmSync(`${WORK}/profile-${THEME}`, { recursive: true, force: true });

const ctx = await chromium.launchPersistentContext(`${WORK}/profile-${THEME}`, {
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: false,
  viewport: VIEW,
  deviceScaleFactor: 2,
  locale: "zh-CN",
  colorScheme: THEME,
  downloadsPath: `${WORK}/chrome-downloads`,
  args: ["--enable-unsafe-extension-debugging", "--lang=zh-CN", "--autoplay-policy=no-user-gesture-required"],
  ignoreDefaultArgs: ["--disable-extensions"],
});

const cdp = await ctx.browser().newBrowserCDPSession();
const { id: extId } = await cdp.send("Extensions.loadUnpacked", { path: `${WORK}/ext` });
// Playwright 默认接管下载（allowAndName），会绕过扩展的 onDeterminingFilename；还给 Chrome 自己处理
await cdp.send("Browser.setDownloadBehavior", { behavior: "default" });
const worker = ctx.serviceWorkers().find((w) => w.url().includes(extId))
  ?? await ctx.waitForEvent("serviceworker", { predicate: (w) => w.url().includes(extId) });
await worker.evaluate(async (theme) => {
  // 配对令牌与 prep.sh 写进桌面端 UserConfig.json 的相同，等于已完成 Pairing
  await chrome.storage.local.set({ desktopServerUrl: "ws://127.0.0.1:14391", gd4bThemePreference: theme, pairToken: "gd-website-shots" });
}, THEME);
console.log("ui language:", await worker.evaluate(() => chrome.i18n.getUILanguage()));

const page = ctx.pages()[0];
const layers = existsSync(`${OUT}layers.json`) ? JSON.parse(readFileSync(`${OUT}layers.json`, "utf8")) : {};
layers.deviceScaleFactor = 2;
layers.theme = THEME;

async function openPopupTab(tabName) {
  // 后台用「当前窗口的活动标签」决定资源归属；弹窗以标签页打开时自己成了活动标签，所以把这一查询指回 B 站标签
  await worker.evaluate(() => {
    const query = chrome.tabs.query.bind(chrome.tabs);
    chrome.tabs.query = (info, ...rest) =>
      query(info.active && info.currentWindow ? { url: "*://www.bilibili.com/video/*" } : info, ...rest);
  });
  const popup = await ctx.newPage();
  await popup.setViewportSize(POPUP);
  await popup.goto(`chrome-extension://${extId}/popup.html`);
  await popup.getByText("已连接", { exact: true }).waitFor({ timeout: 15000 });
  if (tabName) await popup.getByText(tabName, { exact: true }).first().click();
  return popup;
}

if (MODE === "media") {
  const VIDEO = "https://www.bilibili.com/video/BV1DT4y1z7a1/";  // 【4K】大雄兔 Big Buck Bunny（Blender 开放电影）
  const SEEK = Number(process.env.SEEK ?? 160);
  await ctx.addCookies([
    { name: "theme_style", value: THEME, domain: ".bilibili.com", path: "/" },
    { name: "DedeUserID", value: "1", domain: ".bilibili.com", path: "/" },
  ]);
  await page.goto(VIDEO, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("video");
  await wait(8000);

  // 去掉游客提示（静音开播、登录看高清）、暂停态大播放图标和搜索框里的热搜词
  await page.addStyleTag({ content: `
    .bpx-player-toast-wrap, .bpx-player-dialog-wrap, .bpx-player-state-wrap { display: none !important; }
    .nav-search-input::placeholder { color: transparent !important; }
  ` });
  await page.evaluate(async (t) => {
    const v = document.querySelector("video");
    v.muted = true;
    v.currentTime = t;
    await v.play().catch(() => {});
    await new Promise((r) => setTimeout(r, 2500));
    v.pause();
    window.scrollTo(0, 0);
  }, SEEK);

  // 鼠标划过视频让按钮浮现，再停到按钮上让它常驻；按钮在视频外，播放器控件随后自动隐藏
  const vb = await (await page.$("video")).boundingBox();
  await page.mouse.move(vb.x + vb.width * 0.5, vb.y + vb.height * 0.5, { steps: 8 });
  await page.mouse.move(vb.x + vb.width * 0.7, vb.y + vb.height * 0.4, { steps: 8 });
  await page.waitForFunction(() => document.getElementById("ghostDownloaderMediaDownload")?.style.opacity === "1");
  await wait(500);
  const hb = await (await page.$("#ghostDownloaderMediaDownload")).boundingBox();
  await page.mouse.move(hb.x + hb.width - 2, hb.y + hb.height - 2, { steps: 4 });
  await page.evaluate(() => {
    // 鼠标停在按钮上只是为了让它不自动隐藏，截图里呈现静止态
    const s = document.createElement("style");
    s.textContent = "button:hover, .close:hover { background: rgba(255,255,255,.96) !important; } .close:hover { color: #616161 !important; }";
    document.getElementById("ghostDownloaderMediaDownload").shadowRoot.appendChild(s);
  });
  await wait(3500);
  await page.screenshot({ path: `${OUT}page.png` });

  // button.png：透明底，保留按钮自带投影
  const PAD = 24;
  await page.addStyleTag({ content: "html.__gdshot, html.__gdshot body { background: transparent !important; } html.__gdshot body { visibility: hidden !important; }" });
  await page.evaluate(() => document.documentElement.classList.add("__gdshot"));
  const button = { x: Math.round(hb.x) - PAD, y: Math.round(hb.y) - PAD, width: Math.round(hb.width) + PAD * 2, height: Math.round(hb.height) + PAD * 2 };
  await page.screenshot({ path: `${OUT}button.png`, clip: button, omitBackground: true });
  await page.evaluate(() => document.documentElement.classList.remove("__gdshot"));

  const popup = await openPopupTab("资源");
  await popup.getByText(/个 DASH 分片/).click();
  await wait(2500);
  await popup.screenshot({ path: `${OUT}popup.png` });

  Object.assign(layers, {
    video: VIDEO,
    "page.png": { ...VIEW, video: { x: vb.x, y: vb.y, width: vb.width, height: vb.height } },
    "button.png": {
      ...button, padding: PAD,
      note: "透明底含投影；x/y 是 button.png 左上角在 page.png 中的位置（逻辑像素），按钮本体在其内缩 padding",
    },
    "popup.png": POPUP,
  });
}

if (MODE === "takeover") {
  const PAGE = "https://releases.ubuntu.com/26.04/";
  const FILE = "ubuntu-26.04-desktop-amd64.iso";
  await page.goto(PAGE, { waitUntil: "networkidle" });
  const link = page.getByRole("link", { name: FILE, exact: true });
  await link.evaluate((a) => {
    const row = a.closest("tr");
    window.scrollTo(0, row.getBoundingClientRect().top + scrollY - 420);
  });
  await wait(800);
  await page.mouse.move(0, 0);
  await page.screenshot({ path: `${OUT}takeover-page.png` });
  const lb = await link.boundingBox();

  // 链接改指同名的本地限速文件，再真实点击：Chrome 发起下载 → 扩展取消并交给桌面端 → 扩展自动打开弹窗
  await link.evaluate((a, f) => { a.href = `http://127.0.0.1:14392/${f}`; }, FILE);
  const opened = ctx.waitForEvent("page", { predicate: (p) => p.url().includes("popup.html"), timeout: 10000 }).catch(() => null);
  await link.click();
  let popup = await opened;
  console.log("action popup opened by extension:", Boolean(popup));
  if (!popup) popup = await openPopupTab();
  await popup.getByText(FILE).waitFor({ timeout: 15000 });
  await wait(Number(process.env.RUN_MS ?? 4000));
  await popup.screenshot({ path: `${OUT}takeover-moment.png` });
  console.log("popup size:", await popup.evaluate(() => [innerWidth, innerHeight]));

  Object.assign(layers, {
    takeoverPage: PAGE,
    "takeover-page.png": { ...VIEW, link: { x: lb.x, y: lb.y, width: lb.width, height: lb.height, note: `被点击的 ${FILE} 链接` } },
    "takeover-moment.png": POPUP,
  });
}

if (MODE === "click") {
  // 端到端验证：「下载此媒体」真的把任务送到桌面端
  await ctx.addCookies([{ name: "theme_style", value: THEME, domain: ".bilibili.com", path: "/" }]);
  await page.goto("https://www.bilibili.com/video/BV1DT4y1z7a1/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("video");
  await wait(8000);
  const vb = await (await page.$("video")).boundingBox();
  await page.mouse.move(vb.x + vb.width * 0.5, vb.y + vb.height * 0.5, { steps: 8 });
  await page.waitForFunction(() => document.getElementById("ghostDownloaderMediaDownload")?.style.opacity === "1");
  await (await page.$("#ghostDownloaderMediaDownload")).evaluate((h) => h.shadowRoot.querySelector("button").click());
  await wait(6000);
  console.log("button after click:", await page.evaluate(() => document.getElementById("ghostDownloaderMediaDownload").shadowRoot.querySelector(".wrapper").innerText));
}

if (MODE !== "click") writeFileSync(`${OUT}layers.json`, JSON.stringify(layers, null, 2));
await ctx.close();
