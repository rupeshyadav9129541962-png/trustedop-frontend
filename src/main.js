const app = document.getElementById("app");

const LOGO = "./images/file_000000001d9071fb89ee875444fe92f4.png";

const tournaments = [
  {
    id: 1,
    title: "BR FULL MAP",
    game: "FREE FIRE",
    mode: "Squad",
    slots: "100/100",
    entry: 50,
    prize: 5000,
    time: "06:00 PM",
    date: "23 May",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    title: "CLASH SQUAD 1V1",
    game: "FREE FIRE",
    mode: "1v1",
    slots: "45/50",
    entry: 30,
    prize: 2000,
    time: "04:00 PM",
    date: "22 May",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    title: "BR SURVIVAL",
    game: "FREE FIRE",
    mode: "Squad",
    slots: "60/100",
    entry: 40,
    prize: 3000,
    time: "07:00 PM",
    date: "24 May",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    title: "LONE WOLF 1V1",
    game: "FREE FIRE",
    mode: "1v1",
    slots: "30/50",
    entry: 20,
    prize: 1500,
    time: "08:00 PM",
    date: "22 May",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80"
  }
];

let balance = 811;
let currentPage = "home";

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function logo() {
  return `
    <img
      class="brand-logo"
      src="${LOGO}"
      alt="TRUSTED OP"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
    >
    <div class="logo-fallback">TO</div>
  `;
}

function render(html) {
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

function toast(message) {
  const old = document.querySelector(".toast");
  if (old) old.remove();

  const el = document.createElement("div");
  el.className = "toast show";
  el.textContent = message;
  document.body.appendChild(el);

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, 2200);
}

/* ================= SPLASH ================= */

function showSplash() {
  render(`
    <div class="splash-screen">
      <div class="splash-glow"></div>

      <div class="splash-logo-box">
        ${logo()}
      </div>

      <h1>TRUSTED <span>OP</span></h1>
      <p>PLAY • COMPETE • WIN</p>

      <div class="splash-loader">
        <i></i>
      </div>

      <small>LET THE BATTLE BEGIN</small>
    </div>
  `);

  setTimeout(showLogin, 1600);
}

/* ================= AUTH ================= */

function showLogin() {
  render(`
    <div class="auth-screen">
      <div class="auth-bg-glow"></div>

      <div class="auth-container">

        <div class="auth-brand">
          <div class="auth-logo-box">
            ${logo()}
          </div>
          <h1>TRUSTED <span>OP</span></h1>
          <p>Gaming Tournament Platform</p>
        </div>

        <div class="auth-card">

          <div class="auth-tabs">
            <button class="auth-tab active" onclick="showLoginForm()">LOGIN</button>
            <button class="auth-tab" onclick="showRegisterForm()">REGISTER</button>
          </div>

          <div id="auth-form">
            ${loginForm()}
          </div>

        </div>

        <p class="auth-bottom">
          Trusted gaming • Fast rewards • Fair play
        </p>

      </div>
    </div>
  `);
}

function loginForm() {
  return `
    <h2>Welcome Back 👋</h2>
    <p class="auth-description">Login to continue playing tournaments.</p>

    <div class="field">
      <label>Mobile Number</label>
      <div class="input-wrap">
        <span>📱</span>
        <input id="login-mobile" type="tel" placeholder="Enter mobile number">
      </div>
    </div>

    <div class="field">
      <label>Password</label>
      <div class="input-wrap">
        <span>🔐</span>
        <input id="login-password" type="password" placeholder="Enter password">
      </div>
    </div>

    <button class="primary-btn" onclick="loginUser()">
      LOGIN
    </button>

    <button class="forgot-btn" onclick="toast('Password recovery coming soon')">
      Forgot Password?
    </button>
  `;
}

