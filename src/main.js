/* TRUSTED OP
   User App - Tournament Flow
   Card: Image + Tournament Name ONLY
   Details page: Complete tournament information + JOIN MATCH
*/

const app = document.getElementById("app");

const LOGO = "./images/trusted-op-logo.png";

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

let balance = Number(localStorage.getItem("trusted_op_balance") || 811);
let joinedMatches = JSON.parse(
  localStorage.getItem("trusted_op_joined") || "[]"
);

let currentPage = "home";

function saveData() {
  localStorage.setItem("trusted_op_balance", balance);
  localStorage.setItem(
    "trusted_op_joined",
    JSON.stringify(joinedMatches)
  );
}

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
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

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function toast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);

  setTimeout(() => {
    el.classList.add("show");
  }, 20);

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

function header() {
  return `
    <header class="app-header">
      <div class="brand">
        <div class="brand-logo">
          ${logoHTML("header-logo")}
        </div>

        <div class="brand-text">
          <strong>TRUSTED OP</strong>
          <small>ESPORTS</small>
        </div>
      </div>

      <div class="header-actions">
        <button class="coin-box" onclick="showWallet()">
          🪙 ${balance}
        </button>

        <button class="icon-button" onclick="showNotifications()">
          🔔
          <span class="notification-dot">3</span>
        </button>
      </div>
    </header>
  `;
}

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

/* ---------------- HOME ---------------- */

function showHome() {
  currentPage = "home";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <section class="welcome">
          <div>
            <small>WELCOME BACK!</small>
            <h2>Trusted Player</h2>
          </div>

          <div class="profile-avatar">👤</div>
        </section>

        <section class="notice-banner" onclick="showNotifications()">
          📢
          <div>
            <strong>HACKERS & POV RULES UPDATE</strong>
            <small>
              Player ko match ke dauran POV / screen recording maintain karna hoga.
            </small>
          </div>
          <b>›</b>
        </section>

        <section class="hero-card">
          <div class="hero-content">
            <small>TRUSTED OP COMMUNITY</small>
            <h1>PLAY.<br>COMPETE.<br><span>WIN.</span></h1>

            <p>
              India's next generation gaming tournament platform.
            </p>

            <button onclick="showTournaments()">
              EXPLORE TOURNAMENTS →
            </button>
          </div>

          <div class="hero-gamepad">🎮</div>
        </section>

        <section class="section-heading">
          <h2>My Matches</h2>
          <button onclick="showMatches()">View all</button>
        </section>

        <section class="match-stats">

          <div class="stat-card">
            <span>🔥</span>
            <strong>2</strong>
            <small>ONGOING</small>
          </div>

          <div class="stat-card">
            <span>⏰</span>
            <strong>5</strong>
            <small>UPCOMING</small>
          </div>

          <div class="stat-card">
            <span>🏆</span>
            <strong>12</strong>
            <small>COMPLETED</small>
          </div>

        </section>

        <section class="section-heading">
          <h2>Live Tournaments</h2>
          <button onclick="showTournaments()">View all</button>
        </section>

        <div class="filter-tabs">
          <button class="active">All</button>
          <button>Solo</button>
          <button>Duo</button>
          <button>Squad</button>
        </div>

        <section class="tournament-grid">
          ${tournaments
            .filter(x => x.status === "LIVE" || x.status === "UPCOMING")
            .map(tournamentCard)
            .join("")}
        </section>

      </main>

      ${bottomNav("home")}

    </div>
  `;
}

/* ---------------- TOURNAMENT CARD ---------------- */

function tournamentCard(t) {
  return `
    <article
      class="tournament-card clean-card"
      onclick="showTournamentDetails('${t.id}')"
    >

      <div class="tournament-image">
        <img
          src="${escapeHTML(t.image)}"
          alt="${escapeHTML(t.title)}"
          onerror="this.style.display='none'"
        />
      </div>

      <div class="clean-card-title">
        ${escapeHTML(t.title)}
      </div>

    </article>
  `;
}

/* ---------------- TOURNAMENT LIST ---------------- */

function showTournaments() {
  currentPage = "tournaments";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <div class="page-title">
          <h1>Tournaments</h1>
          <p>Choose your tournament</p>
        </div>

        <div class="filter-tabs">
          <button class="active">All</button>
          <button>Solo</button>
          <button>Duo</button>
          <button>Squad</button>
        </div>

        <section class="tournament-grid">
          ${tournaments.map(tournamentCard).join("")}
        </section>

      </main>

      ${bottomNav("tournaments")}

    </div>
  `;
}

