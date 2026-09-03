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
  onValue,
  runTransaction
} from "firebase/database";

/* =========================================================
   TRUSTED OP — ADMIN PANEL
   ========================================================= */

const app = document.getElementById("adminApp");

const LOGO = "../images/trusted-op-logo.png";

let currentPage = "dashboard";
let tournaments = {};
let unsubscribeTournaments = null;

/* ================= PAGES ================= */

const PAGES = {
  dashboard: ["Dashboard", "TRUSTED OP overview"],
  users: ["Users", "Complete user account control"],
  games: ["Games", "Manage games and matches"],
  tournaments: ["Tournaments", "Create and manage tournaments"],
  entries: ["Entries", "Tournament entry records"],
  withdrawals: ["Withdrawals", "Review withdrawal requests"],
  deposits: ["Deposits", "Review deposit requests"],
  staff: ["Staff Panel", "Manage staff accounts and permissions"],
  referral: ["Referral", "Referral bonus and earnings control"],
  notifications: ["Notify", "Console, announcements and push queue"],
  banners: ["App Banner", "Manage Home Screen promotional banners"],
  results: ["Results", "Manage tournament results"],
  wallet: ["Wallet & Transactions", "Manage wallet activity"],
  players: ["Top Players", "Player performance"],
  reports: ["Reports", "Platform reports"],
  settings: ["Settings", "Admin settings"]
};

const GAME_OPTIONS = [
  "BR Survival",
  "Per Kill",
  "Clash Squad 1v1",
  "Lone Wolf 1v1"
];

const STAFF_PERMISSIONS = [
  "dashboard",
  "users",
  "games",
  "tournaments",
  "entries",
  "withdrawals",
  "deposits",
  "referral",
  "notifications",
  "banners",
  "results",
  "wallet",
  "players",
  "reports",
  "settings"
];

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
    return String(value);
  }
}

function statusHTML(status = "Upcoming") {
  const v = String(status).toLowerCase();

  const cls =
    v === "live" ||
    v === "approved" ||
    v === "active"
      ? "status-live"
      : v === "completed" ||
        v === "rejected" ||
        v === "banned" ||
        v === "disabled"
      ? "status-completed"
      : "status-upcoming";

  return `
    <span class="status ${cls}">
      ${escapeHTML(status)}
    </span>
  `;
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
  }, 2800);
}

async function val(path, fallback = {}) {
  const snapshot = await get(ref(db, path));

  return snapshot.exists() ? snapshot.val() : fallback;
}

function entriesOf(obj) {
  return Object.entries(obj || {});
}

function option(value, selected) {
  return `
    <option
      value="${escapeHTML(value)}"
      ${
        String(value).toLowerCase() ===
        String(selected || "").toLowerCase()
          ? "selected"
          : ""
      }
    >
      ${escapeHTML(value)}
    </option>
  `;
}

function emptyHTML(icon, title, message) {
  return `
    <div class="admin-empty">
      <div class="admin-empty-icon">${icon}</div>
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(message)}</p>
    </div>
  `;
}

function panelHeader(title, subtitle, actions = "") {
  return `
    <div class="admin-panel-header">
      <div>
        <h2>${escapeHTML(title)}</h2>
        <p>${escapeHTML(subtitle)}</p>
      </div>

      <div class="panel-actions">
        ${actions}
      </div>
    </div>
  `;
}

/* =========================================================
   LOGIN
   ========================================================= */

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

        <div
          class="login-error"
          id="loginError"
          style="${error ? "display:block" : ""}"
        >
          ${escapeHTML(error)}
        </div>

        <form id="loginForm">

          <div class="form-group">
            <label>ADMIN EMAIL</label>

            <input
              id="adminEmail"
              class="form-input"
              type="email"
              required
              placeholder="Enter admin email"
            >
          </div>

          <div class="form-group">
            <label>PASSWORD</label>

            <input
              id="adminPassword"
              class="form-input"
              type="password"
              required
              placeholder="Enter password"
            >
          </div>

          <button
            class="primary-btn"
            type="submit"
          >
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

async function adminLogin(e) {
  e.preventDefault();

  const email =
    document.getElementById("adminEmail").value.trim();

  const password =
    document.getElementById("adminPassword").value;

  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    toast("Login successful");

  } catch (err) {

    const box =
      document.getElementById("loginError");

    box.textContent =
      err.code === "auth/invalid-credential"
        ? "Email or password is incorrect."
        : err.message;

    box.style.display = "block";
  }
}

/* =========================================================
   ADMIN SHELL
   ========================================================= */

function renderAdminShell() {

  app.innerHTML = `
    <div class="admin-shell">

      <aside
        class="admin-sidebar"
        id="adminSidebar"
      >

        <div class="admin-brand">

          <div class="admin-brand-logo">
            <img
              src="${LOGO}"
              alt="TRUSTED OP"
            >
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

          ${Object.entries(PAGES)
            .map(
              ([id, page]) => `
                <button data-page="${id}">
                  <span class="sidebar-icon">
                    ${iconFor(id)}
                  </span>

                  <span>
                    ${page[0]}
                  </span>
                </button>
              `
            )
            .join("")}

          <button
            class="sidebar-logout"
            id="logoutBtn"
          >
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
                TRUSTED OP overview
              </p>
            </div>

          </div>

          <div class="admin-top-actions">

            <button
              class="admin-icon-btn"
              id="refreshBtn"
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

        <section
          class="admin-content"
          id="adminContent"
        ></section>

      </main>

    </div>

    <div class="admin-toast"></div>
  `;

  document
    .querySelectorAll(
      ".sidebar-menu button[data-page]"
    )
    .forEach(button => {

      button.addEventListener("click", () => {

        currentPage =
          button.dataset.page;

        document
          .querySelectorAll(
            ".sidebar-menu button"
          )
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        document
          .getElementById("adminSidebar")
          .classList.remove("open");

        loadPage(currentPage);
      });
    });

  document
    .getElementById("logoutBtn")
    .onclick = () => signOut(auth);

  document
    .getElementById("refreshBtn")
    .onclick = () => {
      loadPage(currentPage);
      toast("Refreshing...");
    };

  document
    .getElementById("mobileMenuBtn")
    .onclick = () => {
      document
        .getElementById("adminSidebar")
        .classList.toggle("open");
    };

  document
    .getElementById("adminEmailLabel")
    .textContent =
      auth.currentUser?.email || "Admin";

  loadTournamentsRealtime();

  loadPage("dashboard");
}

function iconFor(id) {

  return {
    dashboard: "📊",
    users: "👥",
    games: "🎮",
    tournaments: "🏆",
    entries: "📝",
    withdrawals: "💸",
    deposits: "💰",
    staff: "👨‍💼",
    referral: "🎁",
    notifications: "🔔",
    banners: "🖼️",
    results: "🏅",
    wallet: "💳",
    players: "⭐",
    reports: "📈",
    settings: "⚙️"
  }[id] || "•";
}

/* =========================================================
   PAGE LOADER
   ========================================================= */

function loadPage(page) {

  currentPage = page;

  const p =
    PAGES[page] ||
    PAGES.dashboard;

  document.getElementById(
    "pageTitle"
  ).textContent = p[0];

  document.getElementById(
    "pageSubtitle"
  ).textContent = p[1];

  const content =
    document.getElementById(
      "adminContent"
    );

  const functions = {

    dashboard: showDashboard,

    users: showUsers,

    games: showGames,

    tournaments: showTournaments,

    entries: showEntries,

    withdrawals: showWithdrawals,

    deposits: showDeposits,

    staff: showStaff,

    referral: showReferral,

    notifications: showNotifications,

    banners: showBanners,

    results: showResults,

    wallet: showWallet,

    players: showPlayers,

    reports: showReports,

    settings: showSettings
  };

  const fn =
    functions[page] ||
    showDashboard;

  fn(content);
}

/* =========================================================
   TOURNAMENT REALTIME
   ========================================================= */

