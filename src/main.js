/* =========================================================
   TRUSTED OP — FINAL TOURNAMENT UI
   Firebase Connected
   GAME + STATUS FIXED
   ========================================================= */

import { db } from "./firebase.js";
import { ref, onValue } from "firebase/database";

const app = document.getElementById("app");
const LOGO = "./images/trusted-op-logo.png";

let tournaments = [];
let currentPage = "home";
let selectedGame = "";
let contestTab = "UPCOMING";

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

let countdownTimer = null;

/* =========================================================
   FIREBASE
   ========================================================= */

onValue(
  ref(db, "tournaments"),
  (snapshot) => {
    const data = snapshot.val() || {};

    tournaments = Object.entries(data).map(
      ([id, item]) => {

        item = item || {};

        const rules = Array.isArray(item.rules)
          ? item.rules
          : String(item.rules || "")
              .split("\n")
              .map(x => x.trim())
              .filter(Boolean);

        /* -------------------------
           GAME NORMALIZATION
           ------------------------- */

        const game =
          item.game ||
          item.category ||
          item.gameType ||
          "BR Survival";

        /* -------------------------
           STATUS NORMALIZATION
           Admin:
           Live       → Ongoing
           Upcoming   → Upcoming
           Completed  → Resulted
           ------------------------- */

        const rawStatus =
          String(
            item.status || "Upcoming"
          )
            .trim()
            .toUpperCase();

        const status =
          rawStatus === "LIVE" ||
          rawStatus === "ONGOING"
            ? "ONGOING"
            : rawStatus === "COMPLETED" ||
              rawStatus === "RESULTED"
              ? "RESULTED"
              : "UPCOMING";

        return {
          id,

          title:
            item.name ||
            item.title ||
            "Tournament",

          image:
            item.image ||
            "",

          game,

          type:
            item.mode ||
            item.type ||
            "Solo",

          mode:
            item.mode ||
            "Solo",

          prize:
            Number(
              item.prizePool ??
              item.prize ??
              0
            ),

          perKill:
            Number(
              item.perKill ??
              0
            ),

          entry:
            Number(
              item.entryFee ??
              item.entry ??
              0
            ),

          slots:
            Number(
              item.slots ??
              item.totalSlots ??
              20
            ),

          joined:
            Number(
              item.joined ??
              0
            ),

          map:
            item.map ||
            "Bermuda",

          date:
            item.date ||
            "",

          time:
            item.time ||
            "",

          roomId:
            item.roomId ||
            "",

          roomPassword:
            item.roomPassword ||
            item.roomPass ||
            "",

          status,

          rules
        };
      }
    );

    refreshPage();
  },
  (error) => {
    console.error(error);
    toast("Tournament data load failed");
  }
);

/* =========================================================
   HELPERS
   ========================================================= */

function money(value) {
  return "₹" +
    Number(value || 0)
      .toLocaleString("en-IN");
}

function escapeHTML(value) {
  const div =
    document.createElement("div");

  div.textContent =
    value ?? "";

  return div.innerHTML;
}

function imageHTML(src, alt = "") {

  if (!src) {
    return `
      <div class="no-image">
        🎮
      </div>
    `;
  }

  return `
    <img
      src="${escapeHTML(src)}"
      alt="${escapeHTML(alt)}"
      onerror="this.style.display='none'"
    >
  `;
}

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

function isJoined(id) {

  return joinedMatches.some(
    item =>
      typeof item === "string"
        ? item === id
        : item.id === id
  );
}

function getJoined(id) {

  return joinedMatches.find(
    item =>
      typeof item === "string"
        ? item === id
        : item.id === id
  );
}

function toast(message) {

  const old =
    document.querySelector(".toast");

  if (old) old.remove();

  const el =
    document.createElement("div");

  el.className = "toast";
  el.textContent = message;

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.classList.add("show");
  });

  setTimeout(() => {

    el.classList.remove("show");

    setTimeout(() => {
      el.remove();
    }, 300);

  }, 2200);
}

function refreshPage() {

  if (currentPage === "home") {
    showHome();
  }

  if (currentPage === "contests") {
    showContests(selectedGame);
  }

  if (currentPage === "matches") {
    showMyMatches();
  }

  if (currentPage === "details") {
    return;
  }
}

/* =========================================================
   HEADER
   ========================================================= */

