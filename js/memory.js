// --- VARIABLES DE JUEGO ---
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// --- VARIABLES DE PUNTUACIÓN (estrellas) ---
let starIndex = 0;
let stars = [];

// --- CARGAR COMPONENTE DE ESTRELLAS ---
async function loadRatingComponent(elementId, filePath) {
  try {
    const container = document.getElementById(elementId);
    if (!container) return console.error(`Elemento con ID "${elementId}" no encontrado`);
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
    const html = await response.text();
    container.innerHTML = html;
    stars = Array.from(container.querySelectorAll('span[role="button"]'));
  } catch (error) {
    console.error("Error cargando el componente:", error);
  }
}
loadRatingComponent('rating-component', 'components/rating.html');

// --- FUNCIONES DE ESTRELLAS ---
function fillStar(colorClass) {
  if (starIndex >= stars.length) return;
  const star = stars[starIndex];
  star.classList.remove("text-secondary", "text-warning", "text-danger");
  star.classList.add(colorClass);
  starIndex++;
}

// --- LÓGICA DEL JUEGO ---
function flipCard(card) {
  if (lockBoard || card === firstCard) return;
  const inner = card.querySelector(".card-inner");
  if (!inner) return;
  inner.classList.add("is-flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const isMatch =
    firstCard.dataset.id &&
    secondCard.dataset.id &&
    firstCard.dataset.id === secondCard.dataset.id &&
    firstCard.dataset.type !== secondCard.dataset.type;

  if (isMatch) {
    // ✅ Acierto
    setTimeout(() => {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      fillStar("text-warning");
      resetBoard();
    }, 800);
  } else {
    // ❌ Error
    setTimeout(() => {
      firstCard.querySelector(".card-inner").classList.remove("is-flipped");
      secondCard.querySelector(".card-inner").classList.remove("is-flipped");
      fillStar("text-danger");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// --- EVENTOS DE TODAS LAS CARTAS ---
function addFlipEvents() {
  document.querySelectorAll(".card.carta").forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) flipCard(card);
    });
  });
}

// Esperar a que ambos tableros estén cargados
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => addFlipEvents(), 300);
});
