/* ============================================================
   store.js — shared data layer (localStorage, no server)
   Iteration 2: adds a Claims model + photoUrl on items.
   ============================================================ */

const STORE_KEY  = "slf_jcu_items_v2";
const CLAIMS_KEY = "slf_jcu_claims_v1";

const CATEGORY_ICONS = {
  Electronics: "💻", Accessories: "👜", Clothing: "🧥",
  Documents: "📄", Keys: "🔑", Other: "📦",
};

/* Campus areas — shared by seed data and the interactive map.
   x / y are percentages over the campus aerial (jcu_layout.png). */
const CAMPUS_AREAS = [
  { name: "Main Entrance & Atrium", x: 46, y: 50 },
  { name: "Library",               x: 19, y: 45 },
  { name: "Food Court / Canteen",  x: 33, y: 31 },
  { name: "Sports Courts",         x: 82, y: 22 },
  { name: "Sports Field",          x: 56, y: 13 },
  { name: "Lecture Theatres",      x: 69, y: 41 },
  { name: "Car Park",              x: 44, y: 82 },
  { name: "Link Bridge / Walkway", x: 59, y: 62 },
  { name: "Student Lounge",        x: 27, y: 64 },
];

const SEED_ITEMS = [
  { id: 1, name: "Apple AirPods Pro",    category: "Electronics", location: "Library",               item_type: "found", description: "White case with a small scratch", color: "White", shelf_tag: "A-04", status: "Active",   photoUrl: "", created_at: "2026-05-28" },
  { id: 2, name: "Black leather wallet", category: "Accessories", location: "Food Court / Canteen",   item_type: "found", description: "Contains some cards, no cash", color: "Black", shelf_tag: "B-12", status: "Active",   photoUrl: "", created_at: "2026-05-29" },
  { id: 3, name: "JCU Hoodie — size M",  category: "Clothing",    location: "Lecture Theatres",      item_type: "found", description: "Dark blue, JCU logo on front", color: "Blue",  shelf_tag: "C-02", status: "Active",   photoUrl: "", created_at: "2026-05-30" },
  { id: 4, name: "Samsung Galaxy S25",   category: "Electronics", location: "Food Court / Canteen",   item_type: "found", description: "Black phone, cracked screen",  color: "Black", shelf_tag: "A-07", status: "Claimed",  photoUrl: "", created_at: "2026-05-25" },
  { id: 5, name: "Student ID card",      category: "Documents",   location: "Main Entrance & Atrium", item_type: "found", description: "Name partially visible",       color: "",      shelf_tag: "D-01", status: "Active",   photoUrl: "", created_at: "2026-05-31" },
  { id: 6, name: "Nike running cap",     category: "Clothing",    location: "Sports Courts",         item_type: "found", description: "Red and black, size L",        color: "Red",   shelf_tag: "C-08", status: "Active",   photoUrl: "", created_at: "2026-06-01" },
  { id: 7, name: "MacBook Pro 14\"",     category: "Electronics", location: "Lecture Theatres",      item_type: "found", description: "Space grey, sticker on lid",   color: "Grey",  shelf_tag: "A-01", status: "Claimed",  photoUrl: "", created_at: "2026-05-22" },
  { id: 8, name: "Blue umbrella",        category: "Accessories", location: "Car Park",              item_type: "found", description: "Foldable, blue handle",        color: "Blue",  shelf_tag: "",     status: "Returned", photoUrl: "", created_at: "2026-05-20" },
  { id: 9, name: "Set of car keys",      category: "Keys",        location: "Car Park",              item_type: "found", description: "Toyota key with a red tag",    color: "",      shelf_tag: "E-03", status: "Active",   photoUrl: "", created_at: "2026-06-02" },
  { id: 10, name: "Water bottle (Frank Green)", category: "Other", location: "Sports Field",         item_type: "found", description: "Mint green, 1L insulated",     color: "Green", shelf_tag: "F-05", status: "Active",   photoUrl: "", created_at: "2026-06-02" },
];

const SEED_CLAIMS = [
  { id: 1, itemId: 2, claimantJcuId: "jc123456", proof: "It's my wallet — brown stitching inside and my student concession card is in the front slot.", contact: "jc123456@my.jcu.edu.au", status: "Pending",  created_at: "2026-06-03", updated_at: "2026-06-03" },
  { id: 2, itemId: 4, claimantJcuId: "jc222333", proof: "Cracked top-right corner, lock screen is a photo of a husky. IMEI ends 7741.",                  contact: "jc222333@my.jcu.edu.au", status: "Approved", created_at: "2026-05-26", updated_at: "2026-05-27" },
];