function loadTournamentsRealtime() {

  if (unsubscribeTournaments) {
    unsubscribeTournaments();
  }

  unsubscribeTournaments =
    onValue(
      ref(db, "tournaments"),
      snapshot => {

        tournaments =
          snapshot.exists()
            ? snapshot.val()
            : {};

        if (
          [
            "dashboard",
            "tournaments",
            "games"
          ].includes(currentPage)
        ) {
          loadPage(currentPage);
        }
      },

      error => {
        console.error(error);
      }
    );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

async function showDashboard(content) {

  content.innerHTML =
    emptyHTML(
      "⏳",
      "Loading Dashboard",
      "Fetching live TRUSTED OP data..."
    );

  try {

    const [
      usersData,
      entriesData,
      depositsData,
      withdrawalsData,
      settingsData
    ] = await Promise.all([

      val("users", {}),

      val("entries", {}),

      val("deposits", {}),

      val("withdrawals", {}),

      val("settings", {})
    ]);

    const users =
      entriesOf(usersData);

    const entries =
      entriesOf(entriesData);

    const deposits =
      entriesOf(depositsData);

    const withdrawals =
      entriesOf(withdrawalsData);

    const activeUsers =
      users.filter(
        ([, user]) => {

          const status =
            String(
              user.status ||
              "active"
            ).toLowerCase();

          return ![
            "banned",
            "blocked",
            "disabled",
            "suspended"
          ].includes(status);
        }
      ).length;

    const pendingDeposits =
      deposits.filter(
        ([, item]) =>
          String(
            item.status ||
            "pending"
          ).toLowerCase() ===
          "pending"
      ).length;

    const pendingWithdrawals =
      withdrawals.filter(
        ([, item]) =>
          String(
            item.status ||
            "pending"
          ).toLowerCase() ===
          "pending"
      ).length;

    const approvedDeposits =
      deposits.filter(
        ([, item]) =>
          String(
            item.status || ""
          ).toLowerCase() ===
          "approved"
      );

    const approvedWithdrawals =
      withdrawals.filter(
        ([, item]) =>
          String(
            item.status || ""
          ).toLowerCase() ===
          "approved"
      );

    const totalDeposits =
      approvedDeposits.reduce(
        (sum, [, item]) =>
          sum +
          Number(item.amount || 0),
        0
      );

    const totalWithdrawals =
      approvedWithdrawals.reduce(
        (sum, [, item]) =>
          sum +
          Number(item.amount || 0),
        0
      );

    const tournamentList =
      Object.values(tournaments);

    const liveMatches =
      tournamentList.filter(
        t =>
          String(
            t.status || ""
          ).toLowerCase() ===
          "live"
      ).length;

    const upcomingMatches =
      tournamentList.filter(
        t =>
          String(
            t.status || ""
          ).toLowerCase() ===
          "upcoming"
      ).length;

    const cards = [

      [
        "📅",
        "PLAN VALIDITY",
        settingsData.planValidity ||
          settingsData.validUntil ||
          "Not Set",
        ""
      ],

      [
        "👥",
        "TOTAL USERS",
        users.length,
        "Registered users"
      ],

      [
        "🟢",
        "ACTIVE USERS",
        activeUsers,
        "Active accounts"
      ],

      [
        "💰",
        "PENDING DEPOSITS",
        pendingDeposits,
        "Needs review"
      ],

      [
        "💸",
        "PENDING WITHDRAWALS",
        pendingWithdrawals,
        "Needs review"
      ],

      [
        "🏆",
        "TOTAL MATCHES",
        tournamentList.length,
        "All tournaments"
      ],

      [
        "🔴",
        "ONGOING MATCHES",
        liveMatches,
        "Currently live"
      ],

      [
        "🕒",
        "UPCOMING MATCHES",
        upcomingMatches,
        "Scheduled"
      ],

      [
        "📝",
        "TOTAL ENTRIES",
        entries.length,
        "Tournament entries"
      ],

      [
        "💵",
        "TOTAL DEPOSITS",
        money(totalDeposits),
        "Approved"
      ],

      [
        "💳",
        "TOTAL WITHDRAWALS",
        money(totalWithdrawals),
        "Approved"
      ]
    ];

    content.innerHTML = `

      <div class="dashboard-grid">

        ${cards
          .map(
            card => `
              <div class="dashboard-card">

                <div class="dashboard-card-top">

                  <div class="dashboard-card-icon">
                    ${card[0]}
                  </div>

                </div>

                <div class="dashboard-card-label">
                  ${card[1]}
                </div>

                <div class="dashboard-card-number">
                  ${escapeHTML(card[2])}
                </div>

                <div class="dashboard-card-change">
                  ${escapeHTML(card[3])}
                </div>

              </div>
            `
          )
          .join("")}

      </div>

      <div class="admin-panel">

        ${panelHeader(
          "Recent Tournaments",
          "Latest tournaments in TRUSTED OP",
          `
            <button
              class="btn btn-primary"
              id="dashboardTournamentBtn"
            >
              + Add Tournament
            </button>
          `
        )}

        ${
          tournamentList.length
            ? `
              <div class="table-wrap">

                <table class="admin-table">

                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>GAME</th>
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
      .getElementById(
        "dashboardTournamentBtn"
      )
      ?.addEventListener(
        "click",
        () => {

          currentPage =
            "tournaments";

          loadPage(
            "tournaments"
          );

          setTimeout(
            openTournamentModal,
            100
          );
        }
      );

  } catch (error) {

    console.error(error);

    content.innerHTML =
      emptyHTML(
        "⚠️",
        "Dashboard error",
        error.message
      );
  }
}

function tournamentRow(t) {

  return `
    <tr>

      <td>
        <strong>
          ${escapeHTML(
            t.name ||
            "Unnamed Tournament"
          )}
        </strong>
      </td>

      <td>
        ${escapeHTML(
          t.game ||
          t.category ||
          "BR Survival"
        )}
      </td>

      <td>
        ${money(t.entryFee)}
      </td>

      <td>
        ${money(t.prizePool)}
      </td>

      <td>
        ${Number(t.joined || 0)}/
        ${Number(t.slots || 0)}
      </td>

      <td>
        ${statusHTML(
          t.status ||
          "Upcoming"
        )}
      </td>

    </tr>
  `;
}

/* =========================================================
   USERS — FULL CONTROL
   ========================================================= */

async function showUsers(content) {

  content.innerHTML =
    emptyHTML(
      "⏳",
      "Loading Users",
      "Fetching user accounts..."
    );

  const users =
    await val("users", {});

  const list =
    entriesOf(users);

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "User Accounts",
        "Activate, ban, delete, edit wallet and account details",
        `
          <input
            class="search-box"
            id="userSearch"
            placeholder="Search user..."
          >
        `
      )}

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
                    <th>ACTIONS</th>
                  </tr>

                </thead>

                <tbody id="userTable">

                  ${list
                    .map(
                      ([id, user]) => `
                        <tr>

                          <td>
                            <strong>
                              ${escapeHTML(
                                user.name ||
                                user.username ||
                                id
                              )}
                            </strong>

                            <br>

                            <small>
                              ${escapeHTML(id)}
                            </small>
                          </td>

                          <td>
                            ${escapeHTML(
                              user.email ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${money(
                              user.balance
                            )}
                          </td>

                          <td>
                            ${statusHTML(
                              user.status ||
                              "Active"
                            )}
                          </td>

                          <td>

                            <div class="panel-actions">

                              <button
                                class="btn btn-primary user-edit"
                                data-id="${escapeHTML(id)}"
                              >
                                Edit
                              </button>

                              <button
                                class="btn user-status"
                                data-id="${escapeHTML(id)}"
                              >
                                ${
                                  [
                                    "banned",
                                    "blocked",
                                    "disabled",
                                    "suspended"
                                  ].includes(
                                    String(
                                      user.status ||
                                      ""
                                    ).toLowerCase()
                                  )
                                    ? "Activate"
                                    : "Ban"
                                }
                              </button>

                              <button
                                class="btn btn-danger user-delete"
                                data-id="${escapeHTML(id)}"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      `
                    )
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
      e => {

        const query =
          e.target.value.toLowerCase();

        document
          .querySelectorAll(
            "#userTable tr"
          )
          .forEach(row => {

            row.style.display =
              row.textContent
                .toLowerCase()
                .includes(query)
                ? ""
                : "none";
          });
      }
    );

  document
    .querySelectorAll(".user-edit")
    .forEach(btn => {

      btn.onclick = () =>
        openUserModal(
          btn.dataset.id
        );
    });

  document
    .querySelectorAll(".user-status")
    .forEach(btn => {

      btn.onclick = () =>
        toggleUserStatus(
          btn.dataset.id
        );
    });

  document
    .querySelectorAll(".user-delete")
    .forEach(btn => {

      btn.onclick = () =>
        deleteUser(
          btn.dataset.id
        );
    });
}

/* =========================================================
   USER EDIT
   ========================================================= */

