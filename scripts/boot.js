/**
 * boot.js
 * ------------------------------------
 * PURPOSE:
 * Runs the opening greeting.
 */

const Boot = {
  async start() {
    const bootScreen = document.getElementById("boot-screen");
    const bootLog = document.getElementById("boot-log");

    bootScreen.classList.remove("hidden");
    bootLog.textContent = "";

    await this.wait(2200);

    bootScreen.classList.add("hidden");
  },

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};