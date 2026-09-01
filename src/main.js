import "./style.css";

import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const app = document.getElementById("app");

let authMode = "login";
let currentUser = null;

/* =========================
   DEMO CONTEST DATA
========================= */

const contests = [
  {
    id: 1,
    title: "SOLO KILL CHALLENGE",
    mode: "SOLO",
    map: "Bermuda",
    entry: 10,
    prize: 20,
    kill: 2,
    slots: 48,
    filled: 31,
    time: "8:00 PM",
    status: "LIVE"
  },
  {
    id: 2,
    title: "DUO BATTLE",
    mode: "DUO",
    map: "Bermuda",
    entry: 20,
    prize: 40,
    kill: 4,
    slots: 24,
    filled: 15,
    time: "9:00 PM",
    status: "UPCOMING"
  },
  {
    id: 3,
    title: "SQUAD CLASH",
    mode: "SQUAD",
    map: "Alpine",
    entry: 40,
    prize: 100,
    kill: 10,
    slots: 12,
    filled: 8,
    time: "10:00 PM",
    status: "UPCOMING"
  }
];

/* =========================
   AUTH SCREEN
========================= */

function renderAuth() {
  app.innerHTML = `
    <div class="auth-page">

      <div class="brand">
        <div class="brand-mark">T</div>

        <div>
          <h1>TRUSTED <span>OP</span></h1>
          <p>TOURNAMENT ARENA</p>
        </div>
      </div>

      <div class="auth-card">

        <div class="auth-heading">
          <h2>
            ${authMode === "login"
              ? "Welcome Back"
              : "Create Account"}
          </h2>

          <p>
            ${authMode === "login"
              ? "Enter your details to continue"
              : "Join the Trusted OP tournament arena"}
          </p>
        </div>

        <div id="authMessage"></div>

        <form id="authForm">

          ${
            authMode === "signup"
              ? `
                <label>FULL NAME</label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              `
              : ""
          }

          <label>EMAIL</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
          />

          <label>PASSWORD</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="${
              authMode === "login"
                ? "current-password"
                : "new-password"
            }"
            minlength="6"
            required
          />

          <button class="primary-btn" type="submit">
            ${
              authMode === "login"
                ? "LOGIN TO ARENA"
                : "CREATE ACCOUNT"
            }
          </button>

        </form>

        <div class="auth-switch">
          ${
            authMode === "login"
              ? `
                Don't have an account?
                <button id="switchAuth">
                  Create Account
                </button>
              `
              : `
                Already have an account?
                <button id="switchAuth">
                  Login
                </button>
              `
          }
        </div>

        <div class="security-note">
          🔒 Secure Firebase Authentication
        </div>

      </div>

    </div>
  `;

  document
    .getElementById("authForm")
    .addEventListener("submit", handleAuth);

  document
    .getElementById("switchAuth")
    .addEventListener("click", () => {
      authMode =
        authMode === "login"
          ? "signup"
          : "login";

      renderAuth();
    });
}

/* =========================
   LOGIN / SIGNUP
========================= */

async function handleAuth(event) {
  event.preventDefault();

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;

  const button =
    document.querySelector(".primary-btn");

  button.disabled = true;
  button.textContent =
    authMode === "login"
      ? "LOGGING IN..."
      : "CREATING...";

  try {
    if (authMode === "login") {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } else {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    }

  } catch (error) {
    console.error(error);

    let message =
      "Something went wrong.";

    if (
      error.code ===
      "auth/email-already-in-use"
    ) {
      message =
        "This email is already registered.";
    } else if (
      error.code === "auth/invalid-email"
    ) {
      message =
        "Please enter a valid email.";
    } else if (
      error.code === "auth/weak-password"
    ) {
      message =
        "Password must be at least 6 characters.";
    } else if (
      error.code ===
        "auth/invalid-credential" ||
      error.code ===
        "auth/wrong-password" ||
      error.code ===
        "auth/user-not-found"
    ) {
      message =
        "Email or password is incorrect.";
    }

    showAuthMessage(message);
  }
}