async function openUserModal(id) {

  const users =
    await val("users", {});

  const user =
    users[id];

  if (!user) return;

  const modal =
    document.createElement("div");

  modal.className =
    "modal-overlay show";

  modal.id =
    "userModal";

  modal.innerHTML = `

    <div class="admin-modal">

      <div class="modal-header">

        <h2>
          Edit User Account
        </h2>

        <button
          class="modal-close"
          id="closeUser"
        >
          ✕
        </button>

      </div>

      <div class="modal-body">

        <form id="userForm">

          <div class="form-grid">

            <div class="form-group">

              <label>
                NAME / USERNAME
              </label>

              <input
                class="form-input"
                id="uName"
                value="${escapeHTML(
                  user.name ||
                  user.username ||
                  ""
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                EMAIL
              </label>

              <input
                class="form-input"
                type="email"
                id="uEmail"
                value="${escapeHTML(
                  user.email ||
                  ""
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                PHONE
              </label>

              <input
                class="form-input"
                id="uPhone"
                value="${escapeHTML(
                  user.phone ||
                  user.mobile ||
                  ""
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                WALLET BALANCE
              </label>

              <input
                class="form-input"
                type="number"
                min="0"
                id="uBalance"
                value="${Number(
                  user.balance || 0
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                STATUS
              </label>

              <select
                class="form-select"
                id="uStatus"
              >

                ${option(
                  "Active",
                  user.status
                )}

                ${option(
                  "Banned",
                  user.status
                )}

                ${option(
                  "Disabled",
                  user.status
                )}

                ${option(
                  "Suspended",
                  user.status
                )}

              </select>

            </div>

            <div class="form-group">

              <label>
                REFERRAL CODE
              </label>

              <input
                class="form-input"
                id="uReferral"
                value="${escapeHTML(
                  user.referralCode ||
                  ""
                )}"
              >

            </div>

            <div class="form-group full">

              <label>
                ADMIN NOTE
              </label>

              <textarea
                class="form-textarea"
                id="uNote"
              >${escapeHTML(
                user.adminNote ||
                ""
              )}</textarea>

            </div>

          </div>

          <div class="form-actions">

            <button
              type="button"
              class="btn"
              id="cancelUser"
            >
              Cancel
            </button>

            <button
              class="btn btn-primary"
            >
              Save User
            </button>

          </div>

        </form>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  const close =
    () => modal.remove();

  document
    .getElementById("closeUser")
    .onclick = close;

  document
    .getElementById("cancelUser")
    .onclick = close;

  document
    .getElementById("userForm")
    .onsubmit = async e => {

      e.preventDefault();

      try {

        await update(
          ref(
            db,
            `users/${id}`
          ),
          {
            name:
              document
                .getElementById(
                  "uName"
                )
                .value
                .trim(),

            username:
              document
                .getElementById(
                  "uName"
                )
                .value
                .trim(),

            email:
              document
                .getElementById(
                  "uEmail"
                )
                .value
                .trim(),

            phone:
              document
                .getElementById(
                  "uPhone"
                )
                .value
                .trim(),

            balance:
              Number(
                document
                  .getElementById(
                    "uBalance"
                  )
                  .value || 0
              ),

            status:
              document
                .getElementById(
                  "uStatus"
                )
                .value,

            referralCode:
              document
                .getElementById(
                  "uReferral"
                )
                .value
                .trim(),

            adminNote:
              document
                .getElementById(
                  "uNote"
                )
                .value
                .trim(),

            updatedAt:
              Date.now()
          }
        );

        close();

        toast(
          "User updated successfully"
        );

        loadPage("users");

      } catch (error) {

        toast(
          "Update failed: " +
          error.message
        );
      }
    };
}

/* =========================================================
   USER STATUS
   ========================================================= */

async function toggleUserStatus(id) {

  const users =
    await val("users", {});

  const user =
    users[id];

  if (!user) return;

  const blocked =
    [
      "banned",
      "blocked",
      "disabled",
      "suspended"
    ].includes(
      String(
        user.status || ""
      ).toLowerCase()
    );

  if (
    !confirm(
      `${blocked ? "Activate" : "Ban"} this user account?`
    )
  ) {
    return;
  }

  try {

    await update(
      ref(
        db,
        `users/${id}`
      ),
      {
        status:
          blocked
            ? "Active"
            : "Banned",

        updatedAt:
          Date.now()
      }
    );

    toast(
      blocked
        ? "User activated"
        : "User banned"
    );

    loadPage("users");

  } catch (error) {

    toast(
      "Status update failed: " +
      error.message
    );
  }
}

/* =========================================================
   DELETE USER
   ========================================================= */

async function deleteUser(id) {

  const users =
    await val("users", {});

  const user =
    users[id];

  if (!user) return;

  if (
    !confirm(
      `DELETE "${user.name || user.username || id}"?`
    )
  ) {
    return;
  }

  try {

    await remove(
      ref(
        db,
        `users/${id}`
      )
    );

    toast(
      "User deleted"
    );

    loadPage("users");

  } catch (error) {

    toast(
      "Delete failed: " +
      error.message
    );
  }
}

/* =========================================================
   GAMES
   ========================================================= */

function showGames(content) {

  const list =
    entriesOf(tournaments);

  const groups =
    GAME_OPTIONS.map(
      game => [
        game,
        list.filter(
          ([, tournament]) =>
            (
              tournament.game ||
              tournament.category ||
              "BR Survival"
            ) === game
        ).length
      ]
    );

  content.innerHTML = `

    <div class="dashboard-grid">

      ${groups
        .map(
          group => `

            <div class="dashboard-card">

              <div class="dashboard-card-top">

                <div class="dashboard-card-icon">
                  🎮
                </div>

              </div>

              <div class="dashboard-card-label">
                ${escapeHTML(group[0])}
              </div>

              <div class="dashboard-card-number">
                ${group[1]}
              </div>

              <div class="dashboard-card-change">
                Matches
              </div>

            </div>
          `
        )
        .join("")}

    </div>

    <div class="admin-panel">

      ${panelHeader(
        "Games & Matches",
        "Game-wise tournament management",
        `
          <button
            class="btn btn-primary"
            id="gameAdd"
          >
            + Add Match
          </button>
        `
      )}

      <div class="table-wrap">

        <table class="admin-table">

          <thead>

            <tr>
              <th>GAME</th>
              <th>NAME</th>
              <th>MODE</th>
              <th>ENTRY</th>
              <th>SLOTS</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>

          </thead>

          <tbody>

            ${
              list.length
                ? list
                    .map(
                      ([id, tournament]) => `
                        <tr>

                          <td>
                            ${escapeHTML(
                              tournament.game ||
                              "BR Survival"
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              tournament.name ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              tournament.mode ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${money(
                              tournament.entryFee
                            )}
                          </td>

                          <td>
                            ${Number(
                              tournament.joined ||
                              0
                            )}/
                            ${Number(
                              tournament.slots ||
                              0
                            )}
                          </td>

                          <td>
                            ${statusHTML(
                              tournament.status
                            )}
                          </td>

                          <td>

                            <button
                              class="btn btn-primary"
                              onclick="window.editTournament('${escapeHTML(
                                id
                              )}')"
                            >
                              Edit
                            </button>

                          </td>

                        </tr>
                      `
                    )
                    .join("")
                : `
                    <tr>
                      <td colspan="7">
                        No matches
                      </td>
                    </tr>
                  `
            }

          </tbody>

        </table>

      </div>

    </div>
  `;

  document
    .getElementById("gameAdd")
    .onclick =
      () => openTournamentModal();
}

/* =========================================================
   TOURNAMENTS
   ========================================================= */

function showTournaments(content) {

  const list =
    entriesOf(tournaments);

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "All Tournaments",
        "Create, edit and delete tournaments",
        `
          <input
            id="tournamentSearch"
            class="search-box"
            placeholder="Search tournament..."
          >

          <button
            class="btn btn-primary"
            id="addTournamentBtn"
          >
            + Add Tournament
          </button>
        `
      )}

      ${
        list.length
          ? `
            <div
              class="tournament-admin-grid"
              id="tournamentGrid"
            >

              ${list
                .map(
                  ([id, tournament]) =>
                    tournamentCard(
                      id,
                      tournament
                    )
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
    .getElementById(
      "addTournamentBtn"
    )
    ?.addEventListener(
      "click",
      openTournamentModal
    );

  document
    .getElementById(
      "tournamentSearch"
    )
    ?.addEventListener(
      "input",
      e => {

        const query =
          e.target.value.toLowerCase();

        document
          .querySelectorAll(
            ".admin-tournament-card"
          )
          .forEach(card => {

            card.style.display =
              (
                card.dataset.name ||
                ""
              ).includes(query)
                ? ""
                : "none";
          });
      }
    );
}

function tournamentCard(id, tournament) {

  const image =
    tournament.image ||
    "../images/br-survival.jpg";

  const game =
    tournament.game ||
    tournament.category ||
    tournament.gameType ||
    "BR Survival";

  return `

    <div
      class="admin-tournament-card"
      data-name="${escapeHTML(
        String(
          tournament.name || ""
        ).toLowerCase()
      )}"
    >

      <div class="admin-tournament-image">

        <img
          src="${escapeHTML(image)}"
          alt="${escapeHTML(
            tournament.name ||
            "Tournament"
          )}"
          onerror="this.style.display='none'"
        >

      </div>

      <div class="admin-tournament-body">

        <h3>
          ${escapeHTML(
            tournament.name ||
            "Unnamed Tournament"
          )}
        </h3>

        <p>
          🎮 ${escapeHTML(game)}
          •
          ${escapeHTML(
            tournament.mode ||
            "Solo"
          )}
          •
          ${escapeHTML(
            tournament.map ||
            "Bermuda"
          )}
        </p>

        <div class="admin-tournament-meta">

          <div class="admin-meta-box">
            <small>ENTRY</small>
            <strong>
              ${money(
                tournament.entryFee
              )}
            </strong>
          </div>

          <div class="admin-meta-box">
            <small>PRIZE</small>
            <strong>
              ${money(
                tournament.prizePool
              )}
            </strong>
          </div>

          <div class="admin-meta-box">
            <small>SLOTS</small>
            <strong>
              ${Number(
                tournament.joined ||
                0
              )}/
              ${Number(
                tournament.slots ||
                0
              )}
            </strong>
          </div>

          <div class="admin-meta-box">
            <small>STATUS</small>
            <strong>
              ${escapeHTML(
                tournament.status ||
                "Upcoming"
              )}
            </strong>
          </div>

        </div>

        <div class="admin-tournament-actions">

          <button
            class="btn btn-primary"
            onclick="window.editTournament('${escapeHTML(
              id
            )}')"
          >
            Edit
          </button>

          <button
            class="btn btn-danger"
            onclick="window.deleteTournament('${escapeHTML(
              id
            )}')"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   TOURNAMENT MODAL
   ========================================================= */

function openTournamentModal(id = null) {

  const tournament =
    id && tournaments[id]
      ? tournaments[id]
      : {};

  const modal =
    document.createElement("div");

  modal.className =
    "modal-overlay show";

  modal.id =
    "tournamentModal";

  const game =
    tournament.game ||
    tournament.category ||
    tournament.gameType ||
    "BR Survival";

  modal.innerHTML = `

    <div class="admin-modal">

      <div class="modal-header">

        <h2>
          ${id ? "Edit" : "Add"}
          Tournament
        </h2>

        <button
          class="modal-close"
          id="closeTournament"
        >
          ✕
        </button>

      </div>

      <div class="modal-body">

        <form id="tournamentForm">

          <div class="form-grid">

            <div class="form-group full">

              <label>
                TOURNAMENT NAME
              </label>

              <input
                class="form-input"
                id="tName"
                value="${escapeHTML(
                  tournament.name ||
                  ""
                )}"
                required
              >

            </div>

            <div class="form-group full">

              <label>
                GAME
              </label>

              <select
                class="form-select"
                id="tGame"
              >

                ${GAME_OPTIONS
                  .map(
                    gameName =>
                      option(
                        gameName,
                        game
                      )
                  )
                  .join("")}

              </select>

            </div>

            <div class="form-group">

              <label>
                ENTRY FEE
              </label>

              <input
                class="form-input"
                type="number"
                min="0"
                id="tEntry"
                value="${Number(
                  tournament.entryFee ||
                  0
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                PRIZE POOL
              </label>

              <input
                class="form-input"
                type="number"
                min="0"
                id="tPrize"
                value="${Number(
                  tournament.prizePool ||
                  0
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                PER KILL
              </label>

              <input
                class="form-input"
                type="number"
                min="0"
                id="tPerKill"
                value="${Number(
                  tournament.perKill ||
                  0
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                TOTAL SLOTS
              </label>

              <input
                class="form-input"
                type="number"
                min="1"
                id="tSlots"
                value="${Number(
                  tournament.slots ||
                  50
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                MAP
              </label>

              <select
                class="form-select"
                id="tMap"
              >

                ${[
                  "Bermuda",
                  "Purgatory",
                  "Alpine",
                  "NexTerra"
                ]
                  .map(
                    map =>
                      option(
                        map,
                        tournament.map ||
                          "Bermuda"
                      )
                  )
                  .join("")}

              </select>

            </div>

            <div class="form-group">

              <label>
                MODE
              </label>

              <select
                class="form-select"
                id="tMode"
              >

                ${[
                  "Solo",
                  "Duo",
                  "Squad",
                  "1V1"
                ]
                  .map(
                    mode =>
                      option(
                        mode,
                        tournament.mode ||
                          "Solo"
                      )
                  )
                  .join("")}

              </select>

            </div>

            <div class="form-group">

              <label>
                DATE
              </label>

              <input
                class="form-input"
                type="date"
                id="tDate"
                value="${escapeHTML(
                  tournament.date ||
                  ""
                )}"
                required
              >

            </div>

            <div class="form-group">

              <label>
                TIME
              </label>

              <input
                class="form-input"
                type="time"
                id="tTime"
                value="${escapeHTML(
                  tournament.time ||
                  ""
                )}"
                required
              >

            </div>

            <div class="form-group">

              <label>
                ROOM ID
              </label>

              <input
                class="form-input"
                id="tRoomId"
                value="${escapeHTML(
                  tournament.roomId ||
                  ""
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                ROOM PASSWORD
              </label>

              <input
                class="form-input"
                id="tRoomPassword"
                value="${escapeHTML(
                  tournament.roomPassword ||
                  ""
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                STATUS
              </label>

              <select
                class="form-select"
                id="tStatus"
              >

                ${[
                  "Upcoming",
                  "Live",
                  "Completed"
                ]
                  .map(
                    status =>
                      option(
                        status,
                        tournament.status ||
                          "Upcoming"
                      )
                  )
                  .join("")}

              </select>

            </div>

            <div class="form-group full">

              <label>
                IMAGE URL
              </label>

              <input
                class="form-input"
                type="url"
                id="tImage"
                value="${escapeHTML(
                  tournament.image ||
                  ""
                )}"
              >

            </div>

            <div class="form-group full">

              <label>
                RULES
              </label>

              <textarea
                class="form-textarea"
                id="tRules"
              >${escapeHTML(
                Array.isArray(
                  tournament.rules
                )
                  ? tournament.rules.join(
                      "\n"
                    )
                  : tournament.rules ||
                    ""
              )}</textarea>

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
              class="btn btn-primary"
            >
              ${id ? "Update" : "Create"}
              Tournament
            </button>

          </div>

        </form>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  const close =
    () => modal.remove();

  document
    .getElementById(
      "closeTournament"
    )
    .onclick = close;

  document
    .getElementById(
      "cancelTournament"
    )
    .onclick = close;

  document
    .getElementById(
      "tournamentForm"
    )
    .onsubmit =
      e =>
        saveTournament(
          e,
          id
        );
}