function registerForm() {
  return `
    <h2>Create Account</h2>
    <p class="auth-description">Join TRUSTED OP and start winning.</p>

    <div class="field">
      <label>Full Name</label>
      <div class="input-wrap">
        <span>👤</span>
        <input id="reg-name" type="text" placeholder="Full Name">
      </div>
    </div>

    <div class="field">
      <label>Mobile Number</label>
      <div class="input-wrap">
        <span>📱</span>
        <input id="reg-mobile" type="tel" placeholder="Mobile Number">
      </div>
    </div>

    <div class="field">
      <label>Create Password</label>
      <div class="input-wrap">
        <span>🔐</span>
        <input id="reg-password" type="password" placeholder="Create Password">
      </div>
    </div>

    <div class="field">
      <label>Referral Code <em>(Optional)</em></label>
      <div class="input-wrap">
        <span>🎁</span>
        <input id="reg-referral" type="text" placeholder="Referral Code">
      </div>
    </div>

    <button class="primary-btn" onclick="registerUser()">
      CREATE ACCOUNT
    </button>
  `;
}

function showLoginForm() {
  document.querySelectorAll(".auth-tab").forEach((x, i) => {
    x.classList.toggle("active", i === 0);
  });

  document.getElementById("auth-form").innerHTML = loginForm();
}

function showRegisterForm() {
  document.querySelectorAll(".auth-tab").forEach((x, i) => {
    x.classList.toggle("active", i === 1);
  });

  document.getElementById("auth-form").innerHTML = registerForm();
}

function loginUser() {
  const mobile = document.getElementById("login-mobile").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!mobile || !password) {
    toast("Please enter mobile number and password");
    return;
  }

  toast("Login successful 🎉");

  setTimeout(() => {
    showHome();
  }, 500);
}

function registerUser() {
  const name = document.getElementById("reg-name").value.trim();
  const mobile = document.getElementById("reg-mobile").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!name || !mobile || !password) {
    toast("Please fill all required fields");
    return;
  }

  toast("Account created successfully 🎉");

  setTimeout(() => {
    showHome();
  }, 600);
}

/* ================= HEADER ================= */

function header() {
  return `
    <header class="top-header">

      <div class="brand">
        <div class="brand-image">
          ${logo()}
        </div>

        <div>
          <strong>TRUSTED OP</strong>
          <small>ESPORTS</small>
        </div>
      </div>

      <div class="header-right">
        <button class="coin-box" onclick="showWallet()">
          🪙 <span>${balance}</span>
        </button>

        <button class="header-icon" onclick="showNotifications()">
          🔔
          <b>3</b>
        </button>
      </div>

    </header>
  `;
}

/* ================= BOTTOM NAV ================= */

function bottomNav(active = "home") {
  return `
    <nav class="bottom-navigation">

      <button class="${active === "home" ? "active" : ""}" onclick="showHome()">
        <span>⌂</span>
        <small>Home</small>
      </button>

      <button class="${active === "tournaments" ? "active" : ""}" onclick="showTournaments()">
        <span>🏆</span>
        <small>Tournaments</small>
      </button>

      <button class="${active === "matches" ? "active" : ""}" onclick="showMatches()">
        <span>⚔</span>
        <small>My Matches</small>
      </button>

      <button class="${active === "wallet" ? "active" : ""}" onclick="showWallet()">
        <span>🪙</span>
        <small>Wallet</small>
      </button>

      <button class="${active === "menu" ? "active" : ""}" onclick="showMenu()">
        <span>☰</span>
        <small>Menu</small>
      </button>

    </nav>
  `;
}

/* ================= HOME ================= */

