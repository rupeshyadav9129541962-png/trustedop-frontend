import { auth, db } from "../src/firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  onValue
} from "firebase/database";

/* =========================================================
   TRUSTED OP — ADMIN PANEL
   Firebase Realtime Database
   ========================================================= */

const app = document.getElementById("adminApp");

const LOGO = "../images/trusted-op-logo.png";

let currentPage = "dashboard";
let tournaments = {};
let unsubscribeTournaments = null;

/* ================= HELPERS ================= */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN");
}

function toast(message) {
  let el = document.querySelector(".admin-toast");

  if (!el) {
    el = document.createElement("div");
    el.className = "admin-toast";
    document.body.appendChild(el);
  }

  el.textContent = message;
  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return value;
  }
}

/* ================= LOGIN ================= */

function showLogin(error = "") {
  app.innerHTML = `
    <div class="admin-login">

      <div class="login-card">

        <div class="login-logo">
          <img src="${LOGO}" alt="TRUSTED OP">
        </div>

        <div class="login-title">
          TRUSTED OP
        </div>

        <div class="login-subtitle">
          ADMIN PANEL
        </div>

        <div class="login-error" id="loginError"
             style="${error ? "display:block" : ""}">
          ${escapeHTML(error)}
        </div>

        <form id="loginForm">

          <div class="form-group">
            <label>ADMIN EMAIL</label>
            <input
              id="adminEmail"
              class="form-input"
              type="email"
              placeholder="Enter admin email"
              required
            >
          </div>

          <div class="form-group">
            <label>PASSWORD</label>
            <input
              id="adminPassword"
              class="form-input"
              type="password"
              placeholder="Enter password"
              required
            >
          </div>

          <button class="primary-btn" type="submit">
            LOGIN TO ADMIN PANEL
          </button>

        </form>

      </div>

    </div>
  `;

  document
    .getElementById("loginForm")
    .addEventListener("submit", adminLogin);
}

async function adminLogin(event) {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  const errorBox = document.getElementById("loginError");

  errorBox.style.display = "none";

  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    toast("Login successful");
  } catch (error) {
    console.error(error);

    errorBox.textContent =
      error.code === "auth/invalid-credential"
        ? "Email or password is incorrect."
        : error.message;

    errorBox.style.display = "block";
  }
}

/* ================= ADMIN LAYOUT ================= */

function renderAdminShell() {
  app.innerHTML = `
    <div class="admin-shell">

      <aside class="admin-sidebar" id="adminSidebar">

        <div class="admin-brand">

          <div class="admin-brand-logo">
            <img src="${LOGO}" alt="TRUSTED OP">
          </div>

          <div class="admin-brand-text">
            <strong>TRUSTED OP</strong>
            <small>ADMIN PANEL</small>
          </div>

        </div>

        <div class="sidebar-label">
          MAIN MENU
        </div>

        <div class="sidebar-menu">

          <button data-page="dashboard">
            <span class="sidebar-icon">📊</span>
            <span>Dashboard</span>
          </button>

          <button data-page="users">
            <span class="sidebar-icon">👥</span>
            <span>Users</span>
          </button>

          <button data-page="tournaments">
            <span class="sidebar-icon">🏆</span>
            <span>Tournaments</span>
          </button>

          <button data-page="entries">
            <span class="sidebar-icon">📝</span>
            <span>Entries</span>
          </button>

          <button data-page="results">
            <span class="sidebar-icon">🏅</span>
            <span>Results</span>
          </button>

          <button data-page="wallet">
            <span class="sidebar-icon">💰</span>
            <span>Wallet & Transactions</span>
          </button>

          <button data-page="players">
            <span class="sidebar-icon">⭐</span>
            <span>Top Players</span>
          </button>

          <button data-page="notifications">
            <span class="sidebar-icon">🔔</span>
            <span>Notifications</span>
          </button>

          <button data-page="reports">
            <span class="sidebar-icon">📈</span>
            <span>Reports</span>
          </button>

          <button data-page="settings">
            <span class="sidebar-icon">⚙️</span>
            <span>Settings</span>
          </button>

          <button class="sidebar-logout" id="logoutBtn">
            <span class="sidebar-icon">🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      <main class="admin-main">

        <header class="admin-topbar">

          <div class="admin-page-heading">

            <button
              class="mobile-menu-btn"
              id="mobileMenuBtn"
            >
              ☰
            </button>

            <div>
              <h1 id="pageTitle">
                Dashboard
              </h1>

              <p id="pageSubtitle">
                TRUSTED OP administration
              </p>
            </div>

          </div>

          <div class="admin-top-actions">

            <button
              class="admin-icon-btn"
              id="refreshBtn"
              title="Refresh"
            >
              ↻
            </button>

            <div class="admin-user">
              <div class="admin-user-avatar">
                👤
              </div>

              <span id="adminEmailLabel">
                Admin
              </span>
            </div>

          </div>

        </header>

        <section class="admin-content" id="adminContent">
        </section>

      </main>

    </div>

    <div class="admin-toast"></div>
  `;

  setupNavigation();

  document.getElementById("logoutBtn")
    .addEventListener("click", async () => {
      await signOut(auth);
      toast("Logged out");
    });

  document.getElementById("refreshBtn")
    .addEventListener("click", () => {
      loadPage(currentPage);
      toast("Refreshing...");
    });

  document.getElementById("mobileMenuBtn")
    .addEventListener("click", () => {
      document
        .getElementById("adminSidebar")
        .classList.toggle("open");
    });

  const email = auth.currentUser?.email || "Admin";

  document.getElementById("adminEmailLabel")
    .textContent = email;

  loadTournamentsRealtime();

  loadPage("dashboard");
}

