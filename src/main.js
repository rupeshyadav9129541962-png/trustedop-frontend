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

// ================= AUTH SCREEN =================

function renderAuth() {
  app.innerHTML = `
    <main class="app">
      <div class="logo">
        TRUSTED <span>OP</span>
      </div>

      <section class="auth-card">
        <h1>
          ${mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>

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
              mode === "login"
                ? "current-password"
                : "new-password"
            }"
            minlength="6"
            required
          />

          <button
            class="primary-btn"
            id="submitBtn"
            type="submit"
          >
            ${mode === "login" ? "Login" : "Create Account"}
          </button>

          <p class="signup-text">
            ${
              mode === "login"
                ? `
                  Don't have an account?
                  <button
                    type="button"
                    class="link-btn"
                    id="switchMode"
                  >
                    Create Account
                  </button>
                `
                : `
                  Already have an account?
                  <button
                    type="button"
                    class="link-btn"
                    id="switchMode"
                  >
                    Login
                  </button>
                `
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
      renderAuth();
    });

  document
    .getElementById("mobileTab")
    .addEventListener("click", () => {
      showMessage(
        "Mobile OTP will be added later.",
        "info"
      );
    });
}

// ================= EMAIL AUTH =================

async function handleEmailAuth(event) {
  event.preventDefault();

  const email = document
    .getElementById("email")
    .value
    .trim();

  const password =
    document.getElementById("password").value;

  const submitBtn =
    document.getElementById("submitBtn");

  submitBtn.disabled = true;

  submitBtn.textContent =
    mode === "login"
      ? "Logging in..."
      : "Creating account...";

  try {
    let userCredential;

    if (mode === "signup") {
      userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
    } else {
      userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
    }

    const idToken =
      await userCredential.user.getIdToken();

    const backendUser =
      await verifyBackendUser(idToken);

    if (!backendUser) {
      throw new Error(
        "Backend authentication failed"
      );
    }

    renderDashboard(backendUser);

  } catch (error) {
    console.error("AUTH ERROR:", error);

    let message = "Something went wrong.";

    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered.";
    }

    else if (error.code === "auth/invalid-email") {
      message = "Please enter a valid email.";
    }

    else if (error.code === "auth/weak-password") {
      message =
        "Password must be at least 6 characters.";
    }

    else if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      message =
        "Email or password is incorrect.";
    }

    else if (error.code === "auth/too-many-requests") {
      message =
        "Too many attempts. Please try again later.";
    }

    showMessage(message, "error");

  } finally {
    const button =
      document.getElementById("submitBtn");

    if (button) {
      button.disabled = false;

      button.textContent =
        mode === "login"
          ? "Login"
          : "Create Account";
    }
  }
}

// ================= BACKEND =================

async function verifyBackendUser(idToken) {
  const response = await fetch(
    `${API_URL}/api/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Backend authentication failed"
    );
  }

  return data.user;
}

// ================= DASHBOARD =================

function renderDashboard(user) {
  const email =
    user.email || "Trusted OP User";

  const shortUid =
    user.uid
      ? user.uid.substring(0, 10) + "..."
      : "";

  app.innerHTML = `
    <main class="dashboard">

      <header class="topbar">

        <div>
          <div class="dashboard-logo">
            TRUSTED <span>OP</span>
          </div>

          <p class="welcome">
            Welcome back 👋
          </p>
        </div>

        <button
          id="logoutBtn"
          class="logout-btn"
          type="button"
        >
          Logout
        </button>

      </header>

      <section class="balance-card">

        <div>
          <p class="balance-label">
            Available Balance
          </p>

          <h1>₹0.00</h1>

          <p class="balance-note">
            Wallet will be connected to backend
          </p>
        </div>

        <div class="wallet-icon">
          ₹
        </div>

      </section>

      <section class="quick-actions">

        <button
          class="dashboard-action"
          type="button"
        >
          <span>➕</span>
          <strong>Add Money</strong>
        </button>

        <button
          class="dashboard-action"
          type="button"
        >
          <span>💸</span>
          <strong>Withdraw</strong>
        </button>

        <button
          class="dashboard-action"
          type="button"
        >
          <span>🎮</span>
          <strong>Tournaments</strong>
        </button>

        <button
          class="dashboard-action"
          type="button"
        >
          <span>🏆</span>
          <strong>My Matches</strong>
        </button>

      </section>

      <section class="section-card">

        <div class="section-title">
          <h2>
            Upcoming Tournaments
          </h2>

          <button
            class="see-all"
            type="button"
          >
            View All
          </button>
        </div>

        <div class="empty-state">

          <div class="empty-icon">
            🎮
          </div>

          <h3>
            No tournaments yet
          </h3>

          <p>
            Upcoming Trusted OP tournaments
            will appear here.
          </p>

        </div>

      </section>

      <section class="section-card">

        <div class="section-title">
          <h2>
            Account
          </h2>
        </div>

        <div class="profile-row">

          <div class="avatar">
            ${escapeHtml(
              email.charAt(0).toUpperCase()
            )}
          </div>

          <div class="profile-info">

            <strong>
              ${escapeHtml(email)}
            </strong>

            <span>
              UID: ${escapeHtml(shortUid)}
            </span>

          </div>

        </div>

      </section>

      <nav class="bottom-nav">

        <button
          class="nav-item active"
          type="button"
        >
          <span>🏠</span>
          <small>Home</small>
        </button>

        <button
          class="nav-item"
          type="button"
        >
          <span>🎮</span>
          <small>Tournaments</small>
        </button>

        <button
          class="nav-item"
          type="button"
        >
          <span>🏆</span>
          <small>Matches</small>
        </button>

        <button
          class="nav-item"
          type="button"
        >
          <span>👤</span>
          <small>Profile</small>
        </button>

      </nav>

    </main>
  `;

  document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {

      await signOut(auth);

      mode = "login";

      renderAuth();
    });
}

// ================= SECURITY =================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ================= MESSAGE =================

function showMessage(message, type) {
  const box =
    document.getElementById("message");

  if (!box) return;

  box.textContent = message;

  box.style.marginBottom = "14px";
  box.style.padding = "10px";
  box.style.borderRadius = "8px";

  if (type === "error") {
    box.style.background = "#35151a";
  }

  else if (type === "success") {
    box.style.background = "#12351f";
  }

  else {
    box.style.background = "#18202d";
  }
}

// ================= AUTH STATE =================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    renderAuth();
    return;
  }

  try {

    const idToken =
      await user.getIdToken();

    const backendUser =
      await verifyBackendUser(idToken);

    renderDashboard(backendUser);

  } catch (error) {

    console.error(
      "SESSION ERROR:",
      error.message
    );

    await signOut(auth);

    renderAuth();
  }
});
