# Smart Lost & Found — Iteration 1 (JCU Singapore)

The first working prototype, built with **plain HTML, CSS and vanilla JavaScript**.
No server, no build step, no installation.

> 📸 **Snapshot notice:** this folder is preserved as delivered at release **`v1.0`**.
> It is kept unchanged so the incremental progress across iterations is visible.
> The current application lives in [`../iteration 3`](../iteration%203).

## What Iteration 1 delivered
- **Found-items dashboard** — search, category and status filters, live statistics
- **Report form** with an interactive **JCU campus map** location picker
- **Rule-based help assistant** answering collection and policy questions
- **Admin console** for moving items through Active → Claimed → Returned
- Responsive layout using the JCU Singapore visual identity

## How to run
```bash
cd "iteration 1"
python -m http.server 8121     # then open http://localhost:8121/index.html
```
Or simply double-click `index.html`.

There is no sign-in at this stage — authentication and roles arrive in
[Iteration 2](../iteration%202).

## Structure
```
iteration 1/
├── index.html      # dashboard
├── report.html     # report a found or lost item (campus map picker)
├── assistant.html  # rule-based chatbot
├── admin.html      # item status management
└── assets/
    ├── css/styles.css
    ├── img/  (jcu_logo.png, jcu_layout.png)
    └── js/   store.js · layout.js · dashboard.js · report.js · assistant.js · admin.js
```

## Data
Items are held in the browser's **localStorage**, seeded with sample campus items
on first load. The move to a real PostgreSQL database happens in Iteration 3.
