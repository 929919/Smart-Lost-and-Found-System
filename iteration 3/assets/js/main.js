/* ============================================================
   main.js — role-aware shared chrome (header, nav, footer,
   logged-in indicator, logout, floating chat widget).
   Runs at end of <body>. Requires auth.js + store.js loaded first.
   Pages set <body data-page="..."> for active-nav highlighting.
   ============================================================ */

const NAV_STUDENT = [
  { key: "dashboard",   label: "Dashboard",        href: "index.html" },
  { key: "report-lost", label: "Report Lost Item", href: "report-lost.html", cta: true },
  { key: "assistant",   label: "Assistant",        href: "assistant.html" },
];

const NAV_ADMIN = [
  { key: "admin-dashboard", label: "Admin Home",      href: "admin-dashboard.html" },
  { key: "log-found",       label: "Log Found Item",  href: "log-found.html", cta: true },
  { key: "admin-claims",    label: "Review Claims",   href: "admin-claims.html", badge: true },
  { key: "dashboard",       label: "All Items",       href: "index.html" },
  { key: "assistant",       label: "Assistant",       href: "assistant.html" },
];

function buildHeader(user, active) {
  const nav = (user.role === "admin" ? NAV_ADMIN : NAV_STUDENT);
  const pending = (typeof Claims !== "undefined") ? Claims.counts().pending : 0;

  const links = nav.map(n => {
    const badge = (n.badge && pending > 0) ? `<span class="nav-badge">${pending}</span>` : "";
    return `<a href="${n.href}" class="${n.cta ? "nav-cta" : ""} ${n.key === active ? "active" : ""}">${n.label}${badge}</a>`;
  }).join("");

  const roleLabel = user.role === "admin" ? "Admin" : "Student";

  return `
  <div class="utilitybar">
    <div class="wrap">
      <span class="uloc">📍 Singapore Campus</span>
      <div class="user-area">
        <span class="user-chip">👤 Logged in as <strong>${escapeHTML(user.jcuId)}</strong>
          <span class="role-pill ${user.role}">${roleLabel}</span></span>
        <button class="logout-btn" id="logoutBtn">Logout</button>
      </div>
    </div>
  </div>
  <header class="masthead">
    <div class="wrap">
      <a class="brand" href="${user.role === "admin" ? "admin-dashboard.html" : "index.html"}" aria-label="JCU Singapore — Home">
        <img src="assets/img/jcu_logo.png" alt="James Cook University Singapore" />
      </a>
      <button class="hamburger" id="hamburger" aria-label="Menu">☰</button>
      <nav class="mainnav" id="mainnav">${links}</nav>
    </div>
  </header>`;
}

function buildFooter() {
  const year = new Date().getFullYear();
  return `
  <div class="acknowledge wrap" style="max-width:none">
    James Cook University Singapore is committed to a safe, inclusive and connected campus community.
  </div>
  <footer class="site-footer">
    <div class="wrap">
      <div class="cols">
        <div class="footer-brand">
          <span class="logobox"><img src="assets/img/jcu_logo.png" alt="James Cook University Singapore" /></span>
          <p>The Smart Lost &amp; Found System helps the JCU Singapore community report, search for and recover misplaced items across campus.</p>
          <div class="socials">
            <a href="#" title="Facebook">f</a><a href="#" title="Instagram">◎</a>
            <a href="#" title="LinkedIn">in</a><a href="#" title="YouTube">▶</a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Found Items Dashboard</a></li>
            <li><a href="report-lost.html">Report a Lost Item</a></li>
            <li><a href="assistant.html">Help Assistant</a></li>
            <li><a href="login.html">Sign in / Switch role</a></li>
          </ul>
        </div>
        <div>
          <h4>Campus Services</h4>
          <ul>
            <li><a href="#">Campus Security</a></li><li><a href="#">Student Hub</a></li>
            <li><a href="#">IT Help Desk</a></li><li><a href="#">Library Services</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="footer-contact">
            <li>📍 149 Sims Drive, Singapore 387380</li>
            <li>✉️ lostandfound@jcu.edu.sg</li>
            <li>☎️ +65 6709 3888</li>
            <li>🕗 Security Office · Mon–Sat, 8am–6pm</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} James Cook University Singapore</span>
        <span class="spacer"></span>
        <a href="#">Privacy</a><a href="#">Terms of Use</a><a href="#">Accessibility</a>
        <span>CPE Reg. No. 200100786K</span>
      </div>
    </div>
  </footer>`;
}

/* Wait for the data layer so the pending-claims badge is accurate. */
DB.ready(function initLayout() {
  const user = (window.Auth && Auth.getUser()) ? Auth.getUser() : null;
  if (!user) return; // login page / not signed in — no chrome

  const active = document.body.dataset.page || "";
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = buildHeader(user, active);
  if (footer) footer.innerHTML = buildFooter();

  const burger = document.getElementById("hamburger");
  const nav = document.getElementById("mainnav");
  if (burger && nav) burger.addEventListener("click", () => nav.classList.toggle("open"));

  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", () => Auth.logout());

  // Floating chat widget — visible to both roles, except on the assistant page itself
  if (active !== "assistant") {
    const fab = document.createElement("a");
    fab.href = "assistant.html";
    fab.className = "chat-fab";
    fab.title = "Ask the Lost & Found Assistant";
    fab.innerHTML = "💬";
    document.body.appendChild(fab);
  }
});
