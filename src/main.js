/* =========================================================
   TRUSTED OP - Tournament App
   USER SIDE UI
   Admin Panel: Later
   ========================================================= */

const app = document.getElementById("app") || document.body;

const tournaments = [
  {
    id: 1,
    title: "BR FULL MAP",
    subtitle: "BR FULL MAP HIGH PRICE",
    entry: 1,
    prize: 500,
    perKill: 5,
    slots: "48/50",
    time: "08:00 PM",
    map: "Bermuda",
    mode: "Squad",
    type: "Paid",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    title: "BR FULL MAP",
    subtitle: "BR FULL MAP",
    entry: 2,
    prize: 1000,
    perKill: 10,
    slots: "45/50",
    time: "07:00 PM",
    map: "Bermuda",
    mode: "Squad",
    type: "Paid",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    title: "LW METAP",
    subtitle: "LW METAP",
    entry: 5,
    prize: 2500,
    perKill: 20,
    slots: "30/30",
    time: "09:30 PM",
    map: "Lone Wolf",
    mode: "1 VS 1",
    type: "Paid",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    title: "CS CUSTOM",
    subtitle: "CS CUSTOM",
    entry: 10,
    prize: 5000,
    perKill: 50,
    slots: "20/24",
    time: "10:00 PM",
    map: "CS",
    mode: "Squad",
    type: "Paid",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80"
  }
];

let currentScreen = "home";

function money(value) {
  return `₹ ${value}`;
}

/* =========================
   INITIAL APP
========================= */

document.addEventListener("DOMContentLoaded", () => {
  showSplash();
});

/* =========================
   SPLASH
========================= */

function showSplash() {
  app.innerHTML = `
    <div class="splash-screen">
      <div class="splash-logo">
        <div class="logo-shield">TRUSTED<br><span>OP</span></div>
      </div>

      <div class="splash-title">
        Trusted <span>OP</span>
      </div>

      <div class="splash-subtitle">
        TOURNAMENT APP
      </div>

      <div class="loader"></div>
    </div>
  `;

  setTimeout(() => {
    showLogin();
  }, 1800);
}

/* =========================
   LOGIN
========================= */

function showLogin() {
  currentScreen = "login";

  app.innerHTML = `
    <div class="auth-page">

      <div class="auth-card">

        <div class="auth-logo">
          <div class="mini-logo">TRUSTED <span>OP</span></div>
        </div>

        <h1>Welcome Back!</h1>
        <p class="muted">Login to continue</p>

        <div class="auth-tabs">
          <button class="active">Login</button>
          <button onclick="showRegister()">Register</button>
        </div>

        <div class="input-box">
          <span>📱</span>
          <input id="loginPhone" type="tel" placeholder="+91 1234567890">
        </div>

        <div class="input-box">
          <span>🔒</span>
          <input id="loginPassword" type="password" placeholder="Password">
          <span class="eye">◉</span>
        </div>

        <div class="forgot">
          Forgot Password?
        </div>

        <button class="primary-btn" onclick="loginUser()">
          LOGIN
        </button>

        <div class="or">
          <span></span>
          or continue with
          <span></span>
        </div>

        <div class="social-row">
          <button>G</button>
          <button>f</button>
          <button>☘</button>
        </div>

        <p class="register-text">
          Don't have an account?
          <span onclick="showRegister()">Register</span>
        </p>

      </div>
    </div>
  `;
}

/* =========================
   REGISTER
========================= */

function showRegister() {
  currentScreen = "register";

  app.innerHTML = `
    <div class="auth-page">

      <div class="auth-card">

        <div class="auth-logo">
          <div class="mini-logo">TRUSTED <span>OP</span></div>
        </div>

        <h1>Create Account</h1>
        <p class="muted">Join Trusted OP tournaments</p>

        <div class="input-box">
          <span>👤</span>
          <input id="regName" placeholder="Full Name">
        </div>

        <div class="input-box">
          <span>📱</span>
          <input id="regPhone" type="tel" placeholder="Mobile Number">
        </div>

        <div class="input-box">
          <span>🔒</span>
          <input id="regPassword" type="password" placeholder="Create Password">
        </div>

        <div class="input-box">
          <span>🎁</span>
          <input placeholder="Referral Code (Optional)">
        </div>

        <button class="primary-btn" onclick="registerUser()">
          CREATE ACCOUNT
        </button>

        <p class="register-text">
          Already have an account?
          <span onclick="showLogin()">Login</span>
        </p>

      </div>
    </div>
  `;
}

