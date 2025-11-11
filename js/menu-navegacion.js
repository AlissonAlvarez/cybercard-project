    async function loadComponent(elementId, filePath) {
      const container = document.getElementById(elementId);
      const response = await fetch(filePath);
      const html = await response.text();
      container.innerHTML = html;
      return Promise.resolve();
    }

    loadComponent('cards-danger', 'components/cards-danger.html');
    loadComponent('cards-success', 'components/cards-success.html');
    loadComponent('cards-warning', 'components/cards-warning.html');
    loadComponent('cards-primary', 'components/cards-primary.html');
    loadComponent('menu-navegacion', 'components/menu-navegacion.html')
      .then(() => {

        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => {
          console.log('Juego iniciado');
        });

        document.querySelectorAll('[data-color]').forEach(square => {
          square.addEventListener('click', () => {
            console.log('Color seleccionado:', square.dataset.color);
          });
        });
      });