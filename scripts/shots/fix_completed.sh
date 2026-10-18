#!/bin/zsh
# GD 4.4.0 的 http_pack 完成时不再汇总一次 receivedBytes（supervisor 每秒才更新，完成时直接被 cancel），
# 已完成卡片会显示 "37.0 MB/61.2 MB"。磁盘上的文件是完整的，这里把已完成任务的 receivedBytes 改回真实大小，
# 只为截图，不改 app 代码。会强停并重启 app。
A=(/Users/xiaoyouchr/Library/Android/sdk/platform-tools/adb -s 733f8851)
PKG=com.xychr.ghostdownloader
$A shell am force-stop $PKG
$A shell run-as $PKG cat files/tasks.jsonl | python3 -c '
import sys, json
for line in sys.stdin:
    t = json.loads(line)
    if t["status"] == "COMPLETED" and t.get("packId") == "http":
        for s in t["steps"]:
            s["receivedBytes"] = s["fileSize"]
    print(json.dumps(t, ensure_ascii=False))
' > ${0:A:h}/logs/tasks.jsonl
$A push ${0:A:h}/logs/tasks.jsonl /data/local/tmp/tasks.jsonl >/dev/null
$A shell "run-as $PKG sh -c 'cat /data/local/tmp/tasks.jsonl > files/tasks.jsonl'"
$A shell rm /data/local/tmp/tasks.jsonl
$A shell monkey -p $PKG -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1
