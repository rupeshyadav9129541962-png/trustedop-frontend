// ========================================
// TRUSTED OP - MAIN JAVASCRIPT
// ========================================

const promotions = [
{
title: "TRUSTED OP",
subtitle: "Play • Compete • Win",
image: "./Image/file_000000001d9071fb89ee875444fe92f4.png"
}
];

const tournaments = [
{
id: 1,
name: "1 FULL MAP",
image: "./Image/file_000000003ae071fb8535359ee0b42157.png",
entryFee: "₹10",
prizePool: "₹100",
perKill: "₹5",
type: "Solo",
version: "FF MAX",
map: "Bermuda",
date: "03 September 2026",
time: "08:00 PM",
slots: "48",
availableSlots: "32",
roomId: "Will be shared",
password: "Will be shared",
rules: "Only registered players can participate. Teaming and unregistered players are banned. Follow all tournament rules and join the room before the match starts."
},

{
id: 2,
name: "2 FULL MAP 2",
image: "./Image/file_0000000070c082119a1f752d3655a033.png",
entryFee: "₹20",
prizePool: "₹200",
perKill: "₹10",
type: "Duo",
version: "FF MAX",
map: "Bermuda",
date: "04 September 2026",
time: "09:00 PM",
slots: "24 Teams",
availableSlots: "18 Teams",
roomId: "Will be shared",
password: "Will be shared",
rules: "Both registered players must join. Teaming with another team is not allowed. Room ID and password will be provided before the match."
},

{
id: 3,
name: "3 FULL MAP 3",
image: "./Image/file_000000001d9071fb89ee875444fe92f4.png",
entryFee: "₹30",
prizePool: "₹300",
perKill: "₹15",
type: "Squad",
version: "FF MAX",
map: "Bermuda",
date: "05 September 2026",
time: "08:30 PM",
slots: "12 Teams",
availableSlots: "10 Teams",
roomId: "Will be shared",
password: "Will be shared",
rules: "All squad members must be registered. No teaming with other squads. Players must follow the official match rules."
},

{
id: 4,
name: "4 FULL MAP 4",
image: "./Image/file_000000003ae071fb8535359ee0b42157.png",
entryFee: "₹50",
prizePool: "₹500",
perKill: "₹20",
type: "Solo",
version: "FF MAX",
map: "Bermuda",
date: "06 September 2026",
time: "10:00 PM",
slots: "48",
availableSlots: "40",
roomId: "Will be shared",
password: "Will be shared",
rules: "Players must join on time. Any player using an unregistered account will be removed from the match."
}
];

const promotionContainer =
document.getElementById("promotionContainer");

const matchesContainer =
document.getElementById("matchesContainer");

const matchDetailsContainer =
document.getElementById("matchDetailsContainer");

const scheduleContainer =
document.getElementById("scheduleContainer");

// ========================================
// SELECTED MATCH
// ========================================

let selectedTournamentId = null;

// ========================================
// PROMOTION
// ========================================

function renderPromotion() {

if (!promotionContainer) return;

promotionContainer.innerHTML = promotions.map(promo => `
<div class="promotion-card">

  <img
    src="${promo.image}"
    alt="${promo.title}"
    class="promotion-image"
  >

  <div class="promotion-overlay">

    <div>
      <span class="promo-badge">SPECIAL</span>
      <h2>${promo.title}</h2>
      <p>${promo.subtitle}</p>
    </div>

    <button
      class="promo-button"
      onclick="openPromotion()"
    >
      JOIN NOW
    </button>

  </div>

</div>

`).join("");
}

// ========================================
// HOME TOURNAMENT CARDS
// ========================================

function renderTournaments() {

if (!matchesContainer) return;

matchesContainer.innerHTML = tournaments.map(tournament => `
<article
class="match-card"
onclick="openTournament(${tournament.id})"
>

  <div class="match-image-wrapper">

    <img
      src="${tournament.image}"
      alt="${tournament.name}"
      class="match-image"
    >

  </div>

  <div class="match-content">

    <div class="match-title-row">
      <h3>${tournament.name}</h3>
    </div>

  </div>

</article>

`).join("");
}

// ========================================
// OPEN MATCH DETAILS
// ========================================