/* ================= NAVIGATION ================= */

function setupNavigation() {
  document
    .querySelectorAll(".sidebar-menu button[data-page]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const page = button.dataset.page;

        currentPage = page;

        document
          .querySelectorAll(".sidebar-menu button")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        document
          .getElementById("adminSidebar")
          .classList.remove("open");

        loadPage(page);
      });

    });
}

function loadPage(page) {

  currentPage = page;

  const titles = {
    dashboard: ["Dashboard", "TRUSTED OP overview"],
    users: ["Users", "Manage registered users"],
    tournaments: ["Tournaments", "Create and manage tournaments"],
    entries: ["Entries", "Tournament entry records"],
    results: ["Results", "Manage tournament results"],
    wallet: ["Wallet & Transactions", "Manage wallet activity"],
    players: ["Top Players", "Player performance"],
    notifications: ["Notifications", "Send announcements"],
    reports: ["Reports", "Platform reports"],
    settings: ["Settings", "Admin settings"]
  };

  const info = titles[page] || titles.dashboard;

  document.getElementById("pageTitle").textContent = info[0];
  document.getElementById("pageSubtitle").textContent = info[1];

  const content = document.getElementById("adminContent");

  if (page === "dashboard") {
    showDashboard(content);
  }

  else if (page === "tournaments") {
    showTournaments(content);
  }

  else if (page === "users") {
    showUsers(content);
  }

  else if (page === "entries") {
    showEntries(content);
  }

  else if (page === "results") {
    showResults(content);
  }

  else if (page === "wallet") {
    showWallet(content);
  }

  else if (page === "players") {
    showPlayers(content);
  }

  else if (page === "notifications") {
    showNotifications(content);
  }

  else if (page === "reports") {
    showReports(content);
  }

  else if (page === "settings") {
    showSettings(content);
  }

  else {
    showDashboard(content);
  }
}

/* ================= REALTIME TOURNAMENTS ================= */

function loadTournamentsRealtime() {

  const tournamentsRef = ref(db, "tournaments");

  if (unsubscribeTournaments) {
    unsubscribeTournaments();
  }

  unsubscribeTournaments = onValue(
    tournamentsRef,
    snapshot => {

      tournaments = snapshot.val() || {};

      if (
        currentPage === "dashboard" ||
        currentPage === "tournaments"
      ) {
        loadPage(currentPage);
      }

    },
    error => {
      console.error(
        "Tournament database error:",
        error
      );
    }
  );
}

/* ================= DASHBOARD ================= */