/* =========================================================
   SAVE TOURNAMENT
   ========================================================= */

async function saveTournament(e, id) {

  e.preventDefault();

  const tournament = {

    name:
      document
        .getElementById(
          "tName"
        )
        .value
        .trim(),

    game:
      document
        .getElementById(
          "tGame"
        )
        .value,

    entryFee:
      Number(
        document
          .getElementById(
            "tEntry"
          )
          .value || 0
      ),

    prizePool:
      Number(
        document
          .getElementById(
            "tPrize"
          )
          .value || 0
      ),

    perKill:
      Number(
        document
          .getElementById(
            "tPerKill"
          )
          .value || 0
      ),

    slots:
      Number(
        document
          .getElementById(
            "tSlots"
          )
          .value || 0
      ),

    joined:
      Number(
        id &&
        tournaments[id]?.joined ||
        0
      ),

    map:
      document
        .getElementById(
          "tMap"
        )
        .value,

    mode:
      document
        .getElementById(
          "tMode"
        )
        .value,

    date:
      document
        .getElementById(
          "tDate"
        )
        .value,

    time:
      document
        .getElementById(
          "tTime"
        )
        .value,

    roomId:
      document
        .getElementById(
          "tRoomId"
        )
        .value
        .trim(),

    roomPassword:
      document
        .getElementById(
          "tRoomPassword"
        )
        .value
        .trim(),

    status:
      document
        .getElementById(
          "tStatus"
        )
        .value,

    image:
      document
        .getElementById(
          "tImage"
        )
        .value
        .trim(),

    rules:
      document
        .getElementById(
          "tRules"
        )
        .value
        .trim(),

    updatedAt:
      Date.now()
  };

  try {

    if (id) {

      await update(
        ref(
          db,
          `tournaments/${id}`
        ),
        tournament
      );

    } else {

      const newRef =
        push(
          ref(
            db,
            "tournaments"
          )
        );

      tournament.createdAt =
        Date.now();

      await set(
        newRef,
        tournament
      );
    }

    document
      .getElementById(
        "tournamentModal"
      )
      ?.remove();

    toast(
      id
        ? "Tournament updated"
        : "Tournament created"
    );

  } catch (error) {

    toast(
      "Database error: " +
      error.message
    );
  }
}

/* =========================================================
   DELETE TOURNAMENT
   ========================================================= */

async function deleteTournament(id) {

  const tournament =
    tournaments[id];

  if (!tournament) return;

  if (
    !confirm(
      `Delete "${tournament.name || "this tournament"}"?`
    )
  ) {
    return;
  }

  try {

    await remove(
      ref(
        db,
        `tournaments/${id}`
      )
    );

    toast(
      "Tournament deleted"
    );

  } catch (error) {

    toast(
      "Delete failed: " +
      error.message
    );
  }
}

/* =========================================================
   ENTRIES
   ========================================================= */

async function showEntries(content) {

  const entries =
    await val(
      "entries",
      {}
    );

  const list =
    entriesOf(entries);

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "Tournament Entries",
        "Manage player tournament entries"
      )}

      ${
        list.length
          ? `
            <div class="table-wrap">

              <table class="admin-table">

                <thead>

                  <tr>
                    <th>PLAYER</th>
                    <th>TOURNAMENT</th>
                    <th>AMOUNT</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                  </tr>

                </thead>

                <tbody>

                  ${list
                    .map(
                      ([, entry]) => `
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
                            ${money(
                              entry.amount
                            )}
                          </td>

                          <td>
                            ${formatDate(
                              entry.createdAt
                            )}
                          </td>

                          <td>
                            ${statusHTML(
                              entry.status ||
                              "Confirmed"
                            )}
                          </td>

                        </tr>
                      `
                    )
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

/* =========================================================
   REQUEST TABLE
   ========================================================= */

function requestRows(
  list,
  type
) {

  return list
    .map(
      ([id, item]) => {

        const status =
          String(
            item.status ||
            "pending"
          ).toLowerCase();

        const actions =
          status === "pending"
            ? `
              <button
                class="btn btn-primary request-approve"
                data-id="${escapeHTML(id)}"
                data-type="${type}"
              >
                Approve
              </button>

              <button
                class="btn btn-danger request-reject"
                data-id="${escapeHTML(id)}"
                data-type="${type}"
              >
                Reject
              </button>
            `
            : "-";

        return `
          <tr>

            <td>

              <strong>
                ${escapeHTML(
                  item.userName ||
                  item.name ||
                  item.userId ||
                  "-"
                )}
              </strong>

              <br>

              <small>
                ${escapeHTML(
                  item.userId ||
                  ""
                )}
              </small>

            </td>

            <td>
              ${escapeHTML(
                item.email ||
                "-"
              )}
            </td>

            <td>
              ${money(
                item.amount
              )}
            </td>

            <td>
              ${escapeHTML(
                item.method ||
                item.paymentMethod ||
                item.upiId ||
                "-"
              )}
            </td>

            <td>
              ${formatDate(
                item.createdAt ||
                item.timestamp
              )}
            </td>

            <td>
              ${statusHTML(
                item.status ||
                "Pending"
              )}
            </td>

            <td>

              <div class="panel-actions">
                ${actions}
              </div>

            </td>

          </tr>
        `;
      }
    )
    .join("");
}

/* =========================================================
   DEPOSITS
   ========================================================= */

async function showDeposits(content) {

  const deposits =
    await val(
      "deposits",
      {}
    );

  const list =
    entriesOf(deposits);

  const pending =
    list.filter(
      ([, item]) =>
        String(
          item.status ||
          "pending"
        ).toLowerCase() ===
        "pending"
    ).length;

  content.innerHTML = `

    <div class="mini-stats">

      <div class="mini-stat">
        <small>TOTAL</small>
        <strong>
          ${list.length}
        </strong>
      </div>

      <div class="mini-stat">
        <small>PENDING</small>
        <strong>
          ${pending}
        </strong>
      </div>

    </div>

    <div class="admin-panel">

      ${panelHeader(
        "Deposit Requests",
        "Review and approve/reject deposits"
      )}

      ${
        list.length
          ? `
            <div class="table-wrap">

              <table class="admin-table">

                <thead>

                  <tr>
                    <th>USER</th>
                    <th>EMAIL</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>

                </thead>

                <tbody>
                  ${requestRows(
                    list,
                    "deposit"
                  )}
                </tbody>

              </table>

            </div>
          `
          : emptyHTML(
              "💰",
              "No deposits",
              "Deposit requests will appear here."
            )
      }

    </div>
  `;

  bindRequestButtons();
}

/* =========================================================
   WITHDRAWALS
   ========================================================= */

async function showWithdrawals(content) {

  const withdrawals =
    await val(
      "withdrawals",
      {}
    );

  const list =
    entriesOf(withdrawals);

  const pending =
    list.filter(
      ([, item]) =>
        String(
          item.status ||
          "pending"
        ).toLowerCase() ===
        "pending"
    ).length;

  content.innerHTML = `

    <div class="mini-stats">

      <div class="mini-stat">
        <small>TOTAL</small>
        <strong>
          ${list.length}
        </strong>
      </div>

      <div class="mini-stat">
        <small>PENDING</small>
        <strong>
          ${pending}
        </strong>
      </div>

    </div>

    <div class="admin-panel">

      ${panelHeader(
        "Withdrawal Requests",
        "Review user withdrawals and approve/reject"
      )}

      ${
        list.length
          ? `
            <div class="table-wrap">

              <table class="admin-table">

                <thead>

                  <tr>
                    <th>USER</th>
                    <th>EMAIL</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>

                </thead>

                <tbody>
                  ${requestRows(
                    list,
                    "withdrawal"
                  )}
                </tbody>

              </table>

            </div>
          `
          : emptyHTML(
              "💸",
              "No withdrawals",
              "Withdrawal requests will appear here."
            )
      }

    </div>
  `;

  bindRequestButtons();
}

function bindRequestButtons() {

  document
    .querySelectorAll(
      ".request-approve"
    )
    .forEach(button => {

      button.onclick = () =>
        processRequest(
          button.dataset.type,
          button.dataset.id,
          "approved"
        );
    });

  document
    .querySelectorAll(
      ".request-reject"
    )
    .forEach(button => {

      button.onclick = () =>
        processRequest(
          button.dataset.type,
          button.dataset.id,
          "rejected"
        );
    });
}

/* =========================================================
   DEPOSIT / WITHDRAWAL PROCESSING
   ========================================================= */

async function processRequest(
  type,
  id,
  newStatus
) {

  const path =
    type === "deposit"
      ? "deposits"
      : "withdrawals";

  const item =
    await val(
      `${path}/${id}`,
      null
    );

  if (!item) {
    toast(
      "Request not found"
    );
    return;
  }

  if (
    String(
      item.status ||
      "pending"
    ).toLowerCase() !==
    "pending"
  ) {
    toast(
      "This request is already processed."
    );
    return;
  }

  if (
    !confirm(
      `${
        newStatus === "approved"
          ? "Approve"
          : "Reject"
      } ${type} of ${money(
        item.amount
      )}?`
    )
  ) {
    return;
  }

  try {

    const uid =
      item.userId ||
      item.uid;

    const amount =
      Number(
        item.amount || 0
      );

    if (
      amount <= 0
    ) {
      throw new Error(
        "Invalid amount"
      );
    }

    /*
      Deposit:
      Approved => add balance

      Withdrawal:
      Approved => subtract balance
    */

    if (
      newStatus === "approved" &&
      uid
    ) {

      const balanceRef =
        ref(
          db,
          `users/${uid}/balance`
        );

      if (
        type === "deposit"
      ) {

        await runTransaction(
          balanceRef,
          current =>
            Number(
              current || 0
            ) + amount
        );

      } else {

        const transaction =
          await runTransaction(
            balanceRef,
            current => {

              const balance =
                Number(
                  current || 0
                );

              if (
                balance < amount
              ) {
                return;
              }

              return (
                balance -
                amount
              );
            }
          );

        if (
          !transaction.committed
        ) {
          throw new Error(
            "Insufficient balance or balance update failed."
          );
        }
      }
    }

    await update(
      ref(
        db,
        `${path}/${id}`
      ),
      {
        status:
          newStatus,

        processedAt:
          Date.now(),

        processedBy:
          auth.currentUser
            ?.uid ||
          "admin"
      }
    );

    if (
      newStatus ===
      "approved"
    ) {

      const transactionRef =
        push(
          ref(
            db,
            "transactions"
          )
        );

      await set(
        transactionRef,
        {
          userId:
            uid || "",

          userName:
            item.userName ||
            item.name ||
            "",

          type:
            type === "deposit"
              ? "credit"
              : "debit",

          amount,

          description:
            type === "deposit"
              ? "Deposit approved"
              : "Withdrawal approved",

          createdAt:
            Date.now(),

          requestId:
            id,

          status:
            "Success"
        }
      );
    }

    toast(
      `${type} ${newStatus}`
    );

    loadPage(
      type === "deposit"
        ? "deposits"
        : "withdrawals"
    );

  } catch (error) {

    console.error(error);

    toast(
      "Action failed: " +
      error.message
    );
  }
}

/* =========================================================
   STAFF PANEL
   ========================================================= */

async function showStaff(content) {

  const staff =
    await val(
      "staff",
      {}
    );

  const list =
    entriesOf(staff);

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "Staff Accounts",
        "Manage staff and module permissions",
        `
          <button
            class="btn btn-primary"
            id="addStaff"
          >
            + Add Staff
          </button>
        `
      )}

      ${
        list.length
          ? `
            <div class="table-wrap">

              <table class="admin-table">

                <thead>

                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th>PERMISSIONS</th>
                    <th>ACTION</th>
                  </tr>

                </thead>

                <tbody>

                  ${list
                    .map(
                      ([id, staffUser]) => `
                        <tr>

                          <td>
                            ${escapeHTML(
                              staffUser.name ||
                              id
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              staffUser.email ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              staffUser.role ||
                              "Staff"
                            )}
                          </td>

                          <td>
                            ${statusHTML(
                              staffUser.status ||
                              "Active"
                            )}
                          </td>

                          <td>
                            ${
                              Array.isArray(
                                staffUser.permissions
                              )
                                ? staffUser.permissions
                                    .length +
                                  " modules"
                                : "None"
                            }
                          </td>

                          <td>

                            <button
                              class="btn btn-primary staff-edit"
                              data-id="${escapeHTML(id)}"
                            >
                              Edit
                            </button>

                            <button
                              class="btn btn-danger staff-delete"
                              data-id="${escapeHTML(id)}"
                            >
                              Delete
                            </button>

                          </td>

                        </tr>
                      `
                    )
                    .join("")}

                </tbody>

              </table>

            </div>
          `
          : emptyHTML(
              "👨‍💼",
              "No staff",
              "Create your first staff account."
            )
      }

    </div>
  `;

  document
    .getElementById(
      "addStaff"
    )
    .onclick =
      () =>
        openStaffModal();

  document
    .querySelectorAll(
      ".staff-edit"
    )
    .forEach(button => {

      button.onclick =
        () =>
          openStaffModal(
            button.dataset.id
          );
    });

  document
    .querySelectorAll(
      ".staff-delete"
    )
    .forEach(button => {

      button.onclick =
        () =>
          deleteStaff(
            button.dataset.id
          );
    });
}

