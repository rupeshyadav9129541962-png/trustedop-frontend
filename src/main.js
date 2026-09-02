/* =========================================================
   TRUSTED OP
   PREMIUM GAMING TOURNAMENT APP
   USER SIDE
   ========================================================= */

const app = document.getElementById("app") || document.body;

const LOGO =
  "./Image/file_000000001d9071fb89ee875444fe92f4.png";

let currentPage = "home";
let currentTournament = null;

const state = {
  user: {
    name: "Trusted Player",
    username: "bizon_49",
    phone: "",
    balance: 811
  },

  tournaments: [
    {
      id: 1,
      game: "FREE FIRE",
      title: "BR FULL MAP HIGH PRICE",
      entry: 1,
      prize: 500,
      perKill: 5,
      joined: 48,
      total: 50,
      time: "08:00 PM",
      map: "Bermuda",
      mode: "Squad",
      type: "Paid",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 2,
      game: "FREE FIRE",
      title: "BR FULL MAP",
      entry: 2,
      prize: 1000,
      perKill: 10,
      joined: 45,
      total: 50,
      time: "07:00 PM",
      map: "Bermuda",
      mode: "Squad",
      type: "Paid",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 3,
      game: "FREE FIRE",
      title: "LW ONETAP",
      entry: 5,
      prize: 2500,
      perKill: 20,
      joined: 30,
      total: 30,
      time: "09:30 PM",
      map: "Lone Wolf",
      mode: "1 VS 1",
      type: "Paid",
      image:
        "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: 4,
      game: "FREE FIRE",
      title: "CS CUSTOM",
      entry: 10,
      prize: 5000,
      perKill: 50,
      joined: 20,
      total: 24,
      time: "10:00 PM",
      map: "CS",
      mode: "Squad",
      type: "Paid",
      image:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80"
    }
  ]
};


/* =========================================================
   HELPERS
========================================================= */

function money(value) {
  return `₹ ${Number(value).toLocaleString("en-IN")}`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render(html) {
  app.innerHTML = html;
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
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


/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  showSplash();
});


/* =========================================================
   SPLASH
========================================================= */

function showSplash() {
  render(`
    <div class="splash-screen">

      <div class="splash-logo">
        ${logoHTML("splash-real-logo")}

        <div class="logo-shield">
          <div>TRUSTED</div>
          <span>OP</span>
        </div>
      </div>

      <div class="splash-title">
        TRUSTED <span>OP</span>
      </div>

      <div class="splash-subtitle">
        TOURNAMENT APP
      </div>

      <div class="loader"></div>

    </div>
  `);

  setTimeout(showLogin, 1800);
}


/* =========================================================
   LOGIN
========================================================= */

function showLogin() {
  render(`
    <div class="auth-page">

      <div class="auth-card">

        <div class="auth-logo">
          ${logoHTML("auth-real-logo")}

          <div class="mini-logo">
            TRUSTED <span>OP</span>
          </div>
        </div>

        <h1>Welcome Back</h1>

        <p class="muted">
          Login to continue playing tournaments
        </p>

        <div class="auth-tabs">
          <button class="active">Login</button>
          <button onclick="showRegister()">Register</button>
        </div>

        <form onsubmit="loginUser(event)">

          <div class="input-box">
            <span>📱</span>
            <input
              id="loginPhone"
              type="tel"
              placeholder="Mobile Number"
              maxlength="10"
              required
            >
          </div>

          <div class="input-box">
            <span>🔒</span>
            <input
              id="loginPassword"
              type="password"
              placeholder="Password"
              required
            >
            <span class="eye">👁</span>
          </div>

          <div
            class="forgot"
            onclick="toast('Password reset option coming soon')"
          >
            Forgot Password?
          </div>

          <button class="primary-btn" type="submit">
            LOGIN
          </button>

        </form>

        <div class="or">
          <span></span>
          OR CONTINUE WITH
          <span></span>
        </div>

        <div class="social-row">
          <button onclick="toast('Google login coming soon')">G</button>
          <button onclick="toast('Facebook login coming soon')">f</button>
          <button onclick="toast('More options coming soon')">•••</button>
        </div>

        <div class="register-text">
          Don't have an account?
          <span onclick="showRegister()">Register Now</span>
        </div>

      </div>
    </div>
  `);
}


/* =========================================================
   REGISTER
========================================================= */

