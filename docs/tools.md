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
| **Chrome DevTools** | Debugging, responsive checks, console-error sweeps |

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
