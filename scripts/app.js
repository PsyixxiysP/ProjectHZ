/**
 * app.js
 * ------------------------------------
 * PURPOSE:
 * Starts THDATE in order.
 */

let introSkipped = false;
let introFinished = false;

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

/**
 * Finishes the intro and displays the desktop.
 * The guard prevents this from running more than once.
 */
function finishIntro() {
  if (introFinished) return;

  introFinished = true;
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
  WindowManager.openFromUrl();
  Terminal.focus();
}

/**
 * Shows the continue screen and waits for a keyboard or mouse input.
 */
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

/**
 * Renders items from the manually controlled "new" directory.
 */
function renderNewPanel() {
  const panel = document.getElementById("new-panel-items");
  if (!panel) return;

  const newDirectory = FileSystem.tree.children.new;

  if (!newDirectory || !newDirectory.children) {
    panel.innerHTML = "";
    return;
  }

  const newItems = newDirectory.children;

  panel.innerHTML = Object.entries(newItems)
    .map(([key, item]) => {
      return `
        <button type="button" data-command="open ${key}">
          ${item.title || key}
        </button>
      `;
    })
    .join("");
}

/**
 * Handles browser Back and Forward navigation.
 *
 * When the URL changes:
 * 1. Close the currently open windows.
 * 2. Open the story or collection referenced by the URL hash.
 *
 * Example:
 * #story=i-dont-really-love-you
 * #collection=collection-001
 */
window.addEventListener("popstate", () => {
  document
    .querySelectorAll(".thdate-window")
    .forEach((win) => win.remove());

  WindowManager.openFromUrl();
});

window.addEventListener("hashchange", () => {
  document
    .querySelectorAll(".thdate-window")
    .forEach((win) => win.remove());

  WindowManager.openFromUrl();
});