# Demo Video Script — 5 Minute Recording

← [Back to documentation home](README.md)

A shot-by-shot script for recording the demonstration video. The longer, live
presentation running order is in [DEMO-SCRIPT.md](DEMO-SCRIPT.md); this page is
the condensed version written to be read while recording.

**Narration in quotes is meant to be spoken. Everything else is what to do
on screen.**

---

## Before you hit record

| ✔ | Step |
|---|------|
| ☐ | `cd "iteration 3"` then `python -m http.server 8124` |
| ☐ | Sign in as admin → **⚙️ Manage item statuses → ↺ Reset demo data**, then sign out |
| ☐ | Open tabs in this order: **login page · Supabase Table Editor · tests/tests.html · GitHub repo · project board** |
| ☐ | Browser zoom ~110–125%; close notifications, bookmarks bar and unrelated tabs |
| ☐ | Test your microphone level on a 10-second throwaway take |
| ☐ | Decide now: record the **local** server (faster, offline-safe) or the **live Vercel URL** (proves deployment). Local is recommended — mention the live URL out loud instead |

**If the camera step fails while recording, do not stop.** The fallback message
is deliberate handling — say so and switch to the Upload File tab. It reads as
competence, not as a failure.

---

## 0:00 – 0:30 · Opening

*Screen: the sign-in page.*

> "This is the Smart Lost & Found System — a campus lost-property web
> application for JCU Singapore, built by Group 6 for CP3407. It's plain HTML,
> CSS and vanilla JavaScript with no build step, backed by a managed PostgreSQL
> database on Supabase, and deployed on Vercel. I'll show role-based access, the
> student and admin journeys, the matching engine, the database, the tests, and
> how the work was tracked."

Point at the disclaimer banner:

> "The banner at the top marks this as a student project, not an official
> university service."

---

## 0:30 – 1:15 · Access control

> "Access is determined by the account, not chosen by the user."

1. Sign in `jc111111` / `student123` → header reads `[STUDENT]`, nav shows
   Dashboard · Report Lost Item · Assistant only.
2. Sign out. Sign in `jc000000` / `guest123` → **Access Not Permitted**.
3. Type `localhost:8124/admin-dashboard.html` in the address bar → bounced back.

> "That's a valid account the system deliberately refuses, and the route guard
> stops direct URL access — every page declares what role it requires."

4. Sign out. Sign in `jc999999` / `admin123` → admin nav with the red pending badge.

> "Credentials are checked by a SECURITY DEFINER function inside PostgreSQL. The
> password never reaches the browser, and Row-Level Security stops the client
> reading the users table at all."

---

## 1:15 – 2:30 · Student journey

Sign in `jc111111` / `student123`.

1. Type `wallet` in search → results filter live. Click category **Electronics**.
2. **Report Lost Item** → submit with no map pin → blocked.

> "Validation is enforced before anything reaches the database."

3. Click the **Food Court / Canteen** pin. Name `Black leather wallet`,
   Category **Accessories**, Colour `Black` → **Submit**.
4. Back on the dashboard, the match alert appears.

> "This is the part that makes it smart. Every new lost report is scored against
> all active found items — category, location, colour, shared keywords and date
> proximity — and anything scoring four or above is surfaced with the reason it
> matched. The student doesn't have to keep checking."

5. **View & claim →** → submit empty proof → blocked. Enter
   *"Brown stitching inside, my concession card is in the front slot"* → submit.

---

## 2:30 – 3:30 · Admin journey

Sign out. Sign in `jc999999` / `admin123`.

1. **Log Found Item** → **📸 Take Photo** → **Start Camera** → **Capture**.

> "Camera capture runs in the browser and needs HTTPS, which the Vercel
> deployment provides on real phones."

2. Fill name and category, click a map pin → **Log Found Item**.
3. **Review Claims** → show the claim card: claimant ID, item photo, the proof
   of ownership text, timestamps.
4. **✓ Approve** → claim becomes Approved *and* the item becomes Claimed.
5. **📦 Mark as Returned** → both move to Returned.

> "Approving a claim moves the item through its lifecycle automatically, so the
> item leaves the active list and the counters stay correct."

---

## 3:30 – 4:15 · Under the hood

*Switch to the Supabase tab → Table Editor.*

1. **`items`** — point at the row the student just created.
2. **`claims`** — the status you just changed, live.

> "Real managed PostgreSQL with foreign keys, CHECK constraints and Row-Level
> Security — not browser storage."

*Switch to the tests tab.*

3. Show **53/53 passing**.

> "Fifty-three unit tests across the data layer, the claims workflow and the
> matching engine, including mock-object tests for authentication. They caught a
> real bug — seed data was being mutated in memory so 'reset' didn't fully
> reset — and there's a regression test for it now."

---

## 4:15 – 5:00 · Process and close

*Switch to the GitHub tab.*

1. **Commits** — story-tagged messages.
2. **Releases** — `v1.0`, `v2.0`, `v3.0` marking each iteration.
3. **Actions** — the green CI runs.

> "Continuous integration runs on every push: documentation link checks,
> repository consistency, JavaScript syntax and the full unit suite in a headless
> browser."

4. **Issues** → filter by the `user-story` label.
5. *Switch to the project board tab.*

> "Every backlog story is a GitHub issue carrying its persona, priority, estimate
> and acceptance criteria, grouped into iteration milestones and tracked on a
> Todo / In Progress / Done board. Eighteen of the twenty stories are closed. The
> two that are still open — duplicate detection and the audit trail — were the
> lowest-priority items, and they were cut deliberately when iteration three
> absorbed the unplanned database migration and deployment work."

**Closing line:**

> "Eighteen of twenty stories delivered, sixty-seven of seventy-one estimated
> days, fifty-three passing tests and thirty-four acceptance scenarios. It's
> live at smart-lost-and-found-system dot vercel dot app. Thanks for watching."

---

## If you overrun

Cut in this order — each is the least costly thing to lose:

1. The wrong-password attempt (0:30 block) — the guest account already proves access control.
2. The search-and-filter step (1:15) — the reporting flow is the stronger feature.
3. The `claims` table in Supabase — showing `items` alone makes the point.

**Do not cut** the matching alert, the claim approval lifecycle, or the tests.
Those three carry the most marks.

## If you have room to spare

- Resize the window to phone width to show the responsive layout.
- Tab through the dashboard to show visible focus states and the skip link.
- Mention the graceful degradation: if the database is unreachable the app falls
  back to local data with an amber banner rather than failing.
