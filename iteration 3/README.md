# Smart Lost & Found — Iteration 3 (JCU Singapore)

The current build of the Smart Lost & Found System for the JCU Singapore campus,
built with **plain HTML, CSS, and vanilla JavaScript**. No build step.

**Carried over from Iteration 2:** role-based access (Student / Admin), the
claims workflow, and camera capture.

**New in Iteration 3:**
- 🔔 **Lost ↔ found auto-matching** (`assets/js/matching.js`, story 5.3) — scores
  every active found item against a student's lost report and surfaces ranked
  matches on their dashboard, with the reason for each match.
- 🧪 **Automated test suite** (`tests/`) — 53 unit tests including mock-object
  tests for authentication, zero install.
- 🗄️ **Supabase PostgreSQL backend** (`db/`) — items, claims and accounts in a
  managed relational database, with graceful fallback when unreachable.
- 🔐 **Credential sign-in** — the role comes from the account, not from a choice.

## How to run
Open **`login.html`** in your browser. For the camera tool to work you need a
secure context, so prefer serving locally:

```bash
cd "iteration 3"
python -m http.server 8124    # then open http://localhost:8124/login.html
```

(Double-clicking the files also works for everything except the live camera,
which browsers only allow on `localhost`/HTTPS.)

## Sign in
Accounts live in the `users` table in PostgreSQL. **Your access level comes from
the account — you cannot choose it at login.**

| JCU ID | Password | Access level |
|--------|----------|--------------|
| `jc111111` | `student123` | 🎓 Student — browse & claim found items, report a lost item |
| `jc999999` | `admin123` | 🛡️ Admin — log found items, review & approve claims |
| `jc000000` | `guest123` | 🚫 No access — a valid account with no permissions |

Credentials are checked by `verify_login()`, a `SECURITY DEFINER` function that
runs inside the database, so passwords never reach the browser and Row-Level
Security stops the client reading the `users` table. The signed-in session is
kept as `currentUser = {jcuId, name, role}`; use **Logout** (top-right) to switch.

## Pages & access
| Page                  | Role    | Purpose                                                  |
|-----------------------|---------|----------------------------------------------------------|
| `login.html`          | guest   | JCU ID + password sign in                                |
| `index.html`          | both    | Dashboard of all items (search / filter)                 |
| `item-detail.html`    | both    | Item details; students can start a claim                 |
| `report-lost.html`    | student | Report a lost item (campus map location picker)          |
| `submit-claim.html`   | student | Submit proof-of-ownership claim on a found item          |
| `assistant.html`      | both    | Rule-based help chatbot                                  |
| `admin-dashboard.html`| admin   | Admin landing — stats + action cards                     |
| `log-found.html`      | admin   | Log a found item with **camera or upload** + map         |
| `admin-claims.html`   | admin   | Review claims: approve / reject / mark returned          |
| `admin.html`          | admin   | Item status table (extra management view)                |
| `no-access.html`      | none    | Shown to accounts without permissions                    |

**Route guard:** every protected page runs `auth.js` in `<head>`; signed-out
visitors go to `login.html`, accounts with no permissions go to `no-access.html`,
and signing in with the wrong role for a page returns you to your own home page.

## How data works
Items, claims and accounts live in a **Supabase (PostgreSQL)** database. The data
layer loads them once on startup and caches them in memory, so page rendering
stays synchronous while writes are persisted in the background.

- `items` — found items and lost reports, separated by `item_type`
- `claims` — ownership claims, foreign-keyed to `items`
- `users` — accounts and roles; unreadable from the browser (see above)

If the database cannot be reached the application **falls back to local demo
data** and shows a warning banner rather than failing. The signed-in session is
the only thing kept in `localStorage`.

Approving a claim marks its item **Claimed**; "Mark as Returned" marks it
**Returned**. Use **Admin → ⚙️ Manage item statuses → Reset demo data** to restore
the sample set.

## Running the tests
No installation required — open **`tests/tests.html`** in a browser (or serve it
as above and visit `http://localhost:8124/tests/tests.html`). The runner
snapshots and restores your localStorage, so it never disturbs app data.
**Current result: 53/53 passing.**

## Structure
```
iteration 3/
├── login.html  index.html  item-detail.html
├── report-lost.html  submit-claim.html  assistant.html
├── admin-dashboard.html  log-found.html  admin-claims.html  admin.html
├── db/
│   ├── schema.sql     # items and claims, constraints, row-level security
│   └── users.sql      # accounts and the verify_login() function
├── tests/
│   ├── tests.html     # zero-install test runner
│   ├── tests.js       # 53 unit tests
│   └── mocks.js       # mock objects for testing authentication
└── assets/
    ├── css/styles.css
    ├── img/  (jcu_logo.png, jcu_layout.png)
    └── js/
        ├── auth.js        # session + route guard (loaded in <head>)
        ├── main.js        # role-aware header/nav/footer, logout, chat widget
        ├── store.js       # data layer: items + claims
        ├── map.js         # shared campus-map location picker
        ├── camera.js      # camera capture + file upload
        ├── matching.js    # lost↔found auto-matching engine (story 5.3)
        ├── login.js  dashboard.js  report-lost.js  submit-claim.js
        ├── item-detail.js  log-found.js  admin-dashboard.js
        ├── admin-claims.js  assistant.js  admin.js
```

## Scope decisions
- **Passwords are stored unhashed.** Prototype-grade: they are checked by a
  `SECURITY DEFINER` database function so they never reach the browser, and
  row-level security blocks the client from reading the accounts table. A
  production system would use Supabase Auth with hashed credentials.
- **Accounts are pre-provisioned** — there is no self-registration.
- **The assistant is rule-based**, not a language model.
- **Not delivered this milestone:** duplicate detection (story 3.5, P30) and the
  audit trail (story 4.5, P40). See [the backlog](../docs/requirements.md).