async function showDashboard(content) {

  const tournamentList = Object.values(tournaments);

  let usersCount = 0;
  let entriesCount = 0;

  try {

    const usersSnap = await get(ref(db, "users"));

    if (usersSnap.exists()) {
      usersCount =
        Object.keys(usersSnap.val()).length;
    }

    const entriesSnap =
      await get(ref(db, "entries"));

    if (entriesSnap.exists()) {
      entriesCount =
        Object.keys(entriesSnap.val()).length;
    }

  } catch (error) {
    console.error(error);
  }

  const liveCount =
    tournamentList.filter(
      t => String(t.status).toLowerCase() === "live"
    ).length;

  const upcomingCount =
    tournamentList.filter(
      t => String(t.status).toLowerCase() === "upcoming"
    ).length;

  content.innerHTML = `

    <div class="dashboard-grid">

      <div class="dashboard-card">
        <div class="dashboard-card-top">
          <div class="dashboard-card-icon">👥</div>
        </div>
        <div class="dashboard-card-label">TOTAL USERS</div>
        <div class="dashboard-card-number">${usersCount}</div>
        <div class="dashboard-card-change">
          Registered users
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-top">
          <div class="dashboard-card-icon">🏆</div>
        </div>
        <div class="dashboard-card-label">TOURNAMENTS</div>
        <div class="dashboard-card-number">
          ${tournamentList.length}
        </div>
        <div class="dashboard-card-change">
          ${upcomingCount} upcoming
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-top">
          <div class="dashboard-card-icon">🔴</div>
        </div>
        <div class="dashboard-card-label">LIVE MATCHES</div>
        <div class="dashboard-card-number">
          ${liveCount}
        </div>
        <div class="dashboard-card-change">
          Currently live
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-top">
          <div class="dashboard-card-icon">📝</div>
        </div>
        <div class="dashboard-card-label">ENTRIES</div>
        <div class="dashboard-card-number">
          ${entriesCount}
        </div>
        <div class="dashboard-card-change">
          Tournament entries
        </div>
      </div>

    </div>

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Recent Tournaments</h2>
          <p>Latest tournaments in TRUSTED OP</p>
        </div>

        <div class="panel-actions">
          <button class="btn btn-primary" id="dashboardTournamentBtn">
            + Add Tournament
          </button>
        </div>

      </div>

      ${
        tournamentList.length
          ? `
            <div class="table-wrap">
              <table class="admin-table">

                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>ENTRY</th>
                    <th>PRIZE</th>
                    <th>SLOTS</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>

                  ${tournamentList
                    .slice(0, 8)
                    .map(tournamentRow)
                    .join("")}

                </tbody>

              </table>
            </div>
          `
          : emptyHTML(
              "🏆",
              "No tournaments",
              "Create your first tournament."
            )
      }

    </div>
  `;

  document
    .getElementById("dashboardTournamentBtn")
    ?.addEventListener("click", () => {
      currentPage = "tournaments";
      loadPage("tournaments");
      setTimeout(openTournamentModal, 100);
    });
}

/* ================= TOURNAMENT ROW ================= */

function tournamentRow(t) {

  return `
    <tr>

      <td>
        <strong>
          ${escapeHTML(t.name || "Unnamed Tournament")}
        </strong>
      </td>

      <td>
        ${money(t.entryFee)}
      </td>

      <td>
        ${money(t.prizePool)}
      </td>

      <td>
        ${Number(t.joined || 0)}
        /
        ${Number(t.slots || 0)}
      </td>

      <td>
        ${statusHTML(t.status)}
      </td>

    </tr>
  `;
}

function statusHTML(status) {

  const value =
    String(status || "Upcoming").toLowerCase();

  let className = "status-upcoming";

  if (value === "live") {
    className = "status-live";
  }

  if (value === "completed") {
    className = "status-completed";
  }

  return `
    <span class="status ${className}">
      ${escapeHTML(status || "Upcoming")}
    </span>
  `;
}

/* ================= TOURNAMENTS ================= */

function showTournaments(content) {

  const list = Object.entries(tournaments);

  content.innerHTML = `

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>All Tournaments</h2>
          <p>Create, edit and delete tournaments</p>
        </div>

        <div class="panel-actions">

          <input
            id="tournamentSearch"
            class="search-box"
            type="search"
            placeholder="Search tournament..."
          >

          <button
            class="btn btn-primary"
            id="addTournamentBtn"
          >
            + Add Tournament
          </button>

        </div>

      </div>

      ${
        list.length
          ? `
            <div
              class="tournament-admin-grid"
              id="tournamentGrid"
            >

              ${list
                .map(([id, tournament]) =>
                  tournamentCard(id, tournament)
                )
                .join("")}

            </div>
          `
          : emptyHTML(
              "🏆",
              "No tournaments",
              "Click Add Tournament to create one."
            )
      }

    </div>
  `;

  document
    .getElementById("addTournamentBtn")
    ?.addEventListener(
      "click",
      openTournamentModal
    );

  document
    .getElementById("tournamentSearch")
    ?.addEventListener(
      "input",
      event => {

        const query =
          event.target.value
            .trim()
            .toLowerCase();

        document
          .querySelectorAll(
            ".admin-tournament-card"
          )
          .forEach(card => {

            const name =
              card.dataset.name || "";

            card.style.display =
              name.includes(query)
                ? ""
                : "none";

          });

      }
    );
}