function showHome() {
  currentPage = "home";

  render(`
    <div class="app-shell">

      ${header()}

      <main class="page">

        <section class="welcome-row">
          <div>
            <span class="hello">WELCOME BACK!</span>
            <h2>bizon_49</h2>
          </div>

          <div class="profile-mini" onclick="showProfile()">
            👤
          </div>
        </section>

        <section class="notice-card">
          <span class="notice-icon">📢</span>
          <div>
            <b>HACKERS & POV RULES UPDATE</b>
            <p>Player ko match ke dauran POV / screen recording maintain karna hoga.</p>
          </div>
          <span>›</span>
        </section>

        <section class="hero-card">
          <div class="hero-content">
            <small>TRUSTED OP COMMUNITY</small>
            <h1>PLAY.<br>COMPETE.<br><span>WIN.</span></h1>
            <p>India's next generation gaming tournament platform.</p>

            <button onclick="showTournaments()">
              EXPLORE TOURNAMENTS →
            </button>
          </div>

          <div class="hero-decoration">
            🎮
          </div>
        </section>

        <section class="section">
          <div class="section-title">
            <h3>My Matches</h3>
            <button onclick="showMatches()">View all</button>
          </div>

          <div class="match-stats">

            <div class="stat-box ongoing">
              <span>🔥</span>
              <strong>2</strong>
              <small>ONGOING</small>
            </div>

            <div class="stat-box upcoming">
              <span>⏰</span>
              <strong>5</strong>
              <small>UPCOMING</small>
            </div>

            <div class="stat-box completed">
              <span>🏆</span>
              <strong>12</strong>
              <small>COMPLETED</small>
            </div>

          </div>
        </section>

        <section class="section">
          <div class="section-title">
            <h3>Live Tournaments</h3>
            <button onclick="showTournaments()">View all</button>
          </div>

          <div class="filter-tabs">
            <button class="selected">All</button>
            <button>Solo</button>
            <button>Duo</button>
            <button>Squad</button>
          </div>

          <div class="tournament-grid">
            ${tournaments.map(tournamentCard).join("")}
          </div>
        </section>

      </main>

      ${bottomNav("home")}

    </div>
  `);
}

/* ================= TOURNAMENT CARD ================= */

function tournamentCard(t) {
  return `
    <article class="tournament-card" onclick="showDetails(${t.id})">

      <div class="tournament-cover">
        <img
          src="${t.image}"
          alt="${t.title}"
          loading="lazy"
        >

        <span class="game-label">${t.game}</span>

        <div class="cover-gradient"></div>

        <div class="cover-title">
          <strong>${t.title}</strong>
          <small>TOURNAMENT</small>
        </div>
      </div>

      <div class="tournament-content">

        <div class="tournament-name">
          <span>${t.mode}</span>
          <b>LIVE</b>
        </div>

        <div class="tournament-data">
          <div>
            <small>SLOTS</small>
            <strong>${t.slots}</strong>
          </div>

          <div>
            <small>ENTRY</small>
            <strong>${money(t.entry)}</strong>
          </div>

          <div>
            <small>PRIZE</small>
            <strong class="green">${money(t.prize)}</strong>
          </div>
        </div>

        <div class="tournament-footer">
          <span>📅 ${t.date} • ${t.time}</span>
          <button onclick="event.stopPropagation();joinTournament(${t.id})">
            JOIN NOW
          </button>
        </div>

      </div>

    </article>
  `;
}

/* ================= TOURNAMENTS ================= */

