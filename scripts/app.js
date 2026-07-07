/**
 * app.js
 * ------------------------------------
 * PURPOSE:
 * Starts THDATE in order.
 */

let introSkipped = false;

document.addEventListener("DOMContentLoaded", async () => {
  WindowManager.init();
  Terminal.init();
  Countdown.init();
  renderNewPanel();

  const skipHandler = (event) => {
    if (event.key !== "Enter") return;

       event.preventDefault();
       event.stopPropagation();

    introSkipped = true;
    finishIntro();

    window.removeEventListener("keydown", skipHandler);
  };

  window.addEventListener("keydown", skipHandler);

  await Boot.start();

  if (!introSkipped) {
    await Matrix.start();
  }

  if (!introSkipped) {
    await waitForAnyButton();
  }

  finishIntro();

  window.removeEventListener("keydown", skipHandler);
});

function finishIntro() {
  introSkipped = true;

  const bootScreen = document.getElementById("boot-screen");
  const matrixScreen = document.getElementById("matrix-screen");
  const continueScreen = document.getElementById("continue-screen");
  const desktop = document.getElementById("desktop");

  if (window.Matrix && Matrix.stop) {
    Matrix.stop();
  }

  bootScreen.classList.add("hidden");
  matrixScreen.classList.add("hidden");
  continueScreen.classList.add("hidden");
  desktop.classList.remove("hidden");

  Commands.menu();
  Terminal.focus();
}

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

function renderNewPanel() {
  const panel = document.getElementById("new-panel-items");
  if (!panel) return;

  const newItems = FileSystem.tree.children.new.children;

  panel.innerHTML = Object.entries(newItems).map(([key, item]) => {
    return `
      <button data-command="open ${key}">
        ${item.title || key}
      </button>
    `;
  }).join("");
}