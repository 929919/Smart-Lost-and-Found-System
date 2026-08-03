/* dashboard.js — stats, filters and the item grid (shared by students & admins) */

const CATEGORIES = ["All", "Electronics", "Accessories", "Clothing", "Documents", "Keys", "Other"];
const STATUSES = ["All", "Active", "Claimed", "Returned"];
const state = { search: "", category: "All", status: "Active" };

/* Role-aware call-to-action buttons */
(function setupCta() {
  const user = (window.Auth && Auth.getUser()) || { role: "student" };
  const primary = document.getElementById("primaryCta");
  const link = document.getElementById("ctaLink");
  const title = document.getElementById("ctaTitle");
  const text = document.getElementById("ctaText");
  if (user.role === "admin") {
    if (primary) { primary.href = "log-found.html"; primary.textContent = "＋ Log a Found Item"; }
    if (link) { link.href = "log-found.html"; link.textContent = "Log a Found Item →"; }
    if (title) title.textContent = "An item was handed in?";
    if (text) text.textContent = "Log it with a photo so its owner can find and claim it.";
  } else {
    if (primary) { primary.href = "report-lost.html"; primary.textContent = "＋ Report a Lost Item"; }
    if (link) { link.href = "report-lost.html"; }
  }
})();

/* Story 5.3 — surface auto-matched found items for the student's lost reports */
function renderMatchAlerts() {
  const host = document.getElementById("matchAlerts");
  if (!host || typeof Matcher === "undefined") return;

  const user = (window.Auth && Auth.getUser()) || null;
  if (!user || user.role !== "student") { host.innerHTML = ""; return; }

  const groups = Matcher.matchesForUser(user.jcuId);
  if (!groups.length) { host.innerHTML = ""; return; }

  const total = groups.reduce((n, g) => n + g.matches.length, 0);
  host.innerHTML = `
    <div class="match-alert">
      <div class="match-alert__head">
        <span class="ic">🔔</span>
        <div>
          <h3>${total} possible ${total === 1 ? "match" : "matches"} for your lost ${groups.length === 1 ? "item" : "items"}</h3>
          <p>We compared your lost reports against items handed in to campus security.</p>
        </div>
      </div>
      ${groups.map(g => `
        <div class="match-group">
          <div class="match-group__lost">You lost: <strong>${escapeHTML(g.lost.name)}</strong></div>
          ${g.matches.map(m => `
            <a class="match-row" href="item-detail.html?id=${m.item.id}">
              <span class="match-row__ic">${icon(m.item.category)}</span>
              <span class="match-row__body">
                <strong>${escapeHTML(m.item.name)}</strong>
                <small>📍 ${escapeHTML(m.item.location)} · ${escapeHTML(m.reasons.join(" · "))}</small>
              </span>
              <span class="match-row__cta">View &amp; claim →</span>
            </a>`).join("")}
        </div>`).join("")}
    </div>`;
}

function renderStats() {
  const s = Store.stats();
  document.getElementById("stats").innerHTML = `
    <div class="stat"><div class="num">${s.total}</div><div class="label">Total Items</div></div>
    <div class="stat s-active"><div class="num">${s.active}</div><div class="label">Active</div></div>
    <div class="stat s-claimed"><div class="num">${s.claimed}</div><div class="label">Claimed</div></div>
    <div class="stat s-returned"><div class="num">${s.returned}</div><div class="label">Returned</div></div>`;
}

function renderFilters() {
  document.getElementById("categoryFilters").innerHTML =
    `<span class="filter-label">Category:</span>` +
    CATEGORIES.map(c => `<button class="chip ${state.category === c ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
  document.getElementById("statusFilters").innerHTML =
    `<span class="filter-label">Status:</span>` +
    STATUSES.map(s => `<button class="chip ${state.status === s ? "active" : ""}" data-status="${s}">${s}</button>`).join("");
  document.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { state.category = b.dataset.cat; render(); });
  document.querySelectorAll("[data-status]").forEach(b => b.onclick = () => { state.status = b.dataset.status; render(); });
}

function cardHTML(item) {
  return `
    <a class="card" href="item-detail.html?id=${item.id}">
      ${itemMedia(item)}
      <div class="card__body">
        <div class="card__title">${escapeHTML(item.name)}</div>
        <div class="card__meta">
          <span>🏷️ ${escapeHTML(item.category)}</span>
          <span>📍 ${escapeHTML(item.location)}</span>
          ${item.shelf_tag ? `<span>📦 Shelf ${escapeHTML(item.shelf_tag)}</span>` : ""}
          <span>🗓️ ${escapeHTML(item.created_at)}</span>
        </div>
        <div class="card__foot">
          <span class="badge ${item.status.toLowerCase()}">${item.status}</span>
          <span class="card__id">#${String(item.id).padStart(4, "0")}</span>
        </div>
      </div>
    </a>`;
}

function render() {
  renderMatchAlerts();
  renderStats();
  renderFilters();
  let items = Store.all();
  if (state.category !== "All") items = items.filter(i => i.category === state.category);
  if (state.status !== "All") items = items.filter(i => i.status === state.status);
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.description || "").toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q));
  }
  const grid = document.getElementById("grid");
  grid.innerHTML = items.length
    ? items.map(cardHTML).join("")
    : `<div class="empty"><div class="big">🔍</div><p>No items match your filters. Try a different search or category.</p></div>`;
}

["search", "heroSearch"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", e => {
    state.search = e.target.value;
    const other = document.getElementById(id === "search" ? "heroSearch" : "search");
    if (other) other.value = e.target.value;
    render();
  });
});

DB.ready(() => { render(); DB.warnIfOffline(); });
