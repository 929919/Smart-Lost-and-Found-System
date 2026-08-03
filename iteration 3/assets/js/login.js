/* login.js — role-card selection + open sign in (no password) */

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const roleCards = document.getElementById("roleCards");
let selectedRole = "";

roleCards.querySelectorAll(".role-card").forEach(card => {
  card.addEventListener("click", () => {
    selectedRole = card.dataset.role;
    roleCards.querySelectorAll(".role-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    card.querySelector("input").checked = true;
    errorEl.style.display = "none";
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.style.display = "none";

  const jcuId = document.getElementById("jcuId").value.trim();
  if (!jcuId) { showError("Please enter your JCU ID."); return; }
  if (!selectedRole) { showError("Please choose a role — Student or Admin."); return; }

  Auth.login(jcuId, selectedRole);
  location.replace(Auth.home(selectedRole));
});

function showError(msg) { errorEl.textContent = msg; errorEl.style.display = "block"; }
