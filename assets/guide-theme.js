/*
 * guide-theme — 本文（Markdown から出た HTML）を、読みやすい形に組み直す。
 * https://github.com/nakamura196/guide-theme
 *
 * スクリプトが動かなくても本文はすべて読める。ここで足すのは、
 * 目次・見出しごとのカード・囲みの見出し・タブ・よくある質問の開閉だけ。
 */
(function () {
  "use strict";

  var root = document.querySelector(".gt-content");
  if (!root) return;

  var lang = (document.documentElement.lang || "en").slice(0, 2);
  var WORDS = {
    ja: { point: "ポイント", note: "メモ", warning: "注意", toc: "このページの内容", top: "ページの先頭へ", link: "この見出しへのリンク" },
    en: { point: "Key point", note: "Note", warning: "Caution", toc: "On this page", top: "Back to top", link: "Link to this heading" }
  };
  var t = WORDS[lang] || WORDS.en;

  var ICONS = {
    point: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>'
  };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  // 0. 日本語・中国語の文中の改行を詰める。Markdown の原稿で行を折り返すと、
  //    その改行が空白として表示され「〜ください。 パッケージは」のようになるため。
  var CJK = "\u3000-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef";
  var reBoth = new RegExp("([" + CJK + "])\\s*\\n\\s*(?=[" + CJK + "])", "g");
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      return n.parentNode.closest("pre, code, textarea") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  var texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  texts.forEach(function (n, i) {
    var v = n.nodeValue.replace(reBoth, "$1");
    // 要素の境目（例: 「形に<strong>まとめる</strong>」の手前の改行）も詰める。
    var next = texts[i + 1];
    if (/[\u3000-\u9fff\uff00-\uffef]\s*\n\s*$/.test(v) && next && new RegExp("^\\s*[" + CJK + "]").test(next.nodeValue)) v = v.replace(/\s+$/, "");
    if (/^\s*\n\s*[\u3000-\u9fff\uff00-\uffef]/.test(v) && i > 0 && new RegExp("[" + CJK + "]\\s*$").test(texts[i - 1].nodeValue)) v = v.replace(/^\s+/, "");
    if (v !== n.nodeValue) n.nodeValue = v;
  });

  // 1. 大見出し（h2）ごとに section で包む。最初の h2 より前は「前書き」。
  (function wrapSections() {
    var nodes = Array.prototype.slice.call(root.childNodes);
    var current = el("section", "gt-section gt-intro");
    var out = [current];
    nodes.forEach(function (n) {
      if (n.nodeType === 1 && n.tagName === "H2") {
        current = el("section", "gt-section");
        out.push(current);
      }
      current.appendChild(n);
    });
    root.innerHTML = "";
    out.forEach(function (s) {
      var hasContent = Array.prototype.some.call(s.childNodes, function (c) {
        return c.nodeType === 1 || (c.nodeType === 3 && c.textContent.trim());
      });
      if (hasContent) root.appendChild(s);
    });
  })();

  // 2. 「1. 〜」で始まる大見出しは、番号を丸い印にする。
  root.querySelectorAll("h2").forEach(function (h) {
    var first = h.firstChild;
    if (!first || first.nodeType !== 3) return;
    var m = first.textContent.match(/^\s*(\d+)[.．、]\s*/);
    if (!m) return;
    first.textContent = first.textContent.slice(m[0].length);
    h.insertBefore(el("span", "gt-step", m[1]), h.firstChild);
    h.setAttribute("data-step", m[1]);
  });

  // 3. 見出しにリンクの印を付ける。
  root.querySelectorAll("h2[id], h3[id]").forEach(function (h) {
    var a = el("a", "gt-anchor", "#");
    a.href = "#" + h.id;
    a.setAttribute("aria-label", t.link);
    h.appendChild(a);
  });

  // 4. 囲み（{: .point } など）に見出しを付ける。
  ["point", "note", "warning"].forEach(function (kind) {
    root.querySelectorAll("blockquote." + kind).forEach(function (q) {
      var label = q.getAttribute("data-title") || t[kind];
      q.insertBefore(el("div", "gt-callout-label", ICONS[kind] + "<span></span>"), q.firstChild)
        .lastChild.textContent = label;
    });
  });

  // 5. 表は横にはみ出してもよいように包む。
  root.querySelectorAll("table").forEach(function (tb) {
    var w = el("div", "gt-table");
    tb.parentNode.insertBefore(w, tb);
    w.appendChild(tb);
    // 見出し行が空の表（項目と値だけの表によくある書き方）は、空の帯を出さない。
    var th = tb.querySelector("thead");
    if (th && !th.textContent.trim()) th.hidden = true;
    // 短い値（数値と単位など）は途中で改行しない。
    tb.querySelectorAll("td").forEach(function (td) {
      if (td.textContent.trim().length <= 12) td.classList.add("gt-nowrap");
    });
  });

  // 6. タブ: <div class="tabs" markdown="1"> の中の h3 が 1 つずつタブになる。
  //    data-auto="os" を付けると、見ている人のパソコン（Windows / Mac）を最初に開く。
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var isWin = /Win/.test(navigator.platform || navigator.userAgent);
  root.querySelectorAll("div.tabs").forEach(function (box, bi) {
    var heads = Array.prototype.filter.call(box.children, function (c) { return c.tagName === "H3"; });
    if (heads.length < 2) return;
    var bar = el("div", "gt-tabbar");
    bar.setAttribute("role", "tablist");
    var panels = [];
    heads.forEach(function (h, i) {
      var p = el("div", "gt-tabpanel");
      p.setAttribute("role", "tabpanel");
      p.id = "gt-tab-" + bi + "-" + i;
      var n = h;
      while (n && !(n !== h && n.tagName === "H3")) {
        var next = n.nextElementSibling;
        p.appendChild(n);
        n = next;
      }
      panels.push(p);
      var b = el("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", p.id);
      b.textContent = h.getAttribute("data-tab") || h.textContent.replace(/#$/, "").trim();
      bar.appendChild(b);
    });
    box.innerHTML = "";
    box.appendChild(bar);
    panels.forEach(function (p) { box.appendChild(p); });
    var buttons = bar.querySelectorAll("button");
    function show(i) {
      buttons.forEach(function (b, j) { b.setAttribute("aria-selected", String(i === j)); b.tabIndex = i === j ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = i !== j; });
    }
    buttons.forEach(function (b, i) { b.addEventListener("click", function () { show(i); }); });
    var start = 0;
    if (box.getAttribute("data-auto") === "os") {
      buttons.forEach(function (b, i) {
        if ((isMac && /mac/i.test(b.textContent)) || (isWin && /windows/i.test(b.textContent))) start = i;
      });
    }
    show(start);
    // 見出しへのリンク（#windows-の場合 など）で来たら、そのタブを開く。
    function openFromHash() {
      var id = decodeURIComponent(location.hash.slice(1));
      panels.forEach(function (p, i) { if (id && p.querySelector("[id='" + id.replace(/'/g, "\\'") + "']")) show(i); });
    }
    window.addEventListener("hashchange", openFromHash);
    openFromHash();
  });

  // 7. よくある質問: {: .faq } を付けた箇条書きの各項目を、開閉できる形にする。
  //    項目の先頭の太字が問い、「 — 」より後ろが答え。
  root.querySelectorAll("ul.faq").forEach(function (ul) {
    var box = el("div", "gt-faq");
    Array.prototype.forEach.call(ul.children, function (li) {
      var q = li.querySelector("strong");
      var d = el("details");
      var s = el("summary");
      var body = el("div", "gt-faq-body");
      if (q && li.firstElementChild === q) {
        s.appendChild(q);
        body.innerHTML = li.innerHTML.replace(/^\s*[—–-]\s*/, "");
      } else {
        s.innerHTML = li.innerHTML;
      }
      d.appendChild(s);
      d.appendChild(body);
      box.appendChild(d);
    });
    ul.parentNode.replaceChild(box, ul);
  });

  // 8. 目次（左の欄）。大見出しを並べ、いま読んでいる節の小見出しだけ開く。
  var toc = document.querySelector(".gt-toc");
  if (toc) {
    var list = el("ol");
    var links = [];
    root.querySelectorAll(".gt-section").forEach(function (sec) {
      var h2 = sec.querySelector("h2[id]");
      if (!h2) return;
      var li = el("li");
      var a = el("a");
      a.href = "#" + h2.id;
      var step = h2.getAttribute("data-step");
      a.textContent = (step ? step + ". " : "") + textOf(h2);
      li.appendChild(a);
      links.push({ a: a, h: h2, li: li });
      var subs = sec.querySelectorAll("h3[id]");
      if (subs.length) {
        var ol = el("ol");
        subs.forEach(function (h3) {
          if (h3.closest(".gt-tabpanel")) return;
          var sli = el("li");
          var sa = el("a");
          sa.href = "#" + h3.id;
          sa.textContent = textOf(h3);
          sli.appendChild(sa);
          ol.appendChild(sli);
          links.push({ a: sa, h: h3, li: li });
        });
        if (ol.children.length) li.appendChild(ol);
      }
      list.appendChild(li);
    });
    if (links.length) {
      var details = el("details");
      details.open = window.matchMedia("(min-width: 961px)").matches;
      details.appendChild(el("summary", null, "")).textContent = t.toc;
      details.appendChild(el("p", "gt-toc-title")).textContent = t.toc;
      details.appendChild(list);
      toc.appendChild(details);
      toc.setAttribute("aria-label", t.toc);
      details.addEventListener("click", function (e) {
        if (e.target.tagName === "A" && !window.matchMedia("(min-width: 961px)").matches) details.open = false;
      });

      var ticking = false;
      function spy() {
        ticking = false;
        var y = window.scrollY + window.innerHeight * 0.3;
        var cur = null;
        links.forEach(function (l) { if (l.h.getBoundingClientRect().top + window.scrollY <= y) cur = l; });
        links.forEach(function (l) {
          l.a.classList.toggle("is-active", l === cur);
          l.li.classList.toggle("is-open", !!cur && l.li === cur.li);
        });
      }
      window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
      spy();
    }
  }

  function textOf(h) {
    var c = h.cloneNode(true);
    c.querySelectorAll(".gt-step, .gt-anchor").forEach(function (x) { x.remove(); });
    return c.textContent.trim();
  }

  // 9. ページの先頭へ戻るボタン。
  var top = el("button", "gt-totop", "↑");
  top.type = "button";
  top.setAttribute("aria-label", t.top);
  top.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
  document.body.appendChild(top);
  window.addEventListener("scroll", function () {
    top.classList.toggle("is-shown", window.scrollY > 800);
  }, { passive: true });
})();
