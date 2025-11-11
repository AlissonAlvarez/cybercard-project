// document.addEventListener("DOMContentLoaded", () => {
//   const clickSound = new Audio("./sounds/seleccionar.mp3");
//   clickSound.volume = 0.5;

//   // Estado inicial del sonido
//   let soundEnabled = localStorage.getItem("soundEnabled") === "true";
//   if (soundEnabled === null) soundEnabled = true;

//   // Toggle de sonido
//   const soundToggle = document.getElementById("soundToggle");
//   if (soundToggle) {
//     soundToggle.checked = soundEnabled;
//     soundToggle.addEventListener("change", () => {
//       soundEnabled = soundToggle.checked;
//       localStorage.setItem("soundEnabled", soundEnabled);
//       if (soundEnabled) {
//         clickSound.currentTime = 0;
//         clickSound.play();
//       }
//     });
//   }

//   // 🎴 Asignar sonido al hacer click en cartas
//   const cartas = document.querySelectorAll(".carta");
//   cartas.forEach((carta) => {
//     carta.addEventListener("click", () => {
//       if (soundEnabled) {
//         clickSound.currentTime = 0;
//         clickSound.play();
//       }
//     });
//   });
// });