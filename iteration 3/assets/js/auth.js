/* ============================================================
   auth.js — credential-based sessions with role-based access
   (stories 1.1, 1.2, 1.3)

   Loaded in <head> on every page. Each page declares the role it
   needs BEFORE this script:
       <script>window.PAGE_REQUIRES = 'admin';</script>

   PAGE_REQUIRES values:
     'guest'   → login page (redirect away if already signed in)
     'any'     → any signed-in account that has a role
     'student' → students only
     'admin'   → admins only
     'none'    → the access-denied page

   Accounts live in the `users` table in PostgreSQL. Passwords are
   never sent to the browser: login calls the verify_login()
   SECURITY DEFINER function, which validates inside the database
   and returns only the JCU ID, name and role. See db/users.sql.
   ============================================================ */
(function () {
  var KEY = "slf_jcu_currentUser";

  /* Offline fallback so the app stays demonstrable without the
     database. Mirrors the seed accounts in db/users.sql. */
  var LOCAL_ACCOUNTS = [
    { jcu_id: "jc111111", password: "student123", full_name: "Student Demo Account",    role: "student" },
    { jcu_id: "jc999999", password: "admin123",   full_name: "Campus Security Admin",   role: "admin"   },
    { jcu_id: "jc000000", password: "guest123",   full_name: "Unapproved Demo Account", role: "none"    },
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }

  function home(role) {
    if (role === "admin")   return "admin-dashboard.html";
    if (role === "student") return "index.html";
    return "no-access.html";              // valid account, no permissions
  }

  function store(user) {
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  }

  function localCheck(id, pw) {
    var a = LOCAL_ACCOUNTS.find(function (u) {
      return u.jcu_id.toLowerCase() === id.toLowerCase() && u.password === pw;
    });
    return a ? store({ jcuId: a.jcu_id, name: a.full_name, role: a.role }) : null;
  }

  /* One shared Supabase client. Creating a client per call triggers a
     "Multiple GoTrueClient instances" warning and wastes connections. */
  var _client = null;
  function getClient() {
    if (!_client) _client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _client;
  }

  window.Auth = {
    KEY: KEY,
    getUser: read,
    isLoggedIn: function () { return !!read(); },
    home: home,

    /* Verify credentials. Resolves with the user object, or null when the
       credentials are not recognised. */
    signIn: function (jcuId, password) {
      var id = String(jcuId || "").trim();
      var pw = String(password || "");

      var useDb = (typeof USE_SUPABASE !== "undefined") && USE_SUPABASE &&
                  (typeof supabase !== "undefined");

      if (useDb) {
        return getClient().rpc("verify_login", { p_jcu_id: id, p_password: pw })
          .then(function (res) {
            if (res.error) {
              console.warn("[Auth] verify_login unavailable, using local accounts:", res.error.message);
              return localCheck(id, pw);
            }
            var row = res.data && res.data[0];
            return row ? store({ jcuId: row.jcu_id, name: row.full_name, role: row.role }) : null;
          })
          .catch(function (err) {
            console.warn("[Auth] database unreachable, using local accounts:", err.message || err);
            return localCheck(id, pw);
          });
      }
      return Promise.resolve(localCheck(id, pw));
    },

    logout: function () {
      localStorage.removeItem(KEY);
      location.replace("login.html");
    },
  };

  /* ---- Route guard: runs immediately, before <body> renders ---- */
  var req = window.PAGE_REQUIRES || "any";
  var user = read();

  if (req === "guest") {
    if (user) location.replace(home(user.role));      // already signed in
    return;
  }
  if (!user) {                                         // not signed in
    location.replace("login.html");
    return;
  }
  if (req === "none") return;                          // the access-denied page itself
  if (user.role === "none") {                          // account without permissions
    location.replace("no-access.html");
    return;
  }
  if (req !== "any" && user.role !== req) {            // signed in as the wrong role
    location.replace(home(user.role));
  }
})();
