# Build & Development Tools

← [Back to documentation home](README.md)

The software development, build, and collaboration tools and external libraries
we used, and **how** we used them. Supports **Rubric Criterion 6 — Building and
development tools**.

---

## Languages
- **HTML5 / CSS3** — structure and the JCU design system.
- **JavaScript (ES6+)** — all application logic, no framework.
- **SQL (PostgreSQL)** — database schema and constraints.

## External libraries / services
| Tool | Role | How we used it |
|------|------|----------------|
| **Supabase** | Managed PostgreSQL + REST + Auth | Cloud database; queried from the browser via `supabase-js` |
| **supabase-js** | JS client SDK | `Store`/`Claims` call `.from('items').select/insert/update()` |
| **Vercel** | Static hosting / CI | Auto-deploys the site from GitHub on every push |
| **Mermaid** | Diagrams-as-code | Architecture, ER and sequence diagrams in these docs |
| **Custom browser test runner** | Zero-install unit tests | `tests/tests.html` asserts the data layer; TDD for the claims workflow (see [Testing](testing.md)) |
| Browser **MediaDevices API** | Camera | `getUserMedia` + `<canvas>` capture in `camera.js` |

## Development & collaboration tools
| Tool | How we used it |
|------|----------------|
| **Git + GitHub** | Version control, one repo, feature branches, PRs, tags per iteration (see [Version Control](version-control.md)) |
| **VS Code** | Primary editor; Live Server / `python -m http.server` for local preview |
| **GitHub Projects** | Backlog board — stories move To do → In progress → Done |
| **draw.io / diagrams.net** | Architectural UML diagram, database ER model and UI wireframes — sources committed under `docs/diagrams/` and exported to PNG for the documentation |
| **GitHub Actions** | Continuous integration on every push — see below |
| **Playwright** | Drives headless Chromium so CI runs the same browser test suite a developer runs |
| **Chrome DevTools** | Debugging, responsive checks, console-error sweeps |

## Continuous integration

Every push and pull request runs **[GitHub Actions](../.github/workflows/ci.yml)**.
The application has no build step, so the workflow does not compile anything — it
guards the failures this project actually had:

| Job | What it does | Why |
|-----|--------------|-----|
| **Repository & documentation checks** | `tools/check_links.py` resolves every relative link and image; `tools/check_repo.py` verifies required files, the 20 story pages, that all 11 pages declare `PAGE_REQUIRES` and load the route guard, that the documented test count matches the suite, that the iteration 2 snapshot is unmodified, and that no `service_role` token is committed | Documentation drifting out of step with the code was a repeated defect (D-09) |
| **JavaScript syntax** | `node --check` on every application and test script | Catches a syntax error before it reaches a demonstration |
| **Unit tests (headless browser)** | Serves the app, drives `tests/tests.html` with headless Chromium via Playwright, fails on any failing assertion **or any console error** | Runs exactly what a person runs, so CI cannot drift from the local suite |

The privileged-key check decodes any JWT found in the repository and inspects its
`role` claim, rather than searching for the word — `config.js` legitimately
mentions `service_role` in a comment warning against committing it.

Both Python checks are runnable locally:

```bash
python tools/check_links.py
python tools/check_repo.py
```

## Why "no framework"?
For a small team on a tight timeline, vanilla JS removed build/tooling overhead
so effort went into features and documentation. Shared behaviour is still
modularised (`auth.js`, `store.js`, `map.js`, `camera.js`, `main.js`), giving us
most of the maintainability benefits without a bundler.

## Local setup
```bash
git clone https://github.com/929919/Smart-Lost-and-Found-System.git
cd Smart-Lost-and-Found-System/"iteration 3"
python -m http.server 8124        # open http://localhost:8124/login.html
```
For the database build, add your Supabase keys to `assets/js/config.js`
(created in Iteration 3).
