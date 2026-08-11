#!/usr/bin/env python3
"""
Rewrite every "Last updated:" line from the file's own git history.

These were hardcoded and drifted months out of date, which reads as an
abandoned site to both buyers and crawlers. Driving them from git means the
date is always the last time the page actually changed - and it cannot go
stale again without someone deliberately breaking it.

Uses commit date, not filesystem mtime: a fresh clone (as in CI) rewrites
every mtime to checkout time.

Run from the repo root:  python3 tools/stamp-dates.py
"""
import datetime
import glob
import re
import subprocess

PATTERN = re.compile(
    r'(<p class="last-updated">Last updated:\s*)([^<]*?)(\s*</p>)'
)


def git_date(path):
    """Most recent commit date for a path, as a date object."""
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", path],
        capture_output=True, text=True,
    ).stdout.strip()
    if not out:
        return None
    try:
        return datetime.date.fromisoformat(out)
    except ValueError:
        return None


def main():
    changed = 0
    for path in sorted(glob.glob("*.html") + glob.glob("blog/*.html")):
        source = open(path, encoding="utf-8").read()
        if not PATTERN.search(source):
            continue
        date = git_date(path)
        if date is None:
            continue
        # "August 11, 2026" - %-d avoids a zero-padded day
        stamp = date.strftime("%B %-d, %Y")
        updated = PATTERN.sub(rf"\g<1>{stamp}\g<3>", source)
        if updated != source:
            open(path, "w", encoding="utf-8").write(updated)
            print(f"  {path}: {stamp}")
            changed += 1
    print(f"stamped {changed} file(s)")


if __name__ == "__main__":
    main()