/* ---------------- DETAILS ---------------- */

function showTournamentDetails(id) {
  const t = tournaments.find(item => item.id === id);

  if (!t) {
    toast("Tournament not found");
    return;
  }

  const alreadyJoined = joinedMatches.includes(t.id);

  app.innerHTML = `
    <div class="app-shell details-page">

      <header class="details-header">
        <button onclick="goBack()">‹</button>

        <strong>${escapeHTML(t.title)}</strong>

        <div></div>
      </header>

      <main class="details-content">

        <div class="details-image">
          <img
            src="${escapeHTML(t.image)}"
            alt="${escapeHTML(t.title)}"
            onerror="this.style.display='none'"
          />
        </div>

        <section class="details-main">

          <h1>${escapeHTML(t.title)}</h1>

          <p class="details-game">
            ${escapeHTML(t.game)}
          </p>

          <p class="details-time">
            Time : ${escapeHTML(t.date)} at ${escapeHTML(t.time)}
          </p>

          <div class="details-stats">

            <div>
              <small>PRIZE POOL</small>
              <strong>🪙 ${money(t.prize)}</strong>
            </div>

            <div>
              <small>PER KILL</small>
              <strong>🪙 ${money(t.perKill)}</strong>
            </div>

            <div>
              <small>ENTRY FEE</small>
              <strong>🪙 ${money(t.entry)}</strong>
            </div>

          </div>

          <div class="details-stats">

            <div>
              <small>TYPE</small>
              <strong>${escapeHTML(t.type)}</strong>
            </div>

            <div>
              <small>ENTRY PER PLAYER</small>
              <strong>${money(t.entry)}</strong>
            </div>

            <div>
              <small>MAP</small>
              <strong>${escapeHTML(t.map)}</strong>
            </div>

          </div>

          <div class="slot-section">

            <div class="slot-bar">
              <span
                style="width:${Math.min(
                  100,
                  (t.joined / t.slots) * 100
                )}%"
              ></span>
            </div>

            <div class="slot-info">
              <span>
                ${Math.max(0, t.slots - t.joined)} Spot Left
              </span>

              <span>
                ${t.joined}/${t.slots}
              </span>
            </div>

          </div>

          <section class="rules-box">
            <h3>Rules</h3>

            <ul>
              ${t.rules
                .map(rule => `<li>${escapeHTML(rule)}</li>`)
                .join("")}
            </ul>
          </section>

          ${
            alreadyJoined
              ? `
                <button class="join-button joined-button" disabled>
                  ✓ JOINED
                </button>
              `
              : `
                <button
                  class="join-button"
                  onclick="joinTournament('${t.id}')"
                >
                  JOIN MATCH
                </button>
              `
          }

        </section>

      </main>

    </div>
  `;
}

/* ---------------- JOIN ---------------- */

function joinTournament(id) {
  const t = tournaments.find(item => item.id === id);

  if (!t) return;

  if (joinedMatches.includes(id)) {
    toast("Already joined");
    return;
  }

  if (balance < t.entry) {
    toast("Insufficient wallet balance");
    return;
  }

  balance -= t.entry;

  joinedMatches.push(id);

  saveData();

  toast("Tournament joined successfully ✓");

  setTimeout(() => {
    showTournamentDetails(id);
  }, 700);
}

