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
description: For search results and link previews (optional; otherwise the lead)
image: /assets/ogp-en.png      # link-preview image for this page (optional)
---
```

The page head carries what link previews and search engines need: `canonical`,
Open Graph (`og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`,
`og:image`), a Twitter card, and `hreflang` links for both languages with
absolute URLs (the `alternate` URL is resolved against the page). These need
`url` to be set, which GitHub Pages does for you.

Site-wide options in `_config.yml` (all optional):

```yaml
guide_theme:
  accent: "#0f766e"      # accent colour
  logo: /assets/icon.png # small image at the top left (otherwise the first letter)
  image: /assets/ogp.png # link-preview image (1200 x 630 works everywhere)
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

## Whole site

The layout also works for an application's whole public site — the top page,
the guides and the technical pages — as in [ap.ldas.jp](https://ap.ldas.jp/)
and [lo.ldas.jp](https://lo.ldas.jp/). [`site-template/`](site-template/) holds
the starting files: `_config.yml` (every page uses the guide layout, with one
shared header), a Japanese and an English top page, `CNAME`, and a script that
makes the link-preview images.

1. Copy it into the app's repository. Existing files are left alone.
   ```
   zsh scripts/new-site.zsh <repo folder> "<App name>" <domain> <owner/repo> <contact e-mail>
   ```
2. Add `docs/assets/icon.png` (about 128 px) and screenshots
   `docs/images/screenshot-{ja,en}.png`, then fill in the `TODO`s.
3. Make the link-preview images: `python3 scripts/docs/make_ogp.py`
   (Pillow and the Hiragino fonts of macOS).
4. DNS: a `CNAME` record from the domain to `<owner>.github.io`.
   On Cloudflare, **not proxied** — otherwise GitHub cannot issue the HTTPS certificate.
5. Turn on Pages from `main` / `docs`, and HTTPS once the certificate is issued:
   ```
   gh api -X POST repos/<owner>/<repo>/pages -f "source[branch]=main" -f "source[path]=/docs"
   gh api -X PUT repos/<owner>/<repo>/pages -F https_enforced=true
   gh api -X POST repos/<owner>/<repo>/pages/builds
   ```
   Rebuild after enforcing HTTPS, or `og:url` and `canonical` stay `http://`.
6. The old `<owner>.github.io/<repo>/` URLs redirect to the domain. If a store
   listing links one of them, keep `CNAME` until the listing is updated.

## Release

```
zsh scripts/release.zsh 0.1.1
git commit -am "Release 0.1.1" && git tag v0.1.1 && git push origin main v0.1.1
```

The script writes the version and the integrity hashes into `_layouts/guide.html`.
Sites then copy the new layout file.

## Used by

- [Archival Packager](https://ap.ldas.jp/)
- [Local OCR](https://lo.ldas.jp/)

## License

MIT
