/* ============================================================
   auth.js — open, role-based session (no passwords).
   Loaded in <head> on every page. Each page declares the role
   it needs via:  <script>window.PAGE_REQUIRES = 'admin';</script>
   placed BEFORE this script.

   PAGE_REQUIRES values:
     'guest'   → login page (redirect away if already signed in)
     'any'     → any signed-in user (student or admin)
     'student' → students only
     'admin'   → admins only
     (unset)   → treated as 'any'
   ============================================================ */
(function () {
  var KEY = "slf_jcu_currentUser";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function home(role) { return role === "admin" ? "admin-dashboard.html" : "index.html"; }

  // Public API
  window.Auth = {
    KEY: KEY,
    getUser: read,
    isLoggedIn: function () { return !!read(); },
    login: function (jcuId, role) {
      localStorage.setItem(KEY, JSON.stringify({ jcuId: jcuId, role: role }));
    },
    logout: function () {
      localStorage.removeItem(KEY);
      location.replace("login.html");
    },
    home: home,
  };

  // --- Route guard (runs immediately, before <body> renders) ---
  var req = window.PAGE_REQUIRES || "any";
  var user = read();

  if (req === "guest") {
    if (user) location.replace(home(user.role));   // already signed in
    return;
  }
  if (!user) {                                       // not signed in
    location.replace("login.html");
    return;
  }
  if (req !== "any" && user.role !== req) {           // wrong role → bounce to login
    location.replace("login.html");
  }
})();
