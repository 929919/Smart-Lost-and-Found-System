# Acceptance Tests

← [Back to documentation home](README.md) · See also [Testing strategy](testing.md)

Formal acceptance criteria for every user story, written in **Given / When / Then**
form. A story is *Done* only when its scenarios pass. Supports **Rubric Criterion
4 — Test**.

---

## Test environment

| | |
|---|---|
| **Application** | `iteration 3/` served over HTTP (`python -m http.server 8124`) |
| **Database** | Supabase PostgreSQL (live) — falls back to local demo data if unreachable |
| **Browsers** | Chrome / Edge (primary), Firefox, mobile Safari |
| **Test accounts** | `jc111111`/`student123` (student) · `jc999999`/`admin123` (admin) · `jc000000`/`guest123` (no access) |
| **Reset between runs** | Admin → ⚙️ Manage item statuses → **Reset demo data** |

## Test data set

Deterministic seed loaded on first run (`db/schema.sql` / `SEED_ITEMS`):

| Data | Content |
|------|---------|
| **10 items** | Every category represented; statuses Active (7), Claimed (2), Returned (1); all `item_type = found` |
| **2 claims** | 1 × Pending (on item 2, *Black leather wallet*), 1 × Approved (on item 4) |
| **Edge cases covered** | Item with no photo, item with no shelf tag, item with empty colour |

---

## Epic 1 — Accounts & Access

### AT-1.1 · Sign in with valid credentials *(story 1.1)*
> **Given** I am a signed-out visitor on `login.html`
> **When** I enter JCU ID `jc111111` and password `student123` and submit
> **Then** the credentials are verified in the database, a session is stored, and
> I land on the student dashboard with "Logged in as jc111111" in the header.

**Result:** ✅ Pass

### AT-1.2 · Invalid credentials are rejected *(story 1.1)*
> **Given** I am on the login page
> **When** I submit an empty field, an unknown JCU ID, or a wrong password
> **Then** an inline error appears, the password field is cleared, and no session
> is created.

**Result:** ✅ Pass

### AT-1.3 · The account determines the role and landing page *(story 1.2)*
> **Given** I am on the login page
> **When** I sign in as `jc999999` / `admin123`
> **Then** the role comes from the account record — I cannot choose it — and I
> land on `admin-dashboard.html`, not the student dashboard.

### AT-1.3b · An account with no permissions is denied *(story 1.3)*
> **Given** the account `jc000000` exists with role `none`
> **When** I sign in with `guest123`, or try to open any application page
> **Then** I am shown the **Access Not Permitted** page and can reach no
> student or admin functionality.

**Result:** ✅ Pass

**Result:** ✅ Pass

### AT-1.4 · Navigation is filtered by role *(story 1.2)*
> **Given** I am signed in
> **When** I look at the main navigation
> **Then** a **student** sees only Dashboard / Report Lost Item / Assistant, and an
> **admin** sees Admin Home / Log Found Item / Review Claims / All Items /
> Assistant — never "Report Lost Item".

**Result:** ✅ Pass

### AT-1.5 · Restricted pages cannot be reached by URL *(story 1.3)*
> **Given** I am signed in as a **student**
> **When** I type `admin-dashboard.html`, `log-found.html` or `admin-claims.html`
> directly into the address bar
> **Then** I am redirected away and never see admin content.

**Result:** ✅ Pass *(verified for all three routes)*

### AT-1.6 · Signed-out users are redirected *(story 1.3)*
> **Given** I have no session
> **When** I open any application page
> **Then** I am redirected to `login.html`.

**Result:** ✅ Pass

### AT-1.7 · Logout clears the session *(story 1.1)*
> **Given** I am signed in
> **When** I click **Logout**
> **Then** the session is cleared and I return to the login page; pressing Back
> does not restore access.

**Result:** ✅ Pass

---

## Epic 2 — Search, Browse & Claim

### AT-2.1 · Filter the dashboard *(story 2.3)*
> **Given** I am a student on the dashboard
> **When** I type `wallet` in the search box
> **Then** the grid narrows live to matching items.
> **When** I select category **Electronics** and status **All**
> **Then** only electronics are listed, including Claimed and Returned ones.

**Result:** ✅ Pass

### AT-2.2 · Empty result is handled *(story 2.3)*
> **Given** I am on the dashboard
> **When** I search for a term that matches nothing
> **Then** a friendly empty state is shown instead of a blank grid.