/* =========================================================
   STAFF MODAL
   ========================================================= */

async function openStaffModal(
  id = null
) {

  const allStaff =
    await val(
      "staff",
      {}
    );

  const staffUser =
    id
      ? allStaff[id]
      : {};

  const modal =
    document.createElement("div");

  modal.className =
    "modal-overlay show";

  modal.id =
    "staffModal";

  const permissions =
    Array.isArray(
      staffUser.permissions
    )
      ? staffUser.permissions
      : [];

  modal.innerHTML = `

    <div class="admin-modal">

      <div class="modal-header">

        <h2>
          ${id ? "Edit" : "Create"}
          Staff
        </h2>

        <button
          class="modal-close"
          id="closeStaff"
        >
          ✕
        </button>

      </div>

      <div class="modal-body">

        <form id="staffForm">

          <div class="form-grid">

            <div class="form-group">

              <label>
                NAME
              </label>

              <input
                class="form-input"
                id="sName"
                value="${escapeHTML(
                  staffUser.name ||
                  ""
                )}"
                required
              >

            </div>

            <div class="form-group">

              <label>
                EMAIL
              </label>

              <input
                class="form-input"
                type="email"
                id="sEmail"
                value="${escapeHTML(
                  staffUser.email ||
                  ""
                )}"
                required
              >

            </div>

            <div class="form-group">

              <label>
                ROLE
              </label>

              <select
                class="form-select"
                id="sRole"
              >

                ${option(
                  "Staff",
                  staffUser.role ||
                    "Staff"
                )}

                ${option(
                  "Manager",
                  staffUser.role
                )}

                ${option(
                  "Support",
                  staffUser.role
                )}

              </select>

            </div>

            <div class="form-group">

              <label>
                STATUS
              </label>

              <select
                class="form-select"
                id="sStatus"
              >

                ${option(
                  "Active",
                  staffUser.status ||
                    "Active"
                )}

                ${option(
                  "Disabled",
                  staffUser.status
                )}

              </select>

            </div>

            <div class="form-group full">

              <label>
                MODULE PERMISSIONS
              </label>

              <div
                style="
                  display:grid;
                  grid-template-columns:
                  repeat(auto-fit,minmax(170px,1fr));
                  gap:10px;
                "
              >

                ${STAFF_PERMISSIONS
                  .map(
                    permission => `
                      <label
                        style="
                          display:flex;
                          gap:8px;
                          align-items:center;
                        "
                      >

                        <input
                          type="checkbox"
                          name="staffPermission"
                          value="${permission}"
                          ${
                            permissions.includes(
                              permission
                            )
                              ? "checked"
                              : ""
                          }
                        >

                        ${
                          PAGES[
                            permission
                          ]?.[0] ||
                          permission
                        }

                      </label>
                    `
                  )
                  .join("")}

              </div>

            </div>

          </div>

          <div class="form-actions">

            <button
              type="button"
              class="btn"
              id="cancelStaff"
            >
              Cancel
            </button>

            <button
              class="btn btn-primary"
            >
              Save Staff
            </button>

          </div>

        </form>

      </div>

    </div>
  `;

  document.body.appendChild(
    modal
  );

  const close =
    () => modal.remove();

  document
    .getElementById(
      "closeStaff"
    )
    .onclick = close;

  document
    .getElementById(
      "cancelStaff"
    )
    .onclick = close;

  document
    .getElementById(
      "staffForm"
    )
    .onsubmit =
      async e => {

        e.preventDefault();

        const selectedPermissions =
          [
            ...document.querySelectorAll(
              'input[name="staffPermission"]:checked'
            )
          ].map(
            checkbox =>
              checkbox.value
          );

        const key =
          id ||
          push(
            ref(
              db,
              "staff"
            )
          ).key;

        try {

          await set(
            ref(
              db,
              `staff/${key}`
            ),
            {

              name:
                document
                  .getElementById(
                    "sName"
                  )
                  .value
                  .trim(),

              email:
                document
                  .getElementById(
                    "sEmail"
                  )
                  .value
                  .trim(),

              role:
                document
                  .getElementById(
                    "sRole"
                  )
                  .value,

              status:
                document
                  .getElementById(
                    "sStatus"
                  )
                  .value,

              permissions:
                selectedPermissions,

              createdAt:
                staffUser.createdAt ||
                Date.now(),

              updatedAt:
                Date.now()
            }
          );

          close();

          toast(
            "Staff saved"
          );

          loadPage("staff");

        } catch (error) {

          toast(
            "Staff save failed: " +
            error.message
          );
        }
      };
}

/* =========================================================
   DELETE STAFF
   ========================================================= */

async function deleteStaff(id) {

  if (
    !confirm(
      "Delete this staff record?"
    )
  ) {
    return;
  }

  try {

    await remove(
      ref(
        db,
        `staff/${id}`
      )
    );

    toast(
      "Staff deleted"
    );

    loadPage("staff");

  } catch (error) {

    toast(
      "Delete failed: " +
      error.message
    );
  }
}

/* =========================================================
   REFERRAL
   ========================================================= */

