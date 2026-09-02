/* =========================================================
   TRUSTED OP — FINAL MAIN.JS
   Fully matches the CSS above
   ========================================================= */
import { db } from "./firebase.js";
import { ref, onValue } from "firebase/database";
const app = document.getElementById("app");

const LOGO = "./images/trusted-op-logo.png";

/* =========================================================
   TOURNAMENT DATA
   ========================================================= */

let tournaments = [];
    id: "match-1",
    title: "BR FULL MAP",
    image: "./images/br-survival.jpg",
    game: "FREE FIRE",
    type: "Squad",
    prize: 5000,
    perKill: 0,
    entry: 50,
    slots: 100,
    joined: 90,
    map: "Bermuda",
    date: "23/05/2026",
    time: "06:00 PM",
    status: "LIVE",
    rules: [
      "No hacks, cheats or mod APK.",
      "No abusive behaviour.",
      "Screen recording may be required.",
      "Admin decision will be final."
    ]
  },
  {
    id: "match-2",
    title: "CLASH SQUAD 1V1",
    image: "./images/clash-squad.jpg",
    game: "FREE FIRE",
    type: "1V1",
    prize: 2000,
    perKill: 0,
    entry: 30,
    slots: 50,
    joined: 45,
    map: "Bermuda",
    date: "23/05/2026",
    time: "04:00 PM",
    status: "LIVE",
    rules: [
      "No hacks or third-party applications.",
      "Match must be played on time.",
      "Admin decision will be final."
    ]
  },
  {
    id: "match-3",
    title: "BR SURVIVAL",
    image: "./images/br-survival-2.jpg",
    game: "FREE FIRE",
    type: "Solo",
    prize: 1000,
    perKill: 5,
    entry: 20,
    slots: 50,
    joined: 32,
    map: "Bermuda",
    date: "24/05/2026",
    time: "08:00 PM",
    status: "UPCOMING",
    rules: [
      "Only registered players can participate.",
      "No hacks or cheats.",
      "Admin decision will be final."
    ]
  },
  {
    id: "match-4",
    title: "LONE WOLF 1V1",
    image: "./images/lone-wolf.jpg",
    game: "FREE FIRE",
    type: "1V1",
    prize: 1500,
    perKill: 0,
    entry: 25,
    slots: 40,
    joined: 22,
    map: "Bermuda",
    date: "24/05/2026",
    time: "09:00 PM",
    status: "UPCOMING",
    rules: [
      "No hacks or cheats.",
      "Do not leave the match intentionally.",
      "Admin decision will be final."
    ]
  }
];

/* =========================================================
   LOCAL DATA
   ========================================================= */

let balance = Number(
  localStorage.getItem("trusted_op_balance") || 811
);

let joinedMatches = [];

try {
  const saved = JSON.parse(
    localStorage.getItem("trusted_op_joined") || "[]"
  );

  joinedMatches = Array.isArray(saved) ? saved : [];
} catch {
  joinedMatches = [];
}

let currentPage = "home";

/* =========================================================
   HELPERS
   ========================================================= */

function saveData() {
  localStorage.setItem(
    "trusted_op_balance",
    String(balance)
  );

  localStorage.setItem(
    "trusted_op_joined",
    JSON.stringify(joinedMatches)
  );
}

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function imageHTML(src, alt = "") {
  return `
    <img
      src="${escapeHTML(src)}"
      alt="${escapeHTML(alt)}"
      onerror="this.style.display='none'"
    >
  `;
}

function toast(message) {
  const old = document.querySelector(".toast");

  if (old) {
    old.remove();
  }

  const el = document.createElement("div");

  el.className = "toast";
  el.textContent = message;

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.add("show");
  });

  setTimeout(() => {
    el.classList.remove("show");

    setTimeout(() => {
      if (el.parentNode) {
        el.remove();
      }
    }, 300);
  }, 2300);
}

/* =========================================================
   HEADER
   ========================================================= */