**Result:** ✅ Pass

### AT-2.3 · View item detail *(story 2.4)*
> **Given** I am a student
> **When** I click an item card
> **Then** I see its reference number, category, location, shelf tag, date,
> description and photo (or a category graphic if it has none).

**Result:** ✅ Pass

### AT-2.4 · Claim requires proof of ownership *(story 2.1)*
> **Given** I am viewing an **Active found** item
> **When** I click "This is mine — Submit a Claim" and submit with proof empty
> **Then** validation blocks it and no claim is created.

**Result:** ✅ Pass

### AT-2.5 · Submitting a valid claim *(story 2.1)*
> **Given** I am on the claim form with my JCU ID pre-filled and read-only
> **When** I enter proof text and submit
> **Then** a claim is created with status **Pending** and it appears in the
> admin's Review Claims list.

**Result:** ✅ Pass *(verified end-to-end against the database)*

### AT-2.6 · Unclaimable items offer no claim button *(story 2.1)*
> **Given** an item is already **Claimed** or **Returned**, or is a lost report
> **When** I open its detail page as a student
> **Then** no claim button is offered and the reason is explained.

**Result:** ✅ Pass

### AT-2.7 · Assistant answers policy questions *(story 2.2)*
> **Given** I am on the Assistant page
> **When** I ask where to collect an item
> **Then** it replies with the Security Office location and opening hours.
> **When** I describe a lost item ("I lost my AirPods")
> **Then** it returns the matching record with its location and shelf tag.

**Result:** ✅ Pass

---

## Epic 3 — Reporting & Logging

### AT-3.1 · Lost report requires a map location *(story 3.1)*
> **Given** I am a student on "Report a Lost Item"
> **When** I fill the details but do not click a pin on the campus map
> **Then** submission is blocked with a message asking me to choose a location.

**Result:** ✅ Pass

### AT-3.2 · Selecting a location on the campus map *(story 3.1)*
> **Given** I am on the lost-item form
> **When** I click the **Food Court / Canteen** pin
> **Then** the pin highlights and a confirmation reads
> "Selected location: Food Court / Canteen".

**Result:** ✅ Pass

### AT-3.3 · Submitting a lost report *(story 3.1)*
> **Given** I have chosen a location and entered a name and category
> **When** I submit
> **Then** the item is saved with `item_type = lost`, my JCU ID in `reported_by`,
> and I am returned to the dashboard.

**Result:** ✅ Pass

### AT-3.4 · Capturing a photo with the camera *(story 3.2)*
> **Given** I am an admin on "Log a Found Item", **Take Photo** tab
> **When** I start the camera and click **Capture**
> **Then** a still frame is captured, **Retake** is offered, and the image is
> stored with the item.

**Result:** ✅ Pass *(requires HTTPS or localhost)*

### AT-3.5 · Camera denial degrades gracefully *(story 3.2)*
> **Given** I am on the Take Photo tab
> **When** I deny camera permission, or the device has no camera
> **Then** a clear message directs me to the Upload File tab; the app does not
> break and I can still log the item.

**Result:** ✅ Pass

### AT-3.6 · Uploading a photo instead *(story 3.2)*
> **Given** I am on the **Upload File** tab
> **When** I choose an image
> **Then** a preview appears and the image is saved with the item.

**Result:** ✅ Pass

### AT-3.7 · Found item appears for students *(story 3.2)*
> **Given** an admin has logged a found item
> **When** a student opens the dashboard
> **Then** the item is listed as **Active** with its photo.

**Result:** ✅ Pass

---

## Epic 4 — Administration

### AT-4.1 · Admin dashboard summary *(story 4.1)*
> **Given** I am signed in as an admin
> **When** I open Admin Home
> **Then** I see counts of active found items, pending claims, returned items and
> total items, plus a badge showing outstanding claims.

**Result:** ✅ Pass

### AT-4.2 · Reviewing claim evidence *(story 4.2)*
> **Given** I am on Review Claims
> **When** I inspect a claim card
> **Then** I see the claimant's JCU ID, the item photo and description, the proof
> of ownership text, both dates and the current status.

**Result:** ✅ Pass

### AT-4.3 · Approving a claim updates the item *(story 4.2)*
> **Given** a claim is **Pending**
> **When** I click **Approve**
> **Then** the claim becomes **Approved** *and* its linked item becomes
> **Claimed**, in the database.

