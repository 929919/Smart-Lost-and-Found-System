/* admin-dashboard.js — admin landing: stats strip + pending-claims badge */

DB.ready(function () {
  const user = Auth.getUser();
  if (user) document.getElementById("welcome").textContent = "Welcome, " + user.jcuId;

  const s = Store.stats();
  const c = Claims.counts();

  document.getElementById("stats").innerHTML = statsCards([
    { value: s.activeFound, label: "Active Found Items", tone: "active"   },
    { value: c.pending,     label: "Pending Claims",     tone: "claimed"  },
    { value: s.returned,    label: "Returned Items",     tone: "returned" },
    { value: s.total,       label: "Total Items" },
  ]);

  const badge = document.getElementById("claimBadge");
  if (c.pending > 0) { badge.textContent = c.pending; badge.style.display = "grid"; }
});
