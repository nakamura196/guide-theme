# guide-theme

A page layout for **end-user guides of applications** — installation, first steps,
key points and troubleshooting — written for readers who are not technical.
Pages are written in plain Markdown on GitHub Pages (Jekyll); the layout adds

- a header with the app name, links and a language switch
- a title area with large "entry" cards to the main topics
- a table of contents that follows your reading position (collapsible on phones)
- one card per section, with numbered steps shown as badges
- boxes for key points, notes and cautions
- tabs (e.g. Windows / Mac) that open the reader's own OS first
- a collapsible FAQ
- dark mode, print styles, and correct line joining for Japanese text

Only pages that say `layout: guide` change. The rest of your site keeps its theme.

アプリの利用者向けガイド（インストール・使い方・ポイント・困ったとき）のための
ページの型です。Markdown のまま書け、`layout: guide` と書いたページだけが変わります。

## Use it

1. Copy [`_layouts/guide.html`](_layouts/guide.html) into your site's `_layouts/`.
   The CSS and JS are loaded from jsDelivr at the version written in that file,
   with Subresource Integrity (the browser refuses them if they were altered).
2. Put this at the top of a page:

```yaml
---
layout: guide
lang: en
title: Getting started
eyebrow: My App guide          # small line above the title (optional)
lead: One or two sentences.    # under the title (optional)
alternate: { title: 日本語, url: ./, lang: ja }   # language switch (optional)
nav:                           # links in the header (optional)
  - { title: Home, url: ../ }
quick_links:                   # entry cards (optional)
  - { title: Install, text: Windows and Mac, url: "#1-install" }
  - { title: Troubleshooting, url: "#troubleshooting", mark: "?" }
footer: "Contact: someone@example.org"
---
```

Site-wide options in `_config.yml` (all optional):

```yaml
guide_theme:
  accent: "#0f766e"      # accent colour
  logo: /assets/icon.png # small image at the top left (otherwise the first letter)
```

## Write it

Everything is plain Markdown (kramdown, as on GitHub Pages).

| You write | You get |
| --- | --- |
| `## 1. Install` | a section card with a numbered badge |
| a numbered list | steps with round numbers |
| a quote followed by `{: .point }`, `{: .note }` or `{: .warning }` | a coloured box with a label |
| `<div class="tabs" data-auto="os" markdown="1">` around `### Windows` / `### Mac` | tabs; `data-auto="os"` opens the reader's OS |
| a list whose items start with `**Question**` — answer, followed by `{: .faq }` | collapsible questions |

See [the demo page](https://nakamura196.github.io/guide-theme/) and its
[source](index.md).

Without JavaScript, all text is still shown; only the table of contents, tabs and
FAQ folding are missing.

## Release

```
zsh scripts/release.zsh 0.1.1
git commit -am "Release 0.1.1" && git tag v0.1.1 && git push origin main v0.1.1
```

The script writes the version and the integrity hashes into `_layouts/guide.html`.
Sites then copy the new layout file.

## Used by

- [Archival Packager](https://nakamura196.github.io/archival-packager/guide/)
- [Local OCR](https://nakamura196.github.io/local-ocr/guide.html)

## License

MIT
