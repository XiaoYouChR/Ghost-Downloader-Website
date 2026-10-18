# 用法（cwd 必须是 /tmp/gd-banner）: SHOT_THEME=dark python <本目录>/shoot.py
# 产出:
#   out/shot-08-<theme>.png        编辑任务参数对话框（只有对话框本体）
#   out/shot-08-window-<theme>.png 同一时刻的整窗，背后主窗变暗
#   out/layers-<theme>/frame.png   去掉任务卡的空窗口
#   out/layers-<theme>/card_N.png  每张任务卡，cards.json 记录在窗口内的坐标
import importlib.util, json, os, sys
REPO = "/Users/xiaoyouchr/PycharmProjects/Ghost-Downloader-3"
WORK = "/tmp/gd-banner"
THEME = os.environ["SHOT_THEME"]
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
from PySide6.QtWidgets import QApplication

gd3.setupEnvironment()
application = SingletonApplication(sys.argv, DESKTOP_ID)
gd3.startApp(application)
state = {}
MIRROR = "https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/26.04/ubuntu-26.04-desktop-amd64.iso"
LAYERS = f"{WORK}/out/layers-{THEME}"


def save(widget, name):
    pm = widget.grab()
    pm.save(f"{WORK}/out/{name}.png")
    print("SAVED", name, pm.width(), pm.height(), pm.devicePixelRatio())


def step1():
    w = state["w"] = next(w for w in QApplication.topLevelWidgets() if type(w).__name__ == "MainWindow")
    w.show(); w.resize(1180, 640)
    QTimer.singleShot(9000, step4)


def step2():
    w = state["w"]
    task = next(t for t in w._taskService.tasks if t.name.startswith("ubuntu"))
    d = state["edit"] = w._featureService.createEditDialog(task, w)
    for card in d.cardGroup.findChildren(object):
        if type(card).__name__ == "UrlEditCard":
            card.urlEdit.setText(MIRROR)
            card.urlEdit.setCursorPosition(0)
        if type(card).__name__ == "HeadersEditCard":
            card.headersEditor.setHeaders({"Referer": "https://ubuntu.com/download/desktop"})
        if type(card).__name__ == "OutputFolderCard":
            card.folderPicker.setPath("/Users/ghost/Downloads")
    d.show()
    QTimer.singleShot(1500, step3)


def step3():
    save(state["edit"].widget, f"shot-08-{THEME}")
    save(state["w"], f"shot-08-window-{THEME}")
    state["edit"].reject()
    QTimer.singleShot(800, application.quit)


def step4():
    w = state["w"]
    os.makedirs(LAYERS, exist_ok=True)
    page = next(c for c in w.findChildren(object) if type(c).__name__ == "TaskPage")
    cards = sorted(page._liveCards.values(), key=lambda c: c.mapTo(w, QPoint(0, 0)).y())
    info = []
    for i, c in enumerate(cards):
        p = c.mapTo(w, QPoint(0, 0))
        save(c, f"layers-{THEME}/card_{i}")
        info.append({"i": i, "name": c.task.name if hasattr(c, "task") else "", "x": p.x(), "y": p.y(), "w": c.width(), "h": c.height()})
    state["cards"] = cards
    for c in cards:
        c.setVisible(False)
    QTimer.singleShot(400, lambda: finish(info))


def finish(info):
    w = state["w"]
    save(w, f"layers-{THEME}/frame")
    json.dump({"window": [w.width(), w.height()], "cards": info}, open(f"{LAYERS}/cards.json", "w"), ensure_ascii=False, indent=1)
    for c in state["cards"]:
        c.setVisible(True)
    QTimer.singleShot(600, step2)


QTimer.singleShot(4000, step1)
sys.exit(application.exec())
