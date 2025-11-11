async function loadRatingComponent(elementId, filePath) {
  try {
    const container = document.getElementById(elementId);
    const response = await fetch(filePath);
    const html = await response.text();
    container.innerHTML = html;

    // 🔹 disparar evento para avisar que las estrellas están listas
    document.dispatchEvent(new Event("starsLoaded"));

    container.querySelectorAll('span[role="button"]').forEach(star => {
      star.addEventListener('click', () => console.log('⭐ Estrella seleccionada'));
    });
  } catch (error) {
    console.error(error);
  }
}


function mostrarModalPerdedor() {
  const modal = document.createElement('div');
  modal.id = "modal-perdedor";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.6)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = 9999;

  modal.innerHTML = `
    <div style="background:#222; color:white; padding:30px; border-radius:12px; text-align:center; width:320px;">
      <h2>⚠️ Te falta todavía hacker</h2>
      <p>¿Quieres volver a intentar?</p>
      <button id="btn-reintentar" style="margin:10px;padding:10px 20px;">Sí, reiniciar</button>
      <button id="btn-no" style="margin:10px;padding:10px 20px;">No, suerte a la próxima</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btn-reintentar").addEventListener("click", () => {
    document.body.removeChild(modal);
    reiniciarJuego();
  });

  document.getElementById("btn-no").addEventListener("click", () => {
    document.body.removeChild(modal);
    alert("😎 Suerte a la próxima!");
  });
}

async function reiniciarJuego() {
  window.currentStarIndex = 0;
  window.juegoIniciado = true;

  // Resetear estrellas a gris
  const stars = document.querySelectorAll('#stars-container span');
  stars.forEach(star => star.style.color = 'gray');

  // Mezclar cartas
  await mezclarCartasGlobalAnimado();

  // Desbloquear cartas
  document.dispatchEvent(new Event("gameStarted"));
}

