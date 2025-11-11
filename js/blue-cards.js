// --- PREGUNTAS Y RESPUESTAS (CARTAS AZULES) --- //
// --- PREGUNTAS Y RESPUESTAS (CARTAS AZULES) --- //
window.blueQuestionsAndAnswers = [
  {
    question: "¿Qué herramienta ayuda a gestionar y recordar contraseñas de forma segura?",
    answer: "Un gestor de contraseñas (password manager)."
  },
  {
    question: "¿Qué es la autenticación en dos pasos (2FA)?",
    answer: "Un método que requiere dos formas de verificación (contraseña + código o huella) para acceder a una cuenta."
  },
  {
    question: "¿Qué acción reduce el riesgo de infecciones por malware?",
    answer: "Mantener el sistema operativo y los programas actualizados."
  },
  {
    question: "¿Por qué es importante hacer copias de seguridad?",
    answer: "Porque permiten recuperar la información en caso de pérdida, ataque o daño del sistema."
  }
];


// --- CREAR MAZO DE CARTAS AZULES --- //
let blueCards = [];
blueQuestionsAndAnswers.forEach((item, index) => {
  blueCards.push({ id: index, text: item.question, type: "question" });
  blueCards.push({ id: index, text: item.answer, type: "answer" });
});
blueCards = blueCards.sort(() => Math.random() - 0.5);

// --- RENDERIZAR CARTAS AZULES --- //
const blueBoard = document.getElementById("memory-board-blue");
if (blueBoard) {
  blueCards.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("col-auto");
    cardDiv.innerHTML = `
      <div class="card carta carta-azul text-white text-center"
           data-id="${card.id}" data-type="${card.type}"
           style="width:127px; height:186px; cursor:pointer; pointer-events:none;">
        <div class="card-inner carta-azul">
          <div class="card-front d-flex justify-content-center align-items-center h-100">
            <img src="svg/logo-cybercard-blue.svg" alt="CyberCard Azul" class="img-fluid" />
          </div>
          <div class="card-back d-flex justify-content-center align-items-center text-center p-2 text-white"
               style="background:#0d47a1; font-size:0.85rem;">
            ${card.text}
          </div>
        </div>
      </div>
    `;
    blueBoard.appendChild(cardDiv);
  });
}

// --- VARIABLES DE JUEGO --- //
let blueFlippedCards = [];
let blueMatchedPairs = 0;

// --- 🔊 SONIDOS --- //
const soundSelect = new Audio("sounds/seleccionar.mp3");
const soundError = new Audio("sounds/error.mp3");
const soundCorrect = new Audio("sounds/acertar.mp3"); // Sonido de acierto añadido

// --- ACTUALIZAR RATING GLOBAL --- //
function updateGlobalRating(isCorrect) {
  const stars = document.querySelectorAll('#stars-container span');
  if (window.currentStarIndex < stars.length) {
    stars[window.currentStarIndex].style.color = isCorrect ? 'gold' : 'red';
    window.currentStarIndex++;

    if (!isCorrect && window.currentStarIndex === stars.length) {
      mostrarModalPerdedor();
    }
  }
}

// --- LÓGICA DE VOLTEO --- //
function flipBlueCard(card) {
  if (!window.juegoIniciado) return; // 🚫 Bloquea si no se ha iniciado el juego
  if (card.classList.contains("flipped") || blueFlippedCards.length >= 2) return;

  // 🔊 Reproduce sonido de selección al voltear la carta (solo aquí)
  soundSelect.currentTime = 0;
  soundSelect.play();

  card.classList.add("flipped");
  blueFlippedCards.push(card);

  if (blueFlippedCards.length === 2) {
    const [card1, card2] = blueFlippedCards;
    const id1 = card1.dataset.id;
    const id2 = card2.dataset.id;

    if (id1 === id2 && card1.dataset.type !== card2.dataset.type) {
      // ✅ Coincidencia correcta
      blueMatchedPairs++;
      updateGlobalRating(true);
      blueFlippedCards = [];

      // Reproducir sonido de acierto
      soundCorrect.currentTime = 0;
      soundCorrect.play();

      if (blueMatchedPairs === blueQuestionsAndAnswers.length) {
        setTimeout(() => {
          alert("💙 ¡Completaste todas las cartas azules!");
        }, 500);
      }
    } else {
      // ❌ No coincide → reproducir sonido de error solo aquí (cuando ya hay dos cartas)
      updateGlobalRating(false);
      soundError.currentTime = 0;
      soundError.play();

      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        blueFlippedCards = [];
      }, 800);
    }
  }
}

// --- EVENTOS DE CLICK ---
// IMPORTANTE: seleccionamos SOLO los elementos que TIENEN data-id (el contenedor exterior)
// así evitamos registrar listeners duplicados en elementos anidados.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.card.carta-azul[data-id]').forEach(card => {
    card.addEventListener("click", (e) => {
      // usamos currentTarget para estar seguros de que es el element con data-id
      const cardElement = e.currentTarget;
      flipBlueCard(cardElement);
    });
  });
});

// --- DESBLOQUEAR CARTAS AL INICIAR --- //
document.addEventListener("gameStarted", () => {
  document.querySelectorAll(".card.carta-azul[data-id]").forEach(card => {
    card.style.pointerEvents = "auto"; // 🔓 Activar interacción
  });
});

// --- CARTA NEGRA AZUL --- //
const cartaNegraAzul = document.querySelector("#cartaNegraAzulContainer .card");
if (cartaNegraAzul) {
  const inner = cartaNegraAzul.querySelector(".card-inner");
  cartaNegraAzul.style.pointerEvents = "none"; // 🔒 Bloqueada al inicio

  cartaNegraAzul.addEventListener("click", () => {
    if (!window.juegoIniciado) return; // 🚫 No hace nada si el juego no empezó
    inner.classList.toggle("is-flipped");
    console.log("💙 Carta negra azul volteada");
  });

  // 🔓 Se desbloquea cuando se inicia el juego
  document.addEventListener("gameStarted", () => {
    cartaNegraAzul.style.pointerEvents = "auto";
  });
}