function openTournament(id) {

const tournament =
tournaments.find(item => item.id === id);

if (!tournament) return;

// Save selected match
selectedTournamentId = id;

matchDetailsContainer.innerHTML = `

<div class="details-card">

  <img
    src="${tournament.image}"
    alt="${tournament.name}"
    class="details-image"
  >

  <div class="details-body">

    <h2 class="details-title">
      ${tournament.name}
    </h2>

    <div class="details-grid">

      <div class="detail-item">
        <span class="detail-label">Entry Fee</span>
        <span class="detail-value">
          ${tournament.entryFee}
        </span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Prize Pool</span>
        <span class="detail-value">
          ${tournament.prizePool}
        </span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Per Kill</span>
        <span class="detail-value">
          ${tournament.perKill}
        </span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Type</span>
        <span class="detail-value">
          ${tournament.type}
        </span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Version</span>
        <span class="detail-value">
          ${tournament.version}
        </span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Map</span>
        <span class="detail-value">
          ${tournament.map}
        </span>
      </div>

    </div>

    <button
      class="join-now"
      onclick="joinTournament(${tournament.id})"
    >
      JOIN NOW
    </button>

    <button
      class="join-now"
      onclick="openSchedule(${tournament.id})"
    >
      📅 MATCH SCHEDULE
    </button>

  </div>

</div>

`;

showPage("matchDetails");
}

// ========================================
// FULL MATCH SCHEDULE
// ========================================

function openSchedule(id) {

const tournament =
tournaments.find(item => item.id === id);

if (!tournament) return;

selectedTournamentId = id;

scheduleContainer.innerHTML = `

<div class="schedule-card">

  <h2 class="schedule-title">
    ${tournament.name}
  </h2>

  <p class="schedule-subtitle">
    Complete Match Schedule & Details
  </p>

  <div class="schedule-list">

    <div class="schedule-row">
      <span>📅 Match Date</span>
      <span>${tournament.date}</span>
    </div>

    <div class="schedule-row">
      <span>⏰ Match Time</span>
      <span>${tournament.time}</span>
    </div>

    <div class="schedule-row">
      <span>🎮 Type</span>
      <span>${tournament.type}</span>
    </div>

    <div class="schedule-row">
      <span>📱 Version</span>
      <span>${tournament.version}</span>
    </div>

    <div class="schedule-row">
      <span>🗺️ Map</span>
      <span>${tournament.map}</span>
    </div>

    <div class="schedule-row">
      <span>👥 Total Slots</span>
      <span>${tournament.slots}</span>
    </div>

    <div class="schedule-row">
      <span>🟢 Available Slots</span>
      <span>${tournament.availableSlots}</span>
    </div>

    <div class="schedule-row">
      <span>🔑 Room ID</span>
      <span>${tournament.roomId}</span>
    </div>

    <div class="schedule-row">
      <span>🔐 Password</span>
      <span>${tournament.password}</span>
    </div>

  </div>

  <div class="rules-box">

    <h3>📜 Match Rules</h3>

    <p>
      ${tournament.rules}
    </p>

  </div>

  <button
    class="join-now"
    onclick="joinTournament(${tournament.id})"
  >
    JOIN NOW
  </button>

</div>

`;

showPage("schedule");
}

// ========================================
// JOIN
// ========================================

function joinTournament(id) {

const tournament =
tournaments.find(item => item.id === id);

if (!tournament) return;

alert(
"Join system Firebase se connect hone ke baad active hoga."
);
}

// ========================================
// PROMOTION BUTTON
// ========================================

function openPromotion() {
console.log("Promotion clicked");
}

// ========================================
// PAGE SYSTEM
// ========================================

const pages = {

home:
document.getElementById("homePage"),

matchDetails:
document.getElementById("matchDetailsPage"),

schedule:
document.getElementById("schedulePage"),

wallet:
document.getElementById("walletPage"),

winners:
document.getElementById("winnersPage"),

profile:
document.getElementById("profilePage")

};

// ========================================
// SHOW PAGE
// ========================================

function showPage(pageName) {

Object.keys(pages).forEach(page => {

if (pages[page]) {
  pages[page].classList.add("hidden");
}

});

if (pages[pageName]) {
pages[pageName].classList.remove("hidden");
}

document
.querySelectorAll(".nav-item")
.forEach(item => {

  item.classList.remove("active");

  if (item.dataset.page === pageName) {
    item.classList.add("active");
  }

});

window.scrollTo({
top: 0,
behavior: "smooth"
});
}

// ========================================
// BACK TO MATCH DETAILS
// ========================================

function goBackToMatch() {

if (selectedTournamentId) {
openTournament(selectedTournamentId);
} else {
showPage("home");
}

}

// ========================================
// BOTTOM NAVIGATION
// ========================================

document
.querySelectorAll(".nav-item")
.forEach(item => {

item.addEventListener("click", () => {

  const page =
    item.dataset.page;

  showPage(page);

});

});

// ========================================
// START APP
// ========================================

renderPromotion();

renderTournaments();

showPage("home");