/* =========================
   LOGIN ACTION
========================= */

function loginUser() {
  const phone = document.getElementById("loginPhone")?.value;
  const password = document.getElementById("loginPassword")?.value;

  if (!phone || !password) {
    toast("Please enter mobile number and password");
    return;
  }

  toast("Login successful");
  setTimeout(showHome, 500);
}

/* =========================
   REGISTER ACTION
========================= */

function registerUser() {
  const name = document.getElementById("regName")?.value;
  const phone = document.getElementById("regPhone")?.value;
  const password = document.getElementById("regPassword")?.value;

  if (!name || !phone || !password) {
    toast("Please fill all required fields");
    return;
  }

  toast("Account created successfully");

  setTimeout(showHome, 700);
}

/* =========================
   HOME
========================= */

function showHome() {
  currentScreen = "home";

  app.innerHTML = `
    <div class="app-shell">

      <header class="top-header">

        <div class="profile-area">
          <div class="avatar">👨🏻</div>
          <div>
            <small>Welcome back!</small>
            <strong>bizon_49</strong>
          </div>
        </div>

        <div class="header-actions">
          <div class="coin">
            🪙 ₹ 811
          </div>

          <button class="notification-btn" onclick="showNotifications()">
            🔔
            <span></span>
          </button>
        </div>

      </header>

      <div class="withdraw-banner">
        <span>💵</span>
        Instant withdrawal only on TRUSTED OP
        <span>💵</span>
      </div>

      <section class="hero-banner">
        <div>
          <small>FOLLOW OUR</small>
          <h2>INSTAGRAM<br>ACCOUNT</h2>
          <button onclick="toast('Instagram opening soon')">
            @trustedop
          </button>
        </div>

        <div class="instagram-icon">◎</div>
      </section>

      <section class="section">

        <div class="section-heading">
          <h2>My Matches</h2>
          <button onclick="showMatches()">View all ›</button>
        </div>

        <div class="match-stats">

          <div class="stat-card green">
            <div>🔄</div>
            <strong>2</strong>
            <small>ONGOING</small>
          </div>

          <div class="stat-card blue">
            <div>📅</div>
            <strong>5</strong>
            <small>UPCOMING</small>
          </div>

          <div class="stat-card purple">
            <div>✓</div>
            <strong>12</strong>
            <small>COMPLETED</small>
          </div>

        </div>

      </section>

      <section class="section">

        <div class="section-heading">
          <h2>Games</h2>
          <div class="game-tabs">
            <button class="active">Contests</button>
            <button>Challenges</button>
          </div>
        </div>

        <div class="tournament-grid">
          ${tournaments.map(tournamentCard).join("")}
        </div>

      </section>

      ${bottomNav("home")}

    </div>
  `;
}

/* =========================
   TOURNAMENT CARD
========================= */

function tournamentCard(t) {
  return `
    <div class="tournament-card"
         onclick="showTournament(${t.id})">

      <div class="tournament-image"
           style="background-image:url('${t.image}')">

        <div class="live-dot">● LIVE</div>

        <div class="game-title">
          ${t.title}
        </div>

      </div>

      <div class="tournament-info">

        <h3>${t.subtitle}</h3>

        <div class="card-row">
          <span>Entry</span>
          <strong>${money(t.entry)}</strong>
        </div>

        <div class="card-row">
          <span>Prize Pool</span>
          <strong class="green-text">${money(t.prize)}</strong>
        </div>

        <div class="slots">
          ${t.slots} SLOTS
        </div>

      </div>

    </div>
  `;
}

