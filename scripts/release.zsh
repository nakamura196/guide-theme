#!/usr/bin/env zsh
# 版を出す準備: _layouts/guide.html の版番号と改ざん検知（SRI）の値を書き換える。
#
# 使い方:  zsh scripts/release.zsh 0.1.0
# このあと、差分を確かめてからコミットし、タグ v<版> を付けて push する。
#   git commit -am "Release 0.1.0" && git tag v0.1.0 && git push origin main v0.1.0
# 使う側のサイトは、書き換わった _layouts/guide.html を自分の _layouts/ に写す。
set -euo pipefail
cd "${0:A:h}/.."
ver="${1:?版番号を指定してください（例: 0.1.0）}"
sri() { print -n "sha384-$(openssl dgst -sha384 -binary "$1" | openssl base64 -A)" }
css=$(sri assets/guide-theme.css)
js=$(sri assets/guide-theme.js)
sed -i '' -E \
  -e "s|(assign gt_version = \")[^\"]*|\1${ver}|" \
  -e "s|(assign gt_css_sri = \")[^\"]*|\1${css}|" \
  -e "s|(assign gt_js_sri = \")[^\"]*|\1${js}|" \
  _layouts/guide.html
grep -E 'gt_(version|css_sri|js_sri) =' _layouts/guide.html
