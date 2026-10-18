#!/bin/zsh
# 浏览器层截图的工作区 /tmp/gd-browser：portable 模式的桌面应用（预置配对令牌和端口）+ 扩展副本
# 用法见 shoot.mjs 顶部
set -e
REPO=/Users/xiaoyouchr/PycharmProjects/Ghost-Downloader-3
WORK=/tmp/gd-browser
rm -rf $WORK/app-work $WORK/ext
cp -R $REPO/browser_extension/chromium $WORK/ext
APP=$WORK/app-work
mkdir -p $APP/GhostDownloader $APP/downloads $APP/features $APP/app
for p in $REPO/features/*(/); do [[ ${p:t} == jack_yao || ${p:t} == __pycache__ ]] || ln -s $p $APP/features/${p:t}; done
ln -s $REPO/app/assets $APP/app/assets
cat > $APP/GhostDownloader/UserConfig.json <<JSON
{"Personalization": {"ThemeMode": "Light", "Language": "zh_CN", "BackgroundEffect": "None"},
 "Software": {"HasCompletedOobe": true},
 "GeneralDownload": {"DownloadFolder": "$APP/downloads"},
 "Browser": {"EnableBrowserExtension": true, "BrowserExtensionPairToken": "gd-website-shots", "Port": 14391}}
JSON
