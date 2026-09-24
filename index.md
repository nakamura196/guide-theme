---
layout: guide
lang: ja
title: guide-theme の見本
eyebrow: guide-theme
lead: アプリの利用者向けガイドのための、ページの型です。このページ自体が見本になっています。
nav:
  - { title: GitHub, url: "https://github.com/nakamura196/guide-theme" }
quick_links:
  - { title: 使い方, text: ページの型を置いて、先頭に1行書く, url: "#1-使い方" }
  - { title: 書き方, text: Markdown で書ける部品, url: "#2-書き方" }
  - { title: よくある質問, url: "#よくある質問", mark: "?" }
---

Markdown で書いたページを、非技術者にも読みやすい形で表示します。
`layout: guide` と書いたページだけが変わり、サイトのほかのページはそのままです。

## 1. 使い方

1. [`_layouts/guide.html`](https://github.com/nakamura196/guide-theme/blob/main/_layouts/guide.html) を、自分のサイトの `_layouts/` に置きます
2. ページの先頭に `layout: guide` と書きます
3. 必要なら、見出しの上の小さな文字（`eyebrow`）や入口のカード（`quick_links`）を足します

> 見た目のファイル（CSS / JS）は、版番号つきで配信元から読み込みます。
> 途中で書き換えられていたら、ブラウザは読み込みを拒否します。
{: .point }

## 2. 書き方

### 囲み

引用の直後に `{: .point }`、`{: .note }`、`{: .warning }` のどれかを書きます。

> これはメモの囲みです。
{: .note }

> これは注意の囲みです。
{: .warning }

### タブ

<div class="tabs" data-auto="os" markdown="1">

### Windows の場合

`data-auto="os"` を付けると、見ている人のパソコンに合うタブが最初に開きます。

### Mac の場合

Mac で見ると、こちらが最初に開きます。

</div>

### 表

| 書くもの | 表示 |
| --- | --- |
| `## 1. 見出し` | 番号つきのカード |
| 番号つきの箇条書き | 丸い番号の手順 |

## よくある質問

- **スクリプトが動かないとどうなりますか** — 本文はすべて表示されます。目次・タブ・開閉だけが無くなります
- **色は変えられますか** — サイトの設定 `guide_theme.accent` で変えられます
{: .faq }
