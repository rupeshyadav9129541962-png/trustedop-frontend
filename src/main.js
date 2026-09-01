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
let currentUser = null;

// ================= AUTH =================

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
          <button class="active" type="button">Email</button>
          <button id="mobileTab" type="button">Mobile OTP</button>
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

// ================= EMAIL LOGIN =================

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
    let credential;

    if (mode === "signup") {
      credential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
    } else {
      credential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
    }

    const token =
      await credential.user.getIdToken();

    const user =
      await verifyBackendUser(token);

    currentUser = user;

    renderHome();

  } catch (error) {
    console.error(error);

    let message = "Something went wrong.";

    if (error.code === "auth/email-already-in-use") {
      message = "This email is already registered.";
    } else if (error.code === "auth/invalid-email") {
      message = "Please enter a valid email.";
    } else if (error.code === "auth/weak-password") {
      message =
        "Password must be at least 6 characters.";
    } else if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      message =
        "Email or password is incorrect.";
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

// ================= BACKEND AUTH =================

async function verifyBackendUser(token) {
  const response = await fetch(
    `${API_URL}/api/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`
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

// ================= HOME =================

function renderHome() {
  app.innerHTML = `
    <main class="dashboard">

      <header class="topbar">

        <div>
          <div class="dashboard-logo">
            TRUSTED <span>OP</span>
          </div>

          <p class="welcome">
            Welcome to Trusted OP 👋
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

      <section class="section-card">

        <div class="section-title">
          <h2>🔥 Live & Upcoming Contests</h2>

          <button
            id="refreshContests"
            class="see-all"
            type="button"
          >
            Refresh
          </button>
        </div>

        <div class="contest-list">

          ${contestCard({
            id: "solo-10",
            title: "SOLO MATCH",
            mode: "SOLO",
            entry: "₹10",
            prize: "₹20",
            kill: "₹2",
            players: "10",
            time: "Today • 8:00 PM"
          })}

          ${contestCard({
            id: "solo-20",
            title: "SOLO PRO MATCH",
            mode: "SOLO",
            entry: "₹20",
            prize: "₹40",
            kill: "₹4",
            players: "10",
            time: "Today • 9:00 PM"
          })}

          ${contestCard({
            id: "duo-20",
            title: "DUO MATCH",
            mode: "DUO",
            entry: "₹20",
            prize: "₹40",
            kill: "₹4",
            players: "10 Teams",
            time: "Tomorrow • 7:00 PM"
          })}

        </div>

      </section>

      <nav class="bottom-nav">

        <button
          class="nav-item active"
          id="homeNav"
          type="button"
        >
          <span>🏠</span>
          <small>Home</small>
        </button>

        <button
          class="nav-item"
          id="matchesNav"
          type="button"
        >
          <span>🏆</span>
          <small>My Matches</small>
        </button>

        <button
          class="nav-item"
          id="walletNav"
          type="button"
        >
          <span>💰</span>
          <small>Wallet</small>
        </button>

        <button
          class="nav-item"
          id="profileNav"
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
    .addEventListener("click", logout);

  document
    .getElementById("refreshContests")
    .addEventListener("click", renderHome);

  document
    .getElementById("matchesNav")
    .addEventListener("click", renderMyMatches);

  document
    .getElementById("walletNav")
    .addEventListener("click", renderWallet);

  document
    .getElementById("profileNav")
    .addEventListener("click", renderProfile);

  document
    .querySelectorAll(".contest-card")
    .forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        renderMatchDetails(id);
      });
    });
}

// ================= CONTEST CARD =================

function contestCard(contest) {
  return `
    <article
      class="contest-card"
      data-id="${contest.id}"
    >

      <div class="contest-header">

        <div>
          <span class="contest-badge">
            ${contest.mode}
          </span>

          <h3>
            ${contest.title}
          </h3>
        </div>

        <span class="contest-time">
          🕐 ${contest.time}
        </span>

      </div>

      <div class="contest-stats">

        <div>
          <small>Entry Fee</small>
          <strong>${contest.entry}</strong>
        </div>

        <div>
          <small>Prize Pool</small>
          <strong>${contest.prize}</strong>
        </div>

        <div>
          <small>Per Kill</small>
          <strong>${contest.kill}</strong>
        </div>

        <div>
          <small>Players</small>
          <strong>${contest.players}</strong>
        </div>

      </div>

      <button
        class="contest-join"
        type="button"
      >
        View Match Details →
      </button>

    </article>
  `;
}

// ================= MATCH DETAILS =================

function renderMatchDetails(contestId) {
  const contests = {
    "solo-10": {
      title: "SOLO MATCH",
      mode: "SOLO",
      entry: "₹10",
      prize: "₹20",
      kill: "₹2",
      players: "10 Players",
      map: "Bermuda",
      time: "Today • 8:00 PM"
    },

    "solo-20": {
      title: "SOLO PRO MATCH",
      mode: "SOLO",
      entry: "₹20",
      prize: "₹40",
      kill: "₹4",
      players: "10 Players",
      map: "Bermuda",
      time: "Today • 9:00 PM"
    },

    "duo-20": {
      title: "DUO MATCH",
      mode: "DUO",
      entry: "₹20",
      prize: "₹40",
      kill: "₹4",
      players: "10 Teams",
      map: "Bermuda",
      time: "Tomorrow • 7:00 PM"
    }
  };

  const contest = contests[contestId];

  if (!contest) {
    renderHome();
    return;
  }

  app.innerHTML = `
    <main class="dashboard">

      <header class="topbar">

        <button
          id="backBtn"
          class="logout-btn"
          type="button"
        >
          ← Back
        </button>

        <div class="dashboard-logo">
          TRUSTED <span>OP</span>
        </div>

        <div></div>

      </header>

      <section class="section-card">

        <span class="contest-badge">
          ${contest.mode}
        </span>

        <h1 class="match-title">
          ${contest.title}
        </h1>

        <p class="match-time">
          🕐 ${contest.time}
        </p>

        <div class="match-stats">

          <div>
            <small>Entry Fee</small>
            <strong>${contest.entry}</strong>
          </div>

          <div>
            <small>Prize Pool</small>
            <strong>${contest.prize}</strong>
          </div>

          <div>
            <small>Per Kill</small>
            <strong>${contest.kill}</strong>
          </div>

          <div>
            <small>Players</small>
            <strong>${contest.players}</strong>
          </div>

          <div>
            <small>Map</small>
            <strong>${contest.map}</strong>
          </div>

        </div>

      </section>

      <section class="section-card">

        <div class="section-title">
          <h2>📋 Match Rules</h2>
        </div>

        <div class="rules">

          <p>• Teaming is strictly prohibited.</p>
          <p>• Only registered players are allowed.</p>
          <p>• Hack or unfair gameplay = permanent ban.</p>
          <p>• Room ID & Password will be released before match.</p>
          <p>• Follow Trusted OP official match rules.</p>

        </div>

      </section>

      <section class="section-card">

        <div class="section-title">
          <h2>🎮 Match Room</h2>
        </div>

        <div class="room-locked">

          <div class="empty-icon">
            🔒
          </div>

          <h3>
            Room details locked
          </h3>

          <p>
            Room ID and Password will appear
            after the admin releases them.
          </p>

        </div>

      </section>

      <button
        id="joinBtn"
        class="primary-btn"
        type="button"
      >
        Join Contest — ${contest.entry}
      </button>

    </main>
  `;

  document
    .getElementById("backBtn")
    .addEventListener("click", renderHome);

  document
    .getElementById("joinBtn")
    .addEventListener("click", () => {
      showMessage(
        "Joining system will be connected to wallet later.",
        "info"
      );
    });
}

// ================= MY MATCHES =================

function renderMyMatches() {
  app.innerHTML = `
    <main class="dashboard">

      <header class="topbar">

        <div class="dashboard-logo">
          TRUSTED <span>OP</span>
        </div>

        <button
          id="backHome"
          class="logout-btn"
          type="button"
        >
          Home
        </button>

      </header>

      <section class="section-card">

        <div class="section-title">
          <h2>🏆 My Matches</h2>
        </div>

        <div class="empty-state">

          <div class="empty-icon">
            🏆
          </div>

          <h3>
            No joined matches
          </h3>

          <p>
            Your joined contests will appear here.
          </p>

        </div>

      </section>

      ${bottomNav("matches")}

    </main>
  `;

  setupNavigation();

  document
    .getElementById("backHome")
    .addEventListener("click", renderHome);
}

// ================= WALLET =================

function renderWallet() {
  app.innerHTML = `
    <main class="dashboard">

      <header class="topbar">

        <div>
          <div class="dashboard-logo">
            TRUSTED <span>OP</span>
          </div>

          <p class="welcome">
            Your Wallet
          </p>
        </div>

      </header>

      <section class="balance-card">

        <div>
          <p class="balance-label">
            Available Balance
          </p>

          <h1>₹0.00</h1>

          <p class="balance-note">
            Secure wallet
          </p>
        </div>

        <div class="wallet-icon">
          ₹
        </div>

      </section>

      <section class="quick-actions">

        <button class="dashboard-action">
          <span>➕</span>
          <strong>Add Money</strong>
        </button>

        <button class="dashboard-action">
          <span>💸</span>
          <strong>Withdraw</strong>
        </button>

      </section>

      <section class="section-card">

        <div class="section-title">
          <h2>Transaction History</h2>
        </div>

        <div class="empty-state">

          <div class="empty-icon">
            💳
          </div>

          <h3>
            No transactions
          </h3>

          <p>
            Your transactions will appear here.
          </p>

        </div>

      </section>

      ${bottomNav("wallet")}

    </main>
  `;

  setupNavigation();
}

// ================= PROFILE =================

function renderProfile() {
  const email =
    currentUser?.email || "Trusted OP User";

  app.innerHTML = `
    <main class="dashboard">

      <header class="topbar">

        <div>
          <div class="dashboard-logo">
            TRUSTED <span>OP</span>
          </div>

          <p class="welcome">
            My Profile
          </p>
        </div>

      </header>

      <section class="section-card">

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
              UID:
              ${escapeHtml(
                currentUser?.uid || ""
              )}
            </span>

          </div>

        </div>

      </section>

      <section class="section-card">

        <div class="section-title">
          <h2>Account</h2>
        </div>

        <button
          id="profileLogout"
          class="primary-btn"
          type="button"
        >
          Logout
        </button>

      </section>

      ${bottomNav("profile")}

    </main>
  `;

  setupNavigation();

  document
    .getElementById("profileLogout")
    .addEventListener("click", logout);
}

// ================= BOTTOM NAV =================

function bottomNav(active) {
  return `
    <nav class="bottom-nav">

      <button
        class="nav-item ${active === "home" ? "active" : ""}"
        id="homeNav"
        type="button"
      >
        <span>🏠</span>
        <small>Home</small>
      </button>

      <button
        class="nav-item ${active === "matches" ? "active" : ""}"
        id="matchesNav"
        type="button"
      >
        <span>🏆</span>
        <small>My Matches</small>
      </button>

      <button
        class="nav-item ${active === "wallet" ? "active" : ""}"
        id="walletNav"
        type="button"
      >
        <span>💰</span>
        <small>Wallet</small>
      </button>

      <button
        class="nav-item ${active === "profile" ? "active" : ""}"
        id="profileNav"
        type="button"
      >
        <span>👤</span>
        <small>Profile</small>
      </button>

    </nav>
  `;
}

function setupNavigation() {
  const home =
    document.getElementById("homeNav");

  const matches =
    document.getElementById("matchesNav");

  const wallet =
    document.getElementById("walletNav");

  const profile =
    document.getElementById("profileNav");

  if (home) {
    home.addEventListener(
      "click",
      renderHome
    );
  }

  if (matches) {
    matches.addEventListener(
      "click",
      renderMyMatches
    );
  }

  if (wallet) {
    wallet.addEventListener(
      "click",
      renderWallet
    );
  }

  if (profile) {
    profile.addEventListener(
      "click",
      renderProfile
    );
  }
}

// ================= LOGOUT =================

async function logout() {
  try {
    await signOut(auth);

    currentUser = null;
    mode = "login";

    renderAuth();

  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );
  }
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
  } else if (type === "success") {
    box.style.background = "#12351f";
  } else {
    box.style.background = "#18202d";
  }
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

// ================= AUTH STATE =================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    currentUser = null;
    renderAuth();
    return;
  }

  try {

    const token =
      await user.getIdToken();

    currentUser =
      await verifyBackendUser(token);

    renderHome();

  } catch (error) {

    console.error(
      "SESSION ERROR:",
      error
    );

    await signOut(auth);

    currentUser = null;

    renderAuth();
  }
});
