/* assistant.js — rule-based assistant that also searches the local item store */

const log = document.getElementById("log");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const suggestionsEl = document.getElementById("suggestions");

const SUGGESTIONS = [
  "Where do I collect my item?",
  "How long are items kept?",
  "What's the claim policy?",
  "I lost my AirPods",
];

function addMessage(text, who, matchHTML = "") {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.innerHTML = escapeHTML(text) + matchHTML;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function reply(message) {
  const m = message.toLowerCase();
  const loc  = ["collect", "pick up", "pickup", "retrieve", "where", "office", "hours"];
  const time = ["how long", "days", "keep", "storage", "30"];
  const rule = ["policy", "rules", "procedure", "claim"];

  if (loc.some(k => m.includes(k)))
    return { text: "Found items are held at the Campus Security Office (Main Entrance & Atrium, ground floor). Open Mon–Sat, 8am–6pm. Bring your JCU student/staff ID to collect." };
  if (time.some(k => m.includes(k)))
    return { text: "Items are kept for 30 days from the date they are logged. Unclaimed items are then donated to charity. We'll email a reminder if we have your contact details." };
  if (rule.some(k => m.includes(k)))
    return { text: "To claim an item: (1) Search the dashboard to confirm it's here. (2) Visit the Security Office with your JCU ID. (3) Describe the item. (4) Sign the collection form. Items are only released to verified owners." };

  const items = Store.all().filter(i => i.status === "Active");
  const matched = items.find(item =>
    item.name.toLowerCase().split(/\s+/).some(w => w.length > 3 && m.includes(w)));

  if (matched) {
    const matchHTML = `<div class="match"><strong>${icon(matched.category)} ${escapeHTML(matched.name)}</strong><br>
      📍 ${escapeHTML(matched.location)} &nbsp;·&nbsp; 🏷️ ${escapeHTML(matched.category)}
      ${matched.shelf_tag ? `&nbsp;·&nbsp; 📦 Shelf ${escapeHTML(matched.shelf_tag)}` : ""}</div>`;
    return { text: "Good news! I found a possible match in our records:", matchHTML };
  }
  return { text: "I searched our records but couldn't find an exact match. Try describing your item differently — brand, colour, or where you last had it — or browse the dashboard directly." };
}

function send(message) {
  if (!message.trim()) return;
  addMessage(message, "user");
  chatInput.value = "";
  setTimeout(() => { const r = reply(message); addMessage(r.text, "bot", r.matchHTML || ""); }, 350);
}

chatForm.addEventListener("submit", e => { e.preventDefault(); send(chatInput.value); });

suggestionsEl.innerHTML = SUGGESTIONS.map(s => `<button class="chip" type="button">${s}</button>`).join("");
suggestionsEl.querySelectorAll("button").forEach(b => b.onclick = () => send(b.textContent));

addMessage("👋 Hi! I'm the JCU Lost & Found assistant. Ask me where to collect items, how long we keep them, or describe something you've lost.", "bot");
