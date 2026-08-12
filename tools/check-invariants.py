#!/usr/bin/env python3
"""
Assert the site-wide rules that keep getting undone.

Most of these were fixed once by editing the HTML directly, then quietly
reintroduced when a generator (build-blog.py, build-pages.py) rewrote its
output from a template that still had the old value. Fixing the pages is not
enough; the invariant has to be checkable.

Run from the repo root, after any build:
    python3 tools/check-invariants.py

Exits non-zero on the first broken invariant so CI can gate on it.
"""
import glob
import json
import os
import re
import sys
from urllib.parse import urlsplit

PAGES = sorted(glob.glob("*.html") + glob.glob("blog/*.html"))
failures = []


def read(path):
    return open(path, encoding="utf-8").read()


def fail(message):
    failures.append(message)


def check_canonical_home_links():
    """The homepage canonical is "/". Anything pointing at index.html 301s away."""
    for path in PAGES:
        for match in re.finditer(r'href="((?:\.\./)?index\.html[^"]*)"', read(path)):
            fail(f"{path}: non-canonical homepage link {match.group(1)!r}")


def check_single_entity_name():
    """One legal-name spelling everywhere, or search engines cannot resolve the entity.

    URLs are excluded: the Google Maps link carries the name inside a search
    query string, which is a lookup term rather than a declaration of the
    entity's name, and rewriting it risks changing what the map resolves to.
    """
    found = set()
    for path in PAGES:
        source = re.sub(r"https?://[^\"'\s>]+", "", read(path))
        found.update(re.findall(r"P\.\s?K\.\s?Industries|PK Industries|PK INDUSTRIES", source))
    if len(found) > 1:
        fail(f"multiple entity spellings in use: {sorted(found)}")


def check_no_autoplay():
    """Video must never autoplay, in markup or at runtime."""
    for path in PAGES + sorted(glob.glob("js/*.js")) + sorted(glob.glob("css/*.css")):
        if "autoplay" in read(path):
            fail(f"{path}: autoplay reintroduced")


def check_no_stale_markers():
    for path in PAGES:
        source = read(path)
        if 'name="keywords"' in source:
            fail(f"{path}: meta keywords tag is back")
        if "REPLACE_ME" in source:
            fail(f"{path}: unreplaced placeholder")


def check_footer_nap():
    for path in PAGES:
        if "footer-nap" not in read(path):
            fail(f"{path}: missing footer NAP block")


def check_noindex_not_in_sitemap():
    """A page telling crawlers to skip it must not also be advertised."""
    if not os.path.exists("sitemap.xml"):
        return
    listed = set(re.findall(r"<loc>https://pkindustries\.net/([^<]*)</loc>", read("sitemap.xml")))
    for path in PAGES:
        if re.search(r'<meta name="robots"[^>]*noindex', read(path)) and path in listed:
            fail(f"{path}: noindex but present in sitemap.xml")


def check_json_ld():
    for path in PAGES:
        for block in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', read(path), re.S
        ):
            try:
                json.loads(block)
            except ValueError as err:
                fail(f"{path}: invalid JSON-LD ({err})")


def check_internal_links_resolve():
    """Every local href must point at a file that exists."""
    for path in PAGES:
        base = os.path.dirname(path)
        for href in re.findall(r'(?:href|src)="([^"]+)"', read(path)):
            if re.match(r"(https?:|mailto:|tel:|data:|#)", href):
                continue
            target = urlsplit(href).path
            if not target or target.endswith("/"):
                continue
            resolved = os.path.normpath(
                os.path.join("", target.lstrip("/")) if href.startswith("/")
                else os.path.join(base, target)
            )
            if not os.path.exists(resolved):
                fail(f"{path}: link to missing file {href!r}")


def main():
    for check in (
        check_canonical_home_links,
        check_single_entity_name,
        check_no_autoplay,
        check_no_stale_markers,
        check_footer_nap,
        check_noindex_not_in_sitemap,
        check_json_ld,
        check_internal_links_resolve,
    ):
        check()

    if failures:
        print(f"{len(failures)} invariant failure(s):", file=sys.stderr)
        for message in failures:
            print(f"  {message}", file=sys.stderr)
        sys.exit(1)
    print(f"all invariants hold across {len(PAGES)} pages")


if __name__ == "__main__":
    main()