function showRegister() {
  render(`
    <div class="auth-page">

      <div class="auth-card">

        <div class="auth-logo">
          ${logoHTML("auth-real-logo")}

          <div class="mini-logo">
            TRUSTED <span>OP</span>
          </div>
        </div>

        <h1>Create Account</h1>

        <p class="muted">
          Join TRUSTED OP and start winning
        </p>

        <div class="auth-tabs">
          <button onclick="showLogin()">Login</button>
          <button class="active">Register</button>
        </div>

        <form onsubmit="registerUser(event)">

          <div class="input-box">
            <span>👤</span>
            <input
              id="registerName"
              type="text"
              placeholder="Full Name"
              required
            >
          </div>

          <div class="input-box">
            <span>📱</span>
            <input
              id="registerPhone"
              type="tel"
              placeholder="Mobile Number"
              maxlength="10"
              required
            >
          </div>

          <div class="input-box">
            <span>🔒</span>
            <input
              id="registerPassword"
              type="password"
              placeholder="Create Password"
              required
            >
          </div>

          <div class="input-box">
            <span>🎁</span>
            <input
              id="registerReferral"
              type="text"
              placeholder="Referral Code (Optional)"
            >
          </div>

          <button class="primary-btn" type="submit">
            CREATE ACCOUNT
          </button>

        </form>

        <div class="register-text">
          Already have an account?
          <span onclick="showLogin()">Login Now</span>
        </div>

      </div>
    </div>
  `);
}


/* =========================================================
   AUTH ACTIONS
========================================================= */

function loginUser(event) {
  event.preventDefault();

  const phone =
    document.getElementById("loginPhone")?.value.trim();

  const password =
    document.getElementById("loginPassword")?.value.trim();

  if (!phone || !password) {
    toast("Please fill all fields");
    return;
  }

  state.user.phone = phone;

  toast("Login successful");

  setTimeout(() => {
    showHome();
  }, 500);
}


function registerUser(event) {
  event.preventDefault();

  const name =
    document.getElementById("registerName")?.value.trim();

  const phone =
    document.getElementById("registerPhone")?.value.trim();

  const password =
    document.getElementById("registerPassword")?.value.trim();

  if (!name || !phone || !password) {
    toast("Please fill all required fields");
    return;
  }

  state.user.name = name;
  state.user.phone = phone;

  toast("Account created successfully");

  setTimeout(() => {
    showHome();
  }, 500);
}


/* =========================================================
   HOME
========================================================= */

function showHome() {
  currentPage = "home";

  render(`
    <div class="app-shell">

      <header class="top-header">

        <div
          class="profile-area"
          onclick="showProfile()"
        >

          <div class="avatar">
            👤
          </div>

          <div>
            <small>Welcome back!</small>
            <strong>
              ${escapeHTML(state.user.username)}
            </strong>
          </div>

        </div>

        <div class="header-actions">

          <div class="coin">
            🪙 ${money(state.user.balance)}
          </div>

          <button
            class="notification-btn"
            onclick="showNotifications()"
          >
            🔔
            <span></span>
          </button>

        </div>

      </header>


      <div class="withdraw-banner">
        💸 Withdrawals are processed quickly & securely
      </div>


      <section class="hero-banner">

        <div>
          <small>TRUSTED OP COMMUNITY</small>

          <h2>
            PLAY.<br>
            COMPETE.<br>
            WIN.
          </h2>

          <button onclick="showEarn()">
            EARN MORE
          </button>
        </div>

        <div class="instagram-icon">
          🎮
        </div>

      </section>


      <section class="section">

        <div class="section-heading">
          <h2>My Matches</h2>

          <button onclick="showMatches()">
            View All
          </button>
        </div>

        <div class="match-stats">

          <div class="stat-card green">
            <div>🔥</div>
            <strong>2</strong>
            <small>ONGOING</small>
          </div>

          <div class="stat-card blue">
            <div>⏰</div>
            <strong>5</strong>
            <small>UPCOMING</small>
          </div>

          <div class="stat-card purple">
            <div>🏆</div>
            <strong>12</strong>
            <small>COMPLETED</small>
          </div>

        </div>

      </section>


      <section class="section">

        <div class="section-heading">

          <h2>Games</h2>

          <div class="game-tabs">
            <button class="active">
              Contests
            </button>

            <button onclick="toast('Challenges coming soon')">
              Challenges
            </button>
          </div>

        </div>

        <div class="tournament-grid">

          ${state.tournaments
            .map(tournamentCard)
            .join("")}

        </div>

      </section>


      ${bottomNav("home")}

    </div>
  `);
}


