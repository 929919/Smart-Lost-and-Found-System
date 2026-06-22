/* layout.js — injects the shared JCU header & footer on every page,
   and highlights the active nav item based on <body data-page="..."> */

const NAV = [
  { key: "dashboard", label: "Dashboard",      href: "index.html" },
  { key: "report",    label: "Report an Item",  href: "report.html", cta: true },
  { key: "assistant", label: "Assistant",       href: "assistant.html" },
  { key: "admin",     label: "Admin",           href: "admin.html" },
];

function buildHeader(active) {
  const links = NAV.map(n =>
    `<a href="${n.href}" class="${n.cta ? "nav-cta" : ""} ${n.key === active ? "active" : ""}">${n.label}</a>`
  ).join("");

  return `
  <div class="utilitybar">
    <div class="wrap">
      <span class="uloc">📍 Singapore Campus</span>
      <nav>
        <a href="#">Current Students</a>
        <a href="#">Staff</a>
        <a href="#">Library</a>
        <a href="#">Contact Us</a>
      </nav>
    </div>
  </div>
  <header class="masthead">
    <div class="wrap">
      <a class="brand" href="index.html" aria-label="James Cook University Singapore — Home">
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
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Instagram">◎</a>
            <a href="#" title="LinkedIn">in</a>
            <a href="#" title="YouTube">▶</a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Found Items Dashboard</a></li>
            <li><a href="report.html">Report an Item</a></li>
            <li><a href="assistant.html">Help Assistant</a></li>
            <li><a href="admin.html">Admin Console</a></li>
          </ul>
        </div>
        <div>
          <h4>Campus Services</h4>
          <ul>
            <li><a href="#">Campus Security</a></li>
            <li><a href="#">Student Hub</a></li>
            <li><a href="#">IT Help Desk</a></li>
            <li><a href="#">Library Services</a></li>
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
        <a href="#">Privacy</a>
        <a href="#">Terms of Use</a>
        <a href="#">Accessibility</a>
        <span>CPE Reg. No. 200100786K</span>
      </div>
    </div>
  </footer>`;
}

(function initLayout() {
  const active = document.body.dataset.page || "";
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = buildHeader(active);
  if (footer) footer.innerHTML = buildFooter();

  const burger = document.getElementById("hamburger");
  const nav = document.getElementById("mainnav");
  if (burger && nav) burger.addEventListener("click", () => nav.classList.toggle("open"));
})();