function header() {
  return `
    <header class="app-header">

      <div class="brand">

        <div class="brand-logo">
          <img
            class="header-logo"
            src="${LOGO}"
            alt="TRUSTED OP"
            onerror="this.style.display='none'"
          >
        </div>

        <div>
          <div class="brand-name">
            TRUSTED OP
          </div>

          <div class="brand-subtitle">
            ESPORTS
          </div>
        </div>

      </div>

      <div class="header-actions">

        <button
          class="balance-box"
          onclick="showWallet()"
        >
          🪙 ${balance}
        </button>

        <button
          class="notification-btn"
          onclick="showNotifications()"
        >
          🔔
          <span class="notification-badge">
            3
          </span>
        </button>

      </div>

    </header>
  `;
}

/* =========================================================
   BOTTOM NAV
   ========================================================= */

function bottomNav(active = "home") {
  return `
    <nav class="bottom-nav">

      <button
        class="${active === "home" ? "active" : ""}"
        onclick="showHome()"
      >
        <span>⌂</span>
        <small>Home</small>
      </button>

      <button
        class="${active === "tournaments" ? "active" : ""}"
        onclick="showTournaments()"
      >
        <span>🏆</span>
        <small>Tournaments</small>
      </button>

      <button
        class="${active === "matches" ? "active" : ""}"
        onclick="showMatches()"
      >
        <span>⚔</span>
        <small>My Matches</small>
      </button>

      <button
        class="${active === "wallet" ? "active" : ""}"
        onclick="showWallet()"
      >
        <span>🪙</span>
        <small>Wallet</small>
      </button>

      <button
        class="${active === "menu" ? "active" : ""}"
        onclick="showMenu()"
      >
        <span>☰</span>
        <small>Menu</small>
      </button>

    </nav>
  `;
}

/* =========================================================
   TOURNAMENT CARD
   ONLY IMAGE + NAME
   ========================================================= */

function tournamentCard(tournament) {
  return `
    <article
      class="tournament-card"
      onclick="showTournamentDetails('${escapeHTML(tournament.id)}')"
    >

      <div class="tournament-image">

        ${imageHTML(
          tournament.image,
          tournament.title
        )}

      </div>

      <div class="tournament-card-content">

        <div class="tournament-title">
          ${escapeHTML(tournament.title)}
        </div>

      </div>

    </article>
  `;
}

/* =========================================================
   HOME
   ========================================================= */

function showHome() {
  currentPage = "home";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <section class="welcome">

          <div class="welcome-small">
            WELCOME BACK!
          </div>

          <div class="welcome-name">
            Trusted Player
          </div>

        </section>


        <section
          class="notice"
          onclick="showNotifications()"
        >

          <div class="notice-icon">
            📢
          </div>

          <div>

            <div class="notice-title">
              HACKERS & POV RULES UPDATE
            </div>

            <div class="notice-text">
              Player ko match ke dauran POV /
              screen recording maintain karna hoga.
            </div>

          </div>

        </section>


        <section class="hero">

          <div class="hero-label">
            TRUSTED OP COMMUNITY
          </div>

          <h1 class="hero-title">
            PLAY.<br>
            COMPETE.<br>
            <span>WIN.</span>
          </h1>

          <p class="hero-text">
            India's next generation gaming
            tournament platform.
          </p>

          <button
            class="hero-btn"
            onclick="showTournaments()"
          >
            EXPLORE TOURNAMENTS →
          </button>

          <div class="hero-gamepad">
            🎮
          </div>

        </section>


        <section class="section-head">

          <h2 class="section-title">
            My Matches
          </h2>

          <button
            class="view-all"
            onclick="showMatches()"
          >
            View all
          </button>

        </section>


        <section class="match-stats">

          <div class="match-stat">
            <div class="match-stat-icon">🔥</div>
            <div class="match-stat-number">2</div>
            <div class="match-stat-label">ONGOING</div>
          </div>

          <div class="match-stat">
            <div class="match-stat-icon">⏰</div>
            <div class="match-stat-number">5</div>
            <div class="match-stat-label">UPCOMING</div>
          </div>

          <div class="match-stat">
            <div class="match-stat-icon">🏆</div>
            <div class="match-stat-number">12</div>
            <div class="match-stat-label">COMPLETED</div>
          </div>

        </section>


        <section class="section-head">

          <h2 class="section-title">
            Live Tournaments
          </h2>

          <button
            class="view-all"
            onclick="showTournaments()"
          >
            View all
          </button>

        </section>


        <div class="filters">

          <button class="filter-btn active">
            All
          </button>

          <button class="filter-btn">
            Solo
          </button>

          <button class="filter-btn">
            Duo
          </button>

          <button class="filter-btn">
            Squad
          </button>

        </div>


        <section class="tournament-grid">

          ${tournaments
            .filter(
              tournament =>
                tournament.status === "LIVE" ||
                tournament.status === "UPCOMING"
            )
            .map(tournamentCard)
            .join("")}

        </section>

      </main>

      ${bottomNav("home")}

    </div>
  `;
}

/* =========================================================
   TOURNAMENTS
   ========================================================= */

function showTournaments() {
  currentPage = "tournaments";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <div class="page-title">
          Tournaments
        </div>

        <div class="page-subtitle">
          Choose your tournament
        </div>

        <div class="filters">

          <button class="filter-btn active">
            All
          </button>

          <button class="filter-btn">
            Solo
          </button>

          <button class="filter-btn">
            Duo
          </button>

          <button class="filter-btn">
            Squad
          </button>

        </div>

        <section class="tournament-grid">

          ${tournaments
            .map(tournamentCard)
            .join("")}

        </section>

      </main>

      ${bottomNav("tournaments")}

    </div>
  `;
}