function showTournaments() {
  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>Tournaments</h2>
          <small>Find your next battle</small>
        </div>
        <button onclick="toast('Filters coming soon')">⚙</button>
      </header>

      <main class="page">

        <div class="category-tabs">
          <button class="active">All</button>
          <button>Solo</button>
          <button>Duo</button>
          <button>Squad</button>
        </div>

        <div class="full-tournament-list">
          ${tournaments.map(tournamentListCard).join("")}
        </div>

      </main>

      ${bottomNav("tournaments")}

    </div>
  `);
}

function tournamentListCard(t) {
  return `
    <article class="list-tournament-card">

      <img src="${t.image}" alt="${t.title}">

      <div class="list-card-info">

        <span class="game-label small">${t.game}</span>

        <h3>${t.title}</h3>

        <div class="list-meta">
          <span>👥 ${t.slots}</span>
          <span>💰 ${money(t.entry)}</span>
          <span>🏆 ${money(t.prize)}</span>
        </div>

        <div class="list-bottom">
          <span>📅 ${t.date}, ${t.time}<br>⚔ ${t.mode}</span>

          <button onclick="joinTournament(${t.id})">
            JOIN NOW
          </button>
        </div>

      </div>
    </article>
  `;
}

/* ================= DETAILS ================= */

function showDetails(id) {
  const t = tournaments.find(x => x.id === id);
  if (!t) return;

  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>Tournament Details</h2>
          <small>${t.game}</small>
        </div>
        <button onclick="toast('Tournament link copied')">↗</button>
      </header>

      <main class="page details-page">

        <div class="details-cover">
          <img src="${t.image}" alt="${t.title}">
          <div>
            <span>${t.game}</span>
            <h1>${t.title}</h1>
            <small>TOURNAMENT</small>
          </div>
        </div>

        <div class="details-stats">

          <div>
            <b>${t.slots}</b>
            <small>SLOTS</small>
          </div>

          <div>
            <b>${money(t.entry)}</b>
            <small>ENTRY FEE</small>
          </div>

          <div>
            <b class="green">${money(t.prize)}</b>
            <small>PRIZE POOL</small>
          </div>

        </div>

        <section class="detail-section">
          <h3>About Tournament</h3>

          <p>
            Trusted OP presents ${t.title} Tournament.
            Only fair players are allowed to participate.
          </p>

          <div class="rules-grid">
            <span>🗺️ Map: Bermuda</span>
            <span>⚔️ Mode: ${t.mode}</span>
            <span>🎥 POV Mandatory</span>
            <span>🛡️ Fair Play</span>
          </div>
        </section>

        <section class="detail-section">
          <h3>Tournament Information</h3>

          <div class="info-list">
            <div><span>Date</span><b>${t.date} 2026</b></div>
            <div><span>Time</span><b>${t.time}</b></div>
            <div><span>Type</span><b>${t.mode}</b></div>
            <div><span>Version</span><b>Latest</b></div>
          </div>
        </section>

        <section class="prize-box">
          <div>
            <small>GUARANTEED PRIZE</small>
            <h2>${money(t.prize)}</h2>
          </div>

          <span>🏆</span>
        </section>

        <div class="prize-breakdown">
          <div><span>🥇 1st Prize</span><b>${money(t.prize * .5)}</b></div>
          <div><span>🥈 2nd Prize</span><b>${money(t.prize * .3)}</b></div>
          <div><span>🥉 3rd Prize</span><b>${money(t.prize * .2)}</b></div>
        </div>

        <button class="join-big" onclick="joinTournament(${t.id})">
          JOIN TOURNAMENT — ${money(t.entry)}
        </button>

        <button class="share-btn" onclick="toast('Tournament link copied 📋')">
          SHARE TOURNAMENT
        </button>

      </main>

      ${bottomNav("tournaments")}

    </div>
  `);
}

/* ================= JOIN ================= */

function joinTournament(id) {
  const t = tournaments.find(x => x.id === id);
  if (!t) return;

  if (balance < t.entry) {
    toast("Insufficient balance 💰");
    return;
  }

  balance -= t.entry;

  toast(`${t.title} joined successfully! 🎮`);

  setTimeout(() => {
    showMatches();
  }, 900);
}

/* ================= MATCHES ================= */

function showMatches() {
  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>My Matches</h2>
          <small>Your tournament matches</small>
        </div>
        <button onclick="toast('Matches refreshed')">↻</button>
      </header>

      <main class="page">

        <div class="match-tabs">
          <button class="active">Ongoing</button>
          <button>Upcoming</button>
          <button>Completed</button>
        </div>

        <div class="my-match-card">

          <div class="my-match-top">
            <div>
              <span>FREE FIRE</span>
              <h3>BR FULL MAP</h3>
            </div>
            <b class="live-status">ONGOING</b>
          </div>

          <div class="room-info">
            <div><small>MATCH TIME</small><b>06:00 PM</b></div>
            <div><small>ROOM ID</small><b>12345678</b></div>
            <div><small>PASSWORD</small><b>1234</b></div>
          </div>

          <button class="view-match-btn" onclick="toast('Room details opened')">
            VIEW MATCH
          </button>

        </div>

        <div class="my-match-card">

          <div class="my-match-top">
            <div>
              <span>FREE FIRE</span>
              <h3>CLASH SQUAD 1V1</h3>
            </div>
            <b class="live-status">ONGOING</b>
          </div>

          <div class="room-info">
            <div><small>MATCH TIME</small><b>04:00 PM</b></div>
            <div><small>ROOM ID</small><b>87654321</b></div>
            <div><small>PASSWORD</small><b>4321</b></div>
          </div>

          <button class="view-match-btn" onclick="toast('Room details opened')">
            VIEW MATCH
          </button>

        </div>

        <div class="my-match-card upcoming-match">

          <div class="my-match-top">
            <div>
              <span>FREE FIRE</span>
              <h3>BR SURVIVAL</h3>
            </div>
            <b>UPCOMING</b>
          </div>

          <div class="room-info">
            <div><small>MATCH TIME</small><b>07:00 PM</b></div>
            <div><small>ROOM ID</small><b>--</b></div>
            <div><small>PASSWORD</small><b>--</b></div>
          </div>

          <button class="view-match-btn disabled">
            WAITING
          </button>

        </div>

      </main>

      ${bottomNav("matches")}

    </div>
  `);
}

/* ================= WALLET ================= */

function showWallet() {
  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>Wallet</h2>
          <small>Your balance & transactions</small>
        </div>
        <button onclick="toast('Wallet refreshed')">↻</button>
      </header>

      <main class="page">

        <section class="wallet-main">

          <div>
            <small>TOTAL BALANCE</small>
            <h1>🪙 ${balance}</h1>
            <span>Available coins</span>
          </div>

          <button onclick="toast('Add Coins coming soon')">
            + ADD COINS
          </button>

        </section>

        <section class="section">
          <div class="section-title">
            <h3>Transaction History</h3>
            <button>View All</button>
          </div>

          <div class="transactions">

            <div class="transaction">
              <span>🪙</span>
              <div><b>Added Coins</b><small>Today</small></div>
              <strong class="green">+100</strong>
            </div>

            <div class="transaction">
              <span>🎮</span>
              <div><b>Joined Tournament</b><small>Today</small></div>
              <strong class="red">-50</strong>
            </div>

            <div class="transaction">
              <span>🪙</span>
              <div><b>Added Coins</b><small>Yesterday</small></div>
              <strong class="green">+200</strong>
            </div>

          </div>
        </section>

      </main>

      ${bottomNav("wallet")}

    </div>
  `);
}

