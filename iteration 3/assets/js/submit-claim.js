/* submit-claim.js — student submits proof-of-ownership claim on a found item */

(function () {
  const id = new URLSearchParams(location.search).get("id");
  const item = Store.get(id);
  const user = Auth.getUser();
  const area = document.getElementById("claimArea");

  if (!item || item.item_type !== "found" || item.status !== "Active") {
    area.innerHTML = `<div class="empty"><div class="big">⚠️</div>
      <p>This item is not available to claim.</p>
      <a href="index.html" class="btn btn--ghost" style="margin-top:14px">← Back to dashboard</a></div>`;
    return;
  }

  const photo = item.photoUrl
    ? `<div class="claim-thumb"><img src="${item.photoUrl}" alt=""></div>`
    : `<div class="claim-thumb">${icon(item.category)}</div>`;

  area.innerHTML = `
    <div class="panel">
      <div class="claim-card" style="box-shadow:none;border:none;padding:0;margin-bottom:18px">
        ${photo}
        <div class="claim-body">
          <h3>${escapeHTML(item.name)}</h3>
          <div class="claim-meta">
            <span>🏷️ ${escapeHTML(item.category)}</span>
            <span>📍 ${escapeHTML(item.location)}</span>
            <span>#${String(item.id).padStart(4, "0")}</span>
          </div>
          ${item.description ? `<div class="claim-proof">${escapeHTML(item.description)}</div>` : ""}
        </div>
      </div>

      <form id="claimForm" novalidate>
        <div class="field full" style="margin-bottom:16px">
          <label for="claimant">Your JCU ID</label>
          <input id="claimant" type="text" value="${escapeHTML(user.jcuId)}" readonly />
        </div>
        <div class="field full" style="margin-bottom:16px">
          <label for="proof">Proof of ownership <span class="req">*</span></label>
          <textarea id="proof" placeholder="Describe unique details only the owner would know — contents, marks, serial numbers, what's on the lock screen…" required></textarea>
          <span class="hint">This helps the admin verify the item is really yours.</span>
        </div>
        <div class="field full" style="margin-bottom:16px">
          <label for="contact">Contact <span class="hint">(so we can reach you)</span></label>
          <input id="contact" type="text" value="${escapeHTML(user.jcuId)}@my.jcu.edu.au" />
        </div>
        <p class="form-error" id="error"></p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button type="submit" class="btn btn--primary">Submit Claim</button>
          <a href="item-detail.html?id=${item.id}" class="btn btn--ghost">Cancel</a>
        </div>
      </form>
    </div>`;

  const form = document.getElementById("claimForm");
  const errorEl = document.getElementById("error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.style.display = "none";
    const proof = document.getElementById("proof").value.trim();
    if (!proof) { errorEl.textContent = "Please describe your proof of ownership."; errorEl.style.display = "block"; return; }

    Claims.add({
      itemId: item.id,
      claimantJcuId: user.jcuId,
      proof: proof,
      contact: document.getElementById("contact").value.trim(),
    });

    document.getElementById("banner").classList.add("show");
    form.style.opacity = ".5";
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => { window.location.href = "item-detail.html?id=" + item.id; }, 1500);
  });
})();
