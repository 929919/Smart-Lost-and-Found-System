/* admin-dashboard.js — admin landing: stats strip + pending-claims badge */

DB.ready(function () {
  const user = Auth.getUser();
  if (user) document.getElementById("welcome").textContent = "Welcome, " + user.jcuId;

  const s = Store.stats();
  const c = Claims.counts();

  document.getElementById("stats").innerHTML = `
    <div class="stat s-active"><div class="num">${s.activeFound}</div><div class="label">Active Found Items</div></div>
    <div class="stat s-claimed"><div class="num">${c.pending}</div><div class="label">Pending Claims</div></div>
    <div class="stat s-returned"><div class="num">${s.returned}</div><div class="label">Returned Items</div></div>
    <div class="stat"><div class="num">${s.total}</div><div class="label">Total Items</div></div>`;

  const badge = document.getElementById("claimBadge");
  if (c.pending > 0) { badge.textContent = c.pending; badge.style.display = "grid"; }
});
