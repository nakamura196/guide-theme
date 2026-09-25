#!/usr/bin/env zsh
# アプリの紹介サイト（GitHub Pages の docs/）を site-template から作る。
# 見本: https://ap.ldas.jp （archival-packager）、https://lo.ldas.jp （local-ocr）
#
# 使い方:
#   zsh scripts/new-site.zsh <リポジトリのフォルダ> <アプリ名> <ドメイン> <owner/repo> <連絡先>
#   例: zsh scripts/new-site.zsh ~/git/foo/bar "Bar App" ba.ldas.jp nakamura196/bar someone@example.org
#
# すること:
#   - site-template/ の中身を、置き場所を保ってリポジトリへ写す（既にあるファイルは上書きしない）
#   - _layouts/guide.html を docs/_layouts/ へ写す（こちらは常に最新にする）
#   - __APP__ などの置き換え文字を埋める
# しないこと（README の「Whole site」を参照）:
#   DNS の登録、Pages の有効化、アイコン・画面写真・OGP 画像の用意、TODO の本文
set -euo pipefail
theme="${0:A:h}/.."
dest="${1:?リポジトリのフォルダを指定してください}"
app="${2:?アプリ名を指定してください}"
domain="${3:?ドメインを指定してください（例: lo.ldas.jp）}"
repo="${4:?owner/repo を指定してください}"
contact="${5:?連絡先のメールアドレスを指定してください}"
owner="${repo%%/*}"
name="${repo#*/}"
[[ -d "$dest/.git" || -f "$dest/.git" ]] || { print -u2 "git のリポジトリではありません: $dest"; exit 1 }

cd "$theme/site-template"
for f in $(find . -type f | sed 's|^\./||' | sort); do
  if [[ -e "$dest/$f" ]]; then
    print "そのまま（既にある）: $f"
    continue
  fi
  mkdir -p "$dest/${f:h}"
  sed -e "s|__APP__|${app}|g" -e "s|__DOMAIN__|${domain}|g" -e "s|__REPO__|${repo}|g" \
      -e "s|__OWNER__|${owner}|g" -e "s|__NAME__|${name}|g" -e "s|__CONTACT__|${contact}|g" \
      "$f" > "$dest/$f"
  print "作成: $f"
done
mkdir -p "$dest/docs/_layouts"
cp "$theme/_layouts/guide.html" "$dest/docs/_layouts/guide.html"
print "更新: docs/_layouts/guide.html"

print "\n残り（README の「Whole site」の 2〜6）:"
print "  TODO の箇所: $(grep -rl TODO "$dest/docs" "$dest/scripts/docs" 2>/dev/null | wc -l | tr -d ' ') ファイル"
[[ -f "$dest/docs/assets/icon.png" ]] || print "  docs/assets/icon.png（128px 程度のアプリのアイコン）が無い"
[[ -f "$dest/docs/images/screenshot-ja.png" ]] || print "  docs/images/screenshot-{ja,en}.png（画面写真）が無い"