**Result:** ✅ Pass *(verified directly in PostgreSQL)*

### AT-4.4 · Rejecting a claim leaves the item alone *(story 4.2)*
> **Given** a claim is **Pending**
> **When** I click **Reject**
> **Then** the claim becomes **Rejected** and the item's status is unchanged, so
> it remains claimable by someone else.

**Result:** ✅ Pass

### AT-4.5 · Marking an item returned *(story 4.2)*
> **Given** a claim is **Approved**
> **When** I click **Mark as Returned**
> **Then** both the claim and its item become **Returned**.

**Result:** ✅ Pass *(verified directly in PostgreSQL)*

### AT-4.6 · Filtering claims *(story 4.2)*
> **Given** I am on Review Claims
> **When** I select a status filter
> **Then** only claims with that status are listed and the counters stay accurate.

**Result:** ✅ Pass

---

## Epic 5 — Iteration 3

### AT-5.1 · Data is stored in a real relational database *(story 5.1)*
> **Given** the application is configured with Supabase credentials
> **When** it loads
> **Then** items and claims are read from PostgreSQL, not browser storage, and
> records created in the app are visible in the Supabase Table Editor.

**Result:** ✅ Pass *(10 items + 2 claims loaded; inserted item persisted as id 11)*

### AT-5.2 · Database outage degrades gracefully *(story 5.1)*
> **Given** the database cannot be reached
> **When** I open the application
> **Then** it still runs on local demo data and shows a clear warning banner
> rather than failing.

**Result:** ✅ Pass *(observed while the schema was not yet created)*

### AT-5.3 · Client cannot destroy records *(story 5.1)*
> **Given** Row-Level Security is enabled with no DELETE policy
> **When** a delete is attempted from the browser
> **Then** no rows are removed; records can only be retired by changing status.

**Result:** ✅ Pass

### AT-5.4 · Lost reports are matched to found items *(story 5.3)*
> **Given** I am a student who has reported a lost *Black leather wallet* at the
> Food Court, and a matching found item exists
> **When** I open the dashboard
> **Then** an alert reads "1 possible match for your lost item" and explains why
> it matched (same category, location, colour and shared keywords).

**Result:** ✅ Pass

### AT-5.5 · Matches are private to the reporting student *(story 5.3)*
> **Given** another student has reported a lost item
> **When** I view my dashboard
> **Then** I see only matches for **my own** reports; admins see no student match
> alerts at all.

**Result:** ✅ Pass

### AT-5.6 · Automated regression suite *(story 5.4)*
> **Given** the test runner at `tests/tests.html`
> **When** I open it
> **Then** all assertions pass, covering item CRUD, the claims workflow, seed
> integrity and the matching engine.

**Result:** ✅ Pass — **35/35**

---

## Traceability matrix

| Story | Acceptance tests | Status |
|-------|------------------|:------:|
| 1.1 Sign in | AT-1.1, AT-1.2, AT-1.7 | ✅ |
| 1.2 Role selection | AT-1.3, AT-1.4 | ✅ |
| 1.3 Access control | AT-1.5, AT-1.6 | ✅ |
| 2.1 Submit claim | AT-2.4, AT-2.5, AT-2.6 | ✅ |
| 2.2 Assistant | AT-2.7 | ✅ |
| 2.3 Search & filter | AT-2.1, AT-2.2 | ✅ |
| 2.4 Item detail | AT-2.3 | ✅ |
| 3.1 Report lost + map | AT-3.1, AT-3.2, AT-3.3 | ✅ |
| 3.2 Log found + camera | AT-3.4, AT-3.5, AT-3.6, AT-3.7 | ✅ |
| 4.1 Admin dashboard | AT-4.1 | ✅ |
| 4.2 Claims workflow | AT-4.2 … AT-4.6 | ✅ |
| 5.1 Database | AT-5.1, AT-5.2, AT-5.3 | ✅ |
| 5.3 Auto-matching | AT-5.4, AT-5.5 | ✅ |
| 5.4 Test suite | AT-5.6 | ✅ |

**Coverage: 14 / 14 delivered stories have passing acceptance tests.**

Story 5.2 (deployment) and 5.5 (Claude API assistant) are not yet delivered and
therefore have no acceptance results.
