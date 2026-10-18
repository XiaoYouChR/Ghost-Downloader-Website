# Android 截图用的 uiautomator 小工具
# python3 adbui.py texts            列出屏幕上的文字和中心坐标
# python3 adbui.py tap <文字>        点第一个文字或 content-desc 完全匹配的节点
# python3 adbui.py shot <png>        screencap 原样直出
import re, subprocess, sys

ADB = ["/Users/xiaoyouchr/Library/Android/sdk/platform-tools/adb", "-s", "733f8851"]


def nodes():
    subprocess.run(ADB + ["shell", "uiautomator", "dump", "/sdcard/ui.xml"], capture_output=True)
    xml = subprocess.run(ADB + ["exec-out", "cat", "/sdcard/ui.xml"], capture_output=True, text=True).stdout
    for m in re.finditer(r'text="([^"]*)"[^>]*?content-desc="([^"]*)"[^>]*?bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"', xml):
        text, desc, x1, y1, x2, y2 = m.groups()
        if text or desc:
            yield text or desc, (int(x1) + int(x2)) // 2, (int(y1) + int(y2)) // 2


cmd = sys.argv[1]
if cmd == "texts":
    for label, x, y in nodes():
        print(f"{x:5} {y:5}  {label}")
elif cmd == "tap":
    target = sys.argv[2]
    hit = next(((x, y) for label, x, y in nodes() if label == target), None)
    if not hit:
        sys.exit(f"not found: {target}")
    subprocess.run(ADB + ["shell", "input", "tap", str(hit[0]), str(hit[1])])
elif cmd == "shot":
    with open(sys.argv[2], "wb") as f:
        f.write(subprocess.run(ADB + ["exec-out", "screencap", "-p"], capture_output=True).stdout)