async function showReferral(content) {

  const settings =
    await val(
      "referralSettings",
      {}
    );

  const referrals =
    await val(
      "referrals",
      {}
    );

  const list =
    entriesOf(referrals);

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "Referral Control",
        "Configure referral bonus and monitor referral earnings"
      )}

      <form id="referralForm">

        <div class="form-grid">

          <div class="form-group">

            <label>
              REFERRAL SYSTEM
            </label>

            <select
              class="form-select"
              id="refEnabled"
            >

              ${option(
                "true",
                String(
                  settings.enabled ??
                  true
                )
              )}

              ${option(
                "false",
                String(
                  settings.enabled ??
                  true
                )
              )}

            </select>

          </div>

          <div class="form-group">

            <label>
              BONUS AMOUNT (₹)
            </label>

            <input
              class="form-input"
              type="number"
              min="0"
              id="refBonus"
              value="${Number(
                settings.bonusAmount ||
                0
              )}"
            >

          </div>

          <div class="form-group">

            <label>
              REFERRAL PERCENTAGE (%)
            </label>

            <input
              class="form-input"
              type="number"
              min="0"
              max="100"
              id="refPercent"
              value="${Number(
                settings.percentage ||
                0
              )}"
            >

          </div>

          <div class="form-group">

            <label>
              MINIMUM ENTRY (₹)
            </label>

            <input
              class="form-input"
              type="number"
              min="0"
              id="refMin"
              value="${Number(
                settings.minimumEntry ||
                0
              )}"
            >

          </div>

          <div class="form-group full">

            <label>
              RULES
            </label>

            <textarea
              class="form-textarea"
              id="refRules"
            >${escapeHTML(
              settings.rules ||
              "Invite friends and earn referral rewards."
            )}</textarea>

          </div>

        </div>

        <div class="form-actions">

          <button
            class="btn btn-primary"
          >
            Save Referral Settings
          </button>

        </div>

      </form>

    </div>

    <div class="admin-panel">

      ${panelHeader(
        "Referral Users & Earnings",
        "Referral records"
      )}

      ${
        list.length
          ? `
            <div class="table-wrap">

              <table class="admin-table">

                <thead>

                  <tr>
                    <th>REFERRER</th>
                    <th>REFERRED USER</th>
                    <th>BONUS</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                  </tr>

                </thead>

                <tbody>

                  ${list
                    .map(
                      ([, item]) => `
                        <tr>

                          <td>
                            ${escapeHTML(
                              item.referrerName ||
                              item.referrerId ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              item.referredName ||
                              item.referredUserId ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${money(
                              item.amount ||
                              item.bonus
                            )}
                          </td>

                          <td>
                            ${formatDate(
                              item.createdAt
                            )}
                          </td>

                          <td>
                            ${statusHTML(
                              item.status ||
                              "Success"
                            )}
                          </td>

                        </tr>
                      `
                    )
                    .join("")}

                </tbody>

              </table>

            </div>
          `
          : emptyHTML(
              "🎁",
              "No referrals",
              "Referral activity will appear here."
            )
      }

    </div>
  `;

  document
    .getElementById(
      "referralForm"
    )
    .onsubmit =
      async e => {

        e.preventDefault();

        try {

          await set(
            ref(
              db,
              "referralSettings"
            ),
            {

              enabled:
                document
                  .getElementById(
                    "refEnabled"
                  )
                  .value ===
                "true",

              bonusAmount:
                Number(
                  document
                    .getElementById(
                      "refBonus"
                    )
                    .value || 0
                ),

              percentage:
                Number(
                  document
                    .getElementById(
                      "refPercent"
                    )
                    .value || 0
                ),

              minimumEntry:
                Number(
                  document
                    .getElementById(
                      "refMin"
                    )
                    .value || 0
                ),

              rules:
                document
                  .getElementById(
                    "refRules"
                  )
                  .value
                  .trim(),

              updatedAt:
                Date.now()
            }
          );

          toast(
            "Referral settings saved"
          );

        } catch (error) {

          toast(
            "Save failed: " +
            error.message
          );
        }
      };
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotifications(
  content
) {

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "Notify",
        "Console, announcement and push notification queue"
      )}

      <div class="form-grid">

        <div class="form-group">

          <label>
            TYPE
          </label>

          <select
            class="form-select"
            id="nType"
          >

            <option>
              Console
            </option>

            <option>
              Announcement
            </option>

            <option>
              Push Notification
            </option>

          </select>

        </div>

        <div class="form-group">

          <label>
            TARGET
          </label>

          <select
            class="form-select"
            id="nTarget"
          >

            <option>
              All Users
            </option>

            <option>
              Active Users
            </option>

          </select>

        </div>

        <div class="form-group full">

          <label>
            TITLE
          </label>

          <input
            class="form-input"
            id="nTitle"
          >

        </div>

        <div class="form-group full">

          <label>
            MESSAGE
          </label>

          <textarea
            class="form-textarea"
            id="nMessage"
          ></textarea>

        </div>

      </div>

      <div class="form-actions">

        <button
          class="btn btn-primary"
          id="sendNotificationBtn"
        >
          Send / Queue Notification
        </button>

      </div>

    </div>
  `;

  document
    .getElementById(
      "sendNotificationBtn"
    )
    .onclick =
      async () => {

        const data = {

          type:
            document
              .getElementById(
                "nType"
              )
              .value,

          target:
            document
              .getElementById(
                "nTarget"
              )
              .value,

          title:
            document
              .getElementById(
                "nTitle"
              )
              .value
              .trim(),

          message:
            document
              .getElementById(
                "nMessage"
              )
              .value
              .trim(),

          createdAt:
            Date.now(),

          createdBy:
            auth.currentUser
              ?.uid ||
            "admin"
        };

        if (
          !data.title ||
          !data.message
        ) {
          toast(
            "Title and message required"
          );
          return;
        }

        try {

          await set(
            push(
              ref(
                db,
                "notifications"
              )
            ),
            data
          );

          toast(
            "Notification saved/queued"
          );

          document
            .getElementById(
              "nTitle"
            )
            .value = "";

          document
            .getElementById(
              "nMessage"
            )
            .value = "";

        } catch (error) {

          toast(
            "Notification failed: " +
            error.message
          );
        }
      };
}

/* =========================================================
   APP BANNER
   ========================================================= */

async function showBanners(
  content
) {

  const banners =
    await val(
      "banners",
      {}
    );

  const list =
    entriesOf(banners);

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "App Banner",
        "Manage Home Screen promotional banners",
        `
          <button
            class="btn btn-primary"
            id="addBanner"
          >
            + Add Banner
          </button>
        `
      )}

      ${
        list.length
          ? `
            <div class="tournament-admin-grid">

              ${list
                .map(
                  ([id, banner]) => `

                    <div
                      class="admin-tournament-card"
                    >

                      <div
                        class="admin-tournament-image"
                      >

                        <img
                          src="${escapeHTML(
                            banner.image ||
                            ""
                          )}"
                          alt="Banner"
                        >

                      </div>

                      <div
                        class="admin-tournament-body"
                      >

                        <h3>
                          ${escapeHTML(
                            banner.title ||
                            "Untitled Banner"
                          )}
                        </h3>

                        <p>
                          ${escapeHTML(
                            banner.link ||
                            "No link"
                          )}
                        </p>

                        <p>
                          ${statusHTML(
                            banner.active === false
                              ? "Inactive"
                              : "Active"
                          )}
                        </p>

                        <div
                          class="admin-tournament-actions"
                        >

                          <button
                            class="btn btn-primary banner-edit"
                            data-id="${escapeHTML(
                              id
                            )}"
                          >
                            Edit
                          </button>

                          <button
                            class="btn banner-toggle"
                            data-id="${escapeHTML(
                              id
                            )}"
                          >
                            ${
                              banner.active === false
                                ? "Activate"
                                : "Deactivate"
                            }
                          </button>

                          <button
                            class="btn btn-danger banner-delete"
                            data-id="${escapeHTML(
                              id
                            )}"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>
                  `
                )
                .join("")}

            </div>
          `
          : emptyHTML(
              "🖼️",
              "No banners",
              "Add a Home Screen promotion banner."
            )
      }

    </div>
  `;

  document
    .getElementById(
      "addBanner"
    )
    .onclick =
      () =>
        openBannerModal();

  document
    .querySelectorAll(
      ".banner-edit"
    )
    .forEach(button => {

      button.onclick =
        () =>
          openBannerModal(
            button.dataset.id
          );
    });

  document
    .querySelectorAll(
      ".banner-toggle"
    )
    .forEach(button => {

      button.onclick =
        async () => {

          const banner =
            await val(
              `banners/${button.dataset.id}`,
              {}
            );

          await update(
            ref(
              db,
              `banners/${button.dataset.id}`
            ),
            {
              active:
                banner.active ===
                false,

              updatedAt:
                Date.now()
            }
          );

          loadPage(
            "banners"
          );
        };
    });

  document
    .querySelectorAll(
      ".banner-delete"
    )
    .forEach(button => {

      button.onclick =
        async () => {

          if (
            !confirm(
              "Delete banner?"
            )
          ) {
            return;
          }

          await remove(
            ref(
              db,
              `banners/${button.dataset.id}`
            )
          );

          loadPage(
            "banners"
          );
        };
    });
}

/* =========================================================
   BANNER MODAL
   ========================================================= */

async function openBannerModal(
  id = null
) {

  const allBanners =
    await val(
      "banners",
      {}
    );

  const banner =
    id
      ? allBanners[id]
      : {};

  const modal =
    document.createElement("div");

  modal.className =
    "modal-overlay show";

  modal.id =
    "bannerModal";

  modal.innerHTML = `

    <div class="admin-modal">

      <div class="modal-header">

        <h2>
          ${id ? "Edit" : "Add"}
          App Banner
        </h2>

        <button
          class="modal-close"
          id="closeBanner"
        >
          ✕
        </button>

      </div>

      <div class="modal-body">

        <form id="bannerForm">

          <div class="form-grid">

            <div class="form-group full">

              <label>
                TITLE
              </label>

              <input
                class="form-input"
                id="bTitle"
                value="${escapeHTML(
                  banner.title ||
                  ""
                )}"
                required
              >

            </div>

            <div class="form-group full">

              <label>
                IMAGE URL
              </label>

              <input
                class="form-input"
                type="url"
                id="bImage"
                value="${escapeHTML(
                  banner.image ||
                  ""
                )}"
                required
              >

            </div>

            <div class="form-group full">

              <label>
                LINK / CTA URL
              </label>

              <input
                class="form-input"
                type="url"
                id="bLink"
                value="${escapeHTML(
                  banner.link ||
                  ""
                )}"
              >

            </div>

            <div class="form-group">

              <label>
                STATUS
              </label>

              <select
                class="form-select"
                id="bActive"
              >

                ${option(
                  "true",
                  String(
                    banner.active !==
                    false
                  )
                )}

                ${option(
                  "false",
                  String(
                    banner.active !==
                    false
                  )
                )}

              </select>

            </div>

            <div class="form-group">

              <label>
                ORDER
              </label>

              <input
                class="form-input"
                type="number"
                id="bOrder"
                value="${Number(
                  banner.order ||
                  0
                )}"
              >

            </div>

          </div>

          <div class="form-actions">

            <button
              type="button"
              class="btn"
              id="cancelBanner"
            >
              Cancel
            </button>

            <button
              class="btn btn-primary"
            >
              Save Banner
            </button>

          </div>

        </form>

      </div>

    </div>
  `;

  document.body.appendChild(
    modal
  );

  const close =
    () => modal.remove();

  document
    .getElementById(
      "closeBanner"
    )
    .onclick = close;

  document
    .getElementById(
      "cancelBanner"
    )
    .onclick = close;

  document
    .getElementById(
      "bannerForm"
    )
    .onsubmit =
      async e => {

        e.preventDefault();

        const key =
          id ||
          push(
            ref(
              db,
              "banners"
            )
          ).key;

        try {

          await set(
            ref(
              db,
              `banners/${key}`
            ),
            {

              title:
                document
                  .getElementById(
                    "bTitle"
                  )
                  .value
                  .trim(),

              image:
                document
                  .getElementById(
                    "bImage"
                  )
                  .value
                  .trim(),

              link:
                document
                  .getElementById(
                    "bLink"
                  )
                  .value
                  .trim(),

              active:
                document
                  .getElementById(
                    "bActive"
                  )
                  .value ===
                "true",

              order:
                Number(
                  document
                    .getElementById(
                      "bOrder"
                    )
                    .value || 0
                ),

              createdAt:
                banner.createdAt ||
                Date.now(),

              updatedAt:
                Date.now()
            }
          );

          close();

          toast(
            "Banner saved"
          );

          loadPage(
            "banners"
          );

        } catch (error) {

          toast(
            "Banner save failed: " +
            error.message
          );
        }
      };
}

/* =========================================================
   RESULTS
   ========================================================= */

function showResults(
  content
) {

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "Tournament Results",
        "Add and manage match results",
        `
          <button
            class="btn btn-primary"
            id="resultBtn"
          >
            + Add Result
          </button>
        `
      )}

      ${emptyHTML(
        "🏅",
        "Results Management",
        "Connect result records to tournaments and player rewards."
      )}

    </div>
  `;

  document
    .getElementById(
      "resultBtn"
    )
    .onclick =
      () =>
        toast(
          "Result editor can be connected to your results schema."
        );
}