/* ---------------- MY MATCHES ---------------- */

function showMatches() {
  currentPage = "matches";

  const myMatches = tournaments.filter(t =>
    joinedMatches.includes(t.id)
  );

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <div class="page-title">
          <h1>My Matches</h1>
          <p>Your joined tournaments</p>
        </div>

        ${
          myMatches.length
            ? `
              <section class="tournament-grid">
                ${myMatches.map(tournamentCard).join("")}
              </section>
            `
            : `
              <div class="empty-state">
                <div>🎮</div>
                <h2>No Matches Yet</h2>
                <p>Join a tournament to see it here.</p>

                <button onclick="showTournaments()">
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

/* ---------------- WALLET ---------------- */

function showWallet() {
  currentPage = "wallet";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <div class="page-title">
          <h1>Wallet</h1>
          <p>Manage your tournament balance</p>
        </div>

        <section class="wallet-card">
          <small>AVAILABLE BALANCE</small>

          <h1>${money(balance)}</h1>

          <div class="wallet-actions">
            <button onclick="addDemoMoney()">
              + ADD MONEY
            </button>

            <button onclick="toast('Withdrawal section coming soon')">
              WITHDRAW
            </button>
          </div>
        </section>

        <section class="wallet-info">
          <h3>Transaction History</h3>

          <div class="transaction">
            <span>🪙</span>
            <div>
              <strong>Current Balance</strong>
              <small>TRUSTED OP Wallet</small>
            </div>
            <b>${money(balance)}</b>
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

/* ---------------- NOTIFICATIONS ---------------- */

function showNotifications() {
  currentPage = "notifications";

  app.innerHTML = `
    <div class="app-shell">

      <header class="details-header">
        <button onclick="goBack()">‹</button>
        <strong>Notifications</strong>
        <div></div>
      </header>

      <main class="page-content">

        <div class="notification-item">
          <span>📢</span>
          <div>
            <strong>Rules Updated</strong>
            <p>
              Please maintain POV/screen recording during matches.
            </p>
          </div>
        </div>

        <div class="notification-item">
          <span>🏆</span>
          <div>
            <strong>Welcome to TRUSTED OP</strong>
            <p>
              Join tournaments and compete with other players.
            </p>
          </div>
        </div>

      </main>

    </div>
  `;
}

/* ---------------- MENU ---------------- */

function showMenu() {
  currentPage = "menu";

  app.innerHTML = `
    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <div class="page-title">
          <h1>Menu</h1>
          <p>TRUSTED OP</p>
        </div>

        <div class="menu-list">

          <button onclick="showProfile()">
            👤
            <span>Profile</span>
            <b>›</b>
          </button>

          <button onclick="showTournaments()">
            🏆
            <span>Tournaments</span>
            <b>›</b>
          </button>

          <button onclick="showMatches()">
            ⚔
            <span>My Matches</span>
            <b>›</b>
          </button>

          <button onclick="showWallet()">
            🪙
            <span>Wallet</span>
            <b>›</b>
          </button>

          <button onclick="showNotifications()">
            🔔
            <span>Notifications</span>
            <b>›</b>
          </button>

        </div>

      </main>

      ${bottomNav("menu")}

    </div>
  `;
}

/* ---------------- PROFILE ---------------- */

function showProfile() {
  currentPage = "profile";

  app.innerHTML = `
    <div class="app-shell">

      <header class="details-header">
        <button onclick="goBack()">‹</button>
        <strong>Profile</strong>
        <div></div>
      </header>

      <main class="page-content">

        <section class="profile-card">

          <div class="profile-avatar large">
            👤
          </div>

          <h2>Trusted Player</h2>
          <p>TRUSTED OP Member</p>

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

/* ---------------- BACK ---------------- */

function goBack() {
  if (currentPage === "home") {
    showHome();
  } else {
    showHome();
  }
}

/* ---------------- START ---------------- */

function startApp() {
  showHome();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}

/* Global functions */
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
