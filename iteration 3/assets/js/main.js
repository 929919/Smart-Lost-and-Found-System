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
  <a href="#main-content" class="skip-link">Skip to main content</a>
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

const REPO = "https://github.com/929919/Smart-Lost-and-Found-System";

function buildFooter(user) {
  const year = new Date().getFullYear();

  // Role-appropriate shortcuts — students never see admin actions and vice versa
  const quickLinks = (user && user.role === "admin")
    ? `<li><a href="log-found.html">Log a Found Item</a></li>
       <li><a href="admin-claims.html">Review Claims</a></li>`
    : `<li><a href="report-lost.html">Report a Lost Item</a></li>`;

  return `
  <div class="acknowledge wrap" style="max-width:none">
    🎓 <strong>Student coursework project</strong> — CP3407 Advanced Software Engineering,
    Group 6. This is a university assignment and <strong>not an official James Cook
    University service</strong>. All data shown is sample data.
  </div>
  <footer class="site-footer">
    <div class="wrap">
      <div class="cols">
        <div class="footer-brand">
          <span class="logobox"><img src="assets/img/jcu_logo.png" alt="James Cook University Singapore" /></span>
          <p>The Smart Lost &amp; Found System helps the JCU Singapore community report, search for and recover misplaced items across campus.</p>
          <p style="margin-top:10px;font-size:.82rem">
            Built for <strong>CP3407 Advanced Software Engineering</strong> by Group 6:
            Yuvraj Dave, João Gabriel Costa and Chiranjeeb Satpathy.
          </p>
        </div>
        <div>
          <h4>In this system</h4>
          <ul>
            <li><a href="index.html">Found Items Dashboard</a></li>
            ${quickLinks}
            <li><a href="assistant.html">Help Assistant</a></li>
            <li><a href="login.html">Sign in / Switch account</a></li>
          </ul>
        </div>
        <div>
          <h4>Project</h4>
          <ul>
            <li><a href="${REPO}" target="_blank" rel="noopener">Source code on GitHub ↗</a></li>
            <li><a href="${REPO}/tree/main/docs" target="_blank" rel="noopener">Documentation ↗</a></li>
            <li><a href="${REPO}/blob/main/docs/HOW-TO-TEST.md" target="_blank" rel="noopener">How to test ↗</a></li>
            <li><a href="tests/tests.html">Run the test suite</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact (sample data)</h4>
          <ul class="footer-contact">
            <li>📍 149 Sims Drive, Singapore 387380</li>
            <li>✉️ lostandfound@jcu.edu.sg</li>
            <li>🕗 Security Office · Mon–Sat, 8am–6pm</li>
            <li><a href="https://www.jcu.edu.sg" target="_blank" rel="noopener">Real JCU Singapore website ↗</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} Group 6 · CP3407 student project</span>
        <span class="spacer"></span>
        <a href="${REPO}" target="_blank" rel="noopener">GitHub ↗</a>
        <a href="${REPO}/blob/main/docs/design.md" target="_blank" rel="noopener">Design ↗</a>
        <a href="${REPO}/blob/main/docs/testing.md" target="_blank" rel="noopener">Testing ↗</a>
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
  if (footer) footer.innerHTML = buildFooter(user);

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
