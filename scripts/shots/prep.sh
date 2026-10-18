#!/bin/zsh
# 首页截图管线。先起限速服务器: .venv/bin/python server.py &
# 然后每个主题: ./prep.sh Dark && (cd /tmp/gd-banner && SHOT_THEME=dark .venv/bin/python <本目录>/shoot.py)
# prep.sh 重建 /tmp/gd-banner（portable 模式，不碰用户自己的数据）并写入假任务
set -e
HERE=${0:A:h}
REPO=/Users/xiaoyouchr/PycharmProjects/Ghost-Downloader-3
WORK=/tmp/gd-banner
rm -rf $WORK
mkdir -p $WORK/GhostDownloader $WORK/downloads $WORK/out
# 逐个链接功能包，跳过 jack_yao（不进官网截图）
mkdir -p $WORK/features
for p in $REPO/features/*(/); do [[ ${p:t} == jack_yao || ${p:t} == __pycache__ ]] || ln -s $p $WORK/features/${p:t}; done
# 源码运行时 EXECUTABLE_DIR 是 cwd，resources.rcc 按 cwd/app/assets 注册
mkdir -p $WORK/app && ln -s $REPO/app/assets $WORK/app/assets
cat > $WORK/GhostDownloader/UserConfig.json <<JSON
{"Personalization": {"ThemeMode": "$1", "Language": "zh_CN", "BackgroundEffect": "None"}, "Software": {"HasCompletedOobe": true}}
JSON
cd $WORK && $REPO/.venv/bin/python $HERE/seed.py
