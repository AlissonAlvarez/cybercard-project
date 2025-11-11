document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");

  window.juegoIniciado = false;

  if (!startButton) {
    console.error("❌ No se encontró el botón con id 'startButton'");
    return;
  }

  startButton.addEventListener("click", async () => {
    window.juegoIniciado = true;

    startButton.classList.add("pressed");

    await mezclarCartasGlobalAnimado();

    document.dispatchEvent(new Event("gameStarted"));

    console.log("🟢 Juego iniciado y cartas barajadas con animación.");
  });
});

async function mezclarCartasGlobalAnimado() {
  const tablerosIds = [
    "memory-board",
    "memory-board-green",
    "memory-board-yellow",
    "memory-board-blue"
  ];

  const todasLasCartas = [];
  tablerosIds.forEach(id => {
    const tablero = document.getElementById(id);
    if (tablero) {
      const cartas = Array.from(
        tablero.querySelectorAll(".card.carta:not(.carta-negra)")
      );
      todasLasCartas.push(...cartas);
    }
  });

  if (todasLasCartas.length === 0) return;

  todasLasCartas.forEach(carta => {
    carta.classList.add("animar-barajar-salida");
  });

  await esperar(600);

  for (let i = todasLasCartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todasLasCartas[i], todasLasCartas[j]] = [todasLasCartas[j], todasLasCartas[i]];
  }

  tablerosIds.forEach(id => {
    const tablero = document.getElementById(id);
    if (tablero) tablero.innerHTML = "";
  });

  let index = 0;
  const cartasPorTablero = Math.ceil(todasLasCartas.length / tablerosIds.length);

  tablerosIds.forEach(id => {
    const tablero = document.getElementById(id);
    if (tablero) {
      for (let i = 0; i < cartasPorTablero && index < todasLasCartas.length; i++, index++) {
        const carta = todasLasCartas[index];
        carta.classList.remove("animar-barajar-salida");
        carta.classList.add("animar-barajar-entrada");
        tablero.appendChild(carta);
      }
    }
  });

  await esperar(700);

  todasLasCartas.forEach(carta => {
    carta.classList.remove("animar-barajar-entrada", "animar-barajar-salida");
  });

  console.log("🎴 Barajado global con animación completado.");
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
