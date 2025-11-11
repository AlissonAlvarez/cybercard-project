// --- PREGUNTAS Y RESPUESTAS (CARTAS VERDES) ---
window.greenQuestionsAndAnswers = [
  {
    question: "¿Qué es una contraseña segura?",
    answer: "Una contraseña que combina letras, números y símbolos con longitud mínima de 8 caracteres."
  },
  {
    question: "¿Qué significa el término “phishing”?",
    answer: "Es una técnica usada por atacantes para obtener información confidencial haciéndose pasar por una entidad legítima."
  },
  {
    question: "¿Qué es un firewall?",
    answer: "Una barrera de seguridad que controla el tráfico de red, bloqueando conexiones no autorizadas."
  },
  {
    question: "¿Qué es el malware?",
    answer: "Cualquier software malicioso creado para dañar, robar información o tomar control de un sistema."
  }
];

// --- CREAR PARES DE CARTAS ---
let greenCards = [];
greenQuestionsAndAnswers.forEach((item, index) => {
  greenCards.push({ id: index, text: item.question, type: "question" });
  greenCards.push({ id: index, text: item.answer, type: "answer" });
});
greenCards.sort(() => Math.random() - 0.5);

// --- RENDERIZAR CARTAS VERDES ---
document.addEventListener("DOMContentLoaded", () => {
  const greenBoard = document.getElementById("memory-board-green");

  // --- 🔊 SONIDOS ---
  const soundSelectGreen = new Audio("sounds/seleccionar.mp3");
  const soundErrorGreen = new Audio("sounds/error.mp3");
  const soundCorrectGreen = new Audio("sounds/acertar.mp3"); // ✅ Sonido de acierto

  if (greenBoard) {
    greenCards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("col-auto");
      cardElement.innerHTML = `
        <div class="card carta carta-verde text-white text-center"
             data-id="${card.id}" data-type="${card.type}"
             style="width:127px; height:186px; cursor:pointer; pointer-events:none;">
          <div class="card-inner carta-verde">
            <div class="card-front d-flex justify-content-center align-items-center h-100">
              <img src="svg/logo-cybercard-green.svg" alt="CyberCard Verde" class="img-fluid" />
            </div>
            <div class="card-back d-flex justify-content-center align-items-center text-center p-2 text-white"
                 style="background:#1b5e20; font-size:0.85rem;">
              ${card.text}
            </div>
          </div>
        </div>
      `;
      greenBoard.appendChild(cardElement);
    });
  }

  // --- VARIABLES DE JUEGO ---
  let greenFlippedCards = [];
  let greenMatchedPairs = 0;
  let currentStarIndexGreen = 0;

  // --- ⭐ ACTUALIZAR RATING GLOBAL ---
  function updateGlobalRatingGreen(isCorrect) {
    const stars = document.querySelectorAll('#stars-container span');
    if (currentStarIndexGreen < stars.length) {
      stars[currentStarIndexGreen].style.color = isCorrect ? 'gold' : 'red';
      currentStarIndexGreen++;
      if (!isCorrect && currentStarIndexGreen === stars.length) {
        mostrarModalPerdedor();
      }
    }
  }

  // --- 🎴 LÓGICA DE VOLTEO ---
  function flipGreenCard(card) {
    if (!window.juegoIniciado) return;
    if (card.classList.contains("flipped") || greenFlippedCards.length >= 2) return;

    soundSelectGreen.currentTime = 0;
    soundSelectGreen.play();

    card.classList.add("flipped");
    greenFlippedCards.push(card);

    if (greenFlippedCards.length === 2) {
      const [card1, card2] = greenFlippedCards;
      const id1 = card1.dataset.id;
      const id2 = card2.dataset.id;

      if (id1 === id2 && card1.dataset.type !== card2.dataset.type) {
        // ✅ Coincidencia correcta
        greenMatchedPairs++;
        greenFlippedCards = [];
        updateGlobalRatingGreen(true);

        // 🔊 Sonido de acierto
        soundCorrectGreen.currentTime = 0;
        soundCorrectGreen.play();

        // 🟢 Mantenerlas volteadas y bloquearlas
        card1.style.pointerEvents = "none";
        card2.style.pointerEvents = "none";

        if (greenMatchedPairs === greenQuestionsAndAnswers.length) {
          setTimeout(() => alert("💚 ¡Completaste todas las cartas verdes!"), 500);
        }
      } else {
        // ❌ No coinciden
        updateGlobalRatingGreen(false);
        soundErrorGreen.currentTime = 0;
        soundErrorGreen.play();
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          greenFlippedCards = [];
        }, 800);
      }
    }
  }

  // --- EVENTOS DE CLICK ---
  document.querySelectorAll(".card.carta-verde[data-id]").forEach(card => {
    card.addEventListener("click", () => flipGreenCard(card));
  });

  // --- DESBLOQUEAR CARTAS AL INICIAR ---
  document.addEventListener("gameStarted", () => {
    document.querySelectorAll(".card.carta-verde[data-id]").forEach(card => {
      card.style.pointerEvents = "auto";
    });
  });

  // --- CARTA NEGRA VERDE ---
  const cartaNegraVerde = document.querySelector("#cartaNegraVerdeContainer .card");
  if (cartaNegraVerde) {
    const inner = cartaNegraVerde.querySelector(".card-inner");
    cartaNegraVerde.style.pointerEvents = "none";

    cartaNegraVerde.addEventListener("click", () => {
      if (!window.juegoIniciado) return;
      inner.classList.toggle("is-flipped");

      // 🔴 Penalización (quita una estrella)
      const stars = document.querySelectorAll('#stars-container span');
      for (let i = stars.length - 1; i >= 0; i--) {
        if (stars[i].style.color === '' || stars[i].style.color === 'gold') {
          stars[i].style.color = 'red';
          break;
        }
      }

      console.log("🖤 Carta negra verde volteada (virus)");
    });

    document.addEventListener("gameStarted", () => {
      cartaNegraVerde.style.pointerEvents = "auto";
    });
  }

});