/* =========================================================
   WALLET
   ========================================================= */

async function showWallet(
  content
) {

  const transactions =
    await val(
      "transactions",
      {}
    );

  const list =
    entriesOf(
      transactions
    );

  const credit =
    list.reduce(
      (sum, [, transaction]) =>
        sum +
        (
          String(
            transaction.type
          ).toLowerCase() ===
          "credit"
            ? Number(
                transaction.amount ||
                0
              )
            : 0
        ),
      0
    );

  const debit =
    list.reduce(
      (sum, [, transaction]) =>
        sum +
        (
          String(
            transaction.type
          ).toLowerCase() ===
          "debit"
            ? Number(
                transaction.amount ||
                0
              )
            : 0
        ),
      0
    );

  content.innerHTML = `

    <div class="mini-stats">

      <div class="mini-stat">
        <small>TRANSACTIONS</small>
        <strong>
          ${list.length}
        </strong>
      </div>

      <div class="mini-stat">
        <small>CREDIT</small>
        <strong>
          ${money(credit)}
        </strong>
      </div>

      <div class="mini-stat">
        <small>DEBIT</small>
        <strong>
          ${money(debit)}
        </strong>
      </div>

    </div>

    <div class="admin-panel">

      ${panelHeader(
        "Transactions",
        "Wallet activity"
      )}

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
                    .map(
                      ([, transaction]) => `
                        <tr>

                          <td>
                            ${escapeHTML(
                              transaction.userName ||
                              transaction.userId ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              transaction.type ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${money(
                              transaction.amount
                            )}
                          </td>

                          <td>
                            ${escapeHTML(
                              transaction.description ||
                              "-"
                            )}
                          </td>

                          <td>
                            ${formatDate(
                              transaction.createdAt
                            )}
                          </td>

                        </tr>
                      `
                    )
                    .join("")}

                </tbody>

              </table>

            </div>
          `
          : emptyHTML(
              "💳",
              "No transactions",
              "Wallet transactions will appear here."
            )
      }

    </div>
  `;
}

/* =========================================================
   PLAYERS
   ========================================================= */

function showPlayers(
  content
) {

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "Top Players",
        "Leaderboard management"
      )}

      ${emptyHTML(
        "⭐",
        "Top Players",
        "Player rankings can be calculated from match results."
      )}

    </div>
  `;
}

/* =========================================================
   REPORTS
   ========================================================= */

function showReports(
  content
) {

  const list =
    Object.values(
      tournaments
    );

  const prize =
    list.reduce(
      (sum, tournament) =>
        sum +
        Number(
          tournament.prizePool ||
          0
        ),
      0
    );

  const entry =
    list.reduce(
      (sum, tournament) =>
        sum +
        Number(
          tournament.entryFee ||
          0
        ) *
        Number(
          tournament.joined ||
          0
        ),
      0
    );

  content.innerHTML = `

    <div class="mini-stats">

      <div class="mini-stat">
        <small>TOURNAMENT PRIZE</small>
        <strong>
          ${money(prize)}
        </strong>
      </div>

      <div class="mini-stat">
        <small>ENTRY COLLECTION</small>
        <strong>
          ${money(entry)}
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

      ${panelHeader(
        "Platform Report",
        "Current tournament statistics"
      )}

      ${emptyHTML(
        "📈",
        "Reports",
        "Detailed financial and player reports can be expanded from this module."
      )}

    </div>
  `;
}

/* =========================================================
   SETTINGS
   ========================================================= */

async function showSettings(
  content
) {

  const settings =
    await val(
      "settings",
      {}
    );

  content.innerHTML = `

    <div class="admin-panel">

      ${panelHeader(
        "Settings",
        "TRUSTED OP administration settings"
      )}

      <div class="form-grid">
<div class="form-group">

  <label>
    PAYMENT SYSTEM
  </label>

  <select
    class="form-select"
    id="settingPaymentEnabled"
  >
    ${option(
      "false",
      String(settings.paymentEnabled ?? false)
    )}
    ${option(
      "true",
      String(settings.paymentEnabled ?? false)
    )}
  </select>

</div>
        <div class="form-group">

          <label>
            APP NAME
          </label>

          <input
            class="form-input"
            id="settingAppName"
            value="${escapeHTML(
              settings.appName ||
              "TRUSTED OP"
            )}"
          >

        </div>

        <div class="form-group">

          <label>
            SUPPORT EMAIL
          </label>

          <input
            class="form-input"
            type="email"
            id="settingEmail"
            value="${escapeHTML(
              settings.supportEmail ||
              ""
            )}"
          >

        </div>

        <div class="form-group">

          <label>
            PLAN VALIDITY
          </label>

          <input
            class="form-input"
            id="settingValidity"
            value="${escapeHTML(
              settings.planValidity ||
              ""
            )}"
          >

        </div>

        <div class="form-group">

          <label>
            MAINTENANCE MODE
          </label>

          <select
            class="form-select"
            id="settingMaintenance"
          >

            ${option(
              "false",
              String(
                settings.maintenanceMode ||
                false
              )
            )}

            ${option(
              "true",
              String(
                settings.maintenanceMode ||
                false
              )
            )}

          </select>

        </div>

        <div class="form-group full">

          <label>
            MAINTENANCE MESSAGE
          </label>

          <textarea
            class="form-textarea"
            id="settingMessage"
          >${escapeHTML(
            settings.maintenanceMessage ||
            ""
          )}</textarea>

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
    .getElementById(
      "saveSettingsBtn"
    )
    .onclick =
      async () => {

        try {

          await update(
            ref(
              db,
              "settings"
            ),
            {

              appName:
                document
                  .getElementById(
                    "settingAppName"
                  )
                  .value
                  .trim(),

              supportEmail:
                document
                  .getElementById(
                    "settingEmail"
                  )
                  .value
                  .trim(),

              planValidity:
                document
                  .getElementById(
                    "settingValidity"
                  )
                  .value
                  .trim(),

              maintenanceMode:
                document
                  .getElementById(
                    "settingMaintenance"
                  )
                  .value ===
                "true",

              maintenanceMessage:
                document
                  .getElementById(
                    "settingMessage"
                  )
                  .value
                  .trim(),
paymentEnabled:
  document
    .getElementById(
      "settingPaymentEnabled"
    )
    .value === "true",
              updatedAt:
                Date.now()
            }
          );

          toast(
            "Settings saved successfully"
          );

        } catch (error) {

          toast(
            "Settings error: " +
            error.message
          );
        }
      };
}

/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.editTournament =
  id =>
    openTournamentModal(id);

window.deleteTournament =
  id =>
    deleteTournament(id);

/* =========================================================
   AUTH
   ========================================================= */

onAuthStateChanged(
  auth,
  user => {

    if (user) {

      renderAdminShell();

    } else {

      if (
        unsubscribeTournaments
      ) {

        unsubscribeTournaments();

        unsubscribeTournaments =
          null;
      }

      showLogin();
    }
  }
);
