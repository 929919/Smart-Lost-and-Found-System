#!/usr/bin/env python3
"""Repository consistency checks.

Guards the things that have actually drifted on this project:
  * required files and directories exist
  * the iteration 2 snapshot has not been modified
  * the documented test count matches the number of assertions in the suite
  * documentation does not still describe removed behaviour

Run from the repository root:  python tools/check_repo.py
Exits non-zero on failure so it can gate CI.
"""
import base64
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
APP = ROOT / "iteration 3"

failures: list[str] = []
notes: list[str] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    print(f"  {'PASS' if ok else 'FAIL'}  {label}")
    if not ok:
        failures.append(f"{label}{(' — ' + detail) if detail else ''}")


print("Required files")
for rel in [
    "README.md",
    "Members.md",
    "docs/README.md",
    "docs/requirements.md",
    "docs/design.md",
    "docs/implementation.md",
    "docs/testing.md",
    "docs/tools.md",
    "docs/agile.md",
    "docs/version-control.md",
    "docs/acceptance-tests.md",
    "docs/system-testing-plan.md",
    "docs/code-quality.md",
    "iteration 3/login.html",
    "iteration 3/index.html",
    "iteration 3/db/schema.sql",
    "iteration 3/db/users.sql",
    "iteration 3/tests/tests.html",
    "iteration 3/tests/tests.js",
    "iteration 3/tests/mocks.js",
]:
    check(rel, (ROOT / rel).exists())

print("\nUser story pages (Practicals 5, 6, 8)")
stories = sorted((ROOT / "docs" / "user-stories").glob("*.md"))
check("20 user story pages present", len(stories) == 20, f"found {len(stories)}")

print("\nApplication pages carry the route guard")
pages = [p for p in APP.glob("*.html")]
check("11 pages present", len(pages) == 11, f"found {len(pages)}")
for page in sorted(pages):
    html = page.read_text(encoding="utf-8", errors="ignore")
    has_guard = "assets/js/auth.js" in html
    has_requires = "PAGE_REQUIRES" in html
    check(f"{page.name} declares PAGE_REQUIRES and loads auth.js",
          has_guard and has_requires)

print("\nTest count is consistent with the suite")
tests_js = (APP / "tests" / "tests.js").read_text(encoding="utf-8", errors="ignore")
# assertions are recorded by eq(...) and assert(...) calls
count = len(re.findall(r"\n\s*(?:eq|assert)\(", tests_js))
notes.append(f"assertions found in tests.js: {count}")
claimed = set(re.findall(r"(\d+)/(\d+) passing", (ROOT / "README.md").read_text(encoding="utf-8")))
check("README states a test count", bool(claimed), "no 'N/N passing' found")
if claimed:
    stated = int(list(claimed)[0][1])
    notes.append(f"README states: {stated}")
    check("stated test count matches the suite", stated == count,
          f"README says {stated}, suite has {count}")

print("\nIteration 2 remains an unmodified snapshot")
it2 = ROOT / "iteration 2"
check("iteration 2 has no tests directory", not (it2 / "tests").exists())
check("iteration 2 has no db directory", not (it2 / "db").exists())
check("iteration 2 has no matching.js", not (it2 / "assets/js/matching.js").exists())

print("\nDocumentation does not describe removed behaviour")
stale_patterns = [
    (r"pick a role", "role selection was removed from sign-in"),
    (r"[Nn]o passwords", "sign-in now requires a password"),
    (r"Nome do Integrante", "unfilled placeholder"),
]
for md in list((ROOT / "docs").rglob("*.md")) + [ROOT / "README.md", APP / "README.md", ROOT / "Members.md"]:
    text = md.read_text(encoding="utf-8", errors="ignore")
    for pattern, why in stale_patterns:
        if re.search(pattern, text):
            check(f"{md.relative_to(ROOT).as_posix()} free of stale text", False, why)
check("no stale documentation patterns", True)

print("\nSecurity: no privileged key committed")
# Decode any JWT found in the repository and inspect its role claim, rather than
# grepping for the word — config.js legitimately mentions service_role in a
# comment warning against committing it.
JWT = re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}")
privileged = []
tokens_seen = 0
for path in list(ROOT.rglob("*.js")) + list(ROOT.rglob("*.html")) + list(ROOT.rglob("*.md")):
    if ".git" in path.parts:
        continue
    for token in JWT.findall(path.read_text(encoding="utf-8", errors="ignore")):
        tokens_seen += 1
        payload = token.split(".")[1]
        payload += "=" * (-len(payload) % 4)          # restore base64 padding
        try:
            claims = base64.urlsafe_b64decode(payload).decode("utf-8", "ignore")
        except Exception:
            continue
        if '"role":"service_role"' in claims.replace(" ", ""):
            privileged.append(path.relative_to(ROOT).as_posix())
notes.append(f"JWTs inspected: {tokens_seen} (anon keys are safe to publish; service_role is not)")
check("no service_role token committed anywhere", not privileged,
      ", ".join(sorted(set(privileged))))

print()
for n in notes:
    print(f"  note: {n}")

if failures:
    print(f"\n{len(failures)} check(s) failed:")
    for f in failures:
        print("  " + f)
    sys.exit(1)

print("\nall repository checks passed")
