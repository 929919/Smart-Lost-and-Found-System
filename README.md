# Smart Lost & Found System

**CP3407 Advanced Software Engineering / Projects · Group 6 · James Cook University Singapore**

A responsive web application that centralises reporting, searching and recovering lost
items across the JCU Singapore campus — with role-based access, an interactive campus
map, a verified claims workflow, camera capture for found items, automatic lost↔found
matching, and a help assistant.

> 🔗 **Live demo:** <https://smart-lost-and-found-system-virid.vercel.app>
> 🎥 **Demo video:** **[Walkthrough — 3 min 41 s](https://drive.google.com/file/d/1BMMGsTkiHfR5UGWSQg3bmyD5pLkSfZZr/view?usp=sharing)**

> ### ⚠️ Please read before clicking the live demo
>
> **Chrome currently shows a "Dangerous site" warning for the deployed URL.**
> The application is not compromised. Google Safe Browsing classifies it as
> phishing because it combines three signals that do genuinely describe a
> phishing site: real JCU branding, a sign-in form asking for a university ID
> and password, and a free `vercel.app` subdomain.
>
> The cause has been fixed — a permanent student-project disclaimer sits at the
> top of every page and the demo accounts are published openly on the sign-in
> screen — but clearing the flag requires Google to re-review the site. **That
> review has been requested and is pending.** Tracked as defect
> **[D-03](docs/system-testing-plan.md#d-03--the-one-defect-still-open)**, the
> only defect still open.
>
> **To see the working system:** watch the **demo video** above, or **run it
> locally** ([How to Test](docs/HOW-TO-TEST.md)) — no install, no build step,
> same live database. To reach the deployed site anyway, use Chrome's
> **Details → visit this unsafe site**. Only sample data and the three published
> demo accounts exist there; never enter real credentials.

### What the demo video shows

A screen recording of the delivered application, run against the live database.
**There is no narration** — the running order below is the commentary.

| Time | What is on screen |
|------|-------------------|
| 0:00 | Sign-in page, with the coursework disclaimer and the demo accounts |
| 0:18 | Student dashboard — item counts read live from PostgreSQL |
| 0:22 | **Automatic match alert**: a lost *Phone* report matched to a found item, with the reason it matched |
| 0:40 | Reporting a lost item — location pinned on the interactive campus map |
| 0:58 | The report is saved; the counts move from 11 items to 12 |
| 1:02 | Help assistant answering retention and collection questions |
| 1:17 | Item detail for *Set of car keys* (#0009, Shelf E-03) |
| 1:25 | **Claim with proof of ownership** — an empty submission is refused by validation |
| 1:47 | Signing in as an administrator — a different navigation bar for the same system |
| 1:55 | **Logging a found item using the device camera**, captured live in the browser |
| 2:36 | The new item appears in the register with its photograph, on Shelf B-12 |
| 2:46 | **Reviewing claims** — the proof does not match the item description, so the claim is rejected |
| 3:10 | An earlier claim shows the opposite path: approved, collected, marked Returned |
| 3:14 | The assistant changes with the role — administrators get an operational greeting |
| 3:24 | An account with valid credentials but no permission is refused access |

---

## ▶️ Run it in 30 seconds

**Just open the live site:** <https://smart-lost-and-found-system-virid.vercel.app>
(Chrome shows a Safe Browsing warning first — see the notice above, defect
[D-03](docs/system-testing-plan.md#d-03--the-one-defect-still-open).)

Or run it locally — the application is in **[`iteration 3/`](iteration%203)**, no install, no build step.

```bash
cd "iteration 3"
python -m http.server 8124
```
Then open **http://localhost:8124/login.html**

**Sign in** with one of the pre-provisioned accounts — your access level comes from the account:

| JCU ID | Password | Access level |
|--------|----------|--------------|
| `jc111111` | `student123` | 🎓 **Student** — browse & search found items, report a lost item, submit a claim |
| `jc999999` | `admin123` | 🛡️ **Admin** — log found items (camera/upload), review & approve claims, manage statuses |
| `jc000000` | `guest123` | 🚫 **No access** — a valid account with no permissions, demonstrating access control |

Credentials are verified by a `SECURITY DEFINER` function inside PostgreSQL, so
passwords are never sent to the browser and the `users` table cannot be read by
the client.

> 📋 **Marking this project?** Start with **[docs/HOW-TO-TEST.md](docs/HOW-TO-TEST.md)** —
> a click-by-click walkthrough of every feature.

## 🧪 Run the tests
Open **`iteration 3/tests/tests.html`** in a browser (or `http://localhost:8124/tests/tests.html`).
No installation required. **Current result: 53/53 passing.**

---

## 📚 Documentation

Full documentation lives in **[`docs/`](docs)** — one page per assessment criterion:

| Page | Covers |
|------|--------|
| 📄 **[Project Report](docs/PROJECT-REPORT.md)** | **The full project report** |
| 📋 **[How to Test](docs/HOW-TO-TEST.md)** | **Click-by-click walkthrough — start here if marking** |
| 🎤 [Demo Script](docs/DEMO-SCRIPT.md) | 15-minute presentation running order |
| 🚀 [Deployment Guide](docs/DEPLOYMENT.md) | Publishing to Vercel, step by step |
| [Requirements & Backlog](docs/requirements.md) | User stories, MoSCoW priorities, estimates, budget |
| [Design](docs/design.md) | Architecture, database ER model, UI design |
| [Diagram Build Specs](docs/diagram-specs.md) | draw.io diagram sources, how to edit and export them |
| [Implementation](docs/implementation.md) | What each iteration delivered, tech stack |
| [Testing](docs/testing.md) | Strategy, TDD, unit tests, accessibility |
| [Code Quality](docs/code-quality.md) | SRP & DRY review of the codebase |
| [Acceptance Tests](docs/acceptance-tests.md) | 34 Given/When/Then scenarios + traceability matrix |
| [System Testing Plan](docs/system-testing-plan.md) | Test procedure, defect management and the defect log |
| [Version Control](docs/version-control.md) | Branching model, commit conventions, tags |
| [Build & Dev Tools](docs/tools.md) | Tools and libraries used, and how |
| [Agile Process](docs/agile.md) | Iteration plans, reviews, retrospectives, velocity |

---

## 🗂️ Repository layout

```
Smart-Lost-and-Found-System/
├── iteration 1/     # Iteration 1 — browse & report prototype          (tag v1.0)
├── iteration 2/     # Iteration 2 — roles, claims, camera              (tag v2.0)
├── iteration 3/     # Iteration 3 — auto-matching, tests, database  ← CURRENT APP
├── docs/            # Project documentation (+ diagrams/)
├── backend/         # ⚠️ superseded Flask prototype — kept for history
└── frontend/        # ⚠️ superseded React prototype — kept for history
```

Each iteration folder is a snapshot of what that iteration actually delivered, so the
incremental progress is visible. Releases are tagged `v1.0`, `v2.0`, `v3.0`.

## 🚀 What each iteration delivered

| Iteration | Delivered |
|-----------|-----------|
| **1** | Found-items dashboard (search, category/status filters, live stats), report form with interactive JCU campus map picker, rule-based assistant |
| **2** | JCU ID login with Student/Admin roles + route guard, item detail pages, claim submission with proof of ownership, admin dashboard, log-found with **camera capture**, claims review (approve/reject/mark returned) |
| **3** | **Live PostgreSQL database** (Supabase), **credential login with database-backed accounts and roles**, **lost↔found auto-matching**, **53 automated unit tests**, accessibility pass, full documentation suite |

## 🛠️ Technology

**Front end:** HTML5 · CSS3 · vanilla JavaScript (no framework)
**Database:** Supabase (PostgreSQL) — schema in [`iteration 3/db/schema.sql`](iteration%203/db/schema.sql)
**Hosting:** Vercel (static) · **Media:** MediaDevices API for camera capture

---

## 📋 Project Proposal

### 1. Project Overview
The Smart Lost and Found System is a responsive web-based application designed to centralize and automate the process of reporting, searching, and recovering lost items within high-traffic environments, such as the James Cook University (JCU) campus. It replaces traditional manual tracking methods, physical logs, or fragmented social media posts with an interactive digital platform. The system features an integrated Intelligent Chatbot assistant that interacts naturally with users to answer common policy questions and perform automated real-time queries against the database to check if a missing item has been recovered.

### 2. Objectives
- Create a modern Graphical User Interface (GUI) displaying an interactive visual dashboard of active found item listings.
- Implement a secure and modern relational database backend to maintain data integrity across users, items, and log parameters.
- Leverage modern software tools and APIs to deploy an AI-driven chatbot capable of handling conversational queries through a custom-coded backend framework.
- Provide dynamic search filter engines (sorting by category, date range, and campus location) to maximize item-matching accuracy.

### 3. Features
- **Item Reporting & Cataloging:** Standardized visual forms for users to submit missing items and for campus administrators/security to log found items with secure storage location tags.
- **Intelligent Chatbot Interface:** A real-time chat component configured to serve as a virtual assistant, enabling automated database checking and guiding users on retrieval policies.
- **Status and Lifecycle Tracking:** A real-time administrative status manager to safely transition items from "Active" to "Claimed" or "Returned", keeping the visible grid clean.

## 👥 Team — Group 6
- Yuvraj Dave
- João Gabriel Costa
- Chiranjeeb Satpathy
