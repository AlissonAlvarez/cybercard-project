// --- PREGUNTAS Y RESPUESTAS (CARTAS AMARILLAS) ---
window.yellowQuestionsAndAnswers = [
  {
    question: "Recibes un correo de tu “banco” pidiéndote actualizar tus datos personales. ¿Qué deberías hacer?",
    answer: "No hacer clic en enlaces ni proporcionar datos; verificar directamente con el banco a través de su sitio oficial."
  },
  {
    question: "Tu amigo te pide tu contraseña para entrar a su cuenta porque “es la misma que la tuya”. ¿Qué haces?",
    answer: "Negarte; las contraseñas son personales e intransferibles."
  },
  {
    question: "Tu computador muestra una alerta que dice “su sistema está infectado, descargue este programa ahora”. ¿Cómo reaccionas?",
    answer: "No descargar nada; cerrar la ventana y usar un antivirus legítimo para hacer un análisis del sistema."
  },
  {
    question: "Un amigo te envía un enlace sospechoso por WhatsApp. ¿Qué haces?",
    answer: "No abrirlo; preguntar directamente al amigo si realmente lo envió y verificar la fuente."
  }
];

// --- CREAR MAZO DE CARTAS AMARILLAS ---
let yellowCards = [];
yellowQuestionsAndAnswers.forEach((item, index) => {
  yellowCards.push({ id: index, text: item.question, type: "question" });
  yellowCards.push({ id: index, text: item.answer, type: "answer" });
});
yellowCards = yellowCards.sort(() => Math.random() - 0.5);

// --- RENDERIZAR CARTAS AMARILLAS ---
document.addEventListener("DOMContentLoaded", () => {

  // --- SONIDOS ---
  const soundSelectYellow = new Audio("sounds/seleccionar.mp3");
  const soundErrorYellow = new Audio("sounds/error.mp3");
  const soundCorrectYellow = new Audio("sounds/acertar.mp3"); // Añadido el sonido de acierto

  const yellowBoard = document.getElementById("memory-board-yellow");
  if (yellowBoard) {
    yellowCards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("col-auto");
      cardDiv.innerHTML = `
        <div class="card carta carta-amarilla text-dark text-center"
             data-id="${card.id}" data-type="${card.type}"
             style="width:127px; height:186px; cursor:pointer; pointer-events:none;">
          <div class="card-inner carta-amarilla">
            <div class="card-front d-flex justify-content-center align-items-center h-100">
              <img src="svg/logo-cybercard-yellow.svg" alt="CyberCard Amarilla" class="img-fluid" />
            </div>
            <div class="card-back d-flex justify-content-center align-items-center text-center p-2 text-dark"
                 style="background:#fdd835; font-size:0.85rem;">
              ${card.text}
            </div>
          </div>
        </div>
      `;
      yellowBoard.appendChild(cardDiv);
    });
  }

  // --- VARIABLES DE JUEGO ---
  let yellowFlippedCards = [];
  let yellowMatchedPairs = 0;
  let currentYellowStarIndex = 0;

  function updateYellowRating(isCorrect) {
    const stars = document.querySelectorAll('#stars-container span');
    if (currentYellowStarIndex < stars.length) {
      stars[currentYellowStarIndex].style.color = isCorrect ? 'gold' : 'red';
      currentYellowStarIndex++;
      if (!isCorrect && currentYellowStarIndex === stars.length) {
        mostrarModalPerdedor();
      }
    }
  }

  // --- LÓGICA DE VOLTEO ---
  function flipYellowCard(card) {
    if (!window.juegoIniciado) return;
    if (card.classList.contains("flipped") || yellowFlippedCards.length >= 2) return;

    soundSelectYellow.currentTime = 0;
    soundSelectYellow.play();

    card.classList.add("flipped");
    yellowFlippedCards.push(card);

    if (yellowFlippedCards.length === 2) {
      const [card1, card2] = yellowFlippedCards;
      const id1 = card1.dataset.id;
      const id2 = card2.dataset.id;

      if (id1 === id2 && card1.dataset.type !== card2.dataset.type) {
        yellowMatchedPairs++;
        yellowFlippedCards = [];
        updateYellowRating(true);

        // Reproducir sonido de acierto
        soundCorrectYellow.currentTime = 0;
        soundCorrectYellow.play();

        if (yellowMatchedPairs === yellowQuestionsAndAnswers.length) {
          setTimeout(() => alert("💛 ¡Completaste todas las cartas amarillas!"), 500);
        }
      } else {
        updateYellowRating(false);
        soundErrorYellow.currentTime = 0;
        soundErrorYellow.play();
        setTimeout(() => {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          yellowFlippedCards = [];
        }, 800);
      }
    }
  }

  // --- EVENTOS DE CLICK ---
  document.querySelectorAll(".card.carta-amarilla[data-id]").forEach(card => {
    card.addEventListener("click", () => flipYellowCard(card));
  });

  // --- DESBLOQUEAR CARTAS AL INICIAR ---
  document.addEventListener("gameStarted", () => {
    document.querySelectorAll(".card.carta-amarilla[data-id]").forEach(card => {
      card.style.pointerEvents = "auto";
    });
  });

  // --- CARTA NEGRA AMARILLA ---
  const cartaNegraAmarilla = document.querySelector("#cartaNegraAmarillaContainer .card");
  if (cartaNegraAmarilla) {
    const inner = cartaNegraAmarilla.querySelector(".card-inner");
    cartaNegraAmarilla.style.pointerEvents = "none";

    cartaNegraAmarilla.addEventListener("click", () => {
      if (!window.juegoIniciado) return;
      inner.classList.toggle("is-flipped");
      console.log("🟡 Carta negra amarilla volteada");
    });

    document.addEventListener("gameStarted", () => {
      cartaNegraAmarilla.style.pointerEvents = "auto";
    });
  }

});
