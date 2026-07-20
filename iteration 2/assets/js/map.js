/* map.js — shared interactive campus-map location picker.
   Renders clickable pins (from CAMPUS_AREAS in store.js) over the
   aerial and reports the chosen area. Used by report-lost & log-found. */

const CampusMap = {
  selected: "",

  init(opts) {
    const pinsEl    = document.getElementById(opts.pins);
    const selectedEl = document.getElementById(opts.selected);
    const hidden    = document.getElementById(opts.hidden);
    const self = this;

    pinsEl.innerHTML = CAMPUS_AREAS.map(a => `
      <button type="button" class="map-pin" style="left:${a.x}%;top:${a.y}%"
              data-area="${escapeHTML(a.name)}" aria-label="Select ${escapeHTML(a.name)}">
        <span class="pin-label">${escapeHTML(a.name)}</span>
      </button>`).join("");

    pinsEl.querySelectorAll(".map-pin").forEach(pin => {
      pin.addEventListener("click", () => {
        self.selected = pin.dataset.area;
        if (hidden) hidden.value = self.selected;
        pinsEl.querySelectorAll(".map-pin").forEach(p => p.classList.remove("selected"));
        pin.classList.add("selected");
        if (selectedEl) {
          selectedEl.classList.add("has");
          selectedEl.innerHTML = `<span class="dot"></span> Selected location: <strong>${escapeHTML(self.selected)}</strong>`;
        }
      });
    });
    return this;
  },

  getSelected() { return this.selected; },
};
