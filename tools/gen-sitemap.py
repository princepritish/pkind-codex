#!/usr/bin/env python3
"""
Regenerate sitemap.xml.

lastmod is taken from each file's most recent git commit date, not its
filesystem mtime - a fresh clone (as in CI) rewrites every mtime to
checkout time, which would stamp every URL with the same wrong date.

Run from the repo root:  python3 tools/gen-sitemap.py
"""
import os
import re
import subprocess
import sys

SITE = "https://pkindustries.net"

# (path, priority, changefreq). Anything not listed is discovered as a blog post.
PAGES = [
    ("index.html", "1.0", "weekly"),
    ("steel-plant-consumables-manufacturer-jharkhand-india.html", "0.9", "monthly"),
    ("casting-powder.html", "0.9", "monthly"),
    ("nozzle-filling-compound.html", "0.9", "monthly"),
    ("castable.html", "0.9", "monthly"),
    ("mortar.html", "0.9", "monthly"),
    ("ladle-covering-compound-radex.html", "0.9", "monthly"),
    ("blog.html", "0.85", "weekly"),
    ("documentation.html", "0.85", "monthly"),
    ("casting-powder-docs.html", "0.8", "monthly"),
    ("nozzle-filling-compound-docs.html", "0.8", "monthly"),
    ("castable-docs.html", "0.8", "monthly"),
    ("ladle-covering-compound-docs.html", "0.8", "monthly"),
    ("research-hub.html", "0.8", "monthly"),
    ("chatbot.html", "0.7", "monthly"),
    ("contact.html", "0.8", "yearly"),
    ("about.html", "0.75", "yearly"),
    ("exports.html", "0.75", "yearly"),
    ("glossary.html", "0.7", "yearly"),
    ("privacy.html", "0.3", "yearly"),
    ("sitemap.html", "0.5", "yearly"),
]

EXCLUDE = {"404.html"}

NOINDEX = re.compile(r'<meta\s+name="robots"[^>]*content="[^"]*noindex', re.I)


def is_noindex(path):
    """A page that tells crawlers not to index it does not belong in the sitemap.

    Read from the file rather than a hardcoded list, so marking a page noindex
    is the only edit needed - the sitemap follows automatically.
    """
    try:
        with open(path, encoding="utf-8") as fh:
            return bool(NOINDEX.search(fh.read(4096)))
    except OSError:
        return False


def git_date(path):
    """Most recent commit date for a path, as YYYY-MM-DD."""
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", path],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        return out or None
    except subprocess.CalledProcessError:
        return None


def loc_for(path):
    return f"{SITE}/" if path == "index.html" else f"{SITE}/{path}"


def main():
    entries = list(PAGES)

    # Pick up blog posts automatically once blog/ exists
    if os.path.isdir("blog"):
        for name in sorted(os.listdir("blog")):
            if name == "posts": continue
            if name.endswith(".html") and name not in EXCLUDE:
                entries.append((f"blog/{name}", "0.7", "monthly"))

    rows = []
    missing = []
    skipped = []
    for path, priority, freq in entries:
        if not os.path.exists(path):
            missing.append(path)
            continue
        if is_noindex(path):
            skipped.append(path)
            continue
        date = git_date(path)
        rows.append(
            "  <url>\n"
            f"    <loc>{loc_for(path)}</loc>\n"
            + (f"    <lastmod>{date}</lastmod>\n" if date else "")
            + f"    <changefreq>{freq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            "  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(rows)
        + "\n</urlset>\n"
    )

    with open("sitemap.xml", "w", encoding="utf-8") as fh:
        fh.write(xml)

    print(f"sitemap.xml written: {len(rows)} urls")
    if skipped:
        print("  skipped (noindex): " + ", ".join(skipped))
    if missing:
        print("  skipped (not found): " + ", ".join(missing), file=sys.stderr)


if __name__ == "__main__":
    main()
