# Implementation / Code

← [Back to documentation home](README.md)

What we delivered each iteration — *"what is needed, on time and on budget"* —
plus the technology choices and how to see it running. Supports **Rubric
Criterion 3 — Implementation / Code**.

> 🔗 **Deployed app:** _add Vercel URL_ · 🎥 **Demo video:** _add link_

---

## Technology stack

| Layer | Choice | Why |
|-------|--------|-----|
| Front end | HTML5 + CSS3 + **vanilla JavaScript** (no framework) | Zero build friction, fast to iterate, easy to host and mark |
| Database | **Supabase (PostgreSQL)** | Modern managed relational DB with REST API + Row-Level Security |
| Data access | `supabase-js` browser SDK | Talk to Postgres directly from static pages |
| Hosting | **Vercel** (static) | One-click deploy, free HTTPS + CDN |
| Media | `getUserMedia` + `<canvas>` → base64 | Camera capture for found items, no upload server |
| Diagrams / docs | Mermaid on GitHub | Design diagrams render inline |

## What we delivered, by iteration

### Iteration 1 — Browse & report (foundation)
- Found-items **dashboard** with search + category/status filters and live stats.
- **Report** form with an **interactive JCU campus map** location picker.
- Rule-based **help assistant**.
- Delivered as a polished, responsive static site (`iteration 1/`).

### Iteration 2 — Roles, claims & camera (current app)
- **Role-based login** (Student / Admin) with a route guard (`auth.js`).
- Student: **submit claims** with proof of ownership, item detail pages.
- Admin: **admin dashboard**, **log found items with camera or file upload** (`camera.js`), **review claims** (approve / reject / mark returned), item status table.
- Shared role-aware header/nav, logged-in indicator + logout, floating chat widget (`iteration 2/`).

### Iteration 3 — Persistence, deployment & matching (in progress)
- ✅ **Lost ↔ found auto-matching** (`matching.js`) — scores every active found item against a student's lost report (category, location, colour, shared keywords, date proximity) and surfaces ranked matches on their dashboard **with the reasons for each match**.
- ✅ **Automated test suite** — 35 unit tests, zero-install runner (see [Testing](testing.md)).
- 🔨 Migrate the data layer from `localStorage` to **Supabase Postgres** (`store.js`).
- 🔨 **Deploy** to a public Vercel URL.

## Client feedback per iteration
Each iteration ended with a demo to our client/tutor. Summary:

| Iteration | Feedback received | Action taken |
|-----------|-------------------|--------------|
| 1 | _"Looks clean; make it feel like an official JCU site and add real branding."_ | Adopted JCU Singapore logo, colours and campus map in Iteration 2 |
| 2 | _"Great role separation; needs a real database and a public link to demo."_ | Planned Supabase + Vercel for Iteration 3 |
| 3 | _add your client's feedback here_ | |

> _Replace the italicised feedback with your actual tutor/client comments._

## Screenshots
_Add screenshots of: Login, Dashboard, Report-Lost map, Log-Found camera, Item
Detail, Admin Claims. (Save under `docs/img/` and embed with `![](img/...)`.)_

## Run / build
```bash
# Current app (Iteration 3)
cd "iteration 3" && python -m http.server 8124   # http://localhost:8124/login.html
```
No build step is required. Iteration 3 adds a `config.js` holding your Supabase
URL + anon key (see [Tools](tools.md)).
