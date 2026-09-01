import "./style.css";

import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const API_URL = "https://trustedop-backend-1.onrender.com";

const app = document.getElementById("app");

let mode = "login";

// ---------------- UI ----------------

function render() {
  app.innerHTML = `
    <main class="app">
      <div class="logo">TRUSTED <span>OP</span></div>

      <section class="auth-card">
        <h1>${mode === "login" ? "Welcome Back" : "Create Account"}</h1>

        <p>
          ${
            mode === "login"
              ? "Login to your Trusted OP account"
              : "Create your secure tournament account"
          }
        </p>

        <div class="auth-tabs">
          <button id="emailTab" class="active" type="button">
            Email
          </button>

          <button id="mobileTab" type="button">
            Mobile OTP
          </button>
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

          <button class="primary-btn" id="submitBtn" type="submit">
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
      showMessage(
        "Mobile OTP will be added in the next step.",
        "info"
      );
    });
}

// ---------------- FIREBASE AUTH ----------------

async function handleEmailAuth(event) {
  event.preventDefault();

  const email = document
    .getElementById("email")
    .value
    .trim();

  const password = document
    .getElementById("password")
    .value;

  const submitBtn = document.getElementById("submitBtn");

  submitBtn.disabled = true;
  submitBtn.textContent =
    mode === "login" ? "Logging in..." : "Creating account...";

  try {
    let userCredential;

    if (mode === "signup") {
      userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      showMessage(
        "Account created successfully!",
        "success"
      );
    } else {
      userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      showMessage(
        "Login successful!",
        "success"
      );
    }

    // Get Firebase ID token
    const idToken =
      await userCredential.user.getIdToken();

    // Verify token with Trusted OP backend
    await verifyBackendUser(idToken);

  } catch (error) {
    console.error("AUTH ERROR:", error);

    let message = "Something went wrong.";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered.";
        break;

      case "auth/invalid-email":
        message = "Please enter a valid email.";
        break;

      case "auth/weak-password":
        message =
          "Password must be at least 6 characters.";
        break;

      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        message =
          "Email or password is incorrect.";
        break;

      case "auth/too-many-requests":
        message =
          "Too many attempts. Please try again later.";
        break;
    }

    showMessage(message, "error");

  } finally {
    const button = document.getElementById("submitBtn");

    if (button) {
      button.disabled = false;
      button.textContent =
        mode === "login"
          ? "Login"
          : "Create Account";
    }
  }
}

// ---------------- BACKEND AUTH TEST ----------------

async function verifyBackendUser(idToken) {
  try {
    const response = await fetch(
      `${API_URL}/api/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Backend authentication failed"
      );
    }

    console.log(
      "Trusted OP backend user:",
      data.user
    );

  } catch (error) {
    console.error(
      "BACKEND AUTH ERROR:",
      error.message
    );

    showMessage(
      "Firebase login successful, but backend connection failed.",
      "error"
    );
  }
}

// ---------------- MESSAGE ----------------

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

// ---------------- AUTH STATE ----------------

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Logged in:", user.uid);

    try {
      const idToken = await user.getIdToken();

      await verifyBackendUser(idToken);
    } catch (error) {
      console.error(
        "SESSION ERROR:",
        error.message
      );
    }
  } else {
    console.log("No user logged in");
  }
});

// ---------------- START ----------------

render();
