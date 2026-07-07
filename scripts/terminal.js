/**
 * terminal.js
 * ------------------------------------
 * PURPOSE:
 * Handles terminal rendering and input.
 *
 * DOES NOT:
 * - Know what commands mean.
 */

const Terminal = {
  output: null,
  input: null,
  prompt: null,

  init() {
    this.output = document.getElementById("terminal-output");
    this.input = document.getElementById("terminal-input");
    this.prompt = document.getElementById("prompt");

    document.getElementById("terminal-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const value = this.input.value.trim();
      this.input.value = "";
      if (value) Commands.run(value);
    });

    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-command]");
      if (!link) return;
      Commands.run(link.dataset.command);
    });
  },

  print(html) {
    this.output.innerHTML = html;
  },

  setPrompt(text) {
    this.prompt.textContent = text;
  },

  focus() {
    this.input.focus();
  }
};
