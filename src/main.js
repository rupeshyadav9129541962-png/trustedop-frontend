// ========================================
// TRUSTED OP - MAIN JAVASCRIPT
// ========================================


// ========================================
// PROMOTION
// ========================================

const promotions = [
  {
    title: "TRUSTED OP",
    subtitle: "Play • Compete • Win",
    image: "./Image/file_000000001d9071fb89ee875444fe92f4.png"
  }
];


// ========================================
// TOURNAMENT CARDS
// ========================================

const tournaments = [
  {
    id: 1,
    name: "1 FULL MAP",
    image: "./Image/file_000000003ae071fb8535359ee0b42157.png"
  },

  {
    id: 2,
    name: "2 FULL MAP 2",
    image: "./Image/file_0000000070c082119a1f752d3655a033.png"
  },

  {
    id: 3,
    name: "3 FULL MAP 3",
    image: "./Image/file_000000001d9071fb89ee875444fe92f4.png"
  },

  {
    id: 4,
    name: "4 FULL MAP 4",
    image: "./Image/file_000000003ae071fb8535359ee0b42157.png"
  }
];


// ========================================
// ELEMENTS
// ========================================

const promotionContainer =
  document.getElementById("promotionContainer");

const matchesContainer =
  document.getElementById("matchesContainer");


// ========================================
// RENDER PROMOTION
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
          onclick="openPromotion()"
        >
          JOIN NOW
        </button>

      </div>

    </div>

  `).join("");
}


// ========================================
// RENDER TOURNAMENT CARDS
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

          <h3>
            ${tournament.name}
          </h3>

        </div>

      </div>

    </article>

  `).join("");
}


// ========================================
// TOURNAMENT CLICK
// ========================================

function openTournament(id) {

  const tournament =
    tournaments.find(item => item.id === id);

  if (!tournament) return;

  // Match Details page will be connected here later.
  console.log(
    "Tournament selected:",
    tournament.name
  );

}


// ========================================
// PROMOTION CLICK
// ========================================

function openPromotion() {

  console.log("Promotion clicked");

}


// ========================================
// PAGE ELEMENTS
// ========================================

const pages = {
  home: document.getElementById("homePage"),
  wallet: document.getElementById("walletPage"),
  winners: document.getElementById("winnersPage"),
  profile: document.getElementById("profilePage")
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


  // Update bottom navigation

  document
    .querySelectorAll(".nav-item")
    .forEach(item => {

      item.classList.remove("active");

      if (item.dataset.page === pageName) {
        item.classList.add("active");
      }

    });


  // Scroll to top

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

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
// START HOME
// ========================================

renderPromotion();

renderTournaments();

showPage("home");
