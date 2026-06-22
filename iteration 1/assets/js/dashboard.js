/* dashboard.js — stats, filters and the item grid */

const CATEGORIES = ["All", "Electronics", "Accessories", "Clothing", "Documents", "Keys", "Other"];
const STATUSES = ["All", "Active", "Claimed", "Returned"];
const state = { search: "", category: "All", status: "Active" };

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
    <article class="card">
      <div class="card__media cat-${item.category}">
        ${icon(item.category)}
        <span class="type-tag">${item.item_type}</span>
      </div>
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
    </article>`;
}

function render() {
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

render();
