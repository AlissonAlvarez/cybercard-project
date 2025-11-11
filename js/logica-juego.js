// --- logica-juego.js ---
document.addEventListener("gameStarted", () => {
  console.log("🔹 Juego iniciado en modo:", window.modoJuego);
  iniciarJuego();
});

// Variables compartidas
let cartasSeleccionadas = [];
const soundCorrect = new Audio("sounds/acertar.mp3");

// --- Función para iniciar el juego ---
function iniciarJuego() {
  const cartas = document.querySelectorAll(".carta");

  cartas.forEach((carta) => {
    carta.addEventListener("click", () => manejarClickCarta(carta));
  });

  mostrarTurno();

  // 👾 Si es modo contra la IA, puede comenzar el jugador
  if (window.modoJuego === "ia") {
    window.turnoJugador = true;
  }
}

// --- Manejo de clics del jugador ---
function manejarClickCarta(carta) {
  if (!window.juegoIniciado) return;
  if (carta.classList.contains("volteada") || cartasSeleccionadas.length >= 2) return;

  // Si es contra IA y no es el turno del jugador, no dejar jugar
  if (window.modoJuego === "ia" && !window.turnoJugador) return;

  carta.classList.add("volteada");
  cartasSeleccionadas.push(carta);

  if (cartasSeleccionadas.length === 2) {
    setTimeout(() => verificarPareja(), 700);
  }
}

// --- Verificar si hay coincidencia ---
function verificarPareja() {
  const [c1, c2] = cartasSeleccionadas;
  const esPar = c1.dataset.valor === c2.dataset.valor;

  if (esPar) {
    soundCorrect.play();
  } else {
    setTimeout(() => {
      c1.classList.remove("volteada");
      c2.classList.remove("volteada");
    }, 700);
  }

  cartasSeleccionadas = [];

  // --- Turnos según el modo de juego ---
  if (window.modoJuego === "dos") {
    // alternar turnos entre jugador 1 y 2
    window.turnoJugador = !window.turnoJugador;
    mostrarTurno();
  } else if (window.modoJuego === "ia") {
    // si el jugador falló, turno de la IA
    if (!esPar) {
      window.turnoJugador = false;
      mostrarTurno();

      // ✅ Esperar un poco antes de que la IA actúe
      setTimeout(() => {
        turnoIA();
      }, 1500);
    }
  }
}

// --- Turno de la computadora ---
function turnoIA() {
  const cartasDisponibles = Array.from(document.querySelectorAll(".carta:not(.volteada)"));
  if (cartasDisponibles.length < 2) return;

  // Selecciona 2 cartas distintas
  const carta1 = cartasDisponibles[Math.floor(Math.random() * cartasDisponibles.length)];
  let carta2;
  do {
    carta2 = cartasDisponibles[Math.floor(Math.random() * cartasDisponibles.length)];
  } while (carta1 === carta2);

  mostrarTurno();

  // 🧠 Animación realista del turno de la IA
  setTimeout(() => {
    carta1.classList.add("volteada");
  }, 800);

  setTimeout(() => {
    carta2.classList.add("volteada");
  }, 1600);

  // Verificar después de que ambas estén volteadas
  setTimeout(() => {
    const esPar = carta1.dataset.valor === carta2.dataset.valor;

    if (esPar) {
      soundCorrect.play();
    } else {
      setTimeout(() => {
        carta1.classList.remove("volteada");
        carta2.classList.remove("volteada");
      }, 900);
    }

    // ✅ Después del turno de la IA, vuelve el turno al jugador
    setTimeout(() => {
      window.turnoJugador = true;
      mostrarTurno();
    }, 2000);
  }, 2500);
}

// --- Mostrar el turno actual ---
function mostrarTurno() {
  let infoTurno = document.getElementById("infoTurno");
  if (!infoTurno) {
    infoTurno = document.createElement("div");
    infoTurno.id = "infoTurno";
    infoTurno.className = "position-fixed top-0 start-50 translate-middle-x mt-3 px-3 py-2 rounded-3 bg-primary text-white fw-semibold shadow";
    document.body.appendChild(infoTurno);
  }

  if (window.modoJuego === "dos") {
    infoTurno.textContent = window.turnoJugador ? "🎮 Turno del Jugador 1" : "👥 Turno del Jugador 2";
  } else if (window.modoJuego === "ia") {
    infoTurno.textContent = window.turnoJugador ? "🧍‍♂️ Tu turno" : "🤖 Turno de la Computadora...";
  } else {
    infoTurno.textContent = "🎮 Jugando en modo Solo";
  }
}
