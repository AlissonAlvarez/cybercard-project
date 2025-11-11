async function loadModal(modalId, filePath) {
  const container = document.getElementById(modalId);
  const response = await fetch(filePath);
  const html = await response.text();
  container.innerHTML = html;
}

Promise.all([
  loadModal('modal-reglas', 'modals/modal-reglas.html'),
  loadModal('modal-modo-juego', 'modals/modal-modo-juego.html'),
  loadModal('modal-velocidad', 'modals/modal-velocidad.html'),
  loadModal('modal-opciones', 'modals/modal-opciones.html'),
  loadModal('modal-salir', 'modals/modal-salir.html'),
  loadModal('modal-preparate', 'modals/modal-preparate.html'),
  loadModal('modal-uso-inicial', 'modals/modal-uso-inicial.html'),
  loadModal('modal-comodin', 'modals/modal-comodin.html')
])
.then(() => {
  console.log('✅ Todas las modales fueron cargadas');

  document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const targetModalId = button.dataset.modal;
      const modalElement = document.getElementById(targetModalId);
      if (modalElement) {
        const bootstrapModal = new bootstrap.Modal(modalElement);
        bootstrapModal.show();
      } else {
        console.error(`❌ Modal con id "${targetModalId}" no encontrada.`);
      }
    });
  });

  const modalPreparateEl = document.getElementById('modalPreparate');
  if(modalPreparateEl) {
    const modalPreparate = new bootstrap.Modal(modalPreparateEl, {
      backdrop: 'static',
      keyboard: false
    });
    modalPreparate.show();

    modalPreparateEl.querySelector('#btnListo').addEventListener('click', () => {
      modalPreparate.hide();
      console.log("Usuario listo para jugar");
    });
  }
});

