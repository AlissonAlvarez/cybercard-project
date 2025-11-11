window.addEventListener("DOMContentLoaded", () => {
  const comodinBtn = document.getElementById("comodin-btn");
  if (!comodinBtn) return;

  const soundCorrect = new Audio("sounds/acertar.mp3");
  let intentosUsados = 0;
  const maxIntentos = 2;
  let comodinUsado = false;

  const colorMap = {
    yellow: {
      questions: () => window.yellowQuestionsAndAnswers,
      selector: ".card.carta-amarilla[data-id]",
      button: document.querySelector('[data-color="yellow"]'),
      name: "Amarillo",
    },
    green: {
      questions: () => window.greenQuestionsAndAnswers,
      selector: ".card.carta-verde[data-id]",
      button: document.querySelector('[data-color="green"]'),
      name: "Verde",
    },
    red: {
      questions: () => window.redQuestionsAndAnswers,
      selector: ".card.carta-roja[data-id]",
      button: document.querySelector('[data-color="red"]'),
      name: "Rojo",
    },
    blue: {
      questions: () => window.blueQuestionsAndAnswers,
      selector: ".card.carta-azul[data-id]",
      button: document.querySelector('[data-color="blue"]'),
      name: "Azul",
    },
  };

  function flipAndBlockCard(card) {
    if (!card) return;
    card.classList.add("flipped");
    card.style.pointerEvents = "none";
    const inner = card.querySelector(".card-inner");
    if (inner) inner.classList.add("is-flipped");
  }

  function pulseButton(btn) {
    if (!btn) return;
    btn.classList.add("pulse-color");
    setTimeout(() => btn.classList.remove("pulse-color"), 400);
  }

  function markSelectedColor(finalBtn) {
    document.querySelectorAll(".color-btn").forEach((b) => b.classList.remove("selected-color"));
    if (finalBtn) finalBtn.classList.add("selected-color");
  }

  async function spinWheelSimulation(duration = 900) {
    const colorKeys = Object.keys(colorMap);
    const buttons = colorKeys.map((k) => colorMap[k].button).filter(Boolean);
    if (buttons.length === 0)
      return colorKeys[Math.floor(Math.random() * colorKeys.length)];

    const start = performance.now();
    let current = 0;

    return new Promise((resolve) => {
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const interval = 80 + Math.floor(300 * progress);

        buttons.forEach((b) => b && b.classList.remove("pulse-color"));
        const btn = buttons[current % buttons.length];
        if (btn) pulseButton(btn);

        current++;
        if (elapsed < duration) {
          setTimeout(() => requestAnimationFrame(step), interval);
        } else {
          const idx = Math.floor(Math.random() * buttons.length);
          buttons.forEach((b) => b && b.classList.remove("pulse-color"));
          const finalBtn = buttons[idx];
          pulseButton(finalBtn);
          markSelectedColor(finalBtn);
          const finalKey = colorKeys.find((k) => colorMap[k].button === finalBtn) || colorKeys[idx];
          resolve(finalKey);
        }
      }
      requestAnimationFrame(step);
    });
  }

  comodinBtn.addEventListener("click", async () => {
    // ✅ Solo funciona si el juego fue iniciado
    if (!window.juegoIniciado) {
      mostrarModal("modalUsoInicial");
      return;
    }

    if (intentosUsados >= maxIntentos) {
      mostrarModal("modalIntentos");
      bloquearBoton();
      return;
    }

    if (!comodinUsado) {
      comodinUsado = true;
      mostrarModal("modalComodinInicio");
    }

    intentosUsados++;
    const intentosRestantes = maxIntentos - intentosUsados;

    comodinBtn.style.transition = "transform 0.5s";
    comodinBtn.style.transform = "rotateY(180deg)";
    setTimeout(() => (comodinBtn.style.transform = "rotateY(0deg)"), 500);

    const chosenKey = await spinWheelSimulation(1200);
    const colorData = colorMap[chosenKey];
    if (!colorData) return;

    const questions = colorData.questions();
    if (!questions || !Array.isArray(questions) || questions.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * questions.length);
    const allCardsOfColor = Array.from(document.querySelectorAll(colorData.selector));
    const availableCards = allCardsOfColor.filter((c) => !c.classList.contains("flipped"));

    const questionCard = availableCards.find(
      (c) => parseInt(c.dataset.id, 10) === randomIndex && c.dataset.type === "question"
    );
    const answerCard = availableCards.find(
      (c) => parseInt(c.dataset.id, 10) === randomIndex && c.dataset.type === "answer"
    );
    const item = questions[randomIndex];

    if (questionCard && answerCard) {
      flipAndBlockCard(questionCard);
      flipAndBlockCard(answerCard);
      soundCorrect.currentTime = 0;
      soundCorrect.play();
      mostrarModalComodin(item, colorData.name);
      if (typeof window.updateGlobalRating === "function")
        window.updateGlobalRating(true);
    } else {
      mostrarModalError(colorData.name);
    }

    if (intentosUsados >= maxIntentos) bloquearBoton();
  });

  function bloquearBoton() {
    comodinBtn.disabled = true;
    comodinBtn.style.opacity = "0.5";
    comodinBtn.style.cursor = "not-allowed";
  }

  // --- 🧱 Funciones para mostrar modales ---
  function mostrarModal(id) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    } else {
      console.error(`❌ Modal ${id} no encontrada`);
    }
  }

  function mostrarModalComodin(item, color) {
    const modalEl = document.getElementById("modalComodin");
    if (modalEl) {
      modalEl.querySelector("#comodinColor").textContent = color;
      modalEl.querySelector("#comodinPregunta").textContent = item.question;
      modalEl.querySelector("#comodinRespuesta").textContent = item.answer;
      new bootstrap.Modal(modalEl).show();
    }
  }

  function mostrarModalError(color) {
    const modalEl = document.getElementById("modalErrorComodin");
    if (modalEl) {
      modalEl.querySelector("#colorError").textContent = color;
      new bootstrap.Modal(modalEl).show();
    }
  }

  // --- 🔥 Estilos dinámicos ---
  const style = document.createElement("style");
  style.innerHTML = `
    .pulse-color {
      animation: pulse 0.4s ease-in-out;
    }
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
      50% { transform: scale(1.25); box-shadow: 0 0 10px rgba(255,255,255,0.6); }
      100% { transform: scale(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
    }
    .selected-color {
      outline: 3px solid #fff;
      box-shadow: 0 0 15px rgba(255,255,255,0.9);
      transform: scale(1.2);
    }
  `;
  document.head.appendChild(style);
});
