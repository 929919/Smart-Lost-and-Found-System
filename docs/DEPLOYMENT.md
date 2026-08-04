# Deployment Guide

← [Back to documentation home](README.md)

How to publish the Smart Lost & Found System to a public URL on **Vercel**.
Free, no credit card, about **10 minutes**.

> ✅ **Currently deployed at:** <https://smart-lost-and-found-system-virid.vercel.app>

---

## ⚠️ Read this first — who should deploy

The repository is owned by the GitHub account **`929919`**. Vercel can only import
repositories the signed-in account has access to, so:

| Situation | What happens |
|-----------|--------------|
| ✅ **The repo owner deploys** | Simplest. Works immediately. **Recommended.** |
| ⚠️ A collaborator deploys | Needs the owner to approve Vercel's GitHub access first |
| ❌ Someone deploys a **fork** | **Do not do this.** The live site would freeze at today's code and stop tracking the team's pushes |

**Deploy from the real repository — never a fork.** The assessment expects the
deployed site to reflect the repository being marked.

---

## Before you start

Nothing needs to be built, installed or configured. The application is static
HTML/CSS/JavaScript and reads its database settings from a file already committed
to the repository.

**There are no secrets to add.** The Supabase key in `iteration 3/assets/js/config.js`
is the *anon / publishable* key, which is designed to be public — the database is
protected by Row-Level Security policies, not by hiding that key. The privileged
`service_role` key is **not** in the repository and must never be added to it.

---

## Step-by-step

### 1 · Sign in to Vercel
Go to **<https://vercel.com>** → **Sign Up** (or Log In) → **Continue with GitHub**.
Authorise Vercel when GitHub asks.

### 2 · Start a new project
Click **Add New…** → **Project**.

You'll see *"Import Git Repository"* with a list of repositories.

### 3 · Find the repository
Look for **`Smart-Lost-and-Found-System`** and click **Import**.

> **Not in the list?** Use the account dropdown above the list to switch to the
> account that owns the repo (`929919`). If it still isn't there, click
> **"Adjust GitHub App Permissions"**, then grant Vercel access to this repository.

### 4 · 🔴 Set the Root Directory — the one setting that matters

On the configuration screen, find **Root Directory** and click **Edit**.

Select **`iteration 3`**.

> **Why:** the repository root contains the project proposal and two superseded
> prototypes. Without this setting Vercel would publish the wrong folder and the
> site would not work.

### 5 · Check the framework preset
**Framework Preset** should read **Other**.

If it has guessed *Vite* or *Create React App*, change it to **Other**. This app
has no build step.

Leave **Build Command**, **Output Directory** and **Install Command** empty.

### 6 · Environment variables
**Skip this section — leave it empty.** The app needs none.

### 7 · Deploy
Click **Deploy** and wait about a minute.

You'll get a URL like `https://smart-lost-and-found-system.vercel.app`.

---

## ✅ Verify the deployment (5 minutes)

Open the URL and work through this list:

| ✔ | Check | Expected |
|---|-------|----------|
| ☐ | The site opens | Redirects to the **sign-in page** |
| ☐ | Sign in `jc111111` / `student123` | Student dashboard, items visible |
| ☐ | Items are listed | Data is coming from Supabase |
| ☐ | Press **F12** → Console | `[DB] Supabase connected — … items, … claims` |
| ☐ | **No amber banner** at the top | If one appears, the database wasn't reached |
| ☐ | Logout → `jc999999` / `admin123` | Admin dashboard |
| ☐ | Admin → **Log Found Item** → **Start Camera** | Browser asks for camera permission ✅ *(this only works on HTTPS — it's the main reason to deploy)* |
| ☐ | Logout → `jc000000` / `guest123` | **Access Not Permitted** page |
| ☐ | Open the URL on a phone | Layout adapts, camera uses the rear lens |
| ☐ | `<your-url>/tests/tests.html` | **35/35 passing** |

If every box ticks, the deployment is correct.

---

## After deploying

1. **Send the URL to the team** so it can be added to `README.md` and
   [`docs/implementation.md`](implementation.md), and used in the demo video.
2. **Automatic updates** — every push to `main` redeploys within a minute. No
   further action needed.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Page shows a file listing or the proposal README | Root Directory not set | Project **Settings → General → Root Directory** → `iteration 3` → **Redeploy** |
| Build fails mentioning `npm` or `vite` | Framework preset guessed wrong | Settings → **Framework Preset → Other**, clear Build Command → Redeploy |
| Amber "Could not reach the database" banner | Supabase project paused or the SQL wasn't run | Open the Supabase dashboard; free projects pause when idle — resume it. Ensure `db/schema.sql` and `db/users.sql` have been run |
| Login always fails | `users.sql` not run in Supabase | Run `iteration 3/db/users.sql` in the Supabase **SQL Editor** |
| Camera does nothing | Not on HTTPS, or permission denied | Deployed sites are HTTPS by default; check the browser's site permissions |
| Repository not listed in Vercel | Signed in as a non-owner | Switch account in the dropdown, or have the owner grant access |

---

## Security notes for the assessment

Worth being able to explain if asked:

- **The published key is the anon/publishable key.** It is meant to be in client
  code. Access is controlled by Row-Level Security policies in the database, not
  by keeping the key secret.
- **The `service_role` key is not in the repository** and must never be committed
  or added as a Vercel environment variable for this static site.
- **Demo account passwords are stored unhashed** in the `users` table. This is
  prototype-grade and documented: credentials are checked by a `SECURITY DEFINER`
  function so they never reach the browser, and RLS blocks the client from reading
  the table — but a production system would use Supabase Auth with hashed
  passwords. See [How to Test](HOW-TO-TEST.md#known-scope-decisions).
- **The demo accounts panel on the login page** is convenience for marking. It
  would be removed before any real-world release.
