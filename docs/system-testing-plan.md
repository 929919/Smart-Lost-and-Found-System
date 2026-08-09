# System Testing Plan & Defect Log

← [Back to documentation home](README.md) · See also [Testing strategy](testing.md) · [Acceptance tests](acceptance-tests.md)

The plan used to system-test the Smart Lost & Found System before demonstration,
and the record of defects found and how they were handled. Supports **Rubric
Criterion 4 — Test**, and records the outcome of **Practical 9**.

---

## 1. Purpose and scope

System testing exercises the **complete, integrated application** as a user would
— through the browser, against the live database — rather than testing units in
isolation.

**In scope**
- All 11 pages, both roles, and the account with no permissions
- The full claim lifecycle across the `items` and `claims` tables
- Camera capture and file upload
- Lost↔found auto-matching
- Access control, including direct URL entry
- Behaviour when the database is unreachable
- Responsive layout and keyboard accessibility

**Out of scope**
- Load and performance testing — the register holds tens of items, not thousands
- Penetration testing — access control is verified functionally, not adversarially
- Cross-device camera hardware matrix — tested on the devices available to the team

## 2. Test environments

| Environment | Purpose | Configuration |
|-------------|---------|---------------|
| **Local** | Development and the class demonstration | `python -m http.server` on `localhost`; live Supabase database |
| **Deployed** | Public verification, mobile and camera over HTTPS | Vercel static hosting; same Supabase database |
| **Offline** | Degradation testing | Database unreachable, forcing the local-data fallback |

**Browsers:** Chrome and Edge as primary, Firefox as secondary, mobile Safari and
Chrome on Android for the responsive and camera checks.

**Test data:** the deterministic seed of 10 items and 2 claims, restorable from
**Admin → Manage item statuses → Reset demo data**. Three accounts cover the
three access levels.

## 3. Entry and exit criteria

**Entry — system testing may begin when:**
1. All stories committed for the iteration meet their acceptance criteria
2. The unit suite passes (currently 53/53)
3. The application loads with no console errors on every page
4. The database schema and seed data are in place

**Exit — the build is ready to demonstrate when:**
1. Every acceptance scenario in [acceptance-tests.md](acceptance-tests.md) passes
2. No open **Critical** or **High** defect
3. Both role journeys complete end to end without a workaround
4. The deployed build behaves the same as local
5. Demo data has been reset to a clean state

## 4. Test levels

| Level | What it covers | How it is run | Evidence |
|-------|----------------|---------------|----------|
| **Unit** | Data layer, claims workflow, matching engine, authentication with mocks | `tests/tests.html` | 53 assertions, automated |
| **Integration** | Client to PostgreSQL: writes persist, claim approval transitions two tables | Browser against the live database | Verified in the Supabase table editor |
| **System** | Whole journeys through the interface | Manual, following section 5 | This document |
| **Acceptance** | One scenario per user story | Manual, Given/When/Then | [acceptance-tests.md](acceptance-tests.md) — 34 scenarios |
| **Non-functional** | Responsive layout, keyboard access, screen-reader announcements, offline degradation | Manual + DevTools | [testing.md](testing.md) |

## 5. System test procedure

Run in this order; each block leaves the system in the state the next expects.

### ST-1 Access control *(≈4 min)*
1. Open any page while signed out → redirected to sign-in
2. Sign in with a wrong password → rejected, no session created
3. Sign in `jc000000` / `guest123` → **Access Not Permitted**
4. While signed in as that account, type `/admin-dashboard.html` → still refused
5. Sign in `jc111111` / `student123` → student dashboard; navigation shows no admin links
6. Type `/admin-dashboard.html`, `/log-found.html`, `/admin-claims.html` → each refused

### ST-2 Student journey *(≈5 min)*
1. Search `wallet`; apply a category filter; set status to All
2. Search for something absent → empty state, not a blank grid
3. Open an item → detail page complete
4. Submit a claim with empty proof → blocked
5. Submit with proof → confirmation
6. Report a lost item without choosing a map location → blocked
7. Choose a pin, complete the form, submit
8. Dashboard shows the **match alert** with the reasons for the match
9. Ask the assistant where to collect an item, and describe a lost item