/* ================= LEADERBOARD ================= */

function showLeaderboard() {
  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>Leaderboard</h2>
          <small>Top players</small>
        </div>
        <button>↻</button>
      </header>

      <main class="page">

        <div class="leader-tabs">
          <button class="active">All Time</button>
          <button>This Month</button>
          <button>This Week</button>
        </div>

        <div class="podium">

          <div class="podium-player second">
            <span>🥈</span>
            <b>REDX</b>
            <small>8,450</small>
          </div>

          <div class="podium-player first">
            <span>👑</span>
            <b>DEADSHOT</b>
            <small>12,560</small>
          </div>

          <div class="podium-player third">
            <span>🥉</span>
            <b>NOVA KING</b>
            <small>7,890</small>
          </div>

        </div>

        <div class="leader-list">

          ${[
            ["4","GAMER X","6,450"],
            ["5","DARK FF","5,980"],
            ["6","LEGEND 07","5,230"],
            ["7","ROCKY OP","4,890"],
            ["8","ALPHA KD","4,560"]
          ].map(x => `
            <div class="leader-row">
              <b>${x[0]}</b>
              <span>👤 ${x[1]}</span>
              <strong>${x[2]}</strong>
            </div>
          `).join("")}

        </div>

      </main>

      ${bottomNav("menu")}

    </div>
  `);
}

/* ================= EARN ================= */

function showEarn() {
  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>Refer & Earn</h2>
          <small>Invite friends & earn rewards</small>
        </div>
        <button>🎁</button>
      </header>

      <main class="page">

        <section class="earn-hero">
          <div>🎁</div>
          <h1>INVITE & EARN</h1>
          <p>Share your referral code and earn exciting rewards.</p>
        </section>

        <section class="referral-card">

          <small>YOUR REFERRAL CODE</small>

          <div class="referral-code">
            <strong>TRUSTEDOP07</strong>
            <button onclick="copyReferral()">COPY</button>
          </div>

        </section>

        <section class="share-card">
          <h3>Share via</h3>

          <div class="share-buttons">
            <button onclick="toast('WhatsApp share opened')">WhatsApp</button>
            <button onclick="toast('Telegram share opened')">Telegram</button>
            <button onclick="toast('Share opened')">Share</button>
          </div>
        </section>

      </main>

      ${bottomNav("menu")}

    </div>
  `);
}

function copyReferral() {
  navigator.clipboard?.writeText("TRUSTEDOP07");
  toast("Referral code copied 📋");
}

/* ================= NOTIFICATIONS ================= */

