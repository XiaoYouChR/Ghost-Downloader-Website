# 在 /tmp/gd-browser/app-work 里跑一个隔离的桌面应用，只为让扩展连上 Browser Service。
# 用法（cwd 必须是 app-work）: <GD3>/.venv/bin/python <本目录>/desktop.py ；SIGTERM 退出
import importlib.util, os, signal, sys
REPO = "/Users/xiaoyouchr/PycharmProjects/Ghost-Downloader-3"
del sys.argv[1:]
os.chdir("/tmp/gd-browser/app-work")
sys.path.insert(0, REPO)
spec = importlib.util.spec_from_file_location("gd3main", f"{REPO}/Ghost-Downloader-3.py")
gd3 = importlib.util.module_from_spec(spec); spec.loader.exec_module(gd3)

import app.startup as startup
startup.checkUpdateAtStartup = lambda *a, **k: None

from app.config.constants import DESKTOP_ID
from app.platform.application import SingletonApplication
from PySide6.QtCore import QTimer

gd3.setupEnvironment()
application = SingletonApplication(sys.argv, DESKTOP_ID)
gd3.startApp(application)
signal.signal(signal.SIGTERM, lambda *a: application.quit())
tick = QTimer(); tick.start(500); tick.timeout.connect(lambda: None)  # 让 Python 有机会处理信号
print("APP READY", flush=True)
sys.exit(application.exec())
