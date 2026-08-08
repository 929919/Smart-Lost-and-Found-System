# Agile Software Engineering

← [Back to documentation home](README.md)

How the project applied **iterative, incremental development**: planning against
a prioritised backlog, tracking work on a board, measuring velocity, reviewing
each iteration and adjusting the next. Supports **Rubric Criterion 7**, and
records the outcomes of **Practicals 3, 4, 5, 6 and 8**.

---

## Process

Three timeboxed iterations forming Milestone 1. Each iteration: plan from the
prioritised backlog → build → demonstrate → review and retrospect → use the
measured velocity to adjust the next plan.

The backlog is in [Requirements](requirements.md); each story has its own page
under [`user-stories/`](user-stories/) carrying its task breakdown, acceptance
criteria and status label.

## Task tracking

Stories were broken into tasks with individual estimates *(Practical 4, task 1)*
and tracked with **Todo / In progress / Done** labels *(Practicals 4, 5, 6, 8)*.
Every story page shows the breakdown and the current label; the summary is in
[Requirements](requirements.md).

---

## Velocity

Effort is measured in **story-days**, as estimated during Practical 2.

| Iteration | Planned | Delivered | Velocity | Against plan |
|-----------|:-------:|:---------:|:--------:|--------------|
| **Iteration 1** | 43 d | 43 d | **43** | On plan — all 8 P10 stories |
| **Iteration 2** | 18 d | 18 d | **18** | On plan — all 6 P20 stories |
| **Iteration 3** | 10 d | 6 d planned **+ 7 d unplanned** | **13** | 2 stories deferred; unplanned work absorbed |
| **Total** | **71 d** | **67 d of backlog** | | **18 of 20 stories (94%)** |

**How velocity was used.** Iteration 1 delivered 43 story-days but was tracking
behind for most of the sprint (see the chart below), which indicated the
estimate-to-capacity ratio was too aggressive. Iterations 2 and 3 were therefore
planned at 18 and 10 story-days respectively — a deliberate reduction. Iteration
2 then landed exactly on plan, confirming the corrected sizing.

---

## Burn-down charts

### Iteration 1
![Burn-down chart for Iteration 1](img/burndown-iteration-1.svg)

Tracked behind the ideal line from day 2 onward. The eight P10 stories were all
delivered, but the late catch-up showed the iteration had been over-committed.

> **Data note.** The Practical 3 burn-down was baselined at **34 story-days**,
> while the eight Iteration 1 stories sum to **43 days** in `User_Stories.docx`.
> The discrepancy is in the original submission and is reproduced here rather
> than silently corrected. The velocity table uses the story estimates (43).

### Iteration 2
![Burn-down chart for Iteration 2](img/burndown-iteration-2.svg)

Tracked close to ideal throughout and finished on plan. The reduced commitment
after Iteration 1 proved to be the right correction.

### Iteration 3
![Burn-down chart for Iteration 3](img/burndown-iteration-3.svg)

**The line rises twice** — this iteration took on work that was not in the
interview-derived backlog:

| Unplanned work | Effort | Why it could not wait |
|----------------|:------:|-----------------------|
| Migration to Supabase PostgreSQL | 3 d | The project requires a modern relational database; the prototype used browser storage |
| Automated test suite | 2 d | Practical 7 required at least 15 automated tests |
| Public deployment | 1 d | Needed for demonstration; camera capture also requires HTTPS |
| Accessibility pass | 1 d | Keyboard access, focus states, live regions |

Seven story-days of added scope against a ten-day iteration. The consequence is
visible: the chart ends at **4 story-days remaining**, which are stories **3.5
Duplicate detection (P30)** and **4.5 Audit trail (P40)** — the two lowest
priorities in the whole backlog. No Must or Should story was sacrificed, which
is precisely what the prioritisation existed to protect.

> **Method note.** The team committed in batches rather than daily, so the points
> on the Iteration 2 and 3 charts mark **story completion** — the moment a story
> met its acceptance criteria — rather than daily measurements.

---

## Iteration log

### Iteration 1 — Core functionality *(8 stories, 43 d, all P10)*
- **Planned:** dashboard, search and filter, chatbot with live querying, found-item logging, storage tagging, claim verification, status lifecycle.
- **Delivered:** all eight stories.
- **Review:** the client found the concept clear but said the interface did not look like a university system.
- **Retrospective:**
  - *Went well* — prioritising every P10 story into one iteration meant the first demo showed a usable system, not fragments.
  - *Improve* — commit in smaller, more frequent increments; the work was committed in large batches, which is why the burn-down had to be reconstructed rather than read off.
  - *Action* — adopt authentic JCU branding; reduce the next commitment from 43 to 18 story-days.

### Iteration 2 — Usability and trust *(6 stories, 18 d, all P20)*
- **Planned:** photo display and upload, responsive design, lost-item reporting, required-field rules, claim with proof of ownership.
- **Delivered:** all six stories, plus role-based access brought forward from the Iteration 3 plan because the claims workflow could not be demonstrated safely without it.
- **Review:** the client was satisfied with the role separation and asked for a real database and a public link.
- **Retrospective:**
  - *Went well* — extracting shared components (`map.js`, `camera.js`, `main.js`) meant each new page cost less than the last.
  - *Improve* — no automated tests yet; defects were only caught by manual checking.
  - *Action* — add a test suite and migrate to a real database in Iteration 3.

### Iteration 3 — Persistence, deployment and matching *(6 stories planned, 10 d)*
- **Planned:** clean grid, match notifications, accounts and authentication, duplicate detection, admin roles, audit trail.
- **Delivered:** 1.5, 2.4, 2.5 and 4.4, plus the four unplanned items above. **3.5 and 4.5 deferred.**
- **Review:** demonstrated to the client on a laptop. Two defects were raised — dead links in the page footer, and the assistant returning identical answers to students and administrators. Both were fixed and committed the same day.
- **Retrospective:**
  - *Went well* — the automated tests caught a real defect during development (seed data was being mutated in memory, so "reset demo data" did not fully reset). A regression test now guards it. Graceful degradation to local data also meant the database being unavailable never blocked a demonstration.
  - *Improve* — the unplanned work was foreseeable. The database migration was implied by the project requirements from the start and should have been a backlog story with an estimate in Iteration 1, rather than arriving as unbudgeted work in the final iteration.
  - *Action* — recorded 3.5 and 4.5 with the reasoning for deferral and what remains; the matching engine built for 2.4 already provides most of what 3.5 needs.

---

## Roles and collaboration

- Work split by epic across the three members, with pairing on the claims workflow.
- Asynchronous stand-ups in the team chat: done / next / blockers.
- **Definition of Done:** the story is demonstrable, its acceptance criteria pass, no console errors, the unit suite is green, and the change is committed with a message naming the story.

## What the team would change

The single biggest process lesson is that **non-functional requirements need
estimates too**. The database, deployment, testing and accessibility work was
real engineering effort that never appeared in the interview-derived backlog,
so it had no budget. It ultimately displaced two features. Had it been sized at
planning time, the commitment would have been adjusted rather than the scope cut
at the end.