/* =========================================================
   DETAILS
   ========================================================= */

function showTournamentDetails(id) {
  const tournament = tournaments.find(
    item => item.id === id
  );

  if (!tournament) {
    toast("Tournament not found");
    return;
  }

  currentPage = "details";

  const alreadyJoined =
    joinedMatches.includes(tournament.id);

  const percentage = Math.min(
    100,
    (tournament.joined / tournament.slots) * 100
  );

  app.innerHTML = `
    <div class="detail-page">

      <header class="detail-header">

        <button
          class="back-btn"
          onclick="goBack()"
        >
          ‹
        </button>

        <div class="detail-header-title">
          ${escapeHTML(tournament.title)}
        </div>

        <div></div>

      </header>


      <div class="detail-image">

        ${imageHTML(
          tournament.image,
          tournament.title
        )}

      </div>


      <main class="detail-body">

        <h1 class="detail-title">
          ${escapeHTML(tournament.title)}
        </h1>

        <p class="detail-description">
          ${escapeHTML(tournament.game)}
          •
          ${escapeHTML(tournament.type)}
          •
          ${escapeHTML(tournament.map)}
        </p>


        <section class="detail-card">

          <div class="detail-card-title">
            Tournament Details
          </div>

          <div class="detail-row">
            <span>Prize Pool</span>
            <span>🪙 ${money(tournament.prize)}</span>
          </div>

          <div class="detail-row">
            <span>Per Kill</span>
            <span>🪙 ${money(tournament.perKill)}</span>
          </div>

          <div class="detail-row">
            <span>Entry Fee</span>
            <span>🪙 ${money(tournament.entry)}</span>
          </div>

          <div class="detail-row">
            <span>Type</span>
            <span>${escapeHTML(tournament.type)}</span>
          </div>

          <div class="detail-row">
            <span>Map</span>
            <span>${escapeHTML(tournament.map)}</span>
          </div>

          <div class="detail-row">
            <span>Date</span>
            <span>${escapeHTML(tournament.date)}</span>
          </div>

          <div class="detail-row">
            <span>Time</span>
            <span>${escapeHTML(tournament.time)}</span>
          </div>

        </section>


        <section class="detail-card">

          <div class="detail-card-title">
            Slots
          </div>

          <div class="contest-progress">
            <span
              style="width:${percentage}%"
            ></span>
          </div>

          <div
            style="
              display:flex;
              justify-content:space-between;
              padding:0 16px 15px;
              color:#9292a8;
              font-size:10px;
            "
          >

            <span>
              ${tournament.joined}/${tournament.slots}
            </span>

            <span>
              ${Math.max(
                0,
                tournament.slots - tournament.joined
              )} Spot Left
            </span>

          </div>

        </section>


        <section class="detail-card">

          <div class="detail-card-title">
            Rules
          </div>

          <div style="padding:15px">

            ${tournament.rules
              .map(
                rule => `
                  <div
                    style="
                      color:#9292a8;
                      font-size:10px;
                      line-height:1.6;
                      margin-bottom:7px;
                    "
                  >
                    • ${escapeHTML(rule)}
                  </div>
                `
              )
              .join("")}

          </div>

        </section>


        ${
          alreadyJoined
            ? `
              <button
                class="join-btn"
                disabled
                style="
                  opacity:.55;
                  cursor:not-allowed;
                "
              >
                ✓ JOINED
              </button>
            `
            : `
              <button
                class="join-btn"
                onclick="joinTournament('${escapeHTML(tournament.id)}')"
              >
                JOIN MATCH
              </button>
            `
        }

      </main>

    </div>
  `;
}

