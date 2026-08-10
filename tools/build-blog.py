#!/usr/bin/env python3
"""
Build the blog: post pages, the blog index, and the RSS feed.

Posts are authored as HTML fragments in blog/posts/<slug>.html. Each starts
with a metadata comment:

    <!--meta
    title: How to diagnose slow ladle free opening
    description: One-sentence summary used for the meta description and feed.
    date: 2026-08-17
    product: nozzle-filling-compound
    tags: free opening, ladle, NFC
    -->
    <p>Body HTML from here on...</p>

The site header and footer are read from blog.html at build time, so nav
changes made there flow into every post automatically rather than drifting.

Usage:  python3 tools/build-blog.py
"""
import html
import os
import re
import sys
from datetime import datetime, timezone

SITE = "https://pkindustries.net"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "blog", "posts")
OUT_DIR = os.path.join(ROOT, "blog")

PRODUCT_PAGES = {
    "casting-powder": ("Casting Powder", "casting-powder.html"),
    "nozzle-filling-compound": ("Nozzle Filling Compound", "nozzle-filling-compound.html"),
    "castable": ("Refractory Castable", "castable.html"),
    "mortar": ("Mortar", "mortar.html"),
    "ladle-covering-compound": ("Ladle Covering Compound (Radex)", "ladle-covering-compound-radex.html"),
}


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def chrome():
    """Header and footer lifted from blog.html, with paths made relative to blog/."""
    src = read(os.path.join(ROOT, "blog.html"))
    # Take only the <nav>, not the whole <header>: on this site the header also
    # contains the page hero, which would give every post a second <h1>.
    nav = re.search(r'(<nav class="nav shell".*?</nav>)', src, re.S).group(1)
    header = f'  <header class="site-header page-header" id="top">\n{nav}\n  </header>'
    footer = re.search(r'(<footer class="site-footer.*?</footer>)', src, re.S).group(1)
    tail = re.search(r'(</footer>)(.*?)(</body>)', src, re.S).group(2)

    def up(block):
        block = re.sub(r'(src|href)="(?!https?:|mailto:|tel:|#|/)', r'\1="../', block)
        # srcset/imagesrcset hold comma-separated candidates, so each URL in the
        # list needs the prefix - a plain attribute-level rewrite misses them.
        def fix_srcset(m):
            attr, value = m.group(1), m.group(2)
            out = []
            for cand in value.split(","):
                cand = cand.strip()
                if cand and not re.match(r"(https?:|data:|/)", cand):
                    cand = "../" + cand
                out.append(cand)
            return f'{attr}="{", ".join(out)}"'
        block = re.sub(r'(srcset|imagesrcset)="([^"]*)"', fix_srcset, block)
        block = block.replace('href="../#', 'href="../index.html#')
        return block

    return up(header), up(footer), up(tail)


def parse_post(path):
    raw = read(path)
    m = re.match(r"\s*<!--meta\s*(.*?)-->\s*(.*)", raw, re.S)
    if not m:
        sys.exit(f"ERROR: {path} has no <!--meta ... --> block")
    meta = {}
    for line in m.group(1).strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip().lower()] = v.strip()
    meta["body"] = m.group(2).strip()
    meta["slug"] = os.path.splitext(os.path.basename(path))[0]
    for required in ("title", "description", "date"):
        if not meta.get(required):
            sys.exit(f"ERROR: {path} is missing '{required}' in its meta block")
    return meta


def post_html(p, header, footer, tail):
    url = f"{SITE}/blog/{p['slug']}.html"
    esc_title = html.escape(p["title"])
    esc_desc = html.escape(p["description"])
    pretty = datetime.strptime(p["date"], "%Y-%m-%d").strftime("%d %B %Y")

    related = ""
    if p.get("product") in PRODUCT_PAGES:
        name, page = PRODUCT_PAGES[p["product"]]
        related = (f'\n      <p class="post-related">Related product: '
                   f'<a href="../{page}">{name}</a></p>')

    tags = ""
    if p.get("tags"):
        items = "".join(f"<span>{html.escape(t.strip())}</span>"
                        for t in p["tags"].split(",") if t.strip())
        tags = f'\n        <div class="resource-tags">{items}</div>'

    schema = f'''{{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "{url}#post",
  "headline": {esc_title!r},
  "description": {esc_desc!r},
  "url": "{url}",
  "datePublished": "{p['date']}",
  "dateModified": "{p['date']}",
  "inLanguage": "en-IN",
  "author": {{ "@id": "{SITE}/#organization" }},
  "publisher": {{ "@id": "{SITE}/#organization" }},
  "isPartOf": {{ "@type": "Blog", "@id": "{SITE}/blog.html" }},
  "mainEntityOfPage": "{url}"
}}'''.replace("'", '"')

    crumbs = f'''{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "{SITE}/" }},
    {{ "@type": "ListItem", "position": 2, "name": "Blog", "item": "{SITE}/blog.html" }},
    {{ "@type": "ListItem", "position": 3, "name": "{esc_title}", "item": "{url}" }}
  ]
}}'''

    return f'''<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta name="description" content="{esc_desc}">
  <meta name="author" content="P.K. Industries">
  <meta name="theme-color" content="#06090f">
  <title>{esc_title} | PK INDUSTRIES</title>
  <link rel="canonical" href="{url}">

  <meta property="og:type" content="article">
  <meta property="og:locale" content="en_IN">
  <meta property="og:url" content="{url}">
  <meta property="og:site_name" content="P.K. Industries">
  <meta property="og:title" content="{esc_title}">
  <meta property="og:description" content="{esc_desc}">
  <meta property="article:published_time" content="{p['date']}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc_title}">
  <meta name="twitter:description" content="{esc_desc}">

  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/img/logo1.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="PK Industries Blog" href="/feed.xml">
  <link rel="stylesheet" href="../css/modern-dark.css">
  <link rel="stylesheet" href="../css/docs.css">

  <script type="application/ld+json">
{schema}
  </script>
  <script type="application/ld+json">
{crumbs}
  </script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>

{header}

  <main id="main-content">
    <article class="section shell prose-post">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>/</span><a href="../blog.html">Blog</a><span>/</span><span aria-current="page">{esc_title}</span></nav>
      <p class="eyebrow">Technical article</p>
      <h1>{esc_title}</h1>
      <p class="post-meta"><time datetime="{p['date']}">{pretty}</time></p>
      <p class="lead">{esc_desc}</p>{tags}

{p['body']}
{related}

      <div class="doc-callout" style="margin-top:2rem">
        <p><strong>Need a grade recommendation?</strong> Send your steel grades, casting route and the problem you are solving. WhatsApp <a href="https://wa.me/919431342715">+91 94313 42715</a> or email <a href="mailto:info@pkindustries.net">info@pkindustries.net</a>.</p>
      </div>

      <p style="margin-top:1.5rem"><a href="../blog.html">&larr; All articles</a></p>
    </article>
  </main>

{footer}
{tail}</body>
</html>
'''