/* =========================
   HOME
========================= */

function renderHome() {
  app.innerHTML = `
    <div class="app-shell">

      <header class="top-header">

        <div class="brand-small">
          <div class="brand-mark small">T</div>

          <div>
            <strong>
              TRUSTED <span>OP</span>
            </strong>

            <small>
              TOURNAMENT ARENA
            </small>
          </div>
        </div>

        <button
          class="notification-btn"
          id="notificationBtn"
        >
          🔔
          <i></i>
        </button>

      </header>

      <main class="home-content">

        <section class="hero-banner">

          <div class="hero-content">

            <span class="hero-tag">
              🔥 LIVE TOURNAMENTS
            </span>

            <h1>
              PLAY.
              <span>COMPETE.</span>
              WIN.
            </h1>

            <p>
              Join competitive Free Fire matches
              and prove your skills.
            </p>

            <button
              class="hero-btn"
              id="scrollContest"
            >
              EXPLORE CONTESTS →
            </button>

          </div>

          <div class="hero-gfx">
            🎮
          </div>

        </section>

        <section class="section">

          <div class="section-heading">

            <div>
              <span class="section-label">
                BATTLE ARENA
              </span>

              <h2>
                LIVE & UPCOMING
              </h2>
            </div>

            <button
              class="view-all"
              id="viewAll"
            >
              VIEW ALL
            </button>

          </div>

          <div class="filter-row">

            <button class="filter active">
              ALL
            </button>

            <button class="filter">
              SOLO
            </button>

            <button class="filter">
              DUO
            </button>

            <button class="filter">
              SQUAD
            </button>

          </div>

          <div
            class="contest-grid"
            id="contestGrid"
          >
            ${contests.map(contestCard).join("")}
          </div>

        </section>

      </main>

      ${bottomNavigation("home")}

    </div>
  `;

  document
    .getElementById("notificationBtn")
    .addEventListener(
      "click",
      () => {
        alert(
          "No new notifications."
        );
      }
    );

  document
    .getElementById("scrollContest")
    .addEventListener(
      "click",
      () => {
        document
          .getElementById("contestGrid")
          .scrollIntoView({
            behavior: "smooth"
          });
      }
    );

  document
    .querySelectorAll(".contest-card")
    .forEach(card => {
      card.addEventListener(
        "click",
        () => {
          const id =
            Number(card.dataset.id);

          renderMatchDetails(id);
        }
      );
    });

  setupBottomNavigation();
}

/* =========================
   CONTEST CARD
========================= */

function contestCard(contest) {
  const remaining =
    contest.slots - contest.filled;

  return `
    <article
      class="contest-card"
      data-id="${contest.id}"
    >

      <div class="contest-top">

        <div>
          <span class="mode-badge">
            ${contest.mode}
          </span>

          <h3>
            ${contest.title}
          </h3>
        </div>

        <span class="
          status-badge
          ${contest.status === "LIVE"
            ? "live"
            : ""}
        ">
          ${
            contest.status === "LIVE"
              ? "● LIVE"
              : "UPCOMING"
          }
        </span>

      </div>

      <div class="contest-map">
        🗺️ ${contest.map}
        <span>•</span>
        🕐 ${contest.time}
      </div>

      <div class="contest-prize">

        <div>
          <small>ENTRY</small>
          <strong>₹${contest.entry}</strong>
        </div>

        <div>
          <small>PRIZE POOL</small>
          <strong class="prize">
            ₹${contest.prize}
          </strong>
        </div>

        <div>
          <small>PER KILL</small>
          <strong>₹${contest.kill}</strong>
        </div>

      </div>

      <div class="slots">

        <div class="slot-text">
          <span>
            ${contest.filled}/${contest.slots}
            Players
          </span>

          <span>
            ${remaining} Slots Left
          </span>
        </div>

        <div class="progress">
          <span
            style="
              width:
              ${(contest.filled /
                contest.slots) *
                100}%
            "
          ></span>
        </div>

      </div>

      <button
        class="contest-btn"
        type="button"
      >
        VIEW CONTEST →
      </button>

    </article>
  `;
}

