/* admin-claims.js — review/approve/reject claims, mark returned */

const FILTERS = ["All", "Pending", "Approved", "Rejected", "Returned"];
let claimFilter = "All";

function renderCounters() {
  const c = Claims.counts();
  document.getElementById("counters").innerHTML = `
    <div class="stat"><div class="num">${c.total}</div><div class="label">Total Claims</div></div>
    <div class="stat s-returned"><div class="num">${c.pending}</div><div class="label">Pending</div></div>
    <div class="stat s-claimed"><div class="num">${c.approved}</div><div class="label">Approved</div></div>
    <div class="stat s-active"><div class="num">${c.returned}</div><div class="label">Returned</div></div>`;
}

function renderFilters() {
  document.getElementById("claimFilters").innerHTML =
    `<span class="filter-label">Show:</span>` +
    FILTERS.map(f => `<button class="chip ${claimFilter === f ? "active" : ""}" data-f="${f}">${f}</button>`).join("");
  document.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { claimFilter = b.dataset.f; render(); });
}

function actionsFor(claim) {
  if (claim.status === "Pending")
    return `<button class="btn btn--ok btn--sm" data-act="approve" data-id="${claim.id}">✓ Approve</button>
            <button class="btn btn--danger btn--sm" data-act="reject" data-id="${claim.id}">✕ Reject</button>`;
  if (claim.status === "Approved")
    return `<button class="btn btn--primary btn--sm" data-act="return" data-id="${claim.id}">📦 Mark as Returned</button>`;
  return `<span class="badge ${claim.status.toLowerCase()}">${claim.status}</span>`;
}

function claimCardHTML(claim) {
  const item = Store.get(claim.itemId) || { name: "(item removed)", category: "Other", location: "—", photoUrl: "", description: "" };
  const thumb = item.photoUrl
    ? `<div class="claim-thumb"><img src="${item.photoUrl}" alt=""></div>`
    : `<div class="claim-thumb">${icon(item.category)}</div>`;
  return `
    <div class="claim-card">
      ${thumb}
      <div class="claim-body">
        <h3>${escapeHTML(item.name)} <span class="badge ${claim.status.toLowerCase()}">${claim.status}</span></h3>
        <div class="claim-meta">
          <span>🙋 Claimant: <strong>${escapeHTML(claim.claimantJcuId)}</strong></span>
          <span>📍 ${escapeHTML(item.location)}</span>
          <span>🏷️ ${escapeHTML(item.category)}</span>
          <span>#${String(item.id).padStart(4, "0")}</span>
        </div>
        <div class="claim-meta">
          <span>🗓️ Submitted ${escapeHTML(claim.created_at)}</span>
          <span>🔄 Updated ${escapeHTML(claim.updated_at)}</span>
          ${claim.contact ? `<span>✉️ ${escapeHTML(claim.contact)}</span>` : ""}
        </div>
        <div class="claim-proof"><span class="lbl">Proof of ownership</span>${escapeHTML(claim.proof)}</div>
      </div>
      <div class="claim-actions">${actionsFor(claim)}</div>
    </div>`;
}

function render() {
  renderCounters();
  renderFilters();
  let claims = Claims.all();
  if (claimFilter !== "All") claims = claims.filter(c => c.status === claimFilter);

  const list = document.getElementById("claimList");
  list.innerHTML = claims.length
    ? claims.map(claimCardHTML).join("")
    : `<div class="empty"><div class="big">📋</div><p>No ${claimFilter === "All" ? "" : claimFilter.toLowerCase() + " "}claims to show.</p></div>`;

  list.querySelectorAll("[data-act]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (btn.dataset.act === "approve") Claims.approve(id);
      else if (btn.dataset.act === "reject") Claims.reject(id);
      else if (btn.dataset.act === "return") Claims.markReturned(id);
      render();
      refreshNavBadge();
    };
  });
}

function refreshNavBadge() {
  const badge = document.querySelector(".mainnav .nav-badge");
  const pending = Claims.counts().pending;
  if (badge) {
    if (pending > 0) badge.textContent = pending;
    else badge.remove();
  }
}

render();
