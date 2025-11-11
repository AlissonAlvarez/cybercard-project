// --- modo-juego.js ---
document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  if (typeof window.modoJuego === "undefined") window.modoJuego = null;
  if (typeof window.juegoIniciado === "undefined") window.juegoIniciado = false;
  if (typeof window.turnoJugador === "undefined") window.turnoJugador = true;

  // --- Esperar a que la modal se cargue dinámicamente ---
  const observer = new MutationObserver(() => {
    const modalEl = document.getElementById("modalModoJuego");
    if (modalEl && !modalEl.dataset.inicializado) {
      inicializarModalModoJuego(modalEl);
      modalEl.dataset.inicializado = "true";
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // --- Inicializar la modal ---
  function inicializarModalModoJuego(modalEl) {
    const btnSolo = modalEl.querySelector("#modoSolo");
    const btnDos = modalEl.querySelector("#modoDosJugadores");
    const btnIA = modalEl.querySelector("#modoContraIA");

    if (!btnSolo || !btnDos || !btnIA) return;

    const modal = new bootstrap.Modal(modalEl, { backdrop: "static", keyboard: false });
    modal.show();

    const seleccionarModo = (modo) => {
      window.modoJuego = modo;
      window.juegoIniciado = false;
      window.turnoJugador = true;
      modal.hide();
      mostrarToast(modo);

      document.dispatchEvent(new Event("modoSeleccionado"));

      if (modo === "solo") console.log("🎮 Modo Solo seleccionado");
      if (modo === "dos") console.log("👥 Modo 2 Jugadores seleccionado");
      if (modo === "ia") console.log("🤖 Modo contra la Computadora seleccionado");
    };

    btnSolo.addEventListener("click", () => seleccionarModo("solo"));
    btnDos.addEventListener("click", () => seleccionarModo("dos"));
    btnIA.addEventListener("click", () => seleccionarModo("ia"));
  }

  // --- Toast visual Bootstrap ---
  function mostrarToast(modo) {
    const mensajes = {
      solo: "🎮 Has seleccionado: Jugar Solo",
      dos: "👥 Has seleccionado: 2 Jugadores",
      ia: "🤖 Has seleccionado: Contra la Computadora",
    };

    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className = "position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement("div");
    toastEl.className = "toast align-items-center text-bg-dark border-0 show";
    toastEl.role = "alert";
    toastEl.innerHTML = `
      <div class="d-flex align-items-center bg-dark text-light p-2 rounded shadow"
           style="position: absolute; top: -140px;">
        <div class="toast-body flex-grow-1">
          ${mensajes[modo]}
        </div>
        <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="toast"></button>
      </div>
    `;
    toastContainer.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 4000);
  }

  // --- BOTÓN DE INICIAR ---
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", () => {
      if (!window.modoJuego) {
        alert("⚠️ Primero selecciona un modo de juego antes de iniciar.");
        return;
      }
      window.juegoIniciado = true;
      console.log("🚀 Juego iniciado en modo:", window.modoJuego);
      document.dispatchEvent(new Event("gameStarted"));
    });
  }
});
