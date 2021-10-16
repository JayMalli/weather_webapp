import { SignUp } from "./firebase.js";

const form = document.getElementById("signup__form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("signup__username").value;
  const email = document.getElementById("signup__email").value;
  const password = document.getElementById("signup__password").value;
  SignUp(username, email, password);
});
