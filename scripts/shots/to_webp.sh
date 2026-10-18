#!/bin/zsh
# 用法: ./to_webp.sh 01 04 06 07 10 11 12  — out/ 里的原图转成官网用的 webp（原样直出，阴影和圆角由 CSS 统一加）
HERE=${0:A:h}
PUBLIC=${PUBLIC:-$HERE/../../public/shots}
for n in $@; do for t in dark light; do
  cwebp -q 85 -m 6 -sharp_yuv -quiet $HERE/out/shot-$n-$t.png -o $PUBLIC/$t/shot-$n.webp && echo "$t/shot-$n.webp"
done; done
