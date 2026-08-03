# frontend/ — superseded prototype

> ⚠️ **This folder is not the running application.** It is kept for history only.

## What this was
An early React + Vite single-page app that called the Flask API in
[`../backend`](../backend). It never reached a demonstrable state — the build
rendered a blank screen — and the team moved on rather than debugging a stack
that was heavier than the project needed.

## What replaced it
A static client (HTML + CSS + vanilla JavaScript) that talks to Supabase
directly. Same relational database, no build tooling, no server to host.
See [`../docs/tools.md`](../docs/tools.md) for the reasoning.

## Where the real code is
👉 **[`../iteration 3`](../iteration%203)** — the current application.

`vercel.json` in this folder configures a Vite build and is **not** used by the
current deployment. When deploying, set the project **Root Directory** to
`iteration 3`, which needs no build command.
