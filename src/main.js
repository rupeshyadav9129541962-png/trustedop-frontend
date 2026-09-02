// ================================
// TRUSTED OP - HOME SCREEN
// ================================

const promotions = [
  {
    title: "TRUSTED OP",
    subtitle: "Play Tournament • Win Real Rewards",
    image: "images/promotion-1.jpg",
    button: "JOIN NOW"
  }
];

const matches = [
  {
    id: 1,
    title: "SOLO BATTLE",
    mode: "SOLO",
    entry: "₹10",
    prize: "₹500",
    perKill: "₹5",
    map: "Bermuda",
    date: "Today",
    time: "8:00 PM",
    image: "images/match-1.jpg",
    status: "JOIN NOW"
  },

  {
    id: 2,
    title: "DUO CLASH",
    mode: "DUO",
    entry: "₹20",
    prize: "₹1,000",
    perKill: "₹10",
    map: "Bermuda",
    date: "Today",
    time: "9:00 PM",
    image: "images/match-2.jpg",
    status: "JOIN NOW"
  },

  {
    id: 3,
    title: "SQUAD WAR",
    mode: "SQUAD",
    entry: "₹40",
    prize: "₹2,000",
    perKill: "₹20",
    map: "Purgatory",
    date: "Tomorrow",
    time: "8:30 PM",
    image: "images/match-3.jpg",
    status: "JOIN NOW"
  }
];


// ================================
// ELEMENTS
// ================================

const promotionContainer =
  document.getElementById("promotionContainer");

const matchesContainer =
  document.getElementById("matchesContainer");


// ================================
// PROMOTION CARD
// ================================

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

          <span class="promo-badge">
            SPECIAL
          </span>

          <h2>
            ${promo.title}
          </h2>

          <p>
            ${promo.subtitle}
          </p>

        </div>

        <button
          class="promo-button"
          onclick="handlePromotion()"
        >
          ${promo.button}
        </button>

      </div>

    </div>

  `).join("");
}


// ================================
// MATCH CARDS
// ================================

function renderMatches() {

  if (!matchesContainer) return;

  matchesContainer.innerHTML = matches.map(match => `

    <article
      class="match-card"
      onclick="openMatch(${match.id})"
    >

      <div class="match-image-wrapper">

        <img
          src="${match.image}"
          alt="${match.title}"
          class="match-image"
        >

        <span class="match-status">
          ${match.status}
        </span>

      </div>


      <div class="match-content">

        <div class="match-title-row">

          <div>

            <span class="mode">
              ${match.mode}
            </span>

            <h3>
              ${match.title}
            </h3>

          </div>


          <div class="prize-box">

            <small>
              PRIZE
            </small>

            <strong>
              ${match.prize}
            </strong>

          </div>

        </div>


        <div class="match-info">

          <div>
            <span>ENTRY</span>
            <strong>${match.entry}</strong>
          </div>

          <div>
            <span>PER KILL</span>
            <strong>${match.perKill}</strong>
          </div>

          <div>
            <span>MAP</span>
            <strong>${match.map}</strong>
          </div>

        </div>


        <div class="match-footer">

          <span>
            🗓 ${match.date}
          </span>

          <span>
            ⏰ ${match.time}
          </span>

        </div>


        <button
          class="join-button"
          onclick="event.stopPropagation(); openMatch(${match.id})"
        >
          VIEW MATCH
        </button>

      </div>

    </article>

  `).join("");
}


// ================================
// OPEN MATCH DETAILS
// ================================

function openMatch(id) {

  const match =
    matches.find(item => item.id === id);

  if (!match) return;

  alert(
    `${match.title}\n\n` +
    `Mode: ${match.mode}\n` +
    `Entry: ${match.entry}\n` +
    `Prize: ${match.prize}\n` +
    `Per Kill: ${match.perKill}\n` +
    `Map: ${match.map}\n` +
    `Date: ${match.date}\n` +
    `Time: ${match.time}`
  );
}


// ================================
// PROMOTION BUTTON
// ================================

function handlePromotion() {

  alert("Promotion opened!");

}


// ================================
// START HOME SCREEN
// ================================

renderPromotion();
renderMatches();
