# Diagram Build Specs

← [Back to documentation home](README.md)

The assessment requires the design diagrams to be produced in **online tools**:

> *"Architectural design. **Must use** online UML diagram tool, e.g. Gliffy."*
> *"Database designs. **Must use** online tool, e.g. GenMyModel."*
> *"Interface design. **Must use** prototyping tool, e.g. NinjaMock."*

There are two ways to satisfy this. Note the rubric says *"**e.g.** Gliffy"* — the
named tools are **examples**; the requirement is to use *an* online diagramming
tool.

---

## ⚡ Fast path — import the ready-made file (about 10 minutes)

A complete draw.io file containing all three diagrams is in this repository:
**[`diagrams/smart-lost-found-diagrams.drawio`](diagrams/smart-lost-found-diagrams.drawio)**

1. Go to **<https://app.diagrams.net>** (draw.io — free, online, no sign-up)
2. Choose **Open Existing Diagram** → select the `.drawio` file
   *(or File → Import from → Device)*
3. Three tabs appear along the bottom:
   **1. Architecture (UML)** · **2. Database ER** · **3. UI Design**
4. Adjust anything you want — it is fully editable, so make it yours
5. For each tab: **File → Export as → PNG…**, save into `docs/img/` as
   `architecture.png`, `database-er.png`, `ui-design.png`
6. **File → Save as → Device** to keep your edited copy, and optionally
   **File → Share** for a link to paste into [design.md](design.md)

> Editing the diagrams yourself is worthwhile — you should be able to explain
> every box if you are asked about it.

---

## 🎯 Thorough path — build them in the named tools

If you would rather use Gliffy, GenMyModel and NinjaMock specifically, the
sections below specify every box, column and screen element so it is
transcription rather than design work.

---

## 1️⃣ Gliffy — Architecture (UML Component/Deployment diagram)

**Tool:** <https://www.gliffy.com/uses/uml-software/> → new diagram → *UML* shapes
**Export as:** `docs/img/architecture-gliffy.png`

### Boxes to create

| # | Shape | Label | Group / container |
|---|-------|-------|-------------------|
| 1 | Actor (stick figure) | `Student` | — |
| 2 | Actor (stick figure) | `Admin (Campus Security)` | — |
| 3 | Component | `Web Client (HTML · CSS · Vanilla JS)` | **Browser** |
| 4 | Component | `Pages: login · dashboard · report-lost · log-found · item-detail · submit-claim · admin-*` | inside Browser |
| 5 | Component | `Modules: auth.js · store.js · map.js · camera.js · matching.js · main.js` | inside Browser |
| 6 | Node | `Vercel — Static Hosting / CDN` | **Cloud** |
| 7 | Database (cylinder) | `Supabase — PostgreSQL + REST API + Row-Level Security` | **Cloud** |
| 8 | Component | `MediaDevices API (device camera)` | inside Browser |

### Connectors (arrows)

| From → To | Label | Style |
|-----------|-------|-------|
| Student → Vercel | `HTTPS` | solid arrow |
| Admin → Vercel | `HTTPS` | solid arrow |
| Vercel → Web Client | `serves static files` | solid arrow |
| Pages → Modules | `uses` | dashed arrow |
| Modules → Supabase | `supabase-js SDK (SELECT / INSERT / UPDATE)` | solid arrow, **bold** |
| camera.js → MediaDevices API | `getUserMedia()` | dashed arrow |

### Layout tip
Two actors on the left → **Browser** container in the middle → **Cloud** container
on the right. Draw the Modules → Supabase arrow as the thickest line; it is the
key architectural relationship.

### Caption to add underneath
> A static browser client talks directly to a managed PostgreSQL database via the
> Supabase SDK, with no server of our own to maintain. Row-Level Security enforces
> access rules at the database tier.

---

## 2️⃣ GenMyModel — Database ER diagram

**Tool:** <https://www.genmymodel.com/database-diagram-online>
**Export as:** `docs/img/database-genmymodel.png`
**Source of truth:** [`iteration 3/db/schema.sql`](../iteration%203/db/schema.sql)

### Table 1 — `items`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | BIGSERIAL | **PK** |
| `name` | TEXT | NOT NULL |
| `category` | TEXT | NOT NULL · CHECK ∈ {Electronics, Accessories, Clothing, Documents, Keys, Other} |
| `location` | TEXT | NOT NULL |
| `item_type` | TEXT | NOT NULL · CHECK ∈ {found, lost} |
| `description` | TEXT | DEFAULT '' |
| `color` | TEXT | DEFAULT '' |
| `contact` | TEXT | DEFAULT '' |
| `shelf_tag` | TEXT | DEFAULT '' |
| `status` | TEXT | NOT NULL · DEFAULT 'Active' · CHECK ∈ {Active, Claimed, Returned} |
| `photo_url` | TEXT | DEFAULT '' |
| `reported_by` | TEXT | DEFAULT '' |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |

