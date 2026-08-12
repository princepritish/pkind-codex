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

AUTHOR = "Vision PK INDUSTRIES"

# Each post gets a lead image matched to its product, so posts do not all
# share one photo. Override per post with "image:" in the meta block.
PRODUCT_IMAGES = {
    "casting-powder": ("casting-powder-hero", "Casting powder feeding onto the mould meniscus"),
    "nozzle-filling-compound": ("nfc-hero", "Nozzle filling compound for ladle slide gate free opening"),
    "castable": ("castable-thumb", "Refractory castable lining material"),
    "mortar": ("mortar-rs", "Refractory mortar for jointing and patching"),
    "ladle-covering-compound": ("radex-thumb", "Ladle covering compound insulating the steel surface"),
}
DEFAULT_IMAGE = ("goal-strong-shining-billets", "Freshly cast steel billets")

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
        # Anchors on the homepage must point at the canonical "/", never
        # "/index.html" - the latter 301s away and leaks link equity.
        block = block.replace('href="../#', 'href="/#')
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
    # Appending the brand to an already-long headline pushes the title past
    # the ~60 chars Google renders, so only add it when it fits.
    page_title = esc_title if len(p["title"]) > 45 else f"{esc_title} | PK INDUSTRIES"

    words = len(re.sub(r"<[^>]+>", " ", p["body"]).split())
    minutes = max(1, round(words / 200))

    img_slug, img_alt = PRODUCT_IMAGES.get(p.get("product"), DEFAULT_IMAGE)
    if p.get("image"):
        img_slug = p["image"]
    if p.get("image_alt"):
        img_alt = p["image_alt"]
    hero_img = (f'      <figure class="post-hero">\n'
                f'        <img src="../img/{img_slug}.jpg" alt="{html.escape(img_alt)}" '
                f'width="960" height="540" fetchpriority="high" decoding="async">\n'
                f'      </figure>')

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
  "author": {{ "@type": "Organization", "name": "{AUTHOR}", "url": "{SITE}/about.html" }},
  "publisher": {{ "@id": "{SITE}/#organization" }},
  "isPartOf": {{ "@type": "Blog", "@id": "{SITE}/blog.html" }},
  "mainEntityOfPage": "{url}",
  "image": "{SITE}/img/{img_slug}.jpg",
  "wordCount": {words},
  "timeRequired": "PT{minutes}M"
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
  <meta name="author" content="PK INDUSTRIES">
  <meta name="theme-color" content="#06090f">
  <title>{page_title}</title>
  <link rel="canonical" href="{url}">

  <meta property="og:type" content="article">
  <meta property="og:locale" content="en_IN">
  <meta property="og:url" content="{url}">
  <meta property="og:site_name" content="PK INDUSTRIES">
  <meta property="og:title" content="{esc_title}">
  <meta property="og:description" content="{esc_desc}">
  <meta property="og:image" content="{SITE}/img/{img_slug}.jpg">
  <meta property="og:image:alt" content="{html.escape(img_alt)}">
  <meta property="article:published_time" content="{p['date']}">
  <meta property="article:author" content="{AUTHOR}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc_title}">
  <meta name="twitter:description" content="{esc_desc}">
  <meta name="twitter:image" content="{SITE}/img/{img_slug}.jpg">

  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="/img/logo1.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="PK INDUSTRIES Blog" href="/feed.xml">
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
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="../blog.html">Blog</a><span>/</span><span aria-current="page">{esc_title}</span></nav>
      <p class="eyebrow">Technical article</p>
      <h1>{esc_title}</h1>

      <div class="post-byline">
        <img class="post-avatar" src="../img/logo1.png" alt="" width="40" height="40" aria-hidden="true">
        <div>
          <span class="post-author">{AUTHOR}</span>
          <span class="post-sub"><time datetime="{p['date']}">{pretty}</time> &middot; {minutes} min read</span>
        </div>
      </div>

{hero_img}

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
        def card(p):
            img_slug, img_alt = PRODUCT_IMAGES.get(p.get("product"), DEFAULT_IMAGE)
            if p.get("image"):
                img_slug = p["image"]
            words = len(re.sub(r"<[^>]+>", " ", p["body"]).split())
            mins = max(1, round(words / 200))
            date = datetime.strptime(p["date"], "%Y-%m-%d").strftime("%d %b %Y")
            return f'''        <article class="post-card reveal">
          <div class="post-card-media">
            <img src="img/{img_slug}.jpg" alt="" width="640" height="360" loading="lazy" decoding="async">
          </div>
          <div class="post-card-body">
            <p class="post-card-meta"><time datetime="{p["date"]}">{date}</time> &middot; {mins} min read</p>
            <h3><a href="blog/{p["slug"]}.html">{html.escape(p["title"])}</a></h3>
            <p>{html.escape(p["description"])}</p>
            <p class="post-card-author">{AUTHOR}</p>
          </div>
        </article>'''
        cards = "\n".join(card(p) for p in posts)

    block = ('  <!--POSTS-->\n'
             '  <section class="section shell" id="articles">\n'
             '    <div class="section-heading reveal">\n'
             '      <p class="eyebrow">Latest articles</p>\n'
             '      <h2>Technical notes from the plant floor.</h2>\n'
             '    </div>\n'
             f'    <div class="post-grid">\n{cards}\n    </div>\n'
             '  </section>\n'
             '  <!--/POSTS-->')
    if "<!--POSTS-->" in src:
        src = re.sub(r"[ \t]*<!--POSTS-->.*?<!--/POSTS-->", block, src, flags=re.S)
    else:
        # Lead with the articles rather than burying them under the static
        # sections that predate the blog having real posts.
        src = re.sub(r"(<main[^>]*>)", r"\1\n" + block.replace("\\", "\\\\"), src, count=1)

    entries = ",\n      ".join(
        f'{{"@type": "BlogPosting", "headline": "{html.escape(p["title"])}", '
        f'"url": "{SITE}/blog/{p["slug"]}.html", "datePublished": "{p["date"]}"}}'
        for p in posts) or ""
    src = re.sub(r'"blogPost": \[.*?\]', f'"blogPost": [\n      {entries}\n    ]', src, flags=re.S)

    if 'type="application/rss+xml"' not in src:
        src = src.replace('<link rel="canonical"',
                          '<link rel="alternate" type="application/rss+xml" title="PK INDUSTRIES Blog" href="/feed.xml">\n    <link rel="canonical"', 1)

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
    <title>PK INDUSTRIES - Steel Plant Consumables Blog</title>
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
