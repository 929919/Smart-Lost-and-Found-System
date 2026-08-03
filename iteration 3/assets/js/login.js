/* login.js — credential sign in; the role comes from the account (story 1.1) */

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  hideError();

  const jcuId = document.getElementById("jcuId").value.trim();
  const password = document.getElementById("password").value;

  if (!jcuId)    { showError("Please enter your JCU ID."); return; }
  if (!password) { showError("Please enter your password."); return; }

  setBusy(true);
  Auth.signIn(jcuId, password)
    .then(user => {
      if (!user) {
        setBusy(false);
        showError("Incorrect JCU ID or password. Please try again.");
        document.getElementById("password").value = "";
        document.getElementById("password").focus();
        return;
      }
      location.replace(Auth.home(user.role));
    })
    .catch(err => {
      setBusy(false);
      showError("Sign in failed: " + (err.message || err));
    });
});

function showError(msg) { errorEl.textContent = msg; errorEl.style.display = "block"; }
function hideError() { errorEl.style.display = "none"; }

function setBusy(busy) {
  submitBtn.disabled = busy;
  submitBtn.textContent = busy ? "Signing in…" : "Sign in →";
}
