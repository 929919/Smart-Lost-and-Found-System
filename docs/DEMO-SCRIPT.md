# Demo Script — 15 Minute Walkthrough

← [Back to documentation home](README.md)

A running order for demonstrating the Smart Lost & Found System on a laptop.
Everything runs **locally** — no internet-hosted deployment needed, though the
database is live in the cloud.

---

## ⏱️ Before the demo — 5 minute setup checklist

| ✔ | Step |
|---|------|
| ☐ | **Start the server:** `cd "iteration 3"` then `python -m http.server 8124` |
| ☐ | Open **http://localhost:8124/login.html** and confirm the page loads |
| ☐ | Open DevTools console (F12) once — confirm `[DB] Supabase connected` appears, then close it |
| ☐ | Sign in as admin → **⚙️ Manage item statuses → ↺ Reset demo data** so counts are clean |
| ☐ | Sign out, so you start from the login screen |
| ☐ | Open these browser tabs in advance: **Supabase dashboard**, **GitHub repo**, **`tests/tests.html`** |
| ☐ | Close unrelated tabs/notifications; zoom browser to ~110% for visibility |

**Fallback if the internet drops:** the app automatically falls back to local demo
data and shows an amber banner. Everything still works — say so out loud, it
demonstrates the resilience you built deliberately.

---

## Part 1 · Access control — the three account types *(4 min)*

> *"Access is determined by the account, not by the user. Nobody chooses their own
> permissions."*

### 1a. Student account
- Sign in: **`jc111111` / `student123`**
- Point out: lands on the **student dashboard**; header shows
  `Logged in as jc111111 [STUDENT]`
- Point out the navigation: **Dashboard · Report Lost Item · Assistant** — no admin links

### 1b. An account with no permissions
- **Logout** → sign in as **`jc000000` / `guest123`**
- Result: **"Access Not Permitted"** page — a valid account that the system refuses
- 💡 **Show the guard working:** type `localhost:8124/admin-dashboard.html` in the
  address bar → bounced straight back. Then try `index.html` → also bounced.

### 1c. Wrong password
- **Logout** → try **`jc111111` / `wrongpassword`**
- Result: *"Incorrect JCU ID or password"* — no session created

### 1d. Admin account
- Sign in: **`jc999999` / `admin123`**
- Lands on **Admin Home**; nav now shows Log Found Item, Review Claims (with a red
  pending badge), All Items

> **Say this:** *"Credentials are verified by a `SECURITY DEFINER` function inside
> PostgreSQL. The browser never receives a password, and Row-Level Security means
> the client cannot read the users table at all."*

---

## Part 2 · The student journey *(4 min)*

Sign in as **`jc111111` / `student123`**.

1. **Search & filter** — type `wallet`; then click category **Electronics**, status **All**
2. **Report a lost item** → *Report Lost Item*
   - Try submitting with no map pin → blocked with a clear message *(show validation works)*
   - Click the **Food Court / Canteen** pin → confirmation appears
   - Name `Black leather wallet`, Category **Accessories**, Colour `Black` → **Submit**
3. **🔔 The auto-matching feature fires** — back on the dashboard:
   > *"1 possible match for your lost item"* — and it explains **why**:
   > same category · same location · same colour · matching words
4. Click **View & claim →** → **Submit a Claim**
   - Submit empty proof → blocked
   - Enter *"Brown stitching inside, my concession card is in the front slot"* → submit

> **Say this:** *"This is the 'smart' part — the system compares every new lost
> report against all active found items and scores them, so students don't have to
> keep checking."*

---

## Part 3 · The admin journey *(4 min)*

**Logout** → sign in as **`jc999999` / `admin123`**.

1. **Admin Home** — stats strip, and the **Review Claims** card shows a red badge
   with the pending count (now including the claim just submitted)
2. **Log Found Item**
   - **📸 Take Photo** tab → **Start Camera** → **Capture** → **Retake**
   - *(If the camera is unavailable, the fallback message appears — mention this is
     deliberate handling, then use the **Upload File** tab instead)*
   - Fill name + category, click a map pin → **Log Found Item**
3. **Review Claims**
   - Show the claim card: claimant ID, item photo, **proof of ownership**, dates
   - Click **✓ Approve** → claim becomes *Approved* **and the item becomes Claimed**
   - Click **📦 Mark as Returned** → both become *Returned*
   - Use the status filters to show the counters staying accurate

---

## Part 4 · Under the hood *(3 min)*

### 4a. The live database
Switch to the **Supabase** tab → **Table Editor**
- **`items`** — point out the row the student just created, with `reported_by`
- **`claims`** — show the status you just changed, live
- **`users`** — the three accounts with their roles
- Optionally **SQL Editor**: `SELECT * FROM verify_login('jc111111','student123');`
  returns the role; with a wrong password it returns **zero rows**

> **Say this:** *"This is a real managed PostgreSQL database with foreign keys,
> CHECK constraints and Row-Level Security — not browser storage."*

### 4b. Automated tests
Open **http://localhost:8124/tests/tests.html** → **✔ 35/35 passing**

> **Say this:** *"Unit tests for the data layer, the claims workflow and the
> matching engine. They caught a real bug during development — the seed data was
> being mutated in memory, so 'reset' didn't fully reset. There's now a regression
> test for it."*

### 4c. GitHub
Switch to the **GitHub** tab
- **Commits** — story-tagged messages (`feat: … (story 3.2)`)
- **Releases** — `v1.0`, `v2.0` tags marking each iteration
- **Folders** — `iteration 1 / 2 / 3`, each a snapshot of what that iteration delivered
- **`docs/`** — the documentation set, including `HOW-TO-TEST.md`

---

## 🎯 Points worth making if you get the chance

| Topic | The point |
|-------|-----------|
| **Resilience** | If the database is unreachable the app degrades to local data with a warning instead of crashing |
| **Security** | Passwords never reach the browser; RLS blocks reading `users`; no `DELETE` policy means records can't be destroyed from the client |
| **Accessibility** | Full keyboard navigation with visible focus, a skip link, ARIA live regions, and `prefers-reduced-motion` support |
| **Honest scope** | Passwords are unhashed and accounts are pre-provisioned — prototype-grade, documented, and the production path (Supabase Auth) is identified |

## ❓ Likely questions

**"Is this a real database or local storage?"**
Real — Supabase-managed PostgreSQL. Show the Table Editor updating live.

**"What happens if two people claim the same item?"**
Both claims are recorded as Pending; the admin reviews the proof of ownership and
approves one. Approving moves the item to Claimed so it leaves the active list.

**"Why no framework?"**
Small team, tight timeline — vanilla JS removed build tooling overhead so effort
went into features, testing and documentation. Shared behaviour is still modular
(`auth.js`, `store.js`, `matching.js`, `camera.js`).

**"Is it deployed?"**
The database is live in the cloud; static hosting on Vercel is the next step —
the code is deployment-ready and the repo is connected.
