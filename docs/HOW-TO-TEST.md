# How to Test This Project

← [Back to documentation home](README.md)

A click-by-click walkthrough for exercising **every** feature. No account, no
installation, no database setup required. Allow about **10 minutes**.

---

## Setup (30 seconds)

```bash
cd "iteration 3"
python -m http.server 8124
```
Open **http://localhost:8124/login.html**

> **Why a local server rather than double-clicking?** The camera feature only works
> in a secure context (`localhost` or HTTPS). Everything else works from `file://` too.

**Sign in:** any JCU ID is accepted — there are no passwords in this prototype.
Data is seeded automatically on first load (10 items, 2 claims).

---

## Part 1 — Student experience (5 min)

**Sign in** with JCU ID `jc111111`, role **🎓 Student**.

### ✅ 1.1 Dashboard, search and filters *(story 2.3)*
| Do this | Expect |
|---------|--------|
| Look at the stat cards | Total / Active / Claimed / Returned counts |
| Type `wallet` in the search box | Grid narrows to matching items live |
| Clear search, click category **Electronics** | Only electronics shown |
| Click status **All** | Claimed and Returned items appear too |

### ✅ 1.2 Item detail *(story 2.4)*
| Do this | Expect |
|---------|--------|
| Click any active found item card | Detail page: reference no., category, location, shelf, date, description |
| Check the buttons | A blue **"🙋 This is mine — Submit a Claim"** button |

### ✅ 1.3 Submit a claim *(story 2.1)*
| Do this | Expect |
|---------|--------|
| Click **Submit a Claim** | Form with your JCU ID pre-filled and read-only |
| Leave proof blank → **Submit Claim** | ❌ Validation error — proof is required |
| Enter e.g. *"Brown stitching inside, my concession card is in the front slot"* → **Submit** | ✅ Green success banner, redirected to the item |

### ✅ 1.4 Report a lost item + campus map *(story 3.1)*
| Do this | Expect |
|---------|--------|
| Nav → **Report Lost Item** | Two-step form |
| Submit without picking a map pin | ❌ Error asking you to choose a location |
| Click the **Food Court / Canteen** pin on the campus aerial | Pin turns blue, banner shows *"Selected location: Food Court / Canteen"* |
| Name: `Black leather wallet`, Category: **Accessories**, Colour: `Black` → **Submit** | ✅ Success, redirected to dashboard |

### ✅ 1.5 🔔 Auto-matching — the Iteration 3 feature *(story 5.3)*
| Do this | Expect |
|---------|--------|
| Look at the top of the dashboard after step 1.4 | **"🔔 1 possible match for your lost item"** |
| Read the match row | Shows *why* it matched: *same category · same location · same colour · matching words: black, leather, wallet* |
| Click **View & claim →** | Opens that found item's detail page |

> This is the "Smart" in Smart Lost & Found — the system compares your lost report
> against every active found item automatically.

### ✅ 1.6 Help assistant *(story 2.2)*
| Do this | Expect |
|---------|--------|
| Nav → **Assistant** (or the 💬 button, bottom-right) | Chat opens with a greeting |
| Click **"Where do I collect my item?"** | Security Office location + opening hours |
| Type `I lost my AirPods` | Finds the matching item with its location and shelf tag |

### ✅ 1.7 🔒 Role enforcement — students are blocked from admin pages *(story 1.3)*
| Do this | Expect |
|---------|--------|
| Type `http://localhost:8124/admin-dashboard.html` in the address bar | ❌ **Redirected away** — students cannot access it |
| Type `http://localhost:8124/log-found.html` | ❌ Also blocked |
| Check the nav bar | No admin links are even shown to students |

---

## Part 2 — Admin experience (5 min)

Click **Logout** (top-right), then sign in as `jc999999`, role **🛡️ Admin**.

### ✅ 2.1 Admin dashboard *(story 4.1)*
| Do this | Expect |
|---------|--------|
| Observe the landing page | Stats strip: Active Found / Pending Claims / Returned / Total |
| Look at **Review Student Claims** card | 🔴 Red badge with the pending-claim count |
| Check the nav | Admin-only links; **no** "Report Lost Item" or "Submit Claim" |

### ✅ 2.2 Log a found item with the camera *(story 3.2)*
| Do this | Expect |
|---------|--------|
| Nav → **Log Found Item** | Three-step form with **📸 Take Photo / 📁 Upload File** tabs |
| Click **Start Camera** | Browser asks permission → live video preview |
| Click **📸 Capture** | Frame freezes as the photo, **↺ Retake** appears |
| *(If you deny camera access)* | ✅ Graceful message telling you to use the Upload tab instead — **this is intended behaviour** |
| Switch to **📁 Upload File**, choose any image | Preview appears |
| Fill name + category, pick a map pin → **Log Found Item** | ✅ Item created; your photo shows on its dashboard card |

### ✅ 2.3 Review claims *(story 4.2)*
| Do this | Expect |
|---------|--------|
| Nav → **Review Claims** | Counters + filters (All / Pending / Approved / Rejected / Returned) |
| Inspect a claim card | Claimant JCU ID, item photo & description, **proof of ownership**, dates, status |
| Find the claim you submitted in step 1.3 → **✓ Approve** | Claim → **Approved**, and the **item becomes Claimed** |
| On that approved claim → **📦 Mark as Returned** | Claim → **Returned**, and the **item becomes Returned** |
| Click filter **Pending** | Only pending claims listed |

### ✅ 2.4 Item status management
| Do this | Expect |
|---------|--------|
| Admin Home → **⚙️ Manage item statuses** | Table of all items with status dropdowns |
| Change any status | Saves immediately; stats update |

---

## Part 3 — Automated tests (1 min)

Open **http://localhost:8124/tests/tests.html**

Expect a green **✔ 35/35 passing** summary covering:
- Item CRUD and status transitions
- The full claims workflow (approve / reject / mark returned)
- Seed-reset integrity *(a regression test for a real bug these tests caught)*
- The auto-matching engine

The runner snapshots and restores your data, so it won't disturb anything.

---

## Part 4 — Responsive & accessibility (1 min)

| Do this | Expect |
|---------|--------|
| Press `F12` → toggle device toolbar → iPhone | Layout reflows; nav collapses to a ☰ hamburger |
| Tab through the login page with the keyboard | Focus rings visible, all controls reachable |

---

## 🔄 Resetting between test runs

**Admin → ⚙️ Manage item statuses → ↺ Reset demo data** restores the original
10 items and 2 claims. To clear everything including your session, open DevTools
console and run `localStorage.clear()`.

---

## Known scope decisions

These are deliberate, documented in [Requirements](requirements.md):

- **No passwords.** Login is open by design for this prototype; role selection is the access control being demonstrated.
- **No JCU ID validation.** Any string is accepted.
- **Camera needs HTTPS/localhost.** A browser restriction, not a bug — the fallback to file upload is intentional.
- **Data is per-browser** until the Supabase migration (story 5.1) completes.