/* =========================
   TOURNAMENT DETAILS
========================= */

function showTournament(id) {
  const t = tournaments.find(x => x.id === id);

  if (!t) return;

  currentScreen = "tournament";

  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <button onclick="showHome()">‹</button>
        <h2>Tournament Details</h2>
        <div></div>
      </header>

      <section class="detail-hero"
        style="background-image:url('${t.image}')">

        <div class="detail-overlay">
          <h1>${t.subtitle}</h1>
          <span>Only 2 slots left!</span>
        </div>

      </section>

      <div class="price-grid">

        <div>
          <small>Entry Fee</small>
          <strong>₹ ${t.entry}</strong>
        </div>

        <div>
          <small>Prize Pool</small>
          <strong class="green-text">₹ ${t.prize}</strong>
        </div>

        <div>
          <small>Per Kill Reward</small>
          <strong class="green-text">₹ ${t.perKill}</strong>
        </div>

      </div>

      <section class="details-box">

        <div>👥 <span>Total Slots</span><b>50/50</b></div>
        <div>🎮 <span>Map</span><b>${t.map}</b></div>
        <div>⚔️ <span>Match Mode</span><b>${t.mode}</b></div>
        <div>🕐 <span>Match Time</span><b>${t.time}</b></div>
        <div>💰 <span>Type</span><b>${t.type}</b></div>
        <div>👤 <span>Join Type</span><b>Single</b></div>

      </section>

      <section class="rules">

        <h2>Rules</h2>

        <p>• No Hack / No Teaming</p>
        <p>• Abuse = Ban</p>
        <p>• Follow all match rules</p>
        <p>• Decision of Admin is final</p>

      </section>

      <button class="join-btn" onclick="joinTournament(${t.id})">
        JOIN NOW
      </button>

    </div>
  `;
}

/* =========================
   JOIN
========================= */

function joinTournament(id) {
  const t = tournaments.find(x => x.id === id);

  toast(`Joining ${t.title}...`);

  setTimeout(() => {
    toast(`Entry fee ₹${t.entry} required`);
  }, 800);
}

/* =========================
   MY MATCHES
========================= */

function showMatches() {
  currentScreen = "matches";

  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <button onclick="showHome()">‹</button>
        <h2>My Matches</h2>
        <div></div>
      </header>

      <div class="match-tabs">
        <button class="active">Ongoing</button>
        <button>Upcoming</button>
        <button>Completed</button>
      </div>

      <div class="my-match-list">

        <div class="my-match">
          <div class="match-title">
            BR FULL MAP HIGH PRICE
            <span>● LIVE</span>
          </div>

          <p>Room ID: <b>12345678</b></p>
          <p>Password: <b>1234</b></p>

          <div class="match-bottom">
            <span>08:00 PM</span>
            <span>48/50 Players</span>
            <button>View Details</button>
          </div>
        </div>

        <div class="my-match">
          <div class="match-title">
            BR FULL MAP
          </div>

          <p>Room ID: <b>87654321</b></p>
          <p>Password: <b>4321</b></p>

          <div class="match-bottom">
            <span>07:00 PM</span>
            <span>45/50 Players</span>
            <button>View Details</button>
          </div>
        </div>

      </div>

      ${bottomNav("matches")}

    </div>
  `;
}

/* =========================
   WALLET
========================= */