/* =========================================================
   TOURNAMENT CARD
========================================================= */

function tournamentCard(t) {
  const full = t.joined >= t.total;

  return `
    <div
      class="tournament-card"
      onclick="showTournament(${t.id})"
    >

      <div
        class="tournament-image"
        style="background-image:url('${t.image}')"
      >

        <div class="live-dot">
          ${full ? "FULL" : "LIVE"}
        </div>

        <div class="game-title">
          ${escapeHTML(t.game)}
        </div>

      </div>

      <div class="tournament-info">

        <h3>
          ${escapeHTML(t.title)}
        </h3>

        <div class="card-row">
          <span>Entry</span>
          <b>${money(t.entry)}</b>
        </div>

        <div class="card-row">
          <span>Prize</span>
          <b class="green-text">
            ${money(t.prize)}
          </b>
        </div>

        <div class="card-row">
          <span>Per Kill</span>
          <b>${money(t.perKill)}</b>
        </div>

        <div class="slots">
          👥 ${t.joined}/${t.total} Slots
        </div>

      </div>

    </div>
  `;
}


/* =========================================================
   TOURNAMENT DETAILS
========================================================= */

function showTournament(id) {
  currentTournament =
    state.tournaments.find(
      t => t.id === Number(id)
    );

  if (!currentTournament) {
    toast("Tournament not found");
    return;
  }

  const t = currentTournament;

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showHome()">
          ‹
        </button>

        <h2>
          Tournament Details
        </h2>

        <button onclick="showNotifications()">
          🔔
        </button>

      </div>


      <div
        class="detail-hero"
        style="background-image:url('${t.image}')"
      >

        <div class="detail-overlay">

          <h1>
            ${escapeHTML(t.title)}
          </h1>

          <span>
            🔴 ${escapeHTML(t.game)}
          </span>

        </div>

      </div>


      <div class="price-grid">

        <div>
          <small>ENTRY FEE</small>
          <strong>${money(t.entry)}</strong>
        </div>

        <div>
          <small>PRIZE POOL</small>
          <strong class="green-text">
            ${money(t.prize)}
          </strong>
        </div>

        <div>
          <small>PER KILL</small>
          <strong>${money(t.perKill)}</strong>
        </div>

      </div>


      <div class="details-box">

        <div>
          🎮
          <span>Game</span>
          <b>${escapeHTML(t.game)}</b>
        </div>

        <div>
          🗺️
          <span>Map</span>
          <b>${escapeHTML(t.map)}</b>
        </div>

        <div>
          👥
          <span>Mode</span>
          <b>${escapeHTML(t.mode)}</b>
        </div>

        <div>
          ⏰
          <span>Time</span>
          <b>${escapeHTML(t.time)}</b>
        </div>

        <div>
          💳
          <span>Type</span>
          <b>${escapeHTML(t.type)}</b>
        </div>

        <div>
          🎯
          <span>Slots</span>
          <b>${t.joined}/${t.total}</b>
        </div>

      </div>


      <div class="rules">

        <h2>
          Tournament Rules
        </h2>

        <p>• Use your registered in-game name.</p>
        <p>• Room details will be provided before match.</p>
        <p>• No hacks or third-party cheating tools.</p>
        <p>• Players must join the room on time.</p>
        <p>• Any unfair play may result in disqualification.</p>

      </div>


      <button
        class="join-btn"
        onclick="joinTournament(${t.id})"
        ${t.joined >= t.total ? "disabled" : ""}
      >
        ${
          t.joined >= t.total
            ? "SLOTS FULL"
            : `JOIN NOW • ${money(t.entry)}`
        }
      </button>

    </div>
  `);
}


/* =========================================================
   JOIN TOURNAMENT
========================================================= */

function joinTournament(id) {
  const tournament =
    state.tournaments.find(
      t => t.id === Number(id)
    );

  if (!tournament) return;

  if (tournament.joined >= tournament.total) {
    toast("Tournament slots are full");
    return;
  }

  if (state.user.balance < tournament.entry) {
    toast("Insufficient balance");
    return;
  }

  state.user.balance -= tournament.entry;
  tournament.joined += 1;

  toast("Tournament joined successfully");

  setTimeout(() => {
    showMatches();
  }, 700);
}


/* =========================================================
   MATCHES
========================================================= */

function showMatches() {
  currentPage = "matches";

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showHome()">
          ‹
        </button>

        <h2>My Matches</h2>

        <button onclick="showNotifications()">
          🔔
        </button>

      </div>


      <div class="match-tabs">
        <button class="active">Upcoming</button>
        <button onclick="toast('Ongoing matches')">Ongoing</button>
        <button onclick="toast('Completed matches')">Completed</button>
      </div>


      <div class="my-match-list">

        <div class="my-match">

          <div class="match-title">
            BR FULL MAP
            <span>UPCOMING</span>
          </div>

          <p>
            Room ID:
            <b>458721369</b>
          </p>

          <p>
            Password:
            <b>7845</b>
          </p>

          <div class="match-bottom">
            🕐 Today • 07:00 PM

            <button
              onclick="copyText('458721369')"
            >
              COPY ID
            </button>
          </div>

        </div>


        <div class="my-match">

          <div class="match-title">
            LW ONETAP
            <span>UPCOMING</span>
          </div>

          <p>
            Room ID:
            <b>985214763</b>
          </p>

          <p>
            Password:
            <b>2398</b>
          </p>

          <div class="match-bottom">
            🕐 Today • 09:30 PM

            <button
              onclick="copyText('985214763')"
            >
              COPY ID
            </button>
          </div>

        </div>

      </div>


      ${bottomNav("")}

    </div>
  `);
}