/* =========================
   MATCH DETAILS
========================= */

function renderMatchDetails(id) {
  const contest =
    contests.find(
      item => item.id === id
    );

  if (!contest) {
    renderHome();
    return;
  }

  app.innerHTML = `
    <div class="app-shell">

      <header class="top-header">

        <button
          class="back-btn"
          id="backBtn"
        >
          ←
        </button>

        <div class="page-title">
          MATCH DETAILS
        </div>

        <div></div>

      </header>

      <main class="details-content">

        <div class="details-status">
          ${
            contest.status === "LIVE"
              ? "● LIVE NOW"
              : "UPCOMING MATCH"
          }
        </div>

        <h1>
          ${contest.title}
        </h1>

        <p class="details-sub">
          ${contest.mode} • ${contest.map}
          • ${contest.time}
        </p>

        <section class="details-card">

          <div class="details-grid">

            <div>
              <small>ENTRY FEE</small>
              <strong>
                ₹${contest.entry}
              </strong>
            </div>

            <div>
              <small>PRIZE POOL</small>
              <strong class="prize">
                ₹${contest.prize}
              </strong>
            </div>

            <div>
              <small>PER KILL</small>
              <strong>
                ₹${contest.kill}
              </strong>
            </div>

            <div>
              <small>SLOTS</small>
              <strong>
                ${contest.filled}/${contest.slots}
              </strong>
            </div>

          </div>

        </section>

        <section class="details-card">

          <h2>🎮 MATCH INFORMATION</h2>

          <div class="info-list">

            <div>
              <span>Game</span>
              <strong>Free Fire MAX</strong>
            </div>

            <div>
              <span>Mode</span>
              <strong>${contest.mode}</strong>
            </div>

            <div>
              <span>Map</span>
              <strong>${contest.map}</strong>
            </div>

            <div>
              <span>Match Time</span>
              <strong>${contest.time}</strong>
            </div>

            <div>
              <span>Room ID</span>
              <strong class="locked">
                🔒 Hidden
              </strong>
            </div>

            <div>
              <span>Password</span>
              <strong class="locked">
                🔒 Hidden
              </strong>
            </div>

          </div>

        </section>

        <section class="details-card">

          <h2>📋 MATCH RULES</h2>

          <div class="rules">

            <p>
              01. Only registered players
              can participate.
            </p>

            <p>
              02. Teaming with other players
              is prohibited.
            </p>

            <p>
              03. Hack or unfair gameplay
              results in a ban.
            </p>

            <p>
              04. Room details will be released
              by the admin.
            </p>

          </div>

        </section>

        <button
          class="join-btn"
          id="joinBtn"
        >
          JOIN CONTEST • ₹${contest.entry}
        </button>

      </main>

    </div>
  `;

  document
    .getElementById("backBtn")
    .addEventListener(
      "click",
      renderHome
    );

  document
    .getElementById("joinBtn")
    .addEventListener(
      "click",
      () => {
        alert(
          "Wallet connection will be added next."
        );
      }
    );
}

/* =========================
   MY MATCHES
========================= */

function renderMyMatches() {
  app.innerHTML = `
    <div class="app-shell">

      <header class="top-header">
        <div class="page-title">
          MY MATCHES
        </div>
      </header>

      <main class="empty-page">

        <div class="empty-icon">
          🏆
        </div>

        <h2>
          No Matches Yet
        </h2>

        <p>
          Your joined contests will
          appear here.
        </p>

        <button
          class="join-btn"
          id="browseBtn"
        >
          BROWSE CONTESTS
        </button>

      </main>

      ${bottomNavigation("matches")}

    </div>
  `;

  document
    .getElementById("browseBtn")
    .addEventListener(
      "click",
      renderHome
    );

  setupBottomNavigation();
}

/* =========================
   WALLET
========================= */