/* =========================================================
   JOIN
   ========================================================= */

function joinTournament(id) {
  const tournament = tournaments.find(
    item => item.id === id
  );

  if (!tournament) {
    return;
  }

  if (joinedMatches.includes(id)) {
    toast("Already joined");
    return;
  }

  if (balance < tournament.entry) {
    toast("Insufficient wallet balance");
    return;
  }

  balance -= tournament.entry;

  joinedMatches.push(id);

  saveData();

  toast("Tournament joined successfully ✓");

  setTimeout(() => {
    showTournamentDetails(id);
  }, 600);
}

/* =========================================================
   MY MATCHES
   ========================================================= */

function showMatches() {
  currentPage = "matches";

  const myMatches = tournaments.filter(
    tournament =>
      joinedMatches.includes(tournament.id)
  );

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="matches-page">

        <div class="page-title">
          My Matches
        </div>

        <div class="page-subtitle">
          Your joined tournaments
        </div>

        ${
          myMatches.length
            ? `
              <section class="tournament-grid">
                ${myMatches
                  .map(tournamentCard)
                  .join("")}
              </section>
            `
            : `
              <div class="empty-state">

                <div class="empty-icon">
                  🎮
                </div>

                <h2>
                  No Matches Yet
                </h2>

                <p>
                  Join a tournament to see it here.
                </p>

                <button
                  class="join-btn"
                  onclick="showTournaments()"
                >
                  FIND TOURNAMENT
                </button>

              </div>
            `
        }

      </main>

      ${bottomNav("matches")}

    </div>
  `;
}

/* =========================================================
   WALLET
   ========================================================= */

function showWallet() {
  currentPage = "wallet";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="wallet-page">

        <div class="page-title">
          Wallet
        </div>

        <div class="page-subtitle">
          Manage your tournament balance
        </div>


        <section class="wallet-balance">

          <div class="wallet-balance-label">
            AVAILABLE BALANCE
          </div>

          <div class="wallet-amount">
            ${money(balance)}
          </div>

          <div class="wallet-actions">

            <button
              class="wallet-action primary"
              onclick="addDemoMoney()"
            >
              + ADD MONEY
            </button>

            <button
              class="wallet-action"
              onclick="toast('Withdrawal coming soon')"
            >
              WITHDRAW
            </button>

          </div>

        </section>


        <section class="earn-card">

          <h3>
            Transaction History
          </h3>

          <div class="transaction">

            <div class="transaction-icon">
              🪙
            </div>

            <div class="transaction-info">

              <strong>
                Current Balance
              </strong>

              <small>
                TRUSTED OP Wallet
              </small>

            </div>

            <div class="transaction-amount">
              ${money(balance)}
            </div>

          </div>

        </section>

      </main>

      ${bottomNav("wallet")}

    </div>
  `;
}

