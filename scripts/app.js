/**
 * app.js
 * ------------------------------------
 * PURPOSE:
 * Starts THDATE in order.
 */

document.addEventListener("DOMContentLoaded", async () => {
  WindowManager.init();
  Terminal.init();
  Countdown.init();

  await Boot.start();
  await Matrix.start();
  await waitForAnyButton();

  document.getElementById("desktop").classList.remove("hidden");

  Commands.menu();
  Terminal.focus();
});

function waitForAnyButton() {
  const continueScreen = document.getElementById("continue-screen");

  continueScreen.classList.remove("hidden");

  return new Promise((resolve) => {
    const handler = () => {
      continueScreen.classList.add("hidden");

      window.removeEventListener("keydown", handler);
      window.removeEventListener("click", handler);

      resolve();
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
  });
}