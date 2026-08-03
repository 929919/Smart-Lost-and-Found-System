/* admin.js — table view with live status updates */

const STATUS_OPTIONS = ["Active", "Claimed", "Returned"];

function renderStats() {
  const s = Store.stats();
  document.getElementById("stats").innerHTML = `
    <div class="stat"><div class="num">${s.total}</div><div class="label">Total Items</div></div>
    <div class="stat s-active"><div class="num">${s.active}</div><div class="label">Active</div></div>
    <div class="stat s-claimed"><div class="num">${s.claimed}</div><div class="label">Claimed</div></div>
    <div class="stat s-returned"><div class="num">${s.returned}</div><div class="label">Returned</div></div>`;
}

function rowHTML(item) {
  const options = STATUS_OPTIONS.map(s =>
    `<option value="${s}" ${item.status === s ? "selected" : ""}>${s}</option>`).join("");
  return `
    <tr>
      <td>#${String(item.id).padStart(4, "0")}</td>
      <td>${icon(item.category)} ${escapeHTML(item.name)}</td>
      <td>${escapeHTML(item.category)}</td>
      <td><span class="badge ${item.item_type}">${item.item_type}</span></td>
      <td>${escapeHTML(item.location)}</td>
      <td>${item.shelf_tag ? escapeHTML(item.shelf_tag) : "—"}</td>
      <td>${escapeHTML(item.created_at)}</td>
      <td><select data-id="${item.id}">${options}</select></td>
    </tr>`;
}

function render() {
  renderStats();
  document.getElementById("tbody").innerHTML = Store.all().map(rowHTML).join("");
  document.querySelectorAll("td select").forEach(sel => {
    sel.onchange = () => { Store.updateStatus(sel.dataset.id, sel.value); render(); };
  });
}

document.getElementById("resetBtn").onclick = () => {
  if (confirm("Reset all items and claims back to the demo data? Your changes will be lost.")) {
    Store.reset(); Claims.reset(); render();
  }
};

DB.ready(() => { render(); DB.warnIfOffline(); });