/* =========================================================
   WALLET
========================================================= */

function showWallet() {
  currentPage = "wallet";

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showHome()">
          ‹
        </button>

        <h2>My Wallet</h2>

        <button onclick="showNotifications()">
          🔔
        </button>

      </div>


      <div class="wallet-card">

        <small>AVAILABLE BALANCE</small>

        <h1>
          ${money(state.user.balance)}
        </h1>

        <div class="wallet-icon">
          💰
        </div>

      </div>


      <div class="wallet-actions">

        <button onclick="addMoney()">
          + ADD MONEY
        </button>

        <button onclick="withdrawMoney()">
          WITHDRAW
        </button>

      </div>


      <div class="transaction-section">

        <div class="section-heading">
          <h2>Recent Transactions</h2>
        </div>

        ${transaction(
          "🎮",
          "Tournament Entry",
          "Today • 07:00 PM",
          "- ₹ 2",
          false
        )}

        ${transaction(
          "🏆",
          "Tournament Winning",
          "Yesterday • 09:30 PM",
          "+ ₹ 100",
          true
        )}

        ${transaction(
          "💰",
          "Wallet Deposit",
          "28 Aug • 05:20 PM",
          "+ ₹ 500",
          true
        )}

      </div>


      ${bottomNav("wallet")}

    </div>
  `);
}


function transaction(
  icon,
  title,
  date,
  amount,
  positive
) {
  return `
    <div class="transaction">

      <div class="transaction-icon">
        ${icon}
      </div>

      <div>
        <strong>${title}</strong>
        <small>${date}</small>
      </div>

      <div class="transaction-right">
        <strong
          style="color:${positive ? "#18d879" : "#ff4050"}"
        >
          ${amount}
        </strong>
      </div>

    </div>
  `;
}


function addMoney() {
  toast("Add Money will be connected with payment gateway");
}


function withdrawMoney() {
  if (state.user.balance <= 0) {
    toast("Insufficient balance");
    return;
  }

  toast("Withdrawal section coming soon");
}


/* =========================================================
   EARN
========================================================= */

function showEarn() {
  currentPage = "earn";

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showHome()">
          ‹
        </button>

        <h2>Earn Money</h2>

        <button onclick="showNotifications()">
          🔔
        </button>

      </div>


      <div class="earn-banner">

        <div>
          <small>REFER & EARN</small>

          <h2>
            Invite Friends<br>
            & Earn Rewards
          </h2>
        </div>

        <div class="gift">
          🎁
        </div>

      </div>


      <div class="referral-card">

        <small>
          YOUR REFERRAL CODE
        </small>

        <div class="ref-code">

          <strong>
            TRUSTEDOP49
          </strong>

          <button onclick="copyReferral()">
            COPY
          </button>

        </div>

        <p>
          Share your referral code with friends
          and earn rewards when they join.
        </p>

        <button
          class="share-btn"
          onclick="shareReferral()"
        >
          SHARE REFERRAL CODE
        </button>

      </div>


      <div class="earn-stats">

        <div>
          <small>FRIENDS INVITED</small>
          <strong>12</strong>
        </div>

        <div>
          <small>TOTAL EARNED</small>
          <strong>₹ 1,250</strong>
        </div>

      </div>


      <div class="transaction-section">

        <div class="section-heading">
          <h2>Referral History</h2>
        </div>

        ${transaction(
          "🎁",
          "Referral Bonus",
          "Today",
          "+ ₹ 50",
          true
        )}

        ${transaction(
          "🎁",
          "Referral Bonus",
          "Yesterday",
          "+ ₹ 100",
          true
        )}

      </div>


      ${bottomNav("earn")}

    </div>
  `);
}


