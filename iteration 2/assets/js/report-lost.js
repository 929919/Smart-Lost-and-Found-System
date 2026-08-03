/* report-lost.js — student reports a lost item (item_type = "lost") */

const form = document.getElementById("reportForm");
const errorEl = document.getElementById("error");
const banner = document.getElementById("banner");

CampusMap.init({ pins: "mapPins", selected: "mapSelected", hidden: "location" });

// Pre-fill contact + default date
(function prefill() {
  const user = Auth.getUser();
  const contact = document.getElementById("contact");
  if (user && contact) contact.value = user.jcuId + "@my.jcu.edu.au";
  const date = document.getElementById("date");
  if (date) date.value = new Date().toISOString().slice(0, 10);
})();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.style.display = "none";

  const data = Object.fromEntries(new FormData(form).entries());
  if (!CampusMap.getSelected()) {
    showError("Please choose where you last had the item by clicking a pin on the campus map.");
    document.getElementById("mapCard").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const missing = ["name", "category"].filter(f => !data[f] || !data[f].trim());
  if (missing.length) { showError("Please fill in: " + missing.join(", ") + "."); return; }

  Store.add({
    name: data.name.trim(),
    category: data.category,
    location: CampusMap.getSelected(),
    item_type: "lost",
    color: (data.color || "").trim(),
    description: (data.description || "").trim(),
    contact: (data.contact || "").trim(),
    reported_by: (Auth.getUser() || {}).jcuId || "",
    created_at: data.date || new Date().toISOString().slice(0, 10),
  });

  banner.classList.add("show");
  banner.scrollIntoView({ behavior: "smooth", block: "center" });
  form.style.opacity = ".5";
  setTimeout(() => { window.location.href = "index.html"; }, 1300);
});

function showError(msg) { errorEl.textContent = msg; errorEl.style.display = "block"; }
