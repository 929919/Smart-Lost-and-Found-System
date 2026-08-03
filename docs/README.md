# Smart Lost & Found System — Project Documentation

**CP3407 Advanced Software Engineering / Projects · Group 6 · James Cook University Singapore**

A responsive web application that centralises reporting, searching and recovering
lost items across the JCU Singapore campus, with role-based access (Student /
Admin), an interactive campus map, a claims workflow, camera capture for found
items, and a help assistant.

> 🔗 **Live demo:** _add your deployed Vercel URL here_
> 🎥 **Demo video:** _add link here_

---

## 📚 Documentation index

| Page | Rubric criterion it supports |
|------|------------------------------|
| 📋 **[How to Test This Project](HOW-TO-TEST.md)** | **Start here if you are marking** |
| [Requirements & Product Backlog](requirements.md) | 1 — Requirements |
| [Design](design.md) — architecture, database, UI | 2 — Design |
| [Implementation](implementation.md) — what we delivered | 3 — Implementation / Code |
| [Testing](testing.md) — strategy, TDD, unit tests, accessibility | 4 — Test |
| [Acceptance Tests](acceptance-tests.md) — Given/When/Then per story | 4 — Test |
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
├── backend/            # Flask API + Supabase schema (database tier)
├── frontend/           # Earlier React prototype
├── docs/               # 📚 this documentation
└── README.md
```

## ▶️ Run the current app locally
```bash
cd "iteration 3"
python -m http.server 8124        # then open http://localhost:8124/login.html
```
Sign in with any JCU ID (e.g. `jc123456`) and pick **Student** or **Admin**.