function copyReferral() {
  copyText("TRUSTEDOP49");
}


function shareReferral() {
  const text =
    "Join TRUSTED OP tournaments and win rewards! Referral Code: TRUSTEDOP49";

  if (navigator.share) {
    navigator.share({
      title: "TRUSTED OP",
      text
    });
  } else {
    copyText(text);
  }
}


/* =========================================================
   LEADERBOARD
========================================================= */

function showPlayers() {
  currentPage = "players";

  const players = [
    ["🥇", "RDX KING", "₹ 12,450"],
    ["🥈", "OP GAMER", "₹ 9,850"],
    ["🥉", "BIZON 49", "₹ 8,210"],
    ["4", "HEADSHOT OP", "₹ 7,950"],
    ["5", "DARK FF", "₹ 6,780"],
    ["6", "LEGEND", "₹ 5,920"]
  ];

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showHome()">
          ‹
        </button>

        <h2>Top Players</h2>

        <button onclick="showNotifications()">
          🔔
        </button>

      </div>


      <div class="leader-tabs">

        <button class="active">
          EARNINGS
        </button>

        <button>
          WINS
        </button>

        <button>
          KILLS
        </button>

      </div>


      <div class="leaderboard">

        ${players
          .map(
            player => `
              <div class="player-row">

                <div class="rank">
                  ${player[0]}
                </div>

                <div class="player-avatar">
                  👤
                </div>

                <div class="player-info">
                  <strong>
                    ${player[1]}
                  </strong>

                  <small>
                    Trusted OP Player
                  </small>
                </div>

                <strong>
                  ${player[2]}
                </strong>

              </div>
            `
          )
          .join("")}

      </div>


      <button
        class="leaderboard-btn"
        onclick="toast('Leaderboard updated daily')"
      >
        VIEW FULL LEADERBOARD
      </button>


      ${bottomNav("")}

    </div>
  `);
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showNotifications() {
  currentPage = "notifications";

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showHome()">
          ‹
        </button>

        <h2>Notifications</h2>

        <button
          onclick="toast('All notifications cleared')"
        >
          ✓
        </button>

      </div>


      <div class="notification-list">

        ${notification(
          "🏆",
          "Tournament Joined",
          "You successfully joined BR FULL MAP.",
          "5m"
        )}

        ${notification(
          "💰",
          "Winning Added",
          "₹ 100 has been added to your wallet.",
          "1h"
        )}

        ${notification(
          "🎮",
          "Match Reminder",
          "Your match starts at 07:00 PM.",
          "2h"
        )}

        ${notification(
          "🎁",
          "Referral Reward",
          "You received a referral reward.",
          "1d"
        )}

      </div>


      <button
        class="mark-read"
        onclick="toast('All notifications marked as read')"
      >
        MARK ALL AS READ
      </button>

    </div>
  `);
}


function notification(
  icon,
  title,
  text,
  time
) {
  return `
    <div class="notification-item">

      <div class="notification-icon">
        ${icon}
      </div>

      <div>
        <strong>${title}</strong>
        <p>${text}</p>
      </div>

      <small>${time}</small>

    </div>
  `;
}


/* =========================================================
   MENU
========================================================= */

