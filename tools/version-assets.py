#!/usr/bin/env python3
"""
Append a build version to local CSS and JS URLs in every HTML file.

Why this is needed: the deploy serves static assets with
"Cache-Control: public, max-age=31536000, immutable". On a fixed filename
like js/modern-ui.js that is a trap. "immutable" tells the browser never to
revalidate, so a returning visitor keeps the old file for a year and a
CloudFront invalidation cannot reach them - invalidation clears the edge,
not the browser. Long immutable caching is only safe when the URL changes
between builds.

So the URL changes: js/modern-ui.js?v=<short sha>. HTML is cached for only
300 seconds, so the new HTML arrives quickly and points at a URL the browser
has never seen, which forces a fresh fetch. Browsers key their cache on the
full URL including the query string, so this works regardless of whether
CloudFront forwards query strings.

Images are deliberately not versioned. They are content-identical across
recompressions, so a returning visitor keeping the copy they already hold
costs nothing - there is no stale-behaviour risk the way there is with code.

Run from the repo root, before the S3 sync:
    python3 tools/version-assets.py
"""
import glob
import os
import re
import subprocess
import sys

# (attr)="(optional ../)(css|js)/(file).(css|js)" with no existing query
PATTERN = re.compile(
    r'((?:href|src)=")((?:\.\./)?(?:css|js)/[A-Za-z0-9._-]+\.(?:css|js))(")'
)


def version():
    """Short commit sha, or an env override for local runs."""
    if os.environ.get("ASSET_VERSION"):
        return os.environ["ASSET_VERSION"]
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        if out:
            return out
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    print("ERROR: could not determine a build version", file=sys.stderr)
    sys.exit(1)


def main():
    ver = version()
    changed = 0
    rewrites = 0

    for path in sorted(glob.glob("*.html") + glob.glob("blog/*.html")):
        source = open(path, encoding="utf-8").read()

        def stamp(match):
            nonlocal rewrites
            rewrites += 1
            return f"{match.group(1)}{match.group(2)}?v={ver}{match.group(3)}"

        updated = PATTERN.sub(stamp, source)
        if updated != source:
            open(path, "w", encoding="utf-8").write(updated)
            changed += 1

    print(f"asset version {ver}: {rewrites} url(s) stamped across {changed} file(s)")


if __name__ == "__main__":
    main()
