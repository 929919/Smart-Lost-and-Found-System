# Code Quality Review — SRP & DRY

← [Back to documentation home](README.md)

A review of the codebase against the **Single Responsibility Principle** and
**Don't Repeat Yourself**, as required by **Practical 5 (task 1)** and repeated
in **Practical 6**.

> *"Check your classes to see whether they satisfy SRP and DRY and list down what
> you have found."*

The application is written in modular JavaScript rather than classes, so each
**module** (and the object it exports) is treated as the unit of responsibility.

---

## Module inventory

| Module | Lines | Responsibility | SRP |
|--------|------:|----------------|:---:|
| `auth.js` | 121 | Session handling and the route guard | ⚠️ |
| `store.js` | 291 | Data access for items and claims, database bootstrap, row mapping, view helpers | ❌ |
| `matching.js` | 89 | Scoring lost reports against found items | ✅ |
| `map.js` | 36 | Campus map location picker | ✅ |
| `camera.js` | 95 | Photo capture and file upload | ✅ |
| `main.js` | 150 | Shared header, navigation, footer, logout, chat widget | ⚠️ |
| `config.js` | 19 | Connection settings | ✅ |
| `dashboard.js` | 126 | Dashboard rendering and filtering | ✅ |
| `admin-claims.js` | 90 | Claims review interface | ✅ |
| `admin.js` | 40 | Item status table | ✅ |
| `admin-dashboard.js` | 18 | Admin landing figures | ✅ |
| `item-detail.js` | 65 | Single item view | ✅ |
| `submit-claim.js` | 78 | Claim submission | ✅ |
| `report-lost.js` | 49 | Lost item form | ✅ |
| `log-found.js` | 56 | Found item form | ✅ |
| `login.js` | 41 | Sign-in form handling | ✅ |
| `assistant.js` | 151 | Rule-based assistant | ✅ |

---

## Single Responsibility Principle

### ✅ What holds up well

**The feature modules are genuinely single-purpose.** `matching.js` only scores
similarity — it does not render anything, does not touch the DOM, and does not
know where items come from. That is why it was straightforward to unit test in
isolation: ten assertions cover it without a browser page.

`map.js` and `camera.js` are the same. Each owns one interaction, exposes a
small interface (`CampusMap.init()`, `CameraTool.getPhoto()`), and is reused by
more than one page without modification.

**One page script per page.** Each page has exactly one script responsible for
its behaviour, so a change to the claims screen cannot break the dashboard.

### ❌ Finding 1 — `store.js` carries four responsibilities

At 291 lines it is by far the largest module, and it contains:

1. **Data access** — the `Store` and `Claims` objects
2. **Database bootstrap** — the `DB` object, which creates the client, loads the
   caches and handles the offline fallback
3. **Row mapping** — the `Rows` object translating PostgreSQL `snake_case` to the
   JavaScript `camelCase` model
4. **View helpers** — `icon()`, `escapeHTML()`, `itemMedia()` and `statsCards()`,
   which produce HTML

The fourth is the clearest violation: a data module should not be generating
markup. The first three are defensible as one cohesive "persistence" concern,
but the module would be easier to reason about split into `db.js`
(connection and bootstrap), `store.js` (items and claims) and `ui.js` (shared
view helpers).

**Decision:** not refactored. The change would touch every page and the system
is already deployed and demonstrated; the risk outweighed the benefit this late
in the project. Recorded here as a known finding with the recommended split.

### ⚠️ Finding 2 — `auth.js` does two things

It provides the session API (`signIn`, `getUser`, `logout`) **and** executes the
route guard as a side effect of being loaded. Two responsibilities in one file.

The coupling is deliberate: the guard has to run before the page renders, and
loading a single script in `<head>` guarantees that ordering. Splitting them
would mean two script tags with a required order — an easier mistake to make
than the current arrangement. **Accepted trade-off**, documented rather than
changed.

### ⚠️ Finding 3 — `main.js` assembles several page regions

Header, navigation, footer, logout binding and the chat widget. These are all
"shared page chrome", so the module is cohesive at that level, but it does
mean one file changes for several unrelated reasons. Acceptable at 150 lines;
would warrant splitting if it grew.

---

## Don't Repeat Yourself

### ❌ Finding 4 — identical statistics renderer in two files *(fixed)*

`renderStats()` was **byte-for-byte identical** in `dashboard.js` and `admin.js`:
eight lines of template markup duplicated. Two further near-copies existed in
`admin-dashboard.js` and `admin-claims.js` with the same structure but different
figures — four variations of one component.

Any change to the statistic card markup would have needed four edits, and would
silently drift if one were missed.

**Fixed.** Introduced two helpers in `store.js`:

```js
statsCards(cards)      // renders any [{value, label, tone}] list
itemStatusCards()      // the Total/Active/Claimed/Returned set, shared
                       // by the dashboard and the admin item table
```

All four call sites now use them. `renderStats()` went from eight lines of
duplicated markup to one line.

**Verified after the change:** all four pages render the same figures and colour
tones as before, no console errors, and the 35 unit tests still pass.

### ✅ What was already DRY

- **`escapeHTML()`, `icon()` and `itemMedia()`** were already defined once in
  `store.js` and shared. Every page uses the same escaping routine, which is
  also why output encoding is consistent.
- **The campus map picker** exists once in `map.js` and is used by both
  `report-lost.html` and `log-found.html`. Before it was extracted the pin
  rendering was duplicated in the report form.
- **Header, navigation and footer** are generated once in `main.js` rather than
  repeated across eleven HTML files. This is what made the role-aware navigation
  and the site-wide disclaimer single-line changes.
- **Seed data** is defined once and shared by the application and the test suite.

### ⚠️ Finding 5 — status strings repeated as literals

`"Active"`, `"Claimed"`, `"Returned"`, `"Pending"`, `"Approved"`, `"Rejected"`
appear as string literals in several modules. A typo would fail silently in
JavaScript.

**Mitigated at the database:** `CHECK` constraints in `db/schema.sql` reject any
value outside the allowed set, so a bad literal cannot corrupt stored data — it
fails loudly at the write instead. A shared constants object would still be an
improvement and is recorded as future work.

---

## Summary

| # | Finding | Principle | Outcome |
|---|---------|-----------|---------|
| 1 | `store.js` mixes data access, bootstrap, mapping and view helpers | SRP | Documented; split recommended, deferred as too risky post-deployment |
| 2 | `auth.js` combines the session API with the route guard | SRP | Accepted trade-off — guarantees the guard runs first |
| 3 | `main.js` assembles several page regions | SRP | Acceptable at current size |
| 4 | `renderStats()` duplicated across four call sites | DRY | ✅ **Fixed** — extracted `statsCards()` / `itemStatusCards()` |
| 5 | Status values repeated as string literals | DRY | Mitigated by database `CHECK` constraints; constants recommended |

**Overall.** The feature modules follow SRP well, and the shared-component work
(`map.js`, `camera.js`, `main.js`) means the codebase is largely DRY. The one
clear violation found by this review was fixed and verified. The remaining
findings are recorded with reasoning rather than quietly ignored — the largest,
splitting `store.js`, is deliberately deferred because the system is deployed
and the refactor would touch every page.
