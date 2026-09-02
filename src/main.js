/* =========================================================
   TRUSTED OP — FINAL USER APP
   Tournament cards = IMAGE + NAME ONLY
   Details = tournament open karne ke baad
   ========================================================= */

const app = document.getElementById("app");

const LOGO = "./images/trusted-op-logo.png";

/* =========================================================
   TOURNAMENT DATA
   ========================================================= */

const tournaments = [
  {
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
  joinedMatches = JSON.parse(
    localStorage.getItem("trusted_op_joined") || "[]"
  );

  if (!Array.isArray(joinedMatches)) {
    joinedMatches = [];
  }
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

function logoHTML(className = "") {
  return `
    <img
      class="${className}"
      src="${LOGO}"
      alt="TRUSTED OP"
      onerror="this.style.display='none'"
    >
  `;
}

function toast(message) {
  const oldToast = document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toastElement = document.createElement("div");

  toastElement.className = "toast";
  toastElement.textContent = message;

  document.body.appendChild(toastElement);

  requestAnimationFrame(() => {
    toastElement.classList.add("show");
  });

  setTimeout(() => {
    toastElement.classList.remove("show");

    setTimeout(() => {
      toastElement.remove();
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
          ${logoHTML("header-logo")}
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
          <span class="notification-badge">3</span>
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
   IMPORTANT:
   CARD PAR SIRF IMAGE + NAME
   ========================================================= */

function tournamentCard(tournament) {
  return `
    <article
      class="tournament-card"
      onclick="showTournamentDetails('${tournament.id}')"
    >

      <div class="tournament-image">

        <img
          src="${escapeHTML(tournament.image)}"
          alt="${escapeHTML(tournament.title)}"
          onerror="this.style.display='none'"
        >

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

            <div class="match-stat-icon">
              🔥
            </div>

            <div class="match-stat-number">
              2
            </div>

            <div class="match-stat-label">
              ONGOING
            </div>

          </div>


          <div class="match-stat">

            <div class="match-stat-icon">
              ⏰
            </div>

            <div class="match-stat-number">
              5
            </div>

            <div class="match-stat-label">
              UPCOMING
            </div>

          </div>


          <div class="match-stat">

            <div class="match-stat-icon">
              🏆
            </div>

            <div class="match-stat-number">
              12
            </div>

            <div class="match-stat-label">
              COMPLETED
            </div>

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
              t =>
                t.status === "LIVE" ||
                t.status === "UPCOMING"
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
   TOURNAMENT LIST
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
   TOURNAMENT DETAILS
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

  const percentage =
    Math.min(
      100,
      (tournament.joined / tournament.slots) * 100
    );

  app.innerHTML = `
    <div class="app-shell detail-page">


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

      </header>


      <div class="detail-image">

        <img
          src="${escapeHTML(tournament.image)}"
          alt="${escapeHTML(tournament.title)}"
          onerror="this.style.display='none'"
        >

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


        <div class="detail-card">

          <div class="detail-card-title">
            Tournament Details
          </div>


          <div class="detail-row">

            <span>
              Prize Pool
            </span>

            <span>
              🪙 ${money(tournament.prize)}
            </span>

          </div>


          <div class="detail-row">

            <span>
              Per Kill
            </span>

            <span>
              🪙 ${money(tournament.perKill)}
            </span>

          </div>


          <div class="detail-row">

            <span>
              Entry Fee
            </span>

            <span>
              🪙 ${money(tournament.entry)}
            </span>

          </div>


          <div class="detail-row">

            <span>
              Type
            </span>

            <span>
              ${escapeHTML(tournament.type)}
            </span>

          </div>


          <div class="detail-row">

            <span>
              Map
            </span>

            <span>
              ${escapeHTML(tournament.map)}
            </span>

          </div>


          <div class="detail-row">

            <span>
              Date
            </span>

            <span>
              ${escapeHTML(tournament.date)}
            </span>

          </div>


          <div class="detail-row">

            <span>
              Time
            </span>

            <span>
              ${escapeHTML(tournament.time)}
            </span>

          </div>

        </div>


        <div class="detail-card">

          <div class="detail-card-title">
            Slots
          </div>


          <div
            class="contest-progress"
            style="margin:16px"
          >

            <span
              style="width:${percentage}%"
            ></span>

          </div>


          <div
            style="
              display:flex;
              justify-content:space-between;
              padding:0 16px 16px;
              color:#8995a8;
              font-size:12px;
            "
          >

            <span>
              ${tournament.joined}/${tournament.slots}
            </span>

            <span>
              ${Math.max(
                0,
                tournament.slots -
                tournament.joined
              )} Spot Left
            </span>

          </div>

        </div>


        <div class="detail-card">

          <div class="detail-card-title">
            Rules
          </div>

          <div style="padding:16px">

            ${tournament.rules
              .map(
                rule => `
                  <div
                    style="
                      color:#8995a8;
                      font-size:12px;
                      line-height:1.6;
                      margin-bottom:8px;
                    "
                  >
                    • ${escapeHTML(rule)}
                  </div>
                `
              )
              .join("")}

          </div>

        </div>


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
                onclick="joinTournament('${tournament.id}')"
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
   JOIN TOURNAMENT
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

        ${
          myMatches.length > 0
            ? `
              <section class="tournament-grid">

                ${myMatches
                  .map(tournamentCard)
                  .join("")}

              </section>
            `
            : `
              <div
                style="
                  text-align:center;
                  padding:70px 20px;
                  color:#8995a8;
                "
              >

                <div
                  style="
                    font-size:50px;
                    margin-bottom:15px;
                  "
                >
                  🎮
                </div>

                <h2
                  style="
                    color:#fff;
                    margin-bottom:8px;
                  "
                >
                  No Matches Yet
                </h2>

                <p style="font-size:12px">
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

          <p>
            Current TRUSTED OP wallet balance:
            ${money(balance)}
          </p>

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

      </header>


      <main class="notifications-page">

        <div class="notification-item">

          <div class="notification-icon">
            📢
          </div>

          <div>

            <div class="notification-title">
              Rules Updated
            </div>

            <div class="notification-text">
              Please maintain POV/screen recording
              during matches.
            </div>

          </div>

        </div>


        <div class="notification-item">

          <div class="notification-icon">
            🏆
          </div>

          <div>

            <div class="notification-title">
              Welcome to TRUSTED OP
            </div>

            <div class="notification-text">
              Join tournaments and compete with
              other players.
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


        <div class="menu-list">

          <button
            class="menu-item"
            onclick="showProfile()"
          >

            <div class="menu-item-icon">
              👤
            </div>

            <div class="menu-item-text">
              Profile
            </div>

            <div class="menu-item-arrow">
              ›
            </div>

          </button>


          <button
            class="menu-item"
            onclick="showTournaments()"
          >

            <div class="menu-item-icon">
              🏆
            </div>

            <div class="menu-item-text">
              Tournaments
            </div>

            <div class="menu-item-arrow">
              ›
            </div>

          </button>


          <button
            class="menu-item"
            onclick="showMatches()"
          >

            <div class="menu-item-icon">
              ⚔
            </div>

            <div class="menu-item-text">
              My Matches
            </div>

            <div class="menu-item-arrow">
              ›
            </div>

          </button>


          <button
            class="menu-item"
            onclick="showWallet()"
          >

            <div class="menu-item-icon">
              🪙
            </div>

            <div class="menu-item-text">
              Wallet
            </div>

            <div class="menu-item-arrow">
              ›
            </div>

          </button>


          <button
            class="menu-item"
            onclick="showNotifications()"
          >

            <div class="menu-item-icon">
              🔔
            </div>

            <div class="menu-item-text">
              Notifications
            </div>

            <div class="menu-item-arrow">
              ›
            </div>

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

      </header>


      <main class="profile-page">

        <section class="profile-top">

          <div class="profile-avatar">
            👤
          </div>

          <div class="profile-name">
            Trusted Player
          </div>

          <div class="profile-username">
            TRUSTED OP Member
          </div>

        </section>


        <div class="detail-card">

          <div class="detail-row">

            <span>
              Username
            </span>

            <span>
              Trusted Player
            </span>

          </div>


          <div class="detail-row">

            <span>
              Wallet
            </span>

            <span>
              ${money(balance)}
            </span>

          </div>


          <div class="detail-row">

            <span>
              Joined Matches
            </span>

            <span>
              ${joinedMatches.length}
            </span>

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
  if (
    currentPage === "details" ||
    currentPage === "notifications" ||
    currentPage === "profile"
  ) {
    showHome();
    return;
  }

  showHome();
}

/* =========================================================
   START APP
   ========================================================= */

function startApp() {
  if (!app) {
    console.error("TRUSTED OP: #app not found.");
    return;
  }

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
   RUN
   ========================================================= */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    startApp
  );
} else {
  startApp();
}
