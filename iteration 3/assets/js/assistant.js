/* assistant.js — role-aware rule-based assistant (story 2.2)

   Students and administrators use the Lost & Found for opposite purposes, so
   the assistant answers each role differently:
     • students ask how to recover an item they lost
     • administrators ask how to run the register and what needs attention
   Administrator answers are backed by live counts from the database. */

const log = document.getElementById("log");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const suggestionsEl = document.getElementById("suggestions");

const ROLE = ((window.Auth && Auth.getUser()) || {}).role === "admin" ? "admin" : "student";

const CONFIG = {
  student: {
    greeting: "👋 Hi! I'm the JCU Lost & Found assistant. Ask me where to collect an item, how long we keep things, or just describe what you've lost and I'll search our records.",
    suggestions: [
      "Where do I collect my item?",
      "How long are items kept?",
      "What's the claim policy?",
      "I lost my AirPods",
    ],
  },
  admin: {
    greeting: "🛡️ Admin assistant ready. Ask me what needs attention, how to log a found item, or how the claim approval process works.",
    suggestions: [
      "What needs my attention?",
      "How do I log a found item?",
      "How do I approve a claim?",
      "What's the retention policy?",
    ],
  },
};

function addMessage(text, who, extraHTML = "") {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.innerHTML = escapeHTML(text) + extraHTML;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

const has = (m, words) => words.some(w => m.includes(w));

/* ---------------- Student intents ---------------- */
function studentReply(m) {
  if (has(m, ["collect", "pick up", "pickup", "retrieve", "where do i", "office", "opening", "hours"]))
    return { text: "Found items are held at the Campus Security Office (Main Entrance & Atrium, ground floor), open Mon–Sat 8am–6pm. Bring your JCU student ID to collect." };

  if (has(m, ["how long", "days", "keep", "kept", "storage", "expire", "30"]))
    return { text: "Items are kept for 30 days from the date they are logged. Unclaimed items are then donated to charity. If we have your contact details we'll email you a reminder first." };

  if (has(m, ["policy", "rules", "procedure", "claim", "prove", "proof"]))
    return { text: "To claim an item: (1) find it on the dashboard, (2) open it and choose \"This is mine — Submit a Claim\", (3) describe something only the owner would know as proof of ownership, (4) an administrator reviews it and, once approved, you collect it from the Security Office with your JCU ID." };

  if (has(m, ["report", "lost my", "i lost", "how do i report"]) && has(m, ["report", "how"]))
    return { text: "Use \"Report Lost Item\" in the menu. Pin where you last had it on the campus map and describe it — the system then automatically checks your report against every item handed in, and shows you any likely matches on your dashboard." };

  return searchItems(m, "student");
}

/* ---------------- Admin intents ---------------- */
function adminReply(m) {
  if (has(m, ["attention", "pending", "outstanding", "to do", "todo", "what needs", "workload", "summary", "overview"])) {
    const c = Claims.counts();
    const s = Store.stats();
    const bullets = `<div class="match">
      📋 <strong>${c.pending}</strong> claim${c.pending === 1 ? "" : "s"} awaiting review<br>
      📦 <strong>${s.activeFound}</strong> active found item${s.activeFound === 1 ? "" : "s"} in storage<br>
      ✅ <strong>${c.approved}</strong> approved, awaiting collection<br>
      🔄 <strong>${s.returned}</strong> returned to owners</div>`;
    return {
      text: c.pending > 0
        ? `You have ${c.pending} claim${c.pending === 1 ? "" : "s"} waiting. Open Review Claims to action ${c.pending === 1 ? "it" : "them"}.`
        : "Nothing is waiting for review right now. Here's the current position:",
      extraHTML: bullets,
    };
  }

  if (has(m, ["log", "add item", "new item", "found item", "record", "camera", "photo"]))
    return { text: "Go to \"Log Found Item\". Take a photo with the device camera or upload one, enter the item name, category and storage shelf tag, then pin where it was found on the campus map. It appears on the dashboard immediately so students can search for it." };

  if (has(m, ["approve", "reject", "review", "verify", "claim"]))
    return { text: "Open \"Review Claims\". Each card shows the claimant's JCU ID and their proof of ownership against the item's photo and description. Approving marks the item Claimed; rejecting leaves it Active so someone else can claim it. Once the owner collects it, use \"Mark as Returned\"." };

  if (has(m, ["retention", "how long", "dispose", "donate", "expire", "30", "policy"]))
    return { text: "Items are retained for 30 days from the logged date. After that, unclaimed items are donated to charity. Before disposing of anything, check the item has no pending claim and that any recorded contact details were notified." };

  if (has(m, ["shelf", "storage", "where do i put", "tag"]))
    return { text: "Use the shelf tag field when logging an item so it can be located physically. The convention in the sample data is a letter for the category zone and a number for the slot — for example A-04 for electronics, C-02 for clothing." };

  if (has(m, ["stat", "how many", "count", "total", "report on"])) {
    const s = Store.stats();
    return { text: `There are ${s.total} items in the register: ${s.active} active, ${s.claimed} claimed and ${s.returned} returned. Of the active ones, ${s.activeFound} are found items available to claim.` };
  }

  return searchItems(m, "admin");
}

/* ---------------- Shared item lookup ---------------- */
function searchItems(m, role) {
  const items = Store.all().filter(i => i.item_type === "found" && i.status === "Active");
  const matched = items.find(item =>
    item.name.toLowerCase().split(/\s+/).some(w => w.length > 3 && m.includes(w)));

  if (matched) {
    const extraHTML = `<div class="match"><strong>${icon(matched.category)} ${escapeHTML(matched.name)}</strong><br>
      📍 ${escapeHTML(matched.location)} &nbsp;·&nbsp; 🏷️ ${escapeHTML(matched.category)}
      ${matched.shelf_tag ? `&nbsp;·&nbsp; 📦 Shelf ${escapeHTML(matched.shelf_tag)}` : ""}</div>`;
    return {
      text: role === "admin"
        ? "That item is in the register:"
        : "Good news! I found a possible match in our records:",
      extraHTML,
    };
  }

  return {
    text: role === "admin"
      ? "No active item matches that description. Try the All Items dashboard, or ask me what needs my attention."
      : "I searched our records but couldn't find a match. Try describing it differently — brand, colour, or where you last had it — or report it as lost so the system watches for it automatically.",
  };
}

function reply(message) {
  const m = message.toLowerCase();
  return ROLE === "admin" ? adminReply(m) : studentReply(m);
}

function send(message) {
  if (!message.trim()) return;
  addMessage(message, "user");
  chatInput.value = "";
  setTimeout(() => {
    const r = reply(message);
    addMessage(r.text, "bot", r.extraHTML || "");
  }, 350);
}

chatForm.addEventListener("submit", e => { e.preventDefault(); send(chatInput.value); });

/* Wait for the data layer so admin answers report accurate live counts */
DB.ready(() => {
  const cfg = CONFIG[ROLE];
  suggestionsEl.innerHTML = cfg.suggestions
    .map(s => `<button class="chip" type="button">${s}</button>`).join("");
  suggestionsEl.querySelectorAll("button").forEach(b => b.onclick = () => send(b.textContent));
  addMessage(cfg.greeting, "bot");
});
