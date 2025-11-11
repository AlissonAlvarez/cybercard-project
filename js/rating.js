function updateGlobalRating(isCorrect) {
  const stars = document.querySelectorAll('#stars-container span');
  if (!stars.length) return;

  if (window.currentStarIndex === undefined) window.currentStarIndex = 0;

  if (window.currentStarIndex < stars.length) {
    const star = stars[window.currentStarIndex];
    if (isCorrect) {
      star.classList.remove('text-secondary');
      star.classList.add('text-warning'); // dorado
    } else {
      star.classList.remove('text-secondary');
      star.classList.add('text-danger'); // rojo si falló
    }

    window.currentStarIndex++;

    // última estrella en rojo → mostrar modal
    if (!isCorrect && window.currentStarIndex === stars.length) {
      mostrarModalPerdedor();
    }
  }
}
