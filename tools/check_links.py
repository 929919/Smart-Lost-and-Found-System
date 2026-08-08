#!/usr/bin/env python3
"""Check that every relative link and image in the documentation resolves.

Run from the repository root:  python tools/check_links.py
Exits non-zero if anything is broken, so it can gate CI.
"""
import re
import sys
import pathlib
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Markdown files we care about: repository root, docs (recursively), iteration READMEs
TARGETS = (
    list(ROOT.glob("*.md"))
    + list((ROOT / "docs").rglob("*.md"))
    + list(ROOT.glob("*/README.md"))
)

LINK = re.compile(r"!?\[[^\]]*\]\(([^)\s]+)")
FENCE = re.compile(r"```.*?```", re.S)

def main() -> int:
    broken, checked = [], 0

    for md in sorted(set(TARGETS)):
        text = FENCE.sub("", md.read_text(encoding="utf-8", errors="ignore"))
        for match in LINK.finditer(text):
            target = match.group(1).strip()
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            checked += 1
            path = urllib.parse.unquote(target.split("#")[0])
            if not path:
                continue
            if not (md.parent / path).resolve().exists():
                broken.append(f"{md.relative_to(ROOT).as_posix()} -> {target}")

    print(f"checked {checked} relative links across {len(set(TARGETS))} files")
    if broken:
        print(f"\n{len(broken)} BROKEN:")
        for b in broken:
            print("  " + b)
        return 1
    print("all links resolve")
    return 0


if __name__ == "__main__":
    sys.exit(main())
