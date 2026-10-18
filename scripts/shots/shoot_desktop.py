# 用法（cwd 必须是 /tmp/gd-banner，server.py 已在 18765 运行）:
#   SHOT_THEME=dark SHOT_SCENE=sniff python <本目录>/shoot_desktop.py
# 场景:
#   sniff    out/shot-04-<theme>.png  扩展推来的 B 站任务落到列表顶端（走 BrowserService 真实解析，排队等待）
#   live     out/shot-06-<theme>.png  真录制本地直播 HLS（server.py /live/），趁「录制中」那一刻截
#            out/stack-<theme>/live-card.png
#   hero     out/shot-01-<theme>.png  首屏全景：HTTP 下载中、直播录制中、B 站排队、BT 暂停、已完成，一屏多协议
#   quality  out/shot-07-<theme>.png  添加任务对话框：片段裁剪 + 起点缩略图 + 视频画质菜单展开（真解析 B 站长视频）
#            out/stack-<theme>/quality-menu.png
#   stack    out/stack-<theme>/{drawer-bt,files-bt,draft,trim-yt,trim-bili}.png
# B 站 Cookie、M3U8/FFmpeg/yt-dlp 运行时只在内存里指向用户自己的安装，不写进 /tmp 的配置
import importlib.util, json, os, re, sys, time
from pathlib import Path

REPO = "/Users/xiaoyouchr/PycharmProjects/Ghost-Downloader-3"
WORK = "/tmp/gd-banner"
USER_DATA = Path.home() / "Library/Application Support/GhostDownloader"
THEME = os.environ["SHOT_THEME"]
SCENE = os.environ["SHOT_SCENE"]
STACK = f"{WORK}/out/stack-{THEME}"
SHOWN_FOLDER = "/Users/ghost/Downloads"
del sys.argv[1:]
os.chdir(WORK)
sys.path.insert(0, REPO)
spec = importlib.util.spec_from_file_location("gd3main", f"{REPO}/Ghost-Downloader-3.py")
gd3 = importlib.util.module_from_spec(spec); spec.loader.exec_module(gd3)

import app.startup as startup
startup.checkUpdateAtStartup = lambda *a, **k: None

from app.config.constants import DESKTOP_ID
from app.platform.application import SingletonApplication
from PySide6.QtCore import QPoint, QTimer
from PySide6.QtGui import QCursor, QPainter
from PySide6.QtWidgets import QApplication, QLabel, QLineEdit

gd3.setupEnvironment()
application = SingletonApplication(sys.argv, DESKTOP_ID)
gd3.startApp(application)
state = {}

BILI_HDR = "https://www.bilibili.com/video/BV1Uv411x7Fu"
SNIFF_TITLE = "【4K HDR】冰岛极光延时 合集"
LIVE_URL = "http://127.0.0.1:18765/live/index.m3u8"
LIVE_TITLE = "【直播】Blender Conference 2026 主会场"
DRAFT_URLS = [
    "https://github.com/XiaoYouChR/Ghost-Downloader-3/releases/download/v4.4.0/Ghost-Downloader-v4.4.0-macOS-arm64.dmg",
    "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    BILI_HDR,
]


def save(widget, path):
    pm = widget.grab()
    savePixmap(pm, path)
    return pm


def savePixmap(pm, path):
    os.makedirs(os.path.dirname(f"{WORK}/out/{path}"), exist_ok=True)
    pm.save(f"{WORK}/out/{path}.png")
    print("SAVED", path, pm.width(), pm.height(), flush=True)
    if path.startswith("stack-"):
        record(path.split("/", 1)[1], pm.width() / pm.devicePixelRatio(), pm.height() / pm.devicePixelRatio())


def record(name, width, height):
    index = f"{STACK}/layers.json"
    layers = json.load(open(index)) if os.path.exists(index) else {}
    layers[name] = {"width": round(width), "height": round(height), "file": f"{name}.png"}
    json.dump(dict(sorted(layers.items())), open(index, "w"), ensure_ascii=False, indent=1)


def waitFor(condition, then, timeout=90, every=200, started=None):
    if started is None:
        print("WAIT", SCENE, flush=True)
    started = started or time.time()
    if condition():
        then(); return
    if time.time() - started > timeout:
        print("TIMEOUT", SCENE, flush=True); finish(); return
    QTimer.singleShot(every, lambda: waitFor(condition, then, timeout, every, started))