function header() {

  return `
    <header class="app-header">

      <div
        class="profile-mini"
        onclick="showProfile()"
      >

        <div class="profile-mini-avatar">
          👤
        </div>

        <div>

          <div class="profile-mini-name">
            Trusted Player
          </div>

          <div class="profile-mini-sub">
            VIEW PROFILE
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
        class="${active === "earn" ? "active" : ""}"
        onclick="showEarn()"
      >
        <span>💰</span>
        <small>Earn</small>
      </button>

      <button
        class="${active === "leaderboard" ? "active" : ""}"
        onclick="showLeaderboard()"
      >
        <span>🏆</span>
        <small>Leaderboard</small>
      </button>

      <button
        class="${active === "home" ? "active" : ""}"
        onclick="showHome()"
      >
        <span>⌂</span>
        <small>Home</small>
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
   HOME
   ========================================================= */

function showHome() {

  currentPage = "home";

  const gameList = [
    ["BR Survival", "🔥", "BR"],
    ["Per Kill", "🎯", "PK"],
    ["Clash Squad 1v1", "⚔️", "CS"],
    ["Lone Wolf 1v1", "🥷", "LW"]
  ];

  app.innerHTML = `

    <div class="app-shell">

      ${header()}

      <main class="page-content">

        <section
          class="announcement"
          onclick="showNotifications()"
        >

          <div class="announcement-icon">
            📢
          </div>

          <div>

            <strong>
              IMPORTANT ANNOUNCEMENT
            </strong>

            <p>
              Check match rules before joining.
            </p>

          </div>

          <span>›</span>

        </section>

        <!-- MY MATCHES -->

        <div class="section-head">

          <h2>
            My Matches
          </h2>

          <button
            onclick="showMyMatches()"
          >
            View All
          </button>

        </div>

        <div class="status-row">

          <div
            class="status-card ongoing"
            onclick="showMyMatches('ONGOING')"
          >

            <span>🔥</span>

            <strong>
              ${countMyMatches("ONGOING")}
            </strong>

            <small>
              ONGOING
            </small>

          </div>

          <div
            class="status-card upcoming"
            onclick="showMyMatches('UPCOMING')"
          >

            <span>⏰</span>

            <strong>
              ${countMyMatches("UPCOMING")}
            </strong>

            <small>
              UPCOMING
            </small>

          </div>

          <div
            class="status-card completed"
            onclick="showMyMatches('RESULTED')"
          >

            <span>🏆</span>

            <strong>
              ${countMyMatches("RESULTED")}
            </strong>

            <small>
              COMPLETED
            </small>

          </div>

        </div>

        <!-- ESPORTS GAMES -->

        <div class="section-head game-heading">

          <h2>
            Esports Games
          </h2>

        </div>

        <section class="games-grid">

          ${gameList.map(game => `

            <button
              class="game-card"
              onclick="showContests('${escapeHTML(game[0])}')"
            >

              <div class="game-icon">
                ${game[1]}
              </div>

              <div class="game-name">
                ${escapeHTML(game[0])}
              </div>

              <div class="game-arrow">
                ›
              </div>

            </button>

          `).join("")}

        </section>

        <div class="more-games">
          MORE GAMES COMING SOON
        </div>

      </main>

      ${bottomNav("home")}

    </div>
  `;
}

/* =========================================================
   CONTEST CARD
   ========================================================= */

function contestCard(tournament) {

  return `

    <article
      class="contest-card"
      onclick="showContestDetails('${escapeHTML(tournament.id)}')"
    >

      <div class="contest-banner">

        ${imageHTML(
          tournament.image,
          tournament.title
        )}

      </div>

      <div class="contest-name">

        ${escapeHTML(tournament.title)}

        <span>›</span>

      </div>

    </article>

  `;
}

/* =========================================================
   CONTEST LIST
   ========================================================= */

function showContests(game = "") {

  currentPage = "contests";
  selectedGame = game;

  const filtered =
    tournaments.filter(t => {

      const gameMatch =
        !game ||
        String(t.game)
          .trim()
          .toLowerCase() ===
        String(game)
          .trim()
          .toLowerCase();

      return gameMatch;
    });

  const statusFiltered =
    filtered.filter(
      t => t.status === contestTab
    );

  app.innerHTML = `

    <div class="app-shell">

      <header class="contest-header">

        <button
          class="back-btn"
          onclick="showHome()"
        >
          ‹
        </button>

        <h1>
          ${escapeHTML(
            game || "Contests"
          )}
        </h1>

        <div></div>

      </header>

      <main class="page-content contest-page">

        <div class="contest-tabs">

          <button
            class="${contestTab === "ONGOING" ? "active" : ""}"
            onclick="setContestTab('ONGOING')"
          >
            Ongoing
          </button>

          <button
            class="${contestTab === "UPCOMING" ? "active" : ""}"
            onclick="setContestTab('UPCOMING')"
          >
            Upcoming
          </button>

          <button
            class="${contestTab === "RESULTED" ? "active" : ""}"
            onclick="setContestTab('RESULTED')"
          >
            Resulted
          </button>

        </div>

        <section class="contest-list">

          ${
            statusFiltered.length
              ? statusFiltered
                  .map(contestCard)
                  .join("")
              : `

                <div class="empty-state">

                  <div class="empty-icon">
                    🎮
                  </div>

                  <h2>
                    No Contests
                  </h2>

                  <p>
                    No ${contestTab.toLowerCase()}
                    contests available.
                  </p>

                </div>

              `
          }

        </section>

      </main>

    </div>
  `;
}

function setContestTab(tab) {

  contestTab = tab;

  showContests(
    selectedGame
  );
}

/* =========================================================
   CONTEST DETAILS
   ========================================================= */

function showContestDetails(id) {

  const tournament =
    tournaments.find(
      t => t.id === id
    );

  if (!tournament) {
    toast("Contest not found");
    return;
  }

  currentPage = "details";

  const joined =
    isJoined(id);

  const slotsLeft =
    Math.max(
      0,
      tournament.slots -
      tournament.joined
    );

  app.innerHTML = `

    <div class="detail-page">

      <header class="detail-header">

        <button
          class="back-btn"
          onclick="showContests('${escapeHTML(selectedGame)}')"
        >
          ‹
        </button>

        <h1>
          Contest Details #${escapeHTML(id)}
        </h1>

        <div></div>

      </header>

      <main class="detail-content">

        <div class="detail-banner">

          ${imageHTML(
            tournament.image,
            tournament.title
          )}

        </div>

        <div
          class="time-left"
          data-date="${escapeHTML(tournament.date)}"
          data-time="${escapeHTML(tournament.time)}"
        >

          ⏱️ Time Left:

          <span class="countdown">
            Calculating...
          </span>

        </div>

        <div class="detail-name">

          ${escapeHTML(tournament.title)}

          <div class="detail-id">
            ID #${escapeHTML(id)}
          </div>

        </div>

        <section class="info-grid">

          <div class="info-box">

            <span>
              Team
            </span>

            <strong>
              ${escapeHTML(tournament.type)}
            </strong>

          </div>

          <div class="info-box">

            <span>
              Mode
            </span>

            <strong>
              ${escapeHTML(tournament.mode)}
            </strong>

          </div>

          <div class="info-box">

            <span>
              Map
            </span>

            <strong>
              ${escapeHTML(tournament.map)}
            </strong>

          </div>

          <div class="info-box">

            <span>
              Match Type
            </span>

            <strong>
              ${tournament.entry > 0
                ? "Paid"
                : "Free"}
            </strong>

          </div>

          <div class="info-box">

            <span>
              Entry Fee
            </span>

            <strong>
              🪙 ${money(tournament.entry)}
            </strong>

          </div>

          <div class="info-box">

            <span>
              Available Spots
            </span>

            <strong>
              ${slotsLeft}
            </strong>

          </div>

        </section>

        <section class="schedule-box">

          <span>
            Match Schedule
          </span>

          <strong>
            ${escapeHTML(tournament.date)}
            ${escapeHTML(tournament.time)}
          </strong>

        </section>

        <section class="prize-section">

          <h2>
            Prize Details
          </h2>

          <div class="prize-card">

            <div>

              <span>
                Prize Pool
              </span>

              <strong>
                🪙 ${money(tournament.prize)}
              </strong>

            </div>

            <div>

              <span>
                Per Kill
              </span>

              <strong>
                🪙 ${money(tournament.perKill)}
              </strong>

            </div>

          </div>

          <div class="prize-list">

            <div>

              <span>
                1st Place
              </span>

              <strong>
                ${money(
                  Math.round(
                    tournament.prize * .45
                  )
                )}
              </strong>

            </div>

            <div>

              <span>
                2nd Place
              </span>

              <strong>
                ${money(
                  Math.round(
                    tournament.prize * .30
                  )
                )}
              </strong>

            </div>

            <div>

              <span>
                3rd Place
              </span>

              <strong>
                ${money(
                  Math.round(
                    tournament.prize * .15
                  )
                )}
              </strong>

            </div>

            <div>

              <span>
                Other Positions
              </span>

              <strong>
                ${money(
                  Math.round(
                    tournament.prize * .10
                  )
                )}
              </strong>

            </div>

          </div>

        </section>

        <section class="rules-section">

          <h2>
            Match Rules
          </h2>

          ${
            tournament.rules.length

              ? tournament.rules
                  .map(
                    rule => `

                      <div class="rule">
                        ✓ ${escapeHTML(rule)}
                      </div>

                    `
                  )
                  .join("")

              : `

                <div class="rule">
                  ✓ Follow official tournament rules.
                </div>

                <div class="rule">
                  ✓ Teaming and unregistered players are banned.
                </div>

                <div class="rule">
                  ✓ Follow room and match instructions.
                </div>

              `
          }

        </section>

        <div class="bottom-action">

          ${
            joined

              ? `

                <button
                  class="join-btn joined-btn"
                  onclick="showMyEntry('${escapeHTML(id)}')"
                >
                  ✓ VIEW MY ENTRY
                </button>

              `

              : `

                <button
                  class="join-btn"
                  onclick="joinTournament('${escapeHTML(id)}')"
                >
                  JOIN MATCH
                </button>

              `
          }

        </div>

      </main>

    </div>
  `;

  startCountdown();
}

/* =========================================================
   JOIN
   ========================================================= */

function joinTournament(id) {

  const tournament =
    tournaments.find(
      t => t.id === id
    );

  if (!tournament) return;

  if (isJoined(id)) {
    showMyEntry(id);
    return;
  }

  if (
    tournament.slots > 0 &&
    tournament.joined >=
    tournament.slots
  ) {

    toast(
      "No spots available"
    );

    return;
  }

  if (
    balance <
    tournament.entry
  ) {

    toast(
      "Insufficient coin balance"
    );

    return;
  }

  if (
    tournament.entry > 0
  ) {

    balance -=
      tournament.entry;
  }

  joinedMatches.push({
    id: tournament.id,
    joinedAt: Date.now(),
    status: tournament.status
  });

  saveData();

  toast(
    "Match joined successfully 🎮"
  );

  showMyEntry(id);
}

/* =========================================================
   MY ENTRY
   ========================================================= */

function showMyEntry(id) {

  const tournament =
    tournaments.find(
      t => t.id === id
    );

  if (!tournament) {

    toast(
      "Match not found"
    );

    return;
  }

  currentPage = "matches";

  app.innerHTML = `

    <div class="detail-page">

      <header class="detail-header">

        <button
          class="back-btn"
          onclick="showContestDetails('${escapeHTML(id)}')"
        >
          ‹
        </button>

        <h1>
          My Entry
        </h1>

        <div></div>

      </header>

      <main class="detail-content">

        <div class="entry-success">

          <div>
            ✓
          </div>

          <strong>
            MATCH JOINED
          </strong>

          <span>
            Your entry has been confirmed.
          </span>

        </div>

        <div class="detail-banner">

          ${imageHTML(
            tournament.image,
            tournament.title
          )}

        </div>

        <section class="entry-card">

          <h2>
            ${escapeHTML(
              tournament.title
            )}
          </h2>

          <p>
            Contest ID:
            <strong>
              #${escapeHTML(id)}
            </strong>
          </p>

          <div class="entry-row">

            <span>
              Game
            </span>

            <strong>
              ${escapeHTML(
                tournament.game
              )}
            </strong>

          </div>

          <div class="entry-row">

            <span>
              Team
            </span>

            <strong>
              ${escapeHTML(
                tournament.type
              )}
            </strong>

          </div>

          <div class="entry-row">

            <span>
              Map
            </span>

            <strong>
              ${escapeHTML(
                tournament.map
              )}
            </strong>

          </div>

          <div class="entry-row">

            <span>
              Entry Fee
            </span>

            <strong>
              🪙 ${money(
                tournament.entry
              )}
            </strong>

          </div>

          <div class="entry-row">

            <span>
              Schedule
            </span>

            <strong>
              ${escapeHTML(
                tournament.date
              )}
              ${escapeHTML(
                tournament.time
              )}
            </strong>

          </div>

        </section>

        <section class="room-card">

          <h2>
            Match Joining
          </h2>

          ${
            tournament.roomId

              ? `

                <div class="room-row">

                  <span>
                    Room ID
                  </span>

                  <strong>
                    ${escapeHTML(
                      tournament.roomId
                    )}
                  </strong>

                </div>

                <div class="room-row">

                  <span>
                    Password
                  </span>

                  <strong>
                    ${escapeHTML(
                      tournament.roomPassword ||
                      "Hidden"
                    )}
                  </strong>

                </div>

              `

              : `

                <div class="room-wait">

                  🔒 Room ID & Password will appear here
                  when admin releases the match room.

                </div>

              `
          }

        </section>

        <button
          class="join-btn"
          onclick="showContestDetails('${escapeHTML(id)}')"
        >
          VIEW CONTEST DETAILS
        </button>

      </main>

    </div>
  `;
}

/* =========================================================
   MY MATCHES
   ========================================================= */

function countMyMatches(status) {

  return joinedMatches.filter(
    entry => {

      const id =
        typeof entry === "string"
          ? entry
          : entry.id;

      const tournament =
        tournaments.find(
          t => t.id === id
        );

      return (
        tournament &&
        tournament.status === status
      );
    }
  ).length;
}

function showMyMatches(status = "") {

  currentPage = "matches";

  const matches =
    joinedMatches

      .map(entry => {

        const id =
          typeof entry === "string"
            ? entry
            : entry.id;

        return tournaments.find(
          t => t.id === id
        );

      })

      .filter(Boolean)

      .filter(t => {

        if (!status) {
          return true;
        }

        return t.status === status;
      });

  const title =
    status === "ONGOING"
      ? "Ongoing Matches"
      : status === "UPCOMING"
        ? "Upcoming Matches"
        : status === "RESULTED"
          ? "Completed Matches"
          : "My Matches";

  app.innerHTML = `

    <div class="app-shell">

      <header class="contest-header">

        <button
          class="back-btn"
          onclick="showHome()"
        >
          ‹
        </button>

        <h1>
          ${title}
        </h1>

        <div></div>

      </header>

      <main class="page-content">

        ${
          matches.length

            ? matches
                .map(t => `

                  <article
                    class="my-match-card"
                    onclick="showMyEntry('${escapeHTML(t.id)}')"
                  >

                    <div class="my-match-image">

                      ${imageHTML(
                        t.image,
                        t.title
                      )}

                    </div>

                    <div class="my-match-info">

                      <strong>
                        ${escapeHTML(t.title)}
                      </strong>

                      <span>
                        #${escapeHTML(t.id)}
                      </span>

                      <small>
                        ${escapeHTML(t.date)}
                        ${escapeHTML(t.time)}
                      </small>

                      <b class="match-status">
                        ${
                          t.status === "RESULTED"
                            ? "COMPLETED"
                            : escapeHTML(t.status)
                        }
                      </b>

                    </div>

                  </article>

                `)
                .join("")

            : `

              <div class="empty-state">

                <div class="empty-icon">
                  🎮
                </div>

                <h2>
                  ${
                    status
                      ? `No ${title}`
                      : "No Joined Matches"
                  }
                </h2>

                <p>
                  ${
                    status
                      ? "No matches are available in this status."
                      : "Join a contest and it will appear here."
                  }
                </p>

                <button
                  class="join-btn"
                  onclick="showHome()"
                >
                  EXPLORE CONTESTS
                </button>

              </div>

            `
        }

      </main>

      ${bottomNav("home")}

    </div>
  `;
}

/* =========================================================
   WALLET / EARN
   ========================================================= */

function showWallet() {
  showEarn();
}

function showEarn() {

  currentPage = "wallet";

  app.innerHTML = `

    <div class="app-shell">

      <main class="page-content">

        <div class="page-title">
          Earn
        </div>

        <div class="wallet-card">

          <small>
            AVAILABLE BALANCE
          </small>

          <strong>
            🪙 ${balance}
          </strong>

          <div class="wallet-buttons">

            <button
              onclick="toast('Add money coming soon')"
            >
              + ADD MONEY
            </button>

            <button
              onclick="toast('Withdrawal coming soon')"
            >
              WITHDRAW
            </button>

          </div>

        </div>

      </main>

      ${bottomNav("earn")}

    </div>
  `;
}

/* =========================================================
   LEADERBOARD
   ========================================================= */

function showLeaderboard() {

  currentPage = "leaderboard";

  app.innerHTML = `

    <div class="app-shell">

      <main class="page-content">

        <div class="page-title">
          Leaderboard
        </div>

        <div class="leaderboard-card">

          <div class="rank">
            🥇
            <strong>
              Trusted Player
            </strong>
            <span>
              1
            </span>
          </div>

          <div class="rank">
            🥈
            <strong>
              Top Player
            </strong>
            <span>
              2
            </span>
          </div>

          <div class="rank">
            🥉
            <strong>
              Pro Player
            </strong>
            <span>
              3
            </span>
          </div>

        </div>

      </main>

      ${bottomNav("leaderboard")}

    </div>
  `;
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotifications() {

  currentPage = "notifications";

  app.innerHTML = `

    <div class="app-shell">

      <main class="page-content">

        <div class="page-title">
          Notifications
        </div>

        <div class="notification-item">

          📢

          <div>

            <strong>
              Tournament Update
            </strong>

            <p>
              Check your upcoming match before joining.
            </p>

          </div>

        </div>

        <div class="notification-item">

          🔥

          <div>

            <strong>
              TRUSTED OP
            </strong>

            <p>
              New contests are available now.
            </p>

          </div>

        </div>

      </main>

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

      <main class="page-content">

        <div class="page-title">
          Profile
        </div>

        <div class="profile-card">

          <div class="profile-avatar">
            👤
          </div>

          <h2>
            Trusted Player
          </h2>

          <p>
            TRUSTED OP MEMBER
          </p>

          <div class="profile-stat">

            🏆 Matches Joined:

            <strong>
              ${joinedMatches.length}
            </strong>

          </div>

          <div class="profile-stat">

            🪙 Balance:

            <strong>
              ${balance}
            </strong>

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

      <main class="page-content">

        <div class="page-title">
          Menu
        </div>

        <div class="menu-list">

          <button
            onclick="showProfile()"
          >
            👤
            <span>
              Profile
            </span>
            ›
          </button>

          <button
            onclick="showMyMatches()"
          >
            🎮
            <span>
              My Matches
            </span>
            ›
          </button>

          <button
            onclick="showNotifications()"
          >
            🔔
            <span>
              Notifications
            </span>
            ›
          </button>

          <button
            onclick="toast('Settings coming soon')"
          >
            ⚙️
            <span>
              Settings
            </span>
            ›
          </button>

        </div>

      </main>

      ${bottomNav("menu")}

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
   COUNTDOWN
   ========================================================= */

function startCountdown() {

  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  const element =
    document.querySelector(".time-left");

  if (!element) return;

  const countdown =
    element.querySelector(".countdown");

  if (!countdown) return;

  const date =
    element.dataset.date;

  const time =
    element.dataset.time;

  if (!date) {

    countdown.textContent =
      "Schedule available";

    return;
  }

  const target =
    new Date(
      `${date} ${time || "00:00"}`
    );

  if (
    isNaN(
      target.getTime()
    )
  ) {

    countdown.textContent =
      "Schedule available";

    return;
  }

  function update() {

    const diff =
      target.getTime() -
      Date.now();

    if (diff <= 0) {

      countdown.textContent =
        "Match Started";

      if (countdownTimer) {
        clearInterval(
          countdownTimer
        );

        countdownTimer = null;
      }

      return;
    }

    const days =
      Math.floor(
        diff / 86400000
      );

    const hours =
      Math.floor(
        (diff % 86400000) /
        3600000
      );

    const minutes =
      Math.floor(
        (diff % 3600000) /
        60000
      );

    const seconds =
      Math.floor(
        (diff % 60000) /
        1000
      );

    countdown.textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  update();

  countdownTimer =
    setInterval(
      update,
      1000
    );
}

/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.showHome =
  showHome;

window.showContests =
  showContests;

window.setContestTab =
  setContestTab;

window.showContestDetails =
  showContestDetails;

window.joinTournament =
  joinTournament;

window.showMyEntry =
  showMyEntry;

window.showMyMatches =
  showMyMatches;

window.showWallet =
  showWallet;

window.showEarn =
  showEarn;

window.showLeaderboard =
  showLeaderboard;

window.showNotifications =
  showNotifications;

window.showProfile =
  showProfile;

window.showMenu =
  showMenu;

window.goBack =
  goBack;

/* =========================================================
   START
   ========================================================= */

showHome();