function showWallet() {
  currentScreen = "wallet";

  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <button onclick="showHome()">‹</button>
        <h2>My Wallet</h2>
        <div></div>
      </header>

      <div class="wallet-card">

        <small>Total Balance</small>

        <h1>₹ 811</h1>

        <div class="wallet-icon">
          💰
        </div>

      </div>

      <div class="wallet-actions">
        <button onclick="toast('Add Money')">
          ADD MONEY
        </button>

        <button onclick="toast('Withdraw')">
          WITHDRAW
        </button>
      </div>

      <section class="transaction-section">

        <div class="section-heading">
          <h2>Transaction History</h2>
          <button>View all ›</button>
        </div>

        ${transaction("Added Money", "+ ₹500", "Success")}
        ${transaction("Join Match", "- ₹5", "Success")}
        ${transaction("Withdrawal", "- ₹200", "Success")}
        ${transaction("Referral Bonus", "+ ₹50", "Success")}

      </section>

      ${bottomNav("wallet")}

    </div>
  `;
}

function transaction(title, amount, status) {
  return `
    <div class="transaction">
      <div class="transaction-icon">₹</div>

      <div>
        <strong>${title}</strong>
        <small>02 Sep 2026, 04:45 PM</small>
      </div>

      <div class="transaction-right">
        <strong>${amount}</strong>
        <small>${status}</small>
      </div>
    </div>
  `;
}

/* =========================
   EARN
========================= */

function showEarn() {
  currentScreen = "earn";

  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <button onclick="showHome()">‹</button>
        <h2>Earn</h2>
        <div></div>
      </header>

      <div class="earn-banner">

        <div>
          <small>Refer & Earn</small>
          <h2>Invite your friends<br>and earn bonus</h2>
        </div>

        <div class="gift">🎁</div>

      </div>

      <div class="referral-card">

        <small>Your Referral Code</small>

        <div class="ref-code">
          <strong>TRUSTEDOP49</strong>
          <button onclick="copyReferral()">COPY</button>
        </div>

        <p>Share your link and earn</p>

        <button class="share-btn">
          SHARE
        </button>

      </div>

      <div class="earn-stats">

        <div>
          <small>Total Referrals</small>
          <strong>23</strong>
        </div>

        <div>
          <small>Total Earned</small>
          <strong>₹ 350</strong>
        </div>

      </div>

      <section class="transaction-section">

        <div class="section-heading">
          <h2>Recent Earnings</h2>
          <button>View all ›</button>
        </div>

        ${transaction("Referral Bonus", "+ ₹50", "Success")}
        ${transaction("Referral Bonus", "+ ₹100", "Success")}

      </section>

      ${bottomNav("earn")}

    </div>
  `;
}

function copyReferral() {
  navigator.clipboard?.writeText("TRUSTEDOP49");
  toast("Referral code copied");
}

/* =========================
   TOP PLAYERS
========================= */

function showPlayers() {
  currentScreen = "players";

  const players = [
    ["🥇", "DARK_KING", "152 Wins", "₹ 2,950"],
    ["🥈", "GOD_SAMRAT", "128 Wins", "₹ 4,150"],
    ["🥉", "TPG_RAHUL", "112 Wins", "₹ 3,200"],
    ["4", "NG_AYUSH", "98 Wins", "₹ 2,750"],
    ["5", "ONLY_RED", "85 Wins", "₹ 2,150"],
    ["6", "bizon_49", "45 Wins", "₹ 1,010"]
  ];

  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <button onclick="showHome()">‹</button>
        <h2>Top Players</h2>
        <div></div>
      </header>

      <div class="leader-tabs">
        <button class="active">Win Leaderboard</button>
        <button>Earnings</button>
      </div>

      <div class="leaderboard">

        ${players.map(p => `
          <div class="player-row">

            <div class="rank">${p[0]}</div>

            <div class="player-avatar">
              👨
            </div>

            <div class="player-info">
              <strong>${p[1]}</strong>
              <small>${p[2]}</small>
            </div>

            <strong class="green-text">
              ${p[3]}
            </strong>

          </div>
        `).join("")}

      </div>

      <button class="leaderboard-btn">
        View Full Leaderboard
      </button>

      ${bottomNav("players")}

    </div>
  `;
}

/* =========================
   NOTIFICATIONS
========================= */

function showNotifications() {
  currentScreen = "notifications";

  const notifications = [
    ["🔥", "Your match is starting soon", "BR FULL MAP HIGH PRICE", "5m ago"],
    ["💵", "₹ 200 withdrawal successful", "02 Sep 2026, 10:30 PM", "2h ago"],
    ["🎁", "You have received ₹ 50 bonus", "Referral Bonus", "1d ago"],
    ["🏆", "New tournament added", "CS CUSTOM", "1d ago"],
    ["🔧", "Maintenance scheduled", "App will be down 10 mins", "2d ago"]
  ];

  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <button onclick="showHome()">‹</button>
        <h2>Notifications</h2>
        <div></div>
      </header>

      <div class="notification-list">

        ${notifications.map(n => `
          <div class="notification-item">

            <div class="notification-icon">
              ${n[0]}
            </div>

            <div>
              <strong>${n[1]}</strong>
              <p>${n[2]}</p>
            </div>

            <small>${n[3]}</small>

          </div>
        `).join("")}

      </div>

      <button class="mark-read">
        MARK ALL AS READ
      </button>

      ${bottomNav("notifications")}

    </div>
  `;
}

