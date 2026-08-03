# Requirements & Product Backlog

← [Back to documentation home](README.md)

This page defines the user stories, their **priorities** (MoSCoW), **estimates**
(story points, Fibonacci), and the project **budget** (available team velocity).
It supports **Rubric Criterion 1 — Requirements**.

## Vision
> *"For JCU Singapore students and campus administrators who need to report and
> recover lost property, the Smart Lost & Found System is a web application that
> centralises found-item listings, an interactive campus map, and a verified
> claims process — delivering what is needed, on time and on budget."*

## Roles (personas)
- **Student** — reports lost items, browses/searches found items, claims an item, asks the assistant.
- **Admin (Campus Security)** — logs found items with a photo, reviews and approves claims, manages item lifecycle.

---

## Product backlog

Priorities: **M**ust / **S**hould / **C**ould / **W**on't (this release).
Estimates in story points (SP). Status legend: ✅ done · 🔨 in progress · ⬜ planned.

### Epic 1 — Accounts & Access
| ID | User story | Priority | SP | Iteration | Status |
|----|------------|:--------:|:--:|:---------:|:------:|
| 1.1 | As a user, I want to sign in with my JCU ID so the system knows who I am. | M | 3 | 2 | ✅ |
| 1.2 | As a user, I want to choose a Student or Admin role so I only see actions relevant to me. | M | 3 | 2 | ✅ |
| 1.3 | As a user, I want to be blocked from pages my role can't access so data stays protected. | M | 2 | 2 | ✅ |

### Epic 2 — Search, Browse & Claim (Student)
| ID | User story | Priority | SP | Iteration | Status |
|----|------------|:--------:|:--:|:---------:|:------:|
| 2.1 | As a student, I want to claim a found item with proof of ownership so I can recover it. | M | 5 | 2 | ✅ |
| 2.2 | As a student, I want to chat with a virtual assistant to check if my item was handed in. | S | 3 | 1→2 | ✅ |
| 2.3 | As a student, I want to filter the dashboard by category and status so I can find my property. | M | 3 | 1 | ✅ |
| 2.4 | As a student, I want to view an item's full detail and photo so I can confirm it's mine. | M | 2 | 2 | ✅ |

### Epic 3 — Reporting & Logging
| ID | User story | Priority | SP | Iteration | Status |
|----|------------|:--------:|:--:|:---------:|:------:|
| 3.1 | As a student, I want to report a lost item and pin where I lost it on a campus map. | M | 5 | 1→2 | ✅ |
| 3.2 | As an admin, I want to log a found item with a **photo (camera or upload)** and shelf tag. | M | 8 | 2 | ✅ |

### Epic 4 — Administration
| ID | User story | Priority | SP | Iteration | Status |
|----|------------|:--------:|:--:|:---------:|:------:|
| 4.1 | As an admin, I want a dashboard of active items, pending claims and returns at a glance. | M | 3 | 2 | ✅ |
| 4.2 | As an admin, I want to approve/reject claims and mark items returned so ownership is verified. | M | 5 | 2 | ✅ |

### Epic 5 — Iteration 3 (persistence, deployment, matching)
| ID | User story | Priority | SP | Iteration | Status |
|----|------------|:--------:|:--:|:---------:|:------:|
| 5.1 | As the team, we want the app backed by a **real relational database (Supabase Postgres)** so data is shared and durable. | M | 8 | 3 | ✅ |
| 5.2 | As a user, I want the app **deployed to a public URL** so I can use it from any device. | M | 3 | 3 | 🔨 |
| 5.3 | As a student, I want to be **notified when a found item matches my lost report** so recovery is automatic. | S | 5 | 3 | ✅ |
| 5.4 | As the team, we want **automated tests** (unit + acceptance) so regressions are caught. | M | 5 | 3 | ✅ |
| 5.5 | As a student, I want the assistant powered by the **Claude API** for natural answers. | C | 5 | 3 | ⬜ |

---

## Budget & velocity

The **budget** is the team's total available development capacity across the
three planned iterations. Team of 3, ~2-week iterations.

| Iteration | Capacity (SP budget) | Committed | Delivered (velocity) |
|-----------|:--------------------:|:---------:|:--------------------:|
| Iteration 1 | 18 | 11 | 11 |
| Iteration 2 | 22 | 24 | 24 |
| Iteration 3 | 22 | 26 | _in progress_ |
| **Total budget** | **~62 SP** | | |

**Reading the plan:** the highest-value **Must** stories were pulled into the
earliest iterations; **Could** stories (5.5 Claude API) are the first to be cut
if we run over budget — this is how we keep the project *on time and on budget*.

> _Note: adjust the exact SP/dates to match your team's real sprint records before submission._