### Table 2 — `claims`

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | BIGSERIAL | **PK** |
| `item_id` | BIGINT | **FK → items(id)** · NOT NULL · ON DELETE CASCADE |
| `claimant_jcu_id` | TEXT | NOT NULL |
| `proof` | TEXT | NOT NULL · DEFAULT '' |
| `contact` | TEXT | DEFAULT '' |
| `status` | TEXT | NOT NULL · DEFAULT 'Pending' · CHECK ∈ {Pending, Approved, Rejected, Returned} |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() |

### Relationship
```
items (1) ──────< (0..*) claims
```
One item can receive many claims; every claim belongs to exactly one item.
Cardinality label: `1 : 0..*` — **"receives"**.

### Caption to add underneath
> Normalised relational design. Enum-like values are enforced by `CHECK`
> constraints rather than application code, so invalid data cannot enter the
> database. Row-Level Security is enabled on both tables with no `DELETE` policy,
> so records can be retired by status but never destroyed from the client.

---

## 3️⃣ NinjaMock — UI prototype

**Tool:** <https://ninjamock.com/> → new project → *Web* → **Desktop** size
**Export as:** `docs/img/ui-ninjamock-<screen>.png` (one per screen)
**Do these 5 screens** (they cover both roles and the headline feature):

### Screen A — Login
- JCU logo, centred, top
- Heading: `Lost & Found Sign in`
- Text input, label `JCU ID`, placeholder `jc123456`
- Label: `I am a…`
- **Two selectable cards side by side:** `🎓 Student` and `🛡️ Admin`
- Primary button, full width: `Sign in →`

### Screen B — Dashboard (Student)
- Top utility bar: `📍 Singapore Campus` … right: `Logged in as jc111111 [STUDENT]` `Logout`
- Header: JCU logo left · nav right: `Dashboard | Report Lost Item | Assistant`
- Hero banner with campus photo, title `Lost & Found`
- Search bar + `＋ Report a Lost Item` button
- **🔔 Match alert box:** *"1 possible match for your lost item"* with one result row
- 4 stat cards: `Total | Active | Claimed | Returned`
- Filter chips: category row + status row
- Grid of 6 item cards (image area, title, category, location, status badge)

### Screen C — Report Lost Item
- Panel 1 titled `📍 Step 1 — Where did you last have it?` containing a campus map
  image with **9 circular pins**; one pin highlighted + caption
  `Selected location: Library`
- Panel 2 titled `📝 Step 2 — Item details`: inputs for Item name*, Category
  (dropdown), Colour, Date lost, Contact, Description (textarea)
- Buttons: `Submit Lost Report` (primary) · `Cancel` (secondary)

### Screen D — Log Found Item (Admin, camera)
- Two tabs: `📸 Take Photo` | `📁 Upload File`
- Camera preview rectangle (dark) with buttons `Start Camera`, `📸 Capture`, `↺ Retake`
- Item detail fields: name, category, date found, storage/shelf tag, colour, description
- Campus map picker (same as Screen C)
- Button: `Log Found Item`

### Screen E — Admin Claims Review
- 4 counter cards: `Total Claims | Pending | Approved | Returned`
- Filter chips: `All | Pending | Approved | Rejected | Returned`
- **Claim card**: item thumbnail left · middle: item name + `PENDING` badge,
  claimant `jc123456`, location, dates, and a boxed `PROOF OF OWNERSHIP` quote ·
  right: buttons `✓ Approve` (green) and `✕ Reject` (red)

### Caption to add underneath
> Wireframes were produced before implementation and drove the final build. The
> delivered interface follows JCU Singapore branding: brand blue `#0079c1`,
> gold `#f6a800`, serif headings and card-based layouts.

---

## ✅ After building the three diagrams

1. Export each as **PNG** into `docs/img/`
2. In [design.md](design.md), replace the three `_add link_` placeholders with the
   tool share links
3. Embed the images, e.g.
   ```markdown
   ![Architecture diagram](img/architecture-gliffy.png)
   ```
4. Keep the existing Mermaid diagrams as well — they render inline on GitHub and
   show the design is version-controlled alongside the code.