/* ---------------- Items ---------------- */
const Store = {
  load() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) { localStorage.setItem(STORE_KEY, JSON.stringify(SEED_ITEMS)); return [...SEED_ITEMS]; }
    try { return JSON.parse(raw); } catch { return [...SEED_ITEMS]; }
  },
  save(items) { localStorage.setItem(STORE_KEY, JSON.stringify(items)); },
  all() { return this.load().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")); },
  get(id) { return this.load().find(i => i.id === Number(id)) || null; },
  add(item) {
    const items = this.load();
    const id = items.reduce((m, i) => Math.max(m, i.id), 0) + 1;
    const record = { id, status: "Active", created_at: new Date().toISOString().slice(0, 10),
      description: "", color: "", contact: "", shelf_tag: "", photoUrl: "", ...item };
    items.push(record); this.save(items); return record;
  },
  updateStatus(id, status) {
    const items = this.load();
    const item = items.find(i => i.id === Number(id));
    if (item) { item.status = status; this.save(items); }
    return item;
  },
  stats() {
    const items = this.load();
    return {
      total: items.length,
      active: items.filter(i => i.status === "Active").length,
      claimed: items.filter(i => i.status === "Claimed").length,
      returned: items.filter(i => i.status === "Returned").length,
      activeFound: items.filter(i => i.item_type === "found" && i.status === "Active").length,
    };
  },
  reset() { localStorage.removeItem(STORE_KEY); },
};

/* ---------------- Claims ---------------- */
const Claims = {
  load() {
    const raw = localStorage.getItem(CLAIMS_KEY);
    if (!raw) { localStorage.setItem(CLAIMS_KEY, JSON.stringify(SEED_CLAIMS)); return [...SEED_CLAIMS]; }
    try { return JSON.parse(raw); } catch { return [...SEED_CLAIMS]; }
  },
  save(claims) { localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims)); },
  all() { return this.load().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")); },
  forItem(itemId) { return this.load().filter(c => c.itemId === Number(itemId)); },
  add(claim) {
    const claims = this.load();
    const id = claims.reduce((m, c) => Math.max(m, c.id), 0) + 1;
    const today = new Date().toISOString().slice(0, 10);
    const record = { id, status: "Pending", created_at: today, updated_at: today, contact: "", ...claim };
    claims.push(record); this.save(claims); return record;
  },
  update(id, patch) {
    const claims = this.load();
    const c = claims.find(x => x.id === Number(id));
    if (c) { Object.assign(c, patch, { updated_at: new Date().toISOString().slice(0, 10) }); this.save(claims); }
    return c;
  },
  /* Workflow helpers (also move the linked item's status) */
  approve(id) { const c = this.update(id, { status: "Approved" }); if (c) Store.updateStatus(c.itemId, "Claimed"); return c; },
  reject(id)  { return this.update(id, { status: "Rejected" }); },
  markReturned(id) { const c = this.update(id, { status: "Returned" }); if (c) Store.updateStatus(c.itemId, "Returned"); return c; },
  counts() {
    const cs = this.load();
    return {
      total: cs.length,
      pending: cs.filter(c => c.status === "Pending").length,
      approved: cs.filter(c => c.status === "Approved").length,
      rejected: cs.filter(c => c.status === "Rejected").length,
      returned: cs.filter(c => c.status === "Returned").length,
    };
  },
  reset() { localStorage.removeItem(CLAIMS_KEY); },
};

/* ---------------- Helpers ---------------- */
function icon(category) { return CATEGORY_ICONS[category] || "📦"; }

function escapeHTML(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Media block for an item: photo if present, else category gradient + icon */
function itemMedia(item, extraClass) {
  if (item.photoUrl) {
    return `<div class="card__media has-photo ${extraClass || ""}" style="background-image:url('${item.photoUrl}')">
      <span class="type-tag">${escapeHTML(item.item_type)}</span></div>`;
  }
  return `<div class="card__media cat-${item.category} ${extraClass || ""}">${icon(item.category)}
    <span class="type-tag">${escapeHTML(item.item_type)}</span></div>`;
}