def build():
    if not os.path.isdir(POSTS_DIR):
        os.makedirs(POSTS_DIR, exist_ok=True)
    header, footer, tail = chrome()

    posts = [parse_post(os.path.join(POSTS_DIR, f))
             for f in sorted(os.listdir(POSTS_DIR)) if f.endswith(".html")]
    posts.sort(key=lambda p: p["date"], reverse=True)

    for p in posts:
        out = os.path.join(OUT_DIR, p["slug"] + ".html")
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(post_html(p, header, footer, tail))
        print(f"  wrote blog/{p['slug']}.html")

    update_index(posts)
    write_feed(posts)
    print(f"built {len(posts)} post(s)")


def update_index(posts):
    """Replace the article list and the Blog schema in blog.html."""
    path = os.path.join(ROOT, "blog.html")
    src = read(path)

    if not posts:
        cards = '<p class="notice">New articles are published here regularly.</p>'
    else:
        cards = "\n".join(
            f'''        <article class="doc-card reveal">
          <div class="doc-meta"><span>{datetime.strptime(p["date"], "%Y-%m-%d").strftime("%d %b %Y")}</span></div>
          <h3><a href="blog/{p["slug"]}.html">{html.escape(p["title"])}</a></h3>
          <p>{html.escape(p["description"])}</p>
          <a class="product-link" href="blog/{p["slug"]}.html">Read article</a>
        </article>''' for p in posts)

    block = (f'      <!--POSTS-->\n      <div class="doc-grid">\n{cards}\n      </div>\n      <!--/POSTS-->')
    if "<!--POSTS-->" in src:
        src = re.sub(r"      <!--POSTS-->.*?<!--/POSTS-->", block, src, flags=re.S)
    else:
        src = src.replace("</main>", block + "\n  </main>", 1)

    entries = ",\n      ".join(
        f'{{"@type": "BlogPosting", "headline": "{html.escape(p["title"])}", '
        f'"url": "{SITE}/blog/{p["slug"]}.html", "datePublished": "{p["date"]}"}}'
        for p in posts) or ""
    src = re.sub(r'"blogPost": \[.*?\]', f'"blogPost": [\n      {entries}\n    ]', src, flags=re.S)

    if 'type="application/rss+xml"' not in src:
        src = src.replace('<link rel="canonical"',
                          '<link rel="alternate" type="application/rss+xml" title="PK Industries Blog" href="/feed.xml">\n    <link rel="canonical"', 1)

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(src)
    print("  updated blog.html index")


def write_feed(posts):
    now = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    items = "\n".join(f'''    <item>
      <title>{html.escape(p["title"])}</title>
      <link>{SITE}/blog/{p["slug"]}.html</link>
      <guid isPermaLink="true">{SITE}/blog/{p["slug"]}.html</guid>
      <description>{html.escape(p["description"])}</description>
      <pubDate>{datetime.strptime(p["date"], "%Y-%m-%d").strftime("%a, %d %b %Y 09:00:00 +0530")}</pubDate>
    </item>''' for p in posts)

    feed = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>P.K. Industries - Steel Plant Consumables Blog</title>
    <link>{SITE}/blog.html</link>
    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Practical technical articles on casting powder, nozzle filling compound, refractory castable, mortar and ladle covering compound.</description>
    <language>en-in</language>
    <lastBuildDate>{now}</lastBuildDate>
{items}
  </channel>
</rss>
'''
    with open(os.path.join(ROOT, "feed.xml"), "w", encoding="utf-8") as fh:
        fh.write(feed)
    print("  wrote feed.xml")


if __name__ == "__main__":
    build()
