/* log-found.js — admin logs a found item (item_type = "found") with photo */

const form = document.getElementById("logForm");
const errorEl = document.getElementById("error");
const banner = document.getElementById("banner");

CampusMap.init({ pins: "mapPins", selected: "mapSelected", hidden: "location" });
CameraTool.init({});

// default date = today
document.getElementById("date").value = new Date().toISOString().slice(0, 10);

// Tab switching between camera / upload
document.querySelectorAll(".cam-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".cam-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".cam-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
    if (tab.dataset.tab !== "camera") CameraTool.stop(); // release camera when leaving
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.style.display = "none";

  const data = Object.fromEntries(new FormData(form).entries());
  const missing = ["name", "category"].filter(f => !data[f] || !data[f].trim());
  if (missing.length) { showError("Please fill in: " + missing.join(", ") + "."); return; }
  if (!CampusMap.getSelected()) {
    showError("Please choose where the item was found by clicking a pin on the campus map.");
    document.getElementById("mapCard").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  Store.add({
    name: data.name.trim(),
    category: data.category,
    location: CampusMap.getSelected(),
    item_type: "found",
    color: (data.color || "").trim(),
    shelf_tag: (data.shelf_tag || "").trim(),
    description: (data.description || "").trim(),
    photoUrl: CameraTool.getPhoto(),
    created_at: data.date || new Date().toISOString().slice(0, 10),
  });

  CameraTool.stop();
  banner.classList.add("show");
  banner.scrollIntoView({ behavior: "smooth", block: "center" });
  form.style.opacity = ".5";
  setTimeout(() => { window.location.href = "index.html"; }, 1300);
});

function showError(msg) { errorEl.textContent = msg; errorEl.style.display = "block"; }