function renderWallet() {
  app.innerHTML = `
    <div class="app-shell">

      <header class="top-header">
        <div class="page-title">
          WALLET
        </div>
      </header>

      <main class="wallet-content">

        <section class="wallet-card">

          <small>
            AVAILABLE BALANCE
          </small>

          <h1>
            ₹0.00
          </h1>

          <p>
            Trusted OP Wallet
          </p>

        </section>

        <div class="wallet-actions">

          <button>
            <span>＋</span>
            Add Money
          </button>

          <button>
            <span>↗</span>
            Withdraw
          </button>

        </div>

        <section class="details-card">

          <h2>
            TRANSACTION HISTORY
          </h2>

          <div class="empty-state">
            No transactions yet.
          </div>

        </section>

      </main>

      ${bottomNavigation("wallet")}

    </div>
  `;

  setupBottomNavigation();
}

/* =========================
   PROFILE
========================= */

function renderProfile() {
  const email =
    currentUser?.email ||
    "Trusted OP User";

  app.innerHTML = `
    <div class="app-shell">

      <header class="top-header">
        <div class="page-title">
          PROFILE
        </div>
      </header>

      <main class="profile-content">

        <section class="profile-card">

          <div class="profile-avatar">
            ${email
              .charAt(0)
              .toUpperCase()}
          </div>

          <h2>
            ${escapeHtml(email)}
          </h2>

          <p>
            Trusted OP Player
          </p>

        </section>

        <section class="details-card">

          <div class="info-list">

            <div>
              <span>Email</span>
              <strong>
                ${escapeHtml(email)}
              </strong>
            </div>

            <div>
              <span>User ID</span>
              <strong>
                ${escapeHtml(
                  currentUser?.uid || ""
                )}
              </strong>
            </div>

          </div>

        </section>

        <button
          class="logout-full"
          id="logoutBtn"
        >
          LOGOUT
        </button>

      </main>

      ${bottomNavigation("profile")}

    </div>
  `;

  document
    .getElementById("logoutBtn")
    .addEventListener(
      "click",
      logout
    );

  setupBottomNavigation();
}

/* =========================
   BOTTOM NAVIGATION
========================= */

function bottomNavigation(active) {
  return `
    <nav class="bottom-nav">

      <button
        class="nav-item ${
          active === "home"
            ? "active"
            : ""
        }"
        data-page="home"
      >
        <span>⌂</span>
        <small>HOME</small>
      </button>

      <button
        class="nav-item ${
          active === "matches"
            ? "active"
            : ""
        }"
        data-page="matches"
      >
        <span>🏆</span>
        <small>MATCHES</small>
      </button>

      <button
        class="nav-item ${
          active === "wallet"
            ? "active"
            : ""
        }"
        data-page="wallet"
      >
        <span>₹</span>
        <small>WALLET</small>
      </button>

      <button
        class="nav-item ${
          active === "profile"
            ? "active"
            : ""
        }"
        data-page="profile"
      >
        <span>♙</span>
        <small>PROFILE</small>
      </button>

    </nav>
  `;
}

function setupBottomNavigation() {
  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const page =
            button.dataset.page;

          if (page === "home")
            renderHome();

          if (page === "matches")
            renderMyMatches();

          if (page === "wallet")
            renderWallet();

          if (page === "profile")
            renderProfile();
        }
      );

    });
}

/* =========================
   LOGOUT
========================= */

async function logout() {
  await signOut(auth);
  currentUser = null;
  authMode = "login";
  renderAuth();
}

/* =========================
   AUTH MESSAGE
========================= */

function showAuthMessage(message) {
  const box =
    document.getElementById(
      "authMessage"
    );

  if (!box) return;

  box.textContent = message;
  box.className = "auth-message";
}

/* =========================
   SECURITY
========================= */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   FIREBASE SESSION
========================= */

onAuthStateChanged(
  auth,
  user => {

    if (user) {
      currentUser = {
        uid: user.uid,
        email: user.email
      };

      renderHome();

    } else {
      currentUser = null;
      renderAuth();
    }

  }
);