/* =========================
   MENU
========================= */

function showMenu() {
  currentScreen = "menu";

  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <div></div>
        <h2>Menu</h2>
        <div></div>
      </header>

      <div class="menu-profile">
        <div class="avatar large">👨🏻</div>

        <div>
          <strong>bizon_49</strong>
          <small>View your profile</small>
        </div>
      </div>

      <div class="menu-list">

        <button onclick="showProfile()">
          <span>👤</span>
          My Profile
          <b>›</b>
        </button>

        <button onclick="showWallet()">
          <span>💵</span>
          My Wallet
          <b>›</b>
        </button>

        <button onclick="showPlayers()">
          <span>🏆</span>
          Top Players
          <b>›</b>
        </button>

        <button onclick="showNotifications()">
          <span>🔔</span>
          Notifications
          <b>›</b>
        </button>

        <button>
          <span>📞</span>
          Contact Us
          <b>›</b>
        </button>

        <button class="logout" onclick="showLogin()">
          <span>⏻</span>
          Logout
          <b>›</b>
        </button>

      </div>

      ${bottomNav("menu")}

    </div>
  `;
}

/* =========================
   PROFILE
========================= */

function showProfile() {
  app.innerHTML = `
    <div class="app-shell">

      <header class="page-header">
        <button onclick="showMenu()">‹</button>
        <h2>My Profile</h2>
        <div></div>
      </header>

      <div class="profile-card">

        <div class="profile-avatar">
          👨🏻
        </div>

        <h2>bizon_49</h2>
        <p>TRUSTED OP Player</p>

      </div>

      <div class="profile-form">

        <label>Username</label>
        <input value="bizon_49">

        <label>Mobile Number</label>
        <input value="+91 1234567890">

        <label>Email</label>
        <input placeholder="Enter email">

        <button class="primary-btn">
          SAVE CHANGES
        </button>

      </div>

    </div>
  `;
}

/* =========================
   BOTTOM NAV
========================= */

function bottomNav(active) {
  return `
    <nav class="bottom-nav">

      <button
        class="${active === "earn" ? "active" : ""}"
        onclick="showEarn()">
        <span>🎁</span>
        Earn
      </button>

      <button
        class="${active === "home" ? "active" : ""}"
        onclick="showHome()">
        <span>⌂</span>
        Home
      </button>

      <button
        class="${active === "menu" ? "active" : ""}"
        onclick="showMenu()">
        <span>☰</span>
        Menu
      </button>

    </nav>
  `;
}

/* =========================
   TOAST
========================= */

function toast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const element = document.createElement("div");

  element.className = "toast";
  element.textContent = message;

  document.body.appendChild(element);

  setTimeout(() => {
    element.classList.add("show");
  }, 10);

  setTimeout(() => {
    element.classList.remove("show");

    setTimeout(() => element.remove(), 300);
  }, 2200);
}

/* =========================
   GLOBAL ACCESS
========================= */

window.showHome = showHome;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.showTournament = showTournament;
window.joinTournament = joinTournament;
window.showMatches = showMatches;
window.showWallet = showWallet;
window.showEarn = showEarn;
window.showPlayers = showPlayers;
window.showNotifications = showNotifications;
window.showMenu = showMenu;
window.showProfile = showProfile;
window.copyReferral = copyReferral;
