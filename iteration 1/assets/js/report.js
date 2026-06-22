/* report.js — interactive campus map location picker + validated form */

const form = document.getElementById("reportForm");
const errorEl = document.getElementById("error");
const banner = document.getElementById("banner");
const mapPins = document.getElementById("mapPins");
const selectedEl = document.getElementById("mapSelected");
const locationInput = document.getElementById("location");

let selectedArea = "";

/* --- Build clickable pins over the campus aerial --- */
function buildMap() {
  mapPins.innerHTML = CAMPUS_AREAS.map((a, i) => `
    <button type="button" class="map-pin" style="left:${a.x}%;top:${a.y}%"
            data-area="${escapeHTML(a.name)}" aria-label="Select ${escapeHTML(a.name)}">
      <span class="pin-label">${escapeHTML(a.name)}</span>
    </button>`).join("");

  mapPins.querySelectorAll(".map-pin").forEach(pin => {
    pin.addEventListener("click", () => selectArea(pin.dataset.area, pin));
  });
}

function selectArea(name, pin) {
  selectedArea = name;
  locationInput.value = name;
  mapPins.querySelectorAll(".map-pin").forEach(p => p.classList.remove("selected"));
  if (pin) pin.classList.add("selected");
  selectedEl.classList.add("has");
  selectedEl.innerHTML = `<span class="dot"></span> Selected location: <strong>${escapeHTML(name)}</strong>`;
}

/* --- Submit --- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.style.display = "none";

  const data = Object.fromEntries(new FormData(form).entries());
  const required = ["name", "category", "item_type"];
  const missing = required.filter(f => !data[f] || !data[f].trim());

  if (!selectedArea) {
    errorEl.textContent = "Please choose where the item was lost or found by clicking a pin on the campus map.";
    errorEl.style.display = "block";
    document.getElementById("mapCard").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (missing.length) {
    errorEl.textContent = "Please fill in: " + missing.join(", ") + ".";
    errorEl.style.display = "block";
    return;
  }

  Store.add({
    name: data.name.trim(),
    category: data.category,
    location: selectedArea,
    item_type: data.item_type,
    color: (data.color || "").trim(),
    shelf_tag: (data.shelf_tag || "").trim(),
    description: (data.description || "").trim(),
    contact: (data.contact || "").trim(),
  });

  banner.classList.add("show");
  banner.scrollIntoView({ behavior: "smooth", block: "center" });
  form.style.opacity = ".5";
  setTimeout(() => { window.location.href = "index.html"; }, 1300);
});

buildMap();
