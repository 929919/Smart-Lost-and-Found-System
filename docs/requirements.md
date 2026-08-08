# Requirements & Product Backlog

← [Back to documentation home](README.md)

Supports **Rubric Criterion 1 — Requirements**, and documents the outcome of
**Practical 2** (requirements gathering and user stories) and **Practical 3**
(iteration allocation).

---

## How the requirements were gathered *(Practical 2)*

Requirements were collected by **interviewing target users**, then converted into
user stories with a title, short description, a **priority on the 10–50 scale**
(10 = highest, 50 = lowest) and an **effort estimate in days**.

Source documents, kept in the repository:
- [`User_Stories.docx`](../User_Stories.docx) — interview findings and priority ranking
- [`Practical_Week3_Iteration1.docx`](../Practical_Week3_Iteration1.docx) — iteration allocation, Kanban board and burn-down

### Personas
| Persona | Role | Needs |
|---------|------|-------|
| **Jack** | Student — searching | Browse and filter what has been handed in |
| **Sarah** | Student — lost an item | Report a loss, ask questions, be told when a match appears |
| **Ethan** | Campus Security — logging | Record found items quickly and store them traceably |
| **Peter** | Administrator — claims | Verify ownership and manage the item lifecycle |

### Priority scale
| Tier | Meaning |
|------|---------|
| **P10** | **Must have** — the core system cannot function without it |
| **P20** | **Should have** — works, but feels incomplete without it |
| **P30** | **Could have** — significant value-add |
| **P40** | **Low priority** — useful enhancement, lowest urgency |
| **P50** | Not scheduled for this milestone |

---

## Product backlog — 20 stories, 71 days *(Practical 3)*

Stories were allocated across three iterations by priority then effort, so each
iteration delivers a coherent, demonstrable increment.

Status: ✅ delivered · ⬜ not delivered.

### Epic 1 — Browse & search (Jack)
| ID | Story | Priority | Effort | Iteration | Status |
|----|-------|:--------:|:------:|:---------:|:------:|
| 1.1 | [Found-item dashboard](user-stories/1.1-found-item-dashboard.md) | P10 | 5 d | 1 | ✅ |
| 1.2 | [Search & filter engine](user-stories/1.2-search-and-filter.md) | P10 | 5 d | 1 | ✅ |
| 1.3 | [Photo display for items](user-stories/1.3-photo-display.md) | P20 | 3 d | 2 | ✅ |
| 1.4 | [Responsive design](user-stories/1.4-responsive-design.md) | P20 | 3 d | 2 | ✅ |
| 1.5 | [Clean grid (status filter)](user-stories/1.5-clean-grid.md) | P30 | 1 d | 3 | ✅ |

### Epic 2 — Assistance & notification (Sarah)
| ID | Story | Priority | Effort | Iteration | Status |
|----|-------|:--------:|:------:|:---------:|:------:|
| 2.1 | [Intelligent chatbot](user-stories/2.1-intelligent-chatbot.md) | P10 | 7 d | 1 | ✅ |
| 2.2 | [Real-time database querying](user-stories/2.2-realtime-db-querying.md) | P10 | 7 d | 1 | ✅ |
| 2.3 | [Lost-item reporting form](user-stories/2.3-lost-item-reporting.md) | P20 | 4 d | 2 | ✅ |
| 2.4 | [Match notifications](user-stories/2.4-match-notifications.md) | P30 | 2 d | 3 | ✅ |
| 2.5 | [User accounts & authentication](user-stories/2.5-accounts-and-auth.md) | P40 | 1 d | 3 | ✅ |

### Epic 3 — Logging found items (Ethan)
| ID | Story | Priority | Effort | Iteration | Status |
|----|-------|:--------:|:------:|:---------:|:------:|
| 3.1 | [Found-item logging form](user-stories/3.1-found-item-logging.md) | P10 | 5 d | 1 | ✅ |
| 3.2 | [Storage location tagging](user-stories/3.2-storage-location-tagging.md) | P10 | 4 d | 1 | ✅ |
| 3.3 | [Required vs optional fields](user-stories/3.3-required-optional-fields.md) | P20 | 2 d | 2 | ✅ |
| 3.4 | [Photo upload for items](user-stories/3.4-photo-upload.md) | P20 | 2 d | 2 | ✅ |
| 3.5 | [Duplicate detection](user-stories/3.5-duplicate-detection.md) | P30 | 2 d | 3 | ⬜ |

