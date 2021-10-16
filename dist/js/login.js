import { Login } from "./firebase.js";
const form = document.getElementById("login__form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("login__email").value;
  const password = document.getElementById("login__password").value;
  const response = await Login(email, password);
  const message = document.getElementById("error_message");
  if (response != null) {
    message.textContent = response;
    message.classList.add("show");
    form.reset();
    setTimeout(() => {
      message.classList.remove("show");
    }, 3000);
  }
});
