// --- PREGUNTAS Y RESPUESTAS (CARTAS ROJAS) ---
window.redQuestionsAndAnswers = [
  {
    question: "Descubriste que tu cuenta fue hackeada. ¿Cuál es el primer paso?",
    answer: "Cambiar la contraseña inmediatamente y habilitar la verificación en dos pasos."
  },
  {
    question: "Tu computadora está bloqueada y aparece un mensaje pidiendo dinero para desbloquearla. ¿Qué tipo de ataque es este?",
    answer: "Ransomware."
  },
  {
    question: "Detectas que alguien realizó compras en línea con tu tarjeta sin permiso. ¿Qué haces?",
    answer: "Reportar el fraude al banco y bloquear la tarjeta inmediatamente."
  },
  {
    question: "Tu empresa recibe un ataque DDoS. ¿Qué se recomienda hacer?",
    answer: "Contactar al proveedor de servicios de red, activar mitigaciones y registrar la evidencia del ataque."
  }
];

// --- CREAR MAZO DE CARTAS ROJAS ---
let redCards = [];
redQuestionsAndAnswers.forEach((item, index) => {
  redCards.push({ id: index, text: item.question, type: "question" });
  redCards.push({ id: index, text: item.answer, type: "answer" });
});
redCards = redCards.sort(() => Math.random() - 0.5);

// --- RENDERIZAR CARTAS ROJAS ---
document.addEventListener("DOMContentLoaded", () => {

  // --- SONIDOS ---
  const soundSelect = new Audio("sounds/seleccionar.mp3");
  const soundError = new Audio("sounds/error.mp3");
  const soundCorrectRed = new Audio("sounds/acertar.mp3"); // Sonido de acierto añadido

  // --- RENDERIZAR CARTAS ROJAS ---
  const redBoard = document.getElementById("memory-board");
  if (redBoard) {
    redCards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("col-auto");
      cardDiv.innerHTML = `
        <div class="card carta carta-roja text-white text-center" 
             data-id="${card.id}" data-type="${card.type}" 
             style="width:127px; height:186px; cursor:pointer; pointer-events:none;">
          <div class="card-inner carta-roja">
            <div class="card-front d-flex justify-content-center align-items-center h-100">
              <img src="svg/logo-cybercard.svg" alt="CyberCard" class="img-fluid" />
            </div>
            <div class="card-back d-flex justify-content-center align-items-center text-center p-2 text-white" 
                 style="background:#b71c1c; font-size:0.85rem;">
              ${card.text}
            </div>
          </div>
        </div>
      `;
      redBoard.appendChild(cardDiv);
    });
  }

  // --- VARIABLES DE JUEGO ---
  let redFlippedCards = [];
  let redMatchedPairs = 0;
  let currentStarIndex = 0;

  function updateGlobalRating(isCorrect) {
    const stars = document.querySelectorAll('#stars-container span');
    if (currentStarIndex < stars.length) {
      stars[currentStarIndex].style.color = isCorrect ? 'gold' : 'red';
      currentStarIndex++;
      if (!isCorrect && currentStarIndex === stars.length) {
        mostrarModalPerdedor();
      }
    }
  }

  function flipRedCard(card) {
    if (!window.juegoIniciado) return;
    if (card.classList.contains("flipped") || redFlippedCards.length >= 2) return;

    soundSelect.currentTime = 0;
    soundSelect.play();

    card.classList.add("flipped");
    redFlippedCards.push(card);

    if (redFlippedCards.length === 2) {
      const [card1, card2] = redFlippedCards;
      const id1 = card1.dataset.id;
      const id2 = card2.dataset.id;

      if (id1 === id2 && card1.dataset.type !== card2.dataset.type) {
        redMatchedPairs++;
        redFlippedCards = [];
        updateGlobalRating(true);

        // Reproducir sonido de acierto
        soundCorrectRed.currentTime = 0;
        soundCorrectRed.play();

        if (redMatchedPairs === redQuestionsAndAnswers.length) {
          setTimeout(() => alert("🔥 ¡Completaste todas las cartas rojas!"), 500);
        }
      } else {
        updateGlobalRating(false);
        soundError.currentTime = 0;
        soundError.play();
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          redFlippedCards = [];
        }, 800);
      }
    }
  }

  // --- EVENTOS DE CLICK ---
  document.querySelectorAll(".card.carta-roja[data-id]").forEach(card => {
    card.addEventListener("click", () => flipRedCard(card));
  });

  // --- DESBLOQUEAR CARTAS AL INICIAR ---
  document.addEventListener("gameStarted", () => {
    document.querySelectorAll(".card.carta-roja[data-id]").forEach(card => {
      card.style.pointerEvents = "auto";
    });
  });

  // --- CARTA NEGRA ROJA ---
  const cartaNegraRoja = document.querySelector("#cartaNegraContainer .card");
  if (cartaNegraRoja) {
    const inner = cartaNegraRoja.querySelector(".card-inner");
    cartaNegraRoja.style.pointerEvents = "none";

    cartaNegraRoja.addEventListener("click", () => {
      if (!window.juegoIniciado) return;
      inner.classList.toggle("is-flipped");
      console.log("🔴 Carta negra roja volteada");
    });

    document.addEventListener("gameStarted", () => {
      cartaNegraRoja.style.pointerEvents = "auto";
    });
  }

});
