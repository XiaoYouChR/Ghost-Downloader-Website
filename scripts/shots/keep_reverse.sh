#!/bin/zsh
# adb server 重启会丢掉 reverse；每 2 秒补一次
A=/Users/xiaoyouchr/Library/Android/sdk/platform-tools/adb
while true; do
  r=$($A -s 733f8851 reverse --list 2>/dev/null)
  [[ $r == *18766* ]] || { $A -s 733f8851 reverse tcp:18766 tcp:18766; echo "$(date +%T) re-added" ; }
  [[ $r == *6886* ]] || $A -s 733f8851 reverse tcp:6886 tcp:6886 >/dev/null
  sleep 2
done