### ST-3 Administrator journey *(≈5 min)*
1. Sign in as `jc999999` → admin dashboard; pending-claim badge correct
2. Log a found item: capture with the camera, or deny permission and confirm the fallback message, then upload instead
3. Complete the form, choose a map pin, submit → item appears on the dashboard
4. Review Claims → approve the student's claim → **item becomes Claimed**
5. Mark as Returned → **item becomes Returned**
6. Filter by each status → counters stay correct
7. Ask the assistant "what needs my attention?" → figures match the database

### ST-4 Data integrity *(≈3 min)*
1. Open the Supabase table editor → the new item and claim are present
2. Confirm the claim's `item_id` references the right item
3. Confirm `updated_at` changed when the claim was actioned
4. Reset demo data → the register returns to 10 items and 2 claims

### ST-5 Resilience and non-functional *(≈3 min)*
1. Disconnect the network and reload → local data with the amber warning banner, application still usable
2. Reconnect → live data returns
3. Resize to phone width → layout reflows, navigation collapses
4. Tab through the sign-in page → focus visible, all controls reachable
5. Open the deployed URL on a phone → camera uses the rear lens

### ST-6 Regression *(≈1 min)*
Open `tests/tests.html` → **53/53 passing**.

---

## 6. Defect management

### Severity

| Severity | Definition | Response |
|:--------:|------------|----------|
| **S1 Critical** | Data loss or corruption, or a security failure such as access control being bypassed | Fix before any demonstration |
| **S2 High** | A user story cannot be completed; no workaround | Fix in the current iteration |
| **S3 Medium** | A story completes but behaves wrongly, or there is a usable workaround | Fix in the current iteration if capacity allows |
| **S4 Low** | Cosmetic, or documentation inaccurate | Backlog |

### Workflow

```
Found → recorded → classified (S1–S4) → assigned → fixed on a branch
      → verified against the reproduction steps → committed referencing the defect
      → regression test added where the defect was logic
```

### Where defects are tracked

Practical 9 asks the team to review how defects are tracked and to consider
better tools than editing story pages.

| Mechanism | Use |
|-----------|-----|
| **This log** | The authoritative record: reproduction, severity, cause, resolution |
| **User story pages** | Status labels per story ([`user-stories/`](user-stories/)) |
| **Commit messages** | Every fix commit states the symptom, the cause and the verification, so `git log` is a searchable defect history |
| **GitHub Issues / Projects** | Adopted for defects found after the class demonstration, so each has an owner and a visible state |

**What the team changed.** Early defects were only visible in commit messages,
which records the fix but not the *finding* — a defect noticed but not yet fixed
had nowhere to live. Adding this log gave defects an identity before they were
resolved, and the severity scale made the "fix now or defer" decision explicit
rather than implicit.

---

## 7. Defect log

Defects found during development and system testing. **Nine of the ten are
closed. D-03 remains open at the time of submission** — its cause has been
removed, but the outcome depends on a third party (see below).

| ID | Summary | Sev | Found by | Cause & resolution |
|----|---------|:---:|----------|--------------------|
| **D-01** | "Reset demo data" did not fully reset within a session | S2 | **Automated unit test** | `Store.load()` returned references to the `SEED_ITEMS` constant, so `updateStatus()` mutated the seed in memory. Returned parsed copies; **regression test added**. |
| **D-02** | Sign-in fell back to hard-coded accounts on the deployed site | S2 | Deployment verification | `users.sql` had not been run, so `verify_login()` did not exist. Ran the migration; the fallback behaved as designed and kept the site usable meanwhile. |
| **D-03** ⚠️ **OPEN** | Chrome flags the deployed site as "Dangerous" | S2 | Deployment verification | Authentic university branding + a credential form + a free subdomain matched Safe Browsing's phishing pattern, and nothing on the page said otherwise. Added a prominent student-project disclaimer, opened the demo-accounts panel by default, reworded the sign-in heading. **The cause is removed but the classification stands**: a review request has been submitted to Google and is pending at the time of submission, so Chrome still shows the interstitial. |
| **D-04** | Footer links did nothing | S3 | **Client demonstration** | Eleven `href="#"` placeholders implying services that do not exist. Replaced with real destinations — repository, documentation, testing guide, test runner, the real JCU site — and removed the invented social accounts. |
| **D-05** | The assistant gave identical answers to students and administrators | S3 | **Client demonstration** | A single answer set for both roles. Branched by role: students receive recovery guidance, administrators receive an operational summary drawn from live database counts. |
| **D-06** | `schema.sql` failed on a second run | S3 | Database rebuild | PostgreSQL has no `CREATE POLICY IF NOT EXISTS`. Added `DROP POLICY IF EXISTS` first. |
| **D-07** | Re-running the schema would have duplicated all seed items | S2 | Review while fixing D-06 | Unguarded inserts. Changed to `INSERT … SELECT … WHERE NOT EXISTS`. Not observed in practice because D-06 aborted the script first. |
| **D-08** | Statistics markup duplicated across four call sites | S4 | **SRP/DRY review** | Extracted `statsCards()` and `itemStatusCards()`. See [code-quality.md](code-quality.md). |
| **D-09** | Documentation contradicted the delivered system | S4 | Repository audit | Pages still described password-less sign-in, `localStorage` persistence, tools that were never used, and pointed at a superseded schema. Corrected across the documentation set. |
| **D-10** | Clipped text in the ER diagram | S4 | Diagram review | A two-line label overflowed a fixed-height row. Increased the row height and reflowed. |