function tournamentCard(id, t) {

  const image =
    t.image ||
    "../images/br-survival.jpg";

  return `
    <div
      class="admin-tournament-card"
      data-name="${escapeHTML(
        String(t.name || "").toLowerCase()
      )}"
    >

      <div class="admin-tournament-image">

        <img
          src="${escapeHTML(image)}"
          alt="${escapeHTML(t.name || "Tournament")}"
          onerror="this.style.display='none'"
        >

      </div>

      <div class="admin-tournament-body">

        <h3>
          ${escapeHTML(t.name || "Unnamed Tournament")}
        </h3>

        <p>
          ${escapeHTML(t.mode || "Free Fire")}
          •
          ${escapeHTML(t.map || "Bermuda")}
        </p>

        <div class="admin-tournament-meta">

          <div class="admin-meta-box">
            <small>ENTRY</small>
            <strong>${money(t.entryFee)}</strong>
          </div>

          <div class="admin-meta-box">
            <small>PRIZE</small>
            <strong>${money(t.prizePool)}</strong>
          </div>

          <div class="admin-meta-box">
            <small>SLOTS</small>
            <strong>
              ${Number(t.joined || 0)}
              /
              ${Number(t.slots || 0)}
            </strong>
          </div>

          <div class="admin-meta-box">
            <small>STATUS</small>
            <strong>${escapeHTML(t.status || "Upcoming")}</strong>
          </div>

        </div>

        <div class="admin-tournament-actions">

          <button
            class="btn btn-primary"
            onclick="window.editTournament('${id}')"
          >
            Edit
          </button>

          <button
            class="btn btn-danger"
            onclick="window.deleteTournament('${id}')"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  `;
}

/* ================= ADD / EDIT TOURNAMENT ================= */