function showNotifications() {
  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>Notifications</h2>
          <small>Latest updates</small>
        </div>
        <button>✓</button>
      </header>

      <main class="page">

        ${[
          ["🏆","Tournament Joined","You successfully joined BR FULL MAP tournament.","Just now"],
          ["💰","Wallet Updated","Your wallet transaction was successful.","1 hour ago"],
          ["📢","Rules Update","POV and screen recording rules have been updated.","Today"],
          ["🎮","Match Reminder","Your upcoming match starts soon.","Today"]
        ].map(n => `
          <div class="notification-card">
            <div class="notification-icon">${n[0]}</div>
            <div>
              <b>${n[1]}</b>
              <p>${n[2]}</p>
              <small>${n[3]}</small>
            </div>
          </div>
        `).join("")}

      </main>

    </div>
  `);
}

/* ================= PROFILE ================= */

function showProfile() {
  render(`
    <div class="app-shell">

      <header class="inner-header">
        <button onclick="showHome()">‹</button>
        <div>
          <h2>Profile</h2>
          <small>Your gaming profile</small>
        </div>
        <button onclick="toast('Edit profile coming soon')">✎</button>
      </header>

      <main class="page">

        <section class="profile-card">

          <div class="profile-avatar">👤</div>

          <h2>Trusted OP</h2>
          <p>@bizon_49 ✓</p>

          <div class="profile-stats">
            <div><b>56</b><small>Matches</small></div>
            <div><b>28</b><small>Wins</small></div>
            <div><b>50%</b><small>Win Rate</small></div>
          </div>

        </section>

        <div class="profile-menu">

          <button onclick="showMatches()">⚔️ <span>My Matches</span> ›</button>
          <button onclick="showWallet()">🪙 <span>Wallet (${balance})</span> ›</button>
          <button onclick="showNotifications()">🔔 <span>Notifications</span> ›</button>
          <button onclick="toast('Settings coming soon')">⚙️ <span>Settings</span> ›</button>

        </div>

      </main>

      ${bottomNav("menu")}

    </div>
  `);
}

/* ================= MENU ================= */

function showMenu() {
  render(`
    <div class="app-shell">

      <header class="top-header">
        <div class="brand">
          <div class="brand-image">${logo()}</div>
          <div>
            <strong>TRUSTED OP</strong>
            <small>MENU</small>
          </div>
        </div>
      </header>

      <main class="page">

        <section class="menu-profile">
          <div class="profile-avatar">👤</div>
          <div>
            <b>bizon_49</b>
            <small>Trusted OP Player</small>
          </div>
        </section>

        <div class="menu-list">

          <button onclick="showHome()">🏠 <span>Home</span> <b>›</b></button>
          <button onclick="showTournaments()">🏆 <span>Tournaments</span> <b>›</b></button>
          <button onclick="showMatches()">⚔️ <span>My Matches</span> <b>›</b></button>
          <button onclick="showWallet()">🪙 <span>Wallet</span> <b>›</b></button>
          <button onclick="showLeaderboard()">👑 <span>Leaderboard</span> <b>›</b></button>
          <button onclick="showEarn()">🎁 <span>Refer & Earn</span> <b>›</b></button>
          <button onclick="showProfile()">👤 <span>Profile</span> <b>›</b></button>
          <button onclick="toast('Support coming soon')">💬 <span>Support</span> <b>›</b></button>
          <button onclick="toast('Settings coming soon')">⚙️ <span>Settings</span> <b>›</b></button>

          <button class="logout" onclick="showLogin()">🚪 <span>Logout</span></button>

        </div>

      </main>

      ${bottomNav("menu")}

    </div>
  `);
}

/* ================= START ================= */

document.addEventListener("DOMContentLoaded", () => {
  showSplash();
});

/* ================= GLOBAL ================= */

window.showLogin = showLogin;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.showHome = showHome;
window.showTournaments = showTournaments;
window.showDetails = showDetails;
window.joinTournament = joinTournament;
window.showMatches = showMatches;
window.showWallet = showWallet;
window.showLeaderboard = showLeaderboard;
window.showEarn = showEarn;
window.showNotifications = showNotifications;
window.showProfile = showProfile;
window.showMenu = showMenu;
window.copyReferral = copyReferral;
