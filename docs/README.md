# Smart Lost & Found System — Project Documentation

**CP3407 Advanced Software Engineering / Projects · Group 6 · James Cook University Singapore**

A responsive web application that centralises reporting, searching and recovering
lost items across the JCU Singapore campus, with role-based access (Student /
Admin), an interactive campus map, a claims workflow, camera capture for found
items, and a help assistant.

> 🔗 **Live demo:** <https://smart-lost-and-found-system-virid.vercel.app>
> 🎥 **Demo video:** _add link here_

---

## 📚 Documentation index

| Page | Rubric criterion it supports |
|------|------------------------------|
| 📋 **[How to Test This Project](HOW-TO-TEST.md)** | **Start here if you are marking** |
| 🎤 [Demo Script](DEMO-SCRIPT.md) | 15-minute walkthrough running order |
| 🚀 [Deployment Guide](DEPLOYMENT.md) | Publishing to Vercel, step by step |
| [Requirements & Product Backlog](requirements.md) | 1 — Requirements |
| [Design](design.md) — architecture, database, UI | 2 — Design |
| [Diagram Build Specs](diagram-specs.md) — draw.io sources, editing and export | 2 — Design |
| [Implementation](implementation.md) — what we delivered | 3 — Implementation / Code |
| [Testing](testing.md) — strategy, TDD, unit tests, accessibility | 4 — Test |
| [Code Quality](code-quality.md) — SRP & DRY review | 4 — Test / 7 — Agile |
| [Acceptance Tests](acceptance-tests.md) — Given/When/Then per story | 4 — Test |
| [System Testing Plan & Defect Log](system-testing-plan.md) | 4 — Test |
| [Version Control](version-control.md) — git workflow | 5 — Version control |
| [Build & Development Tools](tools.md) | 6 — Building and development tools |
| [Agile Process](agile.md) — iterations, reviews, velocity | 7 — Agile software engineering |

## 👥 Team — Group 6
- Yuvraj Dave
- João Gabriel Costa
- Chiranjeeb Satpathy

## 🗂️ Repository layout
```
Smart-Lost-and-Found-System/
├── iteration 1/        # Iteration 1 — static browse & report prototype
├── iteration 2/        # Iteration 2 — roles, claims, camera
├── iteration 3/        # Iteration 3 — auto-matching, tests, DB (current app)
├── backend/            # ⚠️ superseded Flask prototype (see its README)
├── frontend/           # ⚠️ superseded React prototype (see its README)
├── docs/               # 📚 this documentation
└── README.md
```

## ▶️ Run the current app locally
```bash
cd "iteration 3"
python -m http.server 8124        # then open http://localhost:8124/login.html
```
Sign in with `jc111111` / `student123` (student) or `jc999999` / `admin123` (admin).
See [How to Test](HOW-TO-TEST.md) for all accounts.
