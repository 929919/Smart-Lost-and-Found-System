# Agile Software Engineering

← [Back to documentation home](README.md)

How we applied **iterative, incremental** development — planning, review and
retrospective each iteration, with measured velocity. Supports **Rubric
Criterion 7 — Agile software engineering**.

---

## Process
We ran **three timeboxed iterations**. Each iteration: plan (pick highest-value
stories within budget) → build → demo to client → **review + retrospective**.
The backlog and priorities live in [Requirements](requirements.md); progress is
tracked on a GitHub Projects board.

## Velocity
| Iteration | Committed (SP) | Delivered (SP) | Bar |
|-----------|:--------------:|:--------------:|-----|
| Iteration 1 | 11 | 11 | ███████████ |
| Iteration 2 | 22 | 24 | ████████████████████████ |
| Iteration 3 | 26 | _in progress_ | |

Velocity rose as the team found its rhythm; Iteration 3 is scoped close to our
proven capacity, with **Could** stories (Claude API) as the buffer to protect the
deadline.

## Iteration log

### Iteration 1 — Foundation
- **Planned:** dashboard, report form + campus map, assistant (stories 2.3, 3.1, 2.2).
- **Delivered:** all of the above as a responsive static site.
- **Review:** client liked the concept; asked for authentic JCU branding.
- **Retrospective:** _Went well_ — fast prototyping. _Improve_ — commit more often, in smaller pieces.

### Iteration 2 — Roles, claims & camera
- **Planned:** login + roles + guard, claims workflow, camera capture, admin console (Epics 1, 2, 4; story 3.2).
- **Delivered:** full role-based app; commits tagged to story IDs.
- **Review:** client happy with role separation; requested a real database and a live URL.
- **Retrospective:** _Went well_ — clear module boundaries. _Improve_ — add automated tests earlier; slightly over budget (24 vs 22 SP).

### Iteration 3 — Persistence, deployment & matching
- **Planned:** Supabase Postgres, Vercel deploy, auto-matching, test suite (Epic 5).
- **Delivered:** _fill in at close of iteration._
- **Review:** _add client feedback._
- **Retrospective:** _add._

## Roles & collaboration
- Work split by epic across the three members; pair-programming on the claims workflow.
- Daily async stand-ups (what I did / will do / blockers) in the team chat.
- Definition of Done: story demoable, acceptance test passes, no console errors, committed with a story-tagged message.

> _Replace italicised placeholders with your real dates, feedback and retro notes before submission._