function showMenu() {
  currentPage = "menu";

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showHome()">
          ‹
        </button>

        <h2>Menu</h2>

        <button onclick="showNotifications()">
          🔔
        </button>

      </div>


      <div
        class="menu-profile"
        onclick="showProfile()"
      >

        <div class="avatar large">
          👤
        </div>

        <div>
          <strong>
            ${escapeHTML(state.user.name)}
          </strong>

          <small>
            @${escapeHTML(state.user.username)}
          </small>
        </div>

      </div>


      <div class="menu-list">

        <button onclick="showProfile()">
          <span>👤</span>
          My Profile
          <b>›</b>
        </button>

        <button onclick="showWallet()">
          <span>💰</span>
          Wallet
          <b>›</b>
        </button>

        <button onclick="showMatches()">
          <span>🎮</span>
          My Matches
          <b>›</b>
        </button>

        <button onclick="showPlayers()">
          <span>🏆</span>
          Top Players
          <b>›</b>
        </button>

        <button onclick="showEarn()">
          <span>🎁</span>
          Refer & Earn
          <b>›</b>
        </button>

        <button onclick="showNotifications()">
          <span>🔔</span>
          Notifications
          <b>›</b>
        </button>

        <button onclick="toast('Support will be available soon')">
          <span>💬</span>
          Contact Support
          <b>›</b>
        </button>

        <button
          class="logout"
          onclick="logoutUser()"
        >
          <span>🚪</span>
          Logout
          <b>›</b>
        </button>

      </div>


      ${bottomNav("menu")}

    </div>
  `);
}


/* =========================================================
   PROFILE
========================================================= */

function showProfile() {
  currentPage = "profile";

  render(`
    <div class="app-shell">

      <div class="page-header">

        <button onclick="showMenu()">
          ‹
        </button>

        <h2>My Profile</h2>

        <button onclick="showNotifications()">
          🔔
        </button>

      </div>


      <div class="profile-card">

        <div class="profile-avatar">
          👤
        </div>

        <h2>
          ${escapeHTML(state.user.name)}
        </h2>

        <p>
          @${escapeHTML(state.user.username)}
        </p>

      </div>


      <form
        class="profile-form"
        onsubmit="saveProfile(event)"
      >

        <label>FULL NAME</label>

        <input
          id="profileName"
          value="${escapeHTML(state.user.name)}"
          required
        >


        <label>USERNAME</label>

        <input
          value="${escapeHTML(state.user.username)}"
          disabled
        >


        <label>MOBILE NUMBER</label>

        <input
          value="${escapeHTML(state.user.phone || "Not added")}"
          disabled
        >


        <button
          class="primary-btn"
          type="submit"
        >
          SAVE CHANGES
        </button>

      </form>

    </div>
  `);
}


function saveProfile(event) {
  event.preventDefault();

  const name =
    document.getElementById("profileName")?.value.trim();

  if (!name) {
    toast("Name cannot be empty");
    return;
  }

  state.user.name = name;

  toast("Profile updated");

  setTimeout(showProfile, 400);
}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {
  toast("Logged out");

  setTimeout(() => {
    showLogin();
  }, 500);
}


/* =========================================================
   BOTTOM NAV
========================================================= */

function bottomNav(active) {
  return `
    <nav class="bottom-nav">

      <button
        class="${active === "earn" ? "active" : ""}"
        onclick="showEarn()"
      >
        <span>🎁</span>
        Earn
      </button>

      <button
        class="${active === "home" ? "active" : ""}"
        onclick="showHome()"
      >
        <span>⌂</span>
        Home
      </button>

      <button
        class="${active === "menu" ? "active" : ""}"
        onclick="showMenu()"
      >
        <span>☰</span>
        Menu
      </button>

    </nav>
  `;
}


/* =========================================================
   COPY
========================================================= */

function copyText(text) {
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast("Copied successfully"))
      .catch(() => toast(text));
  } else {
    toast(text);
  }
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function toast(message) {
  let element =
    document.querySelector(".toast");

  if (!element) {
    element = document.createElement("div");
    element.className = "toast";
    document.body.appendChild(element);
  }

  element.textContent = message;

  clearTimeout(toastTimer);

  requestAnimationFrame(() => {
    element.classList.add("show");
  });

  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2200);
}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.showSplash = showSplash;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.loginUser = loginUser;
window.registerUser = registerUser;

window.showHome = showHome;
window.showTournament = showTournament;
window.joinTournament = joinTournament;
window.showMatches = showMatches;
window.showWallet = showWallet;
window.showEarn = showEarn;
window.showPlayers = showPlayers;
window.showNotifications = showNotifications;
window.showMenu = showMenu;
window.showProfile = showProfile;

window.addMoney = addMoney;
window.withdrawMoney = withdrawMoney;
window.copyReferral = copyReferral;
window.shareReferral = shareReferral;
window.saveProfile = saveProfile;
window.logoutUser = logoutUser;
window.copyText = copyText;
window.toast = toast;