function addDemoMoney() {
  balance += 100;

  saveData();

  toast("₹100 demo balance added");

  showWallet();
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotifications() {
  currentPage = "notifications";

  app.innerHTML = `
    <div class="app-shell">

      <header class="detail-header">

        <button
          class="back-btn"
          onclick="goBack()"
        >
          ‹
        </button>

        <div class="detail-header-title">
          Notifications
        </div>

        <div></div>

      </header>


      <main class="page-content">

        <div class="notification-list">

          <div class="notification-item">

            <div class="notification-icon">
              📢
            </div>

            <div class="notification-content">

              <strong>
                Rules Updated
              </strong>

              <p>
                Please maintain POV/screen recording
                during matches.
              </p>

            </div>

          </div>


          <div class="notification-item">

            <div class="notification-icon">
              🏆
            </div>

            <div class="notification-content">

              <strong>
                Welcome to TRUSTED OP
              </strong>

              <p>
                Join tournaments and compete
                with other players.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  `;
}

/* =========================================================
   MENU
   ========================================================= */

function showMenu() {
  currentPage = "menu";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="menu-page">

        <div class="page-title">
          Menu
        </div>

        <div class="page-subtitle">
          TRUSTED OP
        </div>


        <div class="menu-list">

          <button onclick="showProfile()">
            <span class="menu-icon">👤</span>
            <span class="menu-label">Profile</span>
            <span class="menu-arrow">›</span>
          </button>

          <button onclick="showTournaments()">
            <span class="menu-icon">🏆</span>
            <span class="menu-label">Tournaments</span>
            <span class="menu-arrow">›</span>
          </button>

          <button onclick="showMatches()">
            <span class="menu-icon">⚔</span>
            <span class="menu-label">My Matches</span>
            <span class="menu-arrow">›</span>
          </button>

          <button onclick="showWallet()">
            <span class="menu-icon">🪙</span>
            <span class="menu-label">Wallet</span>
            <span class="menu-arrow">›</span>
          </button>

          <button onclick="showNotifications()">
            <span class="menu-icon">🔔</span>
            <span class="menu-label">Notifications</span>
            <span class="menu-arrow">›</span>
          </button>

        </div>

      </main>

      ${bottomNav("menu")}

    </div>
  `;
}

/* =========================================================
   PROFILE
   ========================================================= */

function showProfile() {
  currentPage = "profile";

  app.innerHTML = `
    <div class="app-shell">

      <header class="detail-header">

        <button
          class="back-btn"
          onclick="goBack()"
        >
          ‹
        </button>

        <div class="detail-header-title">
          Profile
        </div>

        <div></div>

      </header>


      <main class="page-content">

        <section class="profile-card">

          <div class="profile-avatar">
            👤
          </div>

          <h2>
            Trusted Player
          </h2>

          <p>
            TRUSTED OP Member
          </p>

        </section>


        <div class="profile-info">

          <div>
            <small>USERNAME</small>
            <strong>Trusted Player</strong>
          </div>

          <div>
            <small>WALLET BALANCE</small>
            <strong>${money(balance)}</strong>
          </div>

          <div>
            <small>JOINED MATCHES</small>
            <strong>${joinedMatches.length}</strong>
          </div>

        </div>

      </main>

    </div>
  `;
}

/* =========================================================
   BACK
   ========================================================= */

function goBack() {
  showHome();
}

/* =========================================================
   START
   ========================================================= */

function startApp() {
  showHome();
}

/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.showHome = showHome;
window.showTournaments = showTournaments;
window.showTournamentDetails = showTournamentDetails;
window.joinTournament = joinTournament;
window.showMatches = showMatches;
window.showWallet = showWallet;
window.showNotifications = showNotifications;
window.showMenu = showMenu;
window.showProfile = showProfile;
window.addDemoMoney = addDemoMoney;
window.goBack = goBack;

/* =========================================================
   RUN APP
   ========================================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    startApp
  );
} else {
  startApp();
}
