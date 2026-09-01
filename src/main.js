import "./style.css";

import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const app = document.getElementById("app");

let mode = "login";

function render() {
  app.innerHTML = `
    <main class="app">
      <div class="logo">TRUSTED <span>OP</span></div>

      <section class="auth-card">
        <h1>${mode === "login" ? "Welcome Back" : "Create Account"}</h1>

        <p>
          ${mode === "login"
            ? "Login to your Trusted OP account"
            : "Create your secure tournament account"}
        </p>

        <div class="auth-tabs">
          <button id="emailTab" class="active">Email</button>
          <button id="mobileTab">Mobile OTP</button>
        </div>

        <div id="message"></div>

        <form id="emailForm" class="form">

          ${
            mode === "signup"
              ? `
                <input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  autocomplete="name"
                  required
                />
              `
              : ""
          }

          <input
            id="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            required
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            autocomplete="${
              mode === "login" ? "current-password" : "new-password"
            }"
            minlength="6"
            required
          />

          <button class="primary-btn" type="submit">
            ${mode === "login" ? "Login" : "Create Account"}
          </button>

          <p class="signup-text">
            ${
              mode === "login"
                ? `Don't have an account?
                   <button type="button" class="link-btn" id="switchMode">
                     Create Account
                   </button>`
                : `Already have an account?
                   <button type="button" class="link-btn" id="switchMode">
                     Login
                   </button>`
            }
          </p>

        </form>
      </section>
    </main>
  `;

  document
    .getElementById("emailForm")
    .addEventListener("submit", handleEmailAuth);

  document
    .getElementById("switchMode")
    .addEventListener("click", () => {
      mode = mode === "login" ? "signup" : "login";
      render();
    });

  document
    .getElementById("mobileTab")
    .addEventListener("click", () => {
      showMessage("Mobile OTP will be added in the next step.", "info");
    });
}

async function handleEmailAuth(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    if (mode === "signup") {
      await createUserWithEmailAndPassword(auth, email, password);

      showMessage("Account created successfully!", "success");
    } else {
      await signInWithEmailAndPassword(auth, email, password);

      showMessage("Login successful!", "success");
    }
  } catch (error) {
    console.error(error);

    let message = "Something went wrong.";

    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered.";
    } else if (error.code === "auth/invalid-email") {
      message = "Please enter a valid email.";
    } else if (error.code === "auth/weak-password") {
      message = "Password must be at least 6 characters.";
    } else if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      message = "Email or password is incorrect.";
    }

    showMessage(message, "error");
  }
}

function showMessage(message, type) {
  const box = document.getElementById("message");

  if (!box) return;

  box.textContent = message;
  box.style.marginBottom = "14px";
  box.style.padding = "10px";
  box.style.borderRadius = "8px";

  if (type === "error") {
    box.style.background = "#35151a";
  } else if (type === "success") {
    box.style.background = "#12351f";
  } else {
    box.style.background = "#18202d";
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in:", user.uid);
  }
});

render();
