import json, os, sys, time
from pathlib import Path
from struct import pack

REPO = "/Users/xiaoyouchr/PycharmProjects/Ghost-Downloader-3"
WORK = Path("/tmp/gd-banner")
os.chdir(WORK)
sys.path[:0] = [REPO, str(WORK / "features")]

from app.models.task import TaskStatus, TaskFile
from http_pack.task import HttpTask, HttpTaskStep
from bittorrent_pack.task import BTTask, BTTaskStep, BTFile

DL = WORK / "downloads"
shutil_dirs = [DL]
now = int(time.time())
SERVER = "http://127.0.0.1:18765"
tasks = []


def http(name, size, status, progress, age, url=None):
    url = url or f"https://github.com/XiaoYouChR/Ghost-Downloader-3/releases/download/v4.4.0/{name}"
    done = int(size * progress / 100)
    step = HttpTaskStep(stepIndex=0, url=url, fileSize=size, status=status, progress=progress,
                        receivedBytes=done, canUseRangeRequests=True, subworkerCount=8)
    task = HttpTask(name=name, url=url, outputFolder=DL, fileSize=size, steps=[step],
                    createdAt=now - age, completedAt=(now - age + 90) if status == TaskStatus.COMPLETED else 0)
    out = DL / name
    with open(out, "wb") as f:
        f.truncate(size)
    if status != TaskStatus.COMPLETED:
        chunk = size // 8
        with open(f"{out}.ghd", "wb") as f:
            for i in range(8):
                s = i * chunk
                e = size - 1 if i == 7 else s + chunk - 1
                f.write(pack("<QQQ", s, s + int((e - s + 1) * progress / 100), e))
    return task


tasks.append(http("ubuntu-26.04-desktop-amd64.iso", 6_550_000_000, TaskStatus.RUNNING, 22, 300, f"{SERVER}/ubuntu-26.04-desktop-amd64.iso"))
tasks.append(http("blender-5.0.1-macos-arm64.dmg", 318_880_000, TaskStatus.RUNNING, 31, 600, f"{SERVER}/blender-5.0.1-macos-arm64.dmg"))

MB = 1_000_000
bbb = [("Big Buck Bunny/big_buck_bunny_1080p_h264.mov", 725 * MB),
       ("Big Buck Bunny/big_buck_bunny_720p_h264.mov", 369 * MB),
       ("Big Buck Bunny/big_buck_bunny_480p_h264.mov", 176 * MB),
       ("Big Buck Bunny/poster.jpg", 2 * MB)]
files = [BTFile(index=i, relativePath=p, size=s, selected=True) for i, (p, s) in enumerate(bbb)]
total = sum(f.size for f in files)
bt = BTTask(name="Big Buck Bunny", url="magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c",
            outputFolder=DL, files=files, createdAt=now - 900,
            steps=[BTTaskStep(stepIndex=0, status=TaskStatus.PAUSED, progress=46, receivedBytes=int(total * .46))])
tasks.append(bt)

tasks.append(http("Ghost-Downloader-v4.4.0-Linux-x86_64.AppImage", 81_631_736, TaskStatus.COMPLETED, 100, 3600))
tasks.append(http("python-3.14.4-macos11.pkg", 72_400_000, TaskStatus.COMPLETED, 100, 7200,
                  "https://www.python.org/ftp/python/3.14.4/python-3.14.4-macos11.pkg"))
tasks.append(http("Ghost-Downloader-v4.4.0-Windows-x86_64-Setup.exe", 43_851_384, TaskStatus.COMPLETED, 100, 10800))

with open(WORK / "GhostDownloader" / "tasks.jsonl", "w", encoding="utf-8") as f:
    for t in tasks:
        f.write(json.dumps(t.toDict(), ensure_ascii=False) + "\n")
print("seeded", len(tasks))