def useUserRuntimes():
    from bili_pack.config import bilibiliConfig
    from m3u8_pack.config import m3u8Config
    from ffmpeg_pack.config import ffmpegConfig
    from yt_dlp_pack.config import ytDlpConfig
    user = json.load(open(USER_DATA / "UserConfig.json"))
    bilibiliConfig.userCookie.value = user["Bilibili"]["UserCookie"]
    bilibiliConfig.shouldIncludeHdr.value = True
    bilibiliConfig.shouldIncludeDolby.value = True
    bilibiliConfig.defaultQuality.value = 120
    m3u8Config.installFolder.value = str(USER_DATA / "M3U8DL")
    ffmpegConfig.installFolder.value = str(USER_DATA / "FFmpeg")
    ytDlpConfig.installFolder.value = str(USER_DATA / "YtDlp")


def finish():
    from bili_pack.config import bilibiliConfig
    bilibiliConfig.userCookie.value = ""
    QTimer.singleShot(300, application.quit)


def mainWindow():
    return next(w for w in QApplication.topLevelWidgets() if type(w).__name__ == "MainWindow")


def taskPage(w):
    return next(c for c in w.findChildren(object) if type(c).__name__ == "TaskPage")


def push(w, url, title, onParsed=None):
    """走浏览器扩展「下载此媒体」的同一条入口：PAGE_MEDIA → 解析 → 直接入队"""
    service = w._browserService
    service._sendCreateTaskResult = lambda *a, **k: print("PUSH RESULT", a[2:], k, flush=True)
    if onParsed is not None:
        original = service._onTaskParsed
        service._onTaskParsed = lambda task, *a, **k: (onParsed(task), original(task, *a, **k))
    service._onCreateTask(None, {
        "requestId": f"shot-{int(time.time())}", "source": "page_media", "title": title, "draft": False,
        "payload": {"url": url, "pageUrl": url, "pageTitle": title, "path": f"{WORK}/downloads",
                    "headers": {"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                                              "(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"}},
    })


def trafficLights(w):
    """原生红黄绿按钮是 NSView，grab() 拍不到；读出它们在窗口里的真实位置，换算成 Qt 坐标（左上原点）"""
    import Cocoa, objc
    from ctypes import c_void_p
    window = objc.objc_object(c_void_p=int(w.winId())).window()
    height = window.contentView().frame().size.height
    lights = []
    for kind in (Cocoa.NSWindowCloseButton, Cocoa.NSWindowMiniaturizeButton, Cocoa.NSWindowZoomButton):
        button = window.standardWindowButton_(kind)
        r = button.convertRect_toView_(button.bounds(), None)
        lights.append((r.origin.x, height - r.origin.y - r.size.height, r.size.width, r.size.height))
    return lights


# macOS 活动窗口的红黄绿：填充色和 0.5pt 描边。直径 12pt，圆心在按钮 frame 中心（对照过 cacheDisplayInRect 的原生渲染）
LIGHT_COLORS = (("#ff5f57", "#e2463f"), ("#febc2e", "#e1a116"), ("#28c840", "#1aab29"))


def grabWindow(w):
    from PySide6.QtCore import QPointF
    from PySide6.QtGui import QColor, QPen
    pm = w.grab()
    painter = QPainter(pm)
    painter.setRenderHint(QPainter.Antialiasing)
    for (x, y, width, height), (fill, edge) in zip(trafficLights(w), LIGHT_COLORS):
        painter.setPen(QPen(QColor(edge), 0.5))
        painter.setBrush(QColor(fill))
        painter.drawEllipse(QPointF(x + width / 2, y + height / 2), 5.75, 5.75)
    painter.end()
    return pm


def hideTmpPaths(root):
    for widget in root.findChildren(QLineEdit) + root.findChildren(QLabel):
        text = widget.text()
        if "/tmp/gd-banner" in text:
            widget.setText(re.sub(r"/tmp/gd-banner/downloads", SHOWN_FOLDER, text))
    for widget in root.findChildren(object):
        if hasattr(widget, "setPath") and type(widget).__name__.endswith("Picker"):
            widget.setPath(SHOWN_FOLDER)


# ── sniff ──

def sniff(w):
    from app.config.cfg import cfg
    w.resize(960, 720)
    cfg.maxTaskNum.value = 2   # 两条 HTTP 正在跑，新推来的任务如实排队
    QTimer.singleShot(800, lambda: push(w, BILI_HDR, SNIFF_TITLE))
    pushed = lambda: next((t for t in w._taskService.tasks if t.packId == "bili"), None)
    QTimer.singleShot(1000, lambda: waitFor(pushed, lambda: QTimer.singleShot(2500, sniffShot)))


def sniffShot():
    w = state["w"]
    task = next(t for t in w._taskService.tasks if t.packId == "bili")
    print("SNIFF", task.name, task.status, flush=True)
    savePixmap(grabWindow(w), f"shot-04-{THEME}")
    finish()


# ── live ──

def hero(w):
    from app.config.cfg import cfg
    cfg.maxTaskNum.value = 3   # 两条 HTTP 加一条直播在跑，B 站任务如实排队
    live(w, size=(1280, 700), shot="shot-01")
    # 两条 HTTP 恢复之后再推，槽位已满，才会排队
    seconds = int(os.environ.get("SHOT_RECORD_SECONDS", "150"))
    QTimer.singleShot((seconds - 8) * 1000, lambda: push(w, BILI_HDR, SNIFF_TITLE))


def live(w, size=(1180, 740), shot="shot-06"):
    state["shot"] = shot
    # 录两分多钟；两条 HTTP 先暂停，临截图前再继续，否则本地限速源早就跑完了
    seconds = int(os.environ.get("SHOT_RECORD_SECONDS", "150"))
    w.resize(*size)
    from app.models.task import TaskStatus
    http = {t.name.split("-")[0]: t for t in w._taskService.tasks
            if t.packId == "http" and t.status != TaskStatus.COMPLETED}
    for task in http.values():
        w._taskService.pause(task)
    push(w, LIVE_URL, LIVE_TITLE, onParsed=lambda task: task.setOptions({"recordLimit": "02:00:00"}))
    QTimer.singleShot((seconds - 25) * 1000, lambda: w._taskService.start(http["ubuntu"]))
    QTimer.singleShot((seconds - 12) * 1000, lambda: w._taskService.start(http["blender"]))
    QTimer.singleShot(seconds * 1000, liveWait)


def liveTask():
    return next(t for t in state["w"]._taskService.tasks if t.name.startswith("【直播】"))


def liveWait():
    def recording():
        step = liveTask().steps[0]
        return step.liveStatus == "Recording" and step.speed > 0
    waitFor(recording, liveShot, timeout=60, every=50)


def liveShot():
    w = state["w"]
    page = taskPage(w)
    page._refreshTickingCards()
    QApplication.processEvents()
    task = liveTask()
    step = task.steps[0]
    print("LIVE", task.status, step.liveStatus, step.liveElapsed, step.recordLimit, step.speed, flush=True)
    savePixmap(grabWindow(w), f"{state['shot']}-{THEME}")
    card = next(c for c in page._liveCards.values() if getattr(c, "task", None) is task or getattr(c, "_task", None) is task)
    save(card, f"stack-{THEME}/live-card")
    step.terminate()
    QTimer.singleShot(3000, finish)


# ── quality ──

def quality(w):
    from bili_pack.config import bilibiliConfig
    bilibiliConfig.defaultQuality.value = 125   # 默认选中真彩 HDR
    w.resize(1360, 850)   # 14 档画质的菜单有 443px 高，窗口再矮就会被截掉
    w.move(w.screen().availableGeometry().topLeft() + QPoint(40, 10))   # 贴屏幕顶，菜单才会在按钮下方展开
    # showMask() 是模态 exec()，等待逻辑要在打开对话框之前排进事件队列
    QTimer.singleShot(0, lambda: w.addUrls([BILI_HDR]))   # 有 HDR 片源，菜单里才会出现「真彩 HDR」
    waitFor(lambda: biliCard(w) is not None and len(biliCard(w)._trackBar.videoButton._options) > 1,
            lambda: QTimer.singleShot(2500, qualityOpen), timeout=120, every=500)


def biliCard(w):
    return next((c for c in w._draftDialog.findChildren(object) if type(c).__name__ == "BilibiliDraftCard"), None)


def qualityOpen():
    """开片段裁剪，拖起点出缩略图，再展开画质菜单：三件事叠在一张图里"""
    w = state["w"]
    dialog = w._draftDialog
    dialog.urlEdit.horizontalScrollBar().setValue(0)
    dialog.urlEdit.clearFocus()
    hideTmpPaths(dialog)
    card = biliCard(w)
    card._onTrimToggled()
    slider = card._rangeSlider
    slider.setValues(int(slider.endValue() * .35), int(slider.endValue() * .85))
    ready = lambda: slider._previewProvider is not None and slider._previewProvider(slider.startValue()) is not None
    waitFor(ready, lambda: QTimer.singleShot(1500, qualityPreview), timeout=60, every=300)


def qualityPreview():
    w = state["w"]
    slider = biliCard(w)._rangeSlider
    slider._updatePreview(slider._toPixelX(slider.startValue()))
    QApplication.processEvents()
    preview = slider._preview
    state["preview"] = (preview.grab(), preview.mapToGlobal(QPoint(0, 0)) - w.mapToGlobal(QPoint(0, 0)))
    print("PREVIEW", preview.isVisible(), preview.size(), flush=True)
    QCursor.setPos(w.screen().geometry().bottomRight())   # 光标留在菜单上会高亮一行
    QTimer.singleShot(1200, qualityShot)
    biliCard(w)._trackBar.videoButton.click()


def qualityShot():
    w = state["w"]
    menu = next(m for m in QApplication.topLevelWidgets()
                if type(m).__name__ == "CheckableMenu" and m.isVisible())
    print("MENU", [a.text() for a in menu.actions()], flush=True)
    window = grabWindow(w)
    popup = menu.grab()
    thumbnail, at = state["preview"]
    painter = QPainter(window)
    painter.drawPixmap(at, thumbnail)
    painter.drawPixmap(menu.mapToGlobal(QPoint(0, 0)) - w.mapToGlobal(QPoint(0, 0)), popup)
    painter.end()
    savePixmap(window, f"shot-07-{THEME}")
    savePixmap(popup, f"stack-{THEME}/quality-menu")
    menu.close()
    finish()


# ── stack ──

def stack(w):
    # 抽屉跟窗口一样高，窗口拉高才能露出种子 / Tracker 卡
    w.move(w.screen().availableGeometry().topLeft() + QPoint(40, 0))
    w.resize(1180, min(1040, w.screen().availableGeometry().height()))
    print("SCREEN", w.screen().availableGeometry(), flush=True)
    QTimer.singleShot(4000, stackDrawer)


def bigBuckBunny():
    return next(t for t in state["w"]._taskService.tasks if t.name == "Big Buck Bunny")


def stackDrawer():
    from importlib import import_module
    from app.view.dialogs.task_drawer import TaskDrawer
    w = state["w"]
    bt = bigBuckBunny()
    for f, done in zip(bt.files, (0.61, 1, 1, 1)):
        f.downloadedBytes = int(f.size * done); f.completed = done >= 1
    d = state["drawer"] = TaskDrawer(bt, w._taskService, w._featureService, w._categoryService, w)
    d.show()
    d.refreshTimer.stop()
    QTimer.singleShot(1500, lambda: stageDrawer(import_module("bittorrent_pack.swarm")))


def stageDrawer(sw):
    d = state["drawer"]
    d.refreshTimer.stop()
    cards = {type(c).__name__: c for c in d.cards}
    print("DRAWER CARDS", list(cards), flush=True)
    t = cards["TorrentCard"]
    t.hashV1Row.setValue("dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c"); t.hashV1Row.setVisible(True)
    t.piecesRow.setValue("1202 × 1.00 MB"); t.piecesRow.setVisible(True)
    t._setSwarm(sw.SwarmInfo(seeds=24, totalSeeds=118, peers=38, totalPeers=263, distributedCopies=14.62,
                             totalUpload=2_310_000_000, totalDownload=1_240_000_000, nextAnnounceSeconds=734))
    TS = sw.TrackerStatus
    cards["TrackerCard"]._setTrackers((
        sw.TrackerInfo("udp://tracker.opentrackr.org:1337/announce", TS.WORKING, 1420, 63, 118, ""),
        sw.TrackerInfo("udp://open.demonii.com:1337/announce", TS.WORKING, 986, 41, 77, ""),
        sw.TrackerInfo("udp://tracker.torrent.eu.org:451/announce", TS.WORKING, 754, 29, 52, ""),
        sw.TrackerInfo("wss://tracker.openwebtorrent.com", TS.WORKING, 211, 18, 30, ""),
    ))
    if "PeerCard" in cards:
        cards["PeerCard"]._setPeers((
            sw.PeerInfo("203.0.113.24", 51413, "qBittorrent 5.0.2", "D K E I", 1.0, 3_480_000, 120_000),
            sw.PeerInfo("203.0.113.87", 6881, "Transmission 4.0.6", "D K E", 0.93, 2_150_000, 0),
            sw.PeerInfo("198.51.100.9", 28113, "libtorrent 2.0.10", "D E", 1.0, 1_760_000, 340_000),
            sw.PeerInfo("198.51.100.62", 45002, "Deluge 2.1.1", "d K E", 0.58, 0, 910_000),
            sw.PeerInfo("203.0.113.140", 51820, "WebTorrent 0.98", "D K", 0.31, 640_000, 0),
        ))
    for card in d.cards:
        if hasattr(card, "pathRow"):
            card.pathRow.setValue(f"{SHOWN_FOLDER}/Big Buck Bunny")
    hideTmpPaths(d)
    QApplication.processEvents()
    d.scrollArea.verticalScrollBar().setValue(0)
    QTimer.singleShot(800, stackDrawerShot)


def stackDrawerShot():
    d = state["drawer"]
    save(d.widget, f"stack-{THEME}/drawer-bt")
    d.close()
    QTimer.singleShot(800, stackFiles)


def stackFiles():
    from app.view.dialogs.file_select import FileSelectDialog
    w = state["w"]
    d = state["files"] = FileSelectDialog(bigBuckBunny(), w._categoryService, w)
    d.show()
    QTimer.singleShot(1500, stackFilesShot)


def stackFilesShot():
    save(state["files"].widget, f"stack-{THEME}/files-bt")
    state["files"].close()
    QTimer.singleShot(800, stackDraft)


def mediaCards():
    return [c for c in state["w"]._draftDialog.findChildren(object)
            if type(c).__name__ in ("BilibiliDraftCard", "YtDlpDraftCard")]


def stackDraft():
    w = state["w"]
    QTimer.singleShot(0, lambda: w.addUrls(DRAFT_URLS))
    waitFor(lambda: len(mediaCards()) == 2 and len(w._draftDialog.findChildren(object)) > 0,
            lambda: QTimer.singleShot(3000, stackTrim), timeout=150, every=500)


def stackTrim():
    for c in mediaCards():
        c._onTrimToggled()
        end = c._rangeSlider.endValue()
        ratio = (.08, .40) if type(c).__name__ == "YtDlpDraftCard" else (.35, .85)
        c._rangeSlider.setValues(int(end * ratio[0]), int(end * ratio[1]))
    QTimer.singleShot(9000, stackPreviews)


def stackPreviews():
    names = {"YtDlpDraftCard": "trim-yt", "BilibiliDraftCard": "trim-bili"}
    for c in mediaCards():
        sl = c._rangeSlider
        started = time.time()
        while time.time() - started < 40 and (sl._previewProvider is None or sl._previewProvider(sl.startValue()) is None):
            QApplication.processEvents(); time.sleep(0.3)
        sl._updatePreview(sl._toPixelX(sl.startValue()))
        QApplication.processEvents()
        print("PREVIEW STATE", type(c).__name__, getattr(c, "_storyboardLoaded", None), sl._previewProvider, flush=True)
        if sl._preview is not None and sl._preview.isVisible():
            save(sl._preview, f"stack-{THEME}/{names[type(c).__name__]}")
        else:
            print("NO PREVIEW", type(c).__name__, flush=True)
        sl._hidePreview()
    dialog = state["w"]._draftDialog
    dialog.urlEdit.horizontalScrollBar().setValue(0)
    dialog.urlEdit.clearFocus()
    hideTmpPaths(dialog)
    QTimer.singleShot(600, lambda: (save(dialog.widget, f"stack-{THEME}/draft"), finish()))


SCENES = {"hero": hero, "sniff": sniff, "live": live, "quality": quality, "stack": stack}


def begin():
    print("BEGIN", SCENE, flush=True)
    w = state["w"] = mainWindow()
    w.show()
    useUserRuntimes()
    SCENES[SCENE](w)


QTimer.singleShot(4000, begin)
sys.exit(application.exec())