### What the log shows

- **Two defects were found by the client during the demonstration** (D-04, D-05). Both were fixed and committed the same day.
- **One was found by the automated tests** (D-01) — a genuine logic defect that manual testing had missed, and the reason a regression test now guards it.
- **Two were only exposed by deploying** (D-02, D-03). Neither was reproducible locally, which is the argument for deploying early rather than at the end.
- **D-07 was found by inspection while fixing something else** — the more damaging of the pair, and it had never actually fired.

### D-03 — the one defect still open

**Reviewing this project?** Chrome currently shows a full-screen "Dangerous
site" warning before the deployed application loads. The application is not
compromised. Google Safe Browsing classifies it as phishing because it combines
three signals that genuinely do describe a phishing site: authentic James Cook
University branding, a sign-in form asking for a university ID and password, and
a free `vercel.app` subdomain.

The cause has been addressed — a permanent disclaimer now appears at the top of
every page, the demonstration accounts are listed openly on the sign-in screen,
and the heading states that this is a prototype. Clearing the classification,
however, requires Google to re-review the site. **That request has been
submitted and is pending; the verdict had not been returned at the time of
submission.**

Two ways to see the working system without waiting on Google:

- **The demo video** — a 3 min 41 s walkthrough of the whole application, linked
  from [implementation.md](implementation.md).
- **Run it locally** — see [HOW-TO-TEST.md](HOW-TO-TEST.md). No install, no build
  step, and it uses the same live database as the deployed copy.

If you would rather reach the deployed site directly, Chrome's warning page
allows it via **Details → visit this unsafe site**. The site stores only sample
data and the three demonstration accounts published in this documentation; no
real credentials are involved and none should be entered.

**Why it is recorded as open rather than closed.** Every other defect in this
log was closed by a change the team controlled. This one is not fully within the
team's control, and reporting it as closed because the code changed would
misrepresent what a reviewer will actually experience.

---

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| Free Supabase project pauses when idle, so the demo shows the offline banner | Medium | Medium | Open the Supabase dashboard and confirm the project is awake an hour before the demo |
| No network in the demonstration room | Low | Medium | The application degrades to local data automatically; say so out loud — it is deliberate behaviour |
| Camera permission denied on an unfamiliar machine | Medium | Low | The upload tab is the documented fallback and is part of the script |
| Demo data left in a modified state by a previous run | Medium | Low | Reset demo data as the first step of the pre-demo checklist |

## 9. Demonstration readiness checklist

| ✔ | Check |
|---|-------|
| ☐ | Supabase project awake; dashboard open in a tab |
| ☐ | `53/53` unit tests passing |
| ☐ | Demo data reset to 10 items and 2 claims |
| ☐ | Signed out, starting from the sign-in page |
| ☐ | ST-1 to ST-6 completed with no open S1 or S2 defect |
| ☐ | Repository, deployed site and Supabase open in tabs |
| ☐ | Camera permission granted on the demonstration machine |

The presentation running order is in [DEMO-SCRIPT.md](DEMO-SCRIPT.md).