### Epic 4 — Claims & administration (Peter)
| ID | Story | Priority | Effort | Iteration | Status |
|----|-------|:--------:|:------:|:---------:|:------:|
| 4.1 | [Claim verification & approval](user-stories/4.1-claim-verification.md) | P10 | 5 d | 1 | ✅ |
| 4.2 | [Status lifecycle management](user-stories/4.2-status-lifecycle.md) | P10 | 5 d | 1 | ✅ |
| 4.3 | [Claim request & proof of ownership](user-stories/4.3-claim-request-proof.md) | P20 | 4 d | 2 | ✅ |
| 4.4 | [Admin roles & access control](user-stories/4.4-admin-roles-access.md) | P30 | 2 d | 3 | ✅ |
| 4.5 | [Audit trail](user-stories/4.5-audit-trail.md) | P40 | 2 d | 3 | ⬜ |

---

## Iteration allocation

| Iteration | Stories | Planned effort | Focus |
|-----------|:-------:|:--------------:|-------|
| **1** | 8 | 43 days | **P10 — core:** dashboard, search, chatbot, found-item logging, claim workflow |
| **2** | 6 | 18 days | **P20 — usability & trust:** photos, responsive design, lost reporting, proof of ownership |
| **3** | 6 | 10 days | **P30–P40 — enhancements:** notifications, accounts, access control, duplicate detection, audit trail |
| **Total** | **20** | **71 days** | |

**Why this order.** Every P10 story went into Iteration 1 so that the end of the
first iteration produced something genuinely usable rather than a partial
feature set. P20 stories then addressed the things that made the system feel
incomplete — photographs, a lost-item route, and evidence for claims. P30–P40
enhancements were deliberately last so that, if the budget ran out, what was cut
was the least valuable work. That is exactly what happened (see below).

---

## Completed vs unfinished *(Practicals 5, 6 and 8)*

**18 of 20 stories delivered — 67 of 71 estimated days (94%).**

### Delivered beyond the original plan
Iteration 3 also absorbed engineering work that was not in the interview-derived
backlog but was necessary to deliver a credible system:

| Added work | Reason |
|------------|--------|
| Migration to **Supabase PostgreSQL** | The project requires a modern relational database; the prototype had been using browser storage |
| **Public deployment** (Vercel, HTTPS) | Required for demonstration, and camera capture only works over HTTPS |
| **Automated test suite** (35 assertions) | Practical 7 required at least 15 automated tests |
| **Accessibility pass** | Keyboard navigation, focus states, live regions, reduced motion |

### Not delivered
| ID | Story | Priority | Why it was cut |
|----|-------|:--------:|----------------|
| 3.5 | Duplicate detection | P30 | Iteration 3 absorbed the unplanned database migration and deployment. As the lower-value of the two remaining P30 items for data quality, it was deferred. The matching engine built for 2.4 already provides the similarity scoring this story would build on, so the remaining work is a UI warning at logging time. |
| 4.5 | Audit trail | P40 | The lowest-priority story in the entire backlog. Partially mitigated: `claims` records `created_at` and `updated_at`, so claim decisions are already timestamped. A full trail needs a separate table recording who changed what. |

Both were **P30/P40 — "could have" and "low priority"**. No Must or Should story
was dropped, which is the outcome the prioritisation was designed to protect.

---

## Velocity

Effort is measured in **story-days**, as estimated during Practical 2.

| Iteration | Planned | Delivered | Velocity |
|-----------|:-------:|:---------:|:--------:|
| Iteration 1 | 43 d | 43 d | **43 story-days** |
| Iteration 2 | 18 d | 18 d | **18 story-days** |
| Iteration 3 | 10 d | 6 d | **6 story-days** (+ unplanned database, deployment and testing work) |

See [Agile Process](agile.md) for the burn-down charts and iteration reviews.

---

## Note on story numbering in the commit history

Iteration 1 commits reference this backlog directly (for example
`feat: implement chatbot reply engine and item matching (story 2.1, 2.2)`).

During Iterations 2 and 3 an interim numbering was briefly used in commit
messages before being reconciled back to this document. Where a commit message
is ambiguous, **this page is authoritative**. The mapping is:

| Commit reference | Meaning in that commit | Official story |
|------------------|------------------------|----------------|
| `story 1.1` (Iter 2) | session management and route guard | **2.5** Accounts & auth |
| `story 1.2` (Iter 2) | data layer for items and claims | **1.1** Found-item dashboard |
| `story 2.1` (Iter 2) | item detail and claim submission | **4.3** Claim request & proof |
| `story 3.1` (Iter 2) | report lost item with map picker | **2.3** Lost-item reporting |
| `story 3.2` (Iter 2) | log found item with camera | **3.4** Photo upload |
| `story 4.1` (Iter 2) | admin dashboard | **4.1** Claim verification |
| `story 4.2` (Iter 2) | claims review actions | **4.2** Status lifecycle |
| `story 5.1` | Supabase database migration | *unplanned — see above* |
| `story 5.2` | deployment | *unplanned* |
| `story 5.3` | lost↔found auto-matching | **2.4** Match notifications |
| `story 5.4` | automated test suite | *unplanned (Practical 7)* |

> A known inconsistency, recorded here rather than hidden. Later commits use the
> official identifiers.
