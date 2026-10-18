#!/bin/zsh
# 用法: ./shoot_desktop.sh <hero|sniff|live|quality|stack> [Dark Light]   （先起 server.py）
# 每个主题重建 /tmp/gd-banner 后跑一次 shoot_desktop.py，产物拷回本目录 out/

HERE=${0:A:h}
SCENE=$1; shift
for THEME in ${@:-Dark Light}; do
  $HERE/prep.sh $THEME > /dev/null
  (cd /tmp/gd-banner && SHOT_THEME=${THEME:l} SHOT_SCENE=$SCENE \
    /Users/xiaoyouchr/PycharmProjects/Ghost-Downloader-3/.venv/bin/python $HERE/shoot_desktop.py 2>&1 \
    | tee /tmp/gd-shot-$SCENE.log | grep -E "BEGIN|WAIT|SCREEN|SAVED|SNIFF|LIVE|MENU|DRAWER|PREVIEW|TIMEOUT|Traceback|Error" || true)
  pkill -f "N_m3u8DL-RE http://127.0.0.1:18765" || true
  rsync -a --exclude 'layers-*' --exclude 'shot-08*' /tmp/gd-banner/out/ $HERE/out/
done
