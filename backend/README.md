# backend/ — superseded prototype

> ⚠️ **This folder is not the running application.** It is kept for history only.

## What this was
An early Flask REST API intended to sit between a React front end and Supabase.
It exposed `/api/items`, `/api/stats` and `/api/chat`, and was deployed to Render.

## Why it is no longer used
The Flask + React stack was dropped during Iteration 1. The application was
rebuilt as a static client that talks to **Supabase directly** through the
`supabase-js` browser SDK, which removed a whole server tier without losing the
relational database.

## Where the real code is
| Looking for | Go to |
|-------------|-------|
| The application | [`../iteration 3`](../iteration%203) |
| The **authoritative** database schema | [`../iteration 3/db/schema.sql`](../iteration%203/db/schema.sql) |
| User accounts & authentication | [`../iteration 3/db/users.sql`](../iteration%203/db/users.sql) |
| Architecture rationale | [`../docs/design.md`](../docs/design.md) |

⚠️ **Do not run `supabase_schema.sql` in this folder.** It is an earlier draft of
the `items` table that predates the `claims` table, the `photo_url` and
`reported_by` columns, and the row-level-security policies. Use
`iteration 3/db/schema.sql` instead.