function openTournamentModal(id = null) {

  const tournament =
    id && tournaments[id]
      ? tournaments[id]
      : {};

  const isEdit = Boolean(id);

  const modal = document.createElement("div");

  modal.className = "modal-overlay show";

  modal.id = "tournamentModal";

  modal.innerHTML = `

    <div class="admin-modal">

      <div class="modal-header">

        <h2>
          ${isEdit ? "Edit Tournament" : "Add Tournament"}
        </h2>

        <button
          class="modal-close"
          id="closeTournamentModal"
        >
          ✕
        </button>

      </div>

      <div class="modal-body">

        <form id="tournamentForm">

          <div class="form-grid">

            <div class="form-group full">
              <label>TOURNAMENT NAME</label>
              <input
                class="form-input"
                id="tName"
                value="${escapeHTML(tournament.name || "")}"
                placeholder="Example: BR FULL MAP"
                required
              >
            </div>

            <div class="form-group">
              <label>ENTRY FEE</label>
              <input
                class="form-input"
                id="tEntry"
                type="number"
                min="0"
                value="${Number(tournament.entryFee || 0)}"
                placeholder="50"
                required
              >
            </div>

            <div class="form-group">
              <label>PRIZE POOL</label>
              <input
                class="form-input"
                id="tPrize"
                type="number"
                min="0"
                value="${Number(tournament.prizePool || 0)}"
                placeholder="5000"
                required
              >
            </div>

            <div class="form-group">
              <label>PER KILL</label>
              <input
                class="form-input"
                id="tPerKill"
                type="number"
                min="0"
                value="${Number(tournament.perKill || 0)}"
                placeholder="5"
              >
            </div>

            <div class="form-group">
              <label>TOTAL SLOTS</label>
              <input
                class="form-input"
                id="tSlots"
                type="number"
                min="1"
                value="${Number(tournament.slots || 50)}"
                placeholder="50"
                required
              >
            </div>

            <div class="form-group">
              <label>MAP</label>
              <select class="form-select" id="tMap">

                ${selectOption(
                  "Bermuda",
                  tournament.map
                )}

                ${selectOption(
                  "Purgatory",
                  tournament.map
                )}

                ${selectOption(
                  "Alpine",
                  tournament.map
                )}

                ${selectOption(
                  "NexTerra",
                  tournament.map
                )}

              </select>
            </div>

            <div class="form-group">
              <label>MODE</label>
              <select class="form-select" id="tMode">

                ${selectOption(
                  "Solo",
                  tournament.mode
                )}

                ${selectOption(
                  "Duo",
                  tournament.mode
                )}

                ${selectOption(
                  "Squad",
                  tournament.mode
                )}

                ${selectOption(
                  "1V1",
                  tournament.mode
                )}

              </select>
            </div>

            <div class="form-group">
              <label>DATE</label>
              <input
                class="form-input"
                id="tDate"
                type="date"
                value="${escapeHTML(tournament.date || "")}"
                required
              >
            </div>

            <div class="form-group">
              <label>TIME</label>
              <input
                class="form-input"
                id="tTime"
                type="time"
                value="${escapeHTML(tournament.time || "")}"
                required
              >
            </div>

            <div class="form-group">
              <label>ROOM ID</label>
              <input
                class="form-input"
                id="tRoomId"
                value="${escapeHTML(tournament.roomId || "")}"
                placeholder="Room ID"
              >
            </div>

            <div class="form-group">
              <label>ROOM PASSWORD</label>
              <input
                class="form-input"
                id="tRoomPassword"
                value="${escapeHTML(tournament.roomPassword || "")}"
                placeholder="Room Password"
              >
            </div>

            <div class="form-group">
              <label>STATUS</label>
              <select class="form-select" id="tStatus">

                ${selectOption(
                  "Upcoming",
                  tournament.status || "Upcoming"
                )}

                ${selectOption(
                  "Live",
                  tournament.status
                )}

                ${selectOption(
                  "Completed",
                  tournament.status
                )}

              </select>
            </div>

            <div class="form-group full">
              <label>IMAGE URL</label>
              <input
                class="form-input"
                id="tImage"
                type="url"
                value="${escapeHTML(tournament.image || "")}"
                placeholder="https://example.com/banner.jpg"
              >
            </div>

            <div class="form-group full">
              <label>RULES</label>
              <textarea
                class="form-textarea"
                id="tRules"
                placeholder="Tournament rules..."
              >${escapeHTML(tournament.rules || "")}</textarea>
            </div>

          </div>

          <div class="form-actions">

            <button
              type="button"
              class="btn"
              id="cancelTournament"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="btn btn-primary"
            >
              ${isEdit ? "Update Tournament" : "Create Tournament"}
            </button>

          </div>

        </form>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document
    .getElementById("closeTournamentModal")
    .addEventListener(
      "click",
      closeTournamentModal
    );

  document
    .getElementById("cancelTournament")
    .addEventListener(
      "click",
      closeTournamentModal
    );

  document
    .getElementById("tournamentForm")
    .addEventListener(
      "submit",
      event => saveTournament(event, id)
    );
}

function selectOption(value, selected) {

  return `
    <option
      value="${escapeHTML(value)}"
      ${
        String(selected || "").toLowerCase() ===
        String(value).toLowerCase()
          ? "selected"
          : ""
      }
    >
      ${escapeHTML(value)}
    </option>
  `;
}

function closeTournamentModal() {

  document
    .getElementById("tournamentModal")
    ?.remove();
}

async function saveTournament(event, id) {

  event.preventDefault();

  const tournament = {

    name:
      document.getElementById("tName").value.trim(),

    entryFee:
      Number(
        document.getElementById("tEntry").value || 0
      ),

    prizePool:
      Number(
        document.getElementById("tPrize").value || 0
      ),

    perKill:
      Number(
        document.getElementById("tPerKill").value || 0
      ),

    slots:
      Number(
        document.getElementById("tSlots").value || 0
      ),

    joined:
      Number(
        id && tournaments[id]
          ? tournaments[id].joined || 0
          : 0
      ),

    map:
      document.getElementById("tMap").value,

    mode:
      document.getElementById("tMode").value,

    date:
      document.getElementById("tDate").value,

    time:
      document.getElementById("tTime").value,

    roomId:
      document.getElementById("tRoomId").value.trim(),

    roomPassword:
      document.getElementById("tRoomPassword").value.trim(),

    status:
      document.getElementById("tStatus").value,

    image:
      document.getElementById("tImage").value.trim(),

    rules:
      document.getElementById("tRules").value.trim(),

    updatedAt:
      Date.now()

  };

  try {

    if (id) {

      await update(
        ref(db, `tournaments/${id}`),
        tournament
      );

      toast("Tournament updated successfully");

    } else {

      const newRef =
        push(ref(db, "tournaments"));

      tournament.createdAt = Date.now();

      await set(
        newRef,
        tournament
      );

      toast("Tournament created successfully");
    }

    closeTournamentModal();

  } catch (error) {

    console.error(error);

    toast(
      "Database error: " +
      error.message
    );
  }
}

/* ================= DELETE ================= */

async function deleteTournament(id) {

  const tournament = tournaments[id];

  if (!tournament) return;

  const confirmed =
    confirm(
      `Delete "${tournament.name || "this tournament"}"?`
    );

  if (!confirmed) return;

  try {

    await remove(
      ref(db, `tournaments/${id}`)
    );

    toast("Tournament deleted");

  } catch (error) {

    console.error(error);

    toast(
      "Delete failed: " +
      error.message
    );
  }
}

/* ================= USERS ================= */

async function showUsers(content) {

  let users = {};

  try {

    const snapshot =
      await get(ref(db, "users"));

    users =
      snapshot.exists()
        ? snapshot.val()
        : {};

  } catch (error) {

    console.error(error);

  }

  const list =
    Object.entries(users);

  content.innerHTML = `

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Registered Users</h2>
          <p>Total users: ${list.length}</p>
        </div>

        <div class="panel-actions">
          <input
            class="search-box"
            id="userSearch"
            placeholder="Search user..."
          >
        </div>

      </div>

      ${
        list.length
          ? `
          <div class="table-wrap">

            <table class="admin-table">

              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>BALANCE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody id="userTable">

                ${list
                  .map(([id, user]) => `
                    <tr>

                      <td>
                        ${escapeHTML(
                          user.name ||
                          user.username ||
                          id
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          user.email || "-"
                        )}
                      </td>

                      <td>
                        ${money(user.balance)}
                      </td>

                      <td>
                        ${statusHTML(
                          user.status || "Active"
                        )}
                      </td>

                    </tr>
                  `)
                  .join("")}

              </tbody>

            </table>

          </div>
          `
          : emptyHTML(
              "👥",
              "No users",
              "No user records found."
            )
      }

    </div>
  `;

  document
    .getElementById("userSearch")
    ?.addEventListener(
      "input",
      event => {

        const q =
          event.target.value
            .toLowerCase();

        document
          .querySelectorAll("#userTable tr")
          .forEach(row => {

            row.style.display =
              row.textContent
                .toLowerCase()
                .includes(q)
                  ? ""
                  : "none";

          });

      }
    );
}

/* ================= ENTRIES ================= */

async function showEntries(content) {

  let entries = {};

  try {

    const snapshot =
      await get(ref(db, "entries"));

    entries =
      snapshot.exists()
        ? snapshot.val()
        : {};

  } catch (error) {
    console.error(error);
  }

  const list =
    Object.entries(entries);

  content.innerHTML = `

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Tournament Entries</h2>
          <p>Manage player tournament entries</p>
        </div>

      </div>

      ${
        list.length
          ? `
          <div class="table-wrap">

            <table class="admin-table">

              <thead>
                <tr>
                  <th>PLAYER</th>
                  <th>TOURNAMENT</th>
                  <th>ENTRY FEE</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                ${list
                  .map(([id, entry]) => `
                    <tr>

                      <td>
                        ${escapeHTML(
                          entry.userName ||
                          entry.userId ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          entry.tournamentName ||
                          entry.tournamentId ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${money(entry.amount)}
                      </td>

                      <td>
                        ${formatDate(
                          entry.createdAt
                        )}
                      </td>

                      <td>
                        ${statusHTML(
                          entry.status || "Confirmed"
                        )}
                      </td>

                    </tr>
                  `)
                  .join("")}

              </tbody>

            </table>

          </div>
          `
          : emptyHTML(
              "📝",
              "No entries",
              "Tournament entries will appear here."
            )
      }

    </div>
  `;
}

/* ================= RESULTS ================= */

function showResults(content) {

  content.innerHTML = `

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Tournament Results</h2>
          <p>Add and manage match results</p>
        </div>

        <div class="panel-actions">

          <button
            class="btn btn-primary"
            id="addResultBtn"
          >
            + Add Result
          </button>

        </div>

      </div>

      <div class="admin-empty">

        <div class="admin-empty-icon">
          🏅
        </div>

        <h3>
          Results Management
        </h3>

        <p>
          Result records will be connected to tournaments.
        </p>

      </div>

    </div>
  `;

  document
    .getElementById("addResultBtn")
    ?.addEventListener(
      "click",
      () => toast(
        "Result module is ready for database connection."
      )
    );
}

/* ================= WALLET ================= */

async function showWallet(content) {

  let transactions = {};

  try {

    const snapshot =
      await get(
        ref(db, "transactions")
      );

    transactions =
      snapshot.exists()
        ? snapshot.val()
        : {};

  } catch (error) {
    console.error(error);
  }

  const list =
    Object.entries(transactions);

  content.innerHTML = `

    <div class="mini-stats">

      <div class="mini-stat">
        <small>TOTAL TRANSACTIONS</small>
        <strong>${list.length}</strong>
      </div>

      <div class="mini-stat">
        <small>CREDIT</small>
        <strong>
          ${money(
            list.reduce(
              (sum, [, t]) =>
                sum +
                (
                  t.type === "credit"
                    ? Number(t.amount || 0)
                    : 0
                ),
              0
            )
          )}
        </strong>
      </div>

      <div class="mini-stat">
        <small>DEBIT</small>
        <strong>
          ${money(
            list.reduce(
              (sum, [, t]) =>
                sum +
                (
                  t.type === "debit"
                    ? Number(t.amount || 0)
                    : 0
                ),
              0
            )
          )}
        </strong>
      </div>

    </div>

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Transactions</h2>
          <p>Wallet activity</p>
        </div>

      </div>

      ${
        list.length
          ? `
          <div class="table-wrap">

            <table class="admin-table">

              <thead>
                <tr>
                  <th>USER</th>
                  <th>TYPE</th>
                  <th>AMOUNT</th>
                  <th>DESCRIPTION</th>
                  <th>DATE</th>
                </tr>
              </thead>

              <tbody>

                ${list
                  .map(([id, t]) => `
                    <tr>

                      <td>
                        ${escapeHTML(
                          t.userName ||
                          t.userId ||
                          "-"
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          t.type || "-"
                        )}
                      </td>

                      <td>
                        ${money(t.amount)}
                      </td>

                      <td>
                        ${escapeHTML(
                          t.description || "-"
                        )}
                      </td>

                      <td>
                        ${formatDate(
                          t.createdAt
                        )}
                      </td>

                    </tr>
                  `)
                  .join("")}

              </tbody>

            </table>

          </div>
          `
          : emptyHTML(
              "💰",
              "No transactions",
              "Wallet transactions will appear here."
            )
      }

    </div>
  `;
}

/* ================= TOP PLAYERS ================= */

function showPlayers(content) {

  content.innerHTML = `

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Top Players</h2>
          <p>Leaderboard management</p>
        </div>

      </div>

      <div class="admin-empty">

        <div class="admin-empty-icon">
          ⭐
        </div>

        <h3>
          Top Players
        </h3>

        <p>
          Player rankings will be calculated from results.
        </p>

      </div>

    </div>
  `;
}

/* ================= NOTIFICATIONS ================= */

function showNotifications(content) {

  content.innerHTML = `

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Notifications</h2>
          <p>Send announcements to users</p>
        </div>

      </div>

      <form id="notificationForm">

        <div class="form-grid">

          <div class="form-group full">
            <label>TITLE</label>

            <input
              class="form-input"
              id="notificationTitle"
              placeholder="Notification title"
              required
            >

          </div>

          <div class="form-group full">
            <label>MESSAGE</label>

            <textarea
              class="form-textarea"
              id="notificationMessage"
              placeholder="Write your announcement..."
              required
            ></textarea>

          </div>

        </div>

        <div class="form-actions">

          <button
            class="btn btn-primary"
            type="submit"
          >
            Send Notification
          </button>

        </div>

      </form>

    </div>
  `;

  document
    .getElementById("notificationForm")
    .addEventListener(
      "submit",
      sendNotification
    );
}

async function sendNotification(event) {

  event.preventDefault();

  const title =
    document
      .getElementById("notificationTitle")
      .value
      .trim();

  const message =
    document
      .getElementById("notificationMessage")
      .value
      .trim();

  try {

    const newRef =
      push(
        ref(db, "notifications")
      );

    await set(
      newRef,
      {
        title,
        message,
        createdAt: Date.now()
      }
    );

    document
      .getElementById("notificationForm")
      .reset();

    toast(
      "Notification saved successfully"
    );

  } catch (error) {

    console.error(error);

    toast(
      "Notification failed: " +
      error.message
    );
  }
}

/* ================= REPORTS ================= */

function showReports(content) {

  const list =
    Object.values(tournaments);

  const totalPrize =
    list.reduce(
      (sum, t) =>
        sum +
        Number(t.prizePool || 0),
      0
    );

  const totalEntry =
    list.reduce(
      (sum, t) =>
        sum +
        (
          Number(t.entryFee || 0) *
          Number(t.joined || 0)
        ),
      0
    );

  content.innerHTML = `

    <div class="mini-stats">

      <div class="mini-stat">
        <small>TOURNAMENT PRIZE</small>
        <strong>
          ${money(totalPrize)}
        </strong>
      </div>

      <div class="mini-stat">
        <small>ENTRY COLLECTION</small>
        <strong>
          ${money(totalEntry)}
        </strong>
      </div>

      <div class="mini-stat">
        <small>TOURNAMENTS</small>
        <strong>
          ${list.length}
        </strong>
      </div>

    </div>

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Platform Report</h2>
          <p>Current tournament statistics</p>
        </div>

      </div>

      <div class="admin-empty">

        <div class="admin-empty-icon">
          📈
        </div>

        <h3>
          Reports
        </h3>

        <p>
          Detailed financial and player reports can be added next.
        </p>

      </div>

    </div>
  `;
}

/* ================= SETTINGS ================= */

function showSettings(content) {

  content.innerHTML = `

    <div class="admin-panel">

      <div class="admin-panel-header">

        <div>
          <h2>Settings</h2>
          <p>TRUSTED OP administration settings</p>
        </div>

      </div>

      <div class="form-grid">

        <div class="form-group">
          <label>APP NAME</label>

          <input
            class="form-input"
            value="TRUSTED OP"
            id="settingAppName"
          >
        </div>

        <div class="form-group">
          <label>SUPPORT EMAIL</label>

          <input
            class="form-input"
            type="email"
            placeholder="support@example.com"
            id="settingEmail"
          >
        </div>

        <div class="form-group full">
          <label>MAINTENANCE MESSAGE</label>

          <textarea
            class="form-textarea"
            id="settingMessage"
            placeholder="Maintenance message..."
          ></textarea>
        </div>

      </div>

      <div class="form-actions">

        <button
          class="btn btn-primary"
          id="saveSettingsBtn"
        >
          Save Settings
        </button>

      </div>

    </div>
  `;

  document
    .getElementById("saveSettingsBtn")
    .addEventListener(
      "click",
      saveSettings
    );
}

async function saveSettings() {

  const appName =
    document
      .getElementById("settingAppName")
      .value
      .trim();

  const supportEmail =
    document
      .getElementById("settingEmail")
      .value
      .trim();

  const maintenanceMessage =
    document
      .getElementById("settingMessage")
      .value
      .trim();

  try {

    await set(
      ref(db, "settings"),
      {
        appName,
        supportEmail,
        maintenanceMessage,
        updatedAt: Date.now()
      }
    );

    toast(
      "Settings saved successfully"
    );

  } catch (error) {

    console.error(error);

    toast(
      "Settings error: " +
      error.message
    );
  }
}

/* ================= EMPTY ================= */

function emptyHTML(
  icon,
  title,
  message
) {

  return `
    <div class="admin-empty">

      <div class="admin-empty-icon">
        ${icon}
      </div>

      <h3>
        ${escapeHTML(title)}
      </h3>

      <p>
        ${escapeHTML(message)}
      </p>

    </div>
  `;
}

/* ================= GLOBAL FUNCTIONS ================= */

window.editTournament = function(id) {
  openTournamentModal(id);
};

window.deleteTournament = function(id) {
  deleteTournament(id);
};

/* ================= AUTH STATE ================= */

onAuthStateChanged(
  auth,
  user => {

    if (user) {

      renderAdminShell();

    } else {

      if (unsubscribeTournaments) {
        unsubscribeTournaments();
        unsubscribeTournaments = null;
      }

      showLogin();
    }

  }
);
