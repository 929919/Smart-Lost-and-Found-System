/* item-detail.js — view one item; students can start a claim on active found items */

(function () {
  const id = new URLSearchParams(location.search).get("id");
  const item = Store.get(id);
  const user = Auth.getUser();
  const el = document.getElementById("detail");

  if (!item) {
    el.innerHTML = `<div class="empty"><div class="big">🔍</div><p>Sorry, that item could not be found.</p>
      <a href="index.html" class="btn btn--ghost" style="margin-top:14px">← Back to dashboard</a></div>`;
    return;
  }

  document.getElementById("pageTitle").textContent = item.name;

  const photo = item.photoUrl
    ? `<img src="${item.photoUrl}" alt="${escapeHTML(item.name)}" />`
    : icon(item.category);

  // Action panel depends on role + item state
  let action = "";
  if (user.role === "student") {
    if (item.item_type === "found" && item.status === "Active") {
      action = `<a class="btn btn--primary" href="submit-claim.html?id=${item.id}">🙋 This is mine — Submit a Claim</a>`;
    } else if (item.item_type === "found") {
      action = `<div class="map-selected"><span class="dot"></span> This item is currently <strong>${escapeHTML(item.status)}</strong> and can't be claimed.</div>`;
    } else {
      action = `<div class="map-selected"><span class="dot"></span> This is a <strong>lost-item report</strong>. If you found it, please hand it in to campus security.</div>`;
    }
  } else {
    // admin view: claims on this item
    const claims = Claims.forItem(item.id);
    const rows = claims.length
      ? claims.map(c => `<li><span class="k">${escapeHTML(c.claimantJcuId)}</span>
          <span><span class="badge ${c.status.toLowerCase()}">${c.status}</span> · ${escapeHTML(c.created_at)}</span></li>`).join("")
      : `<li><span class="k">Claims</span><span>None yet</span></li>`;
    action = `<h3 style="margin-bottom:10px">Claims on this item</h3>
      <ul class="detail-list">${rows}</ul>
      <a class="btn btn--ghost" href="admin-claims.html">Open Claims Review →</a>`;
  }

  el.innerHTML = `
    <div class="detail-grid">
      <div class="detail-photo">${photo}</div>
      <div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
          <span class="badge ${item.item_type}">${item.item_type}</span>
          <span class="badge ${item.status.toLowerCase()}">${item.status}</span>
        </div>
        <h2>${escapeHTML(item.name)}</h2>
        <ul class="detail-list" style="margin-top:16px">
          <li><span class="k">Reference</span><span>#${String(item.id).padStart(4, "0")}</span></li>
          <li><span class="k">Category</span><span>${icon(item.category)} ${escapeHTML(item.category)}</span></li>
          <li><span class="k">Location</span><span>📍 ${escapeHTML(item.location)}</span></li>
          ${item.color ? `<li><span class="k">Colour</span><span>${escapeHTML(item.color)}</span></li>` : ""}
          ${item.shelf_tag ? `<li><span class="k">Storage</span><span>📦 Shelf ${escapeHTML(item.shelf_tag)}</span></li>` : ""}
          <li><span class="k">Date</span><span>🗓️ ${escapeHTML(item.created_at)}</span></li>
          ${item.description ? `<li><span class="k">Description</span><span>${escapeHTML(item.description)}</span></li>` : ""}
        </ul>
        ${action}
        <div style="margin-top:18px"><a href="index.html" class="btn btn--ghost btn--sm">← Back to dashboard</a></div>
      </div>
    </div>`;
})();
