/**
 * countdown.js
 * ------------------------------------
 * PURPOSE:
 * Runs the countdown and unstable caption text.
 */

const Countdown = {
  target: new Date(THDATE_CONFIG.countdownTarget),
  noiseChars: "01AEX#[]<>_|/=-",

  init() {
    this.countdownEls = [
      document.getElementById("countdown"),
      document.getElementById("boot-countdown")
    ];
    this.captionEl = document.getElementById("countdown-caption");

    setInterval(() => this.tick(), 1000);
    this.tick();
    this.runCaptionCycle();
  },

  tick() {
    let diff = this.target - new Date();
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;

    const text = [days, hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");

    this.countdownEls.forEach((el) => {
      if (el) el.textContent = text;
    });
  },

  randomNoise(length) {
    let output = "";
    for (let i = 0; i < length; i++) {
      output += this.noiseChars[Math.floor(Math.random() * this.noiseChars.length)];
    }
    return output;
  },

  mutatePhrase(phrase, progress, reverse = false) {
    return phrase.split("").map((char) => {
      if (char === " ") return " ";
      const useNoise = reverse ? Math.random() < progress : Math.random() > progress;
      return useNoise
        ? this.noiseChars[Math.floor(Math.random() * this.noiseChars.length)]
        : char;
    }).join("");
  },

  runCaptionCycle() {
    const phrase = THDATE_CONFIG.countdownCaptions[
      Math.floor(Math.random() * THDATE_CONFIG.countdownCaptions.length)
    ];

    let phase = "noise";
    let frame = 0;

    const interval = setInterval(() => {
      frame++;

      if (phase === "noise") {
        this.captionEl.textContent = this.randomNoise(phrase.length);
        if (frame > 30) { phase = "resolve"; frame = 0; }
        return;
      }

      if (phase === "resolve") {
        this.captionEl.textContent = this.mutatePhrase(phrase, frame / 18);
        if (frame > 18) { phase = "hold"; frame = 0; }
        return;
      }

      if (phase === "hold") {
        this.captionEl.textContent = phrase;
        if (frame > 20) { phase = "decay"; frame = 0; }
        return;
      }

      this.captionEl.textContent = this.mutatePhrase(phrase, frame / 18, true);
      if (frame > 18) {
        clearInterval(interval);
        setTimeout(() => this.runCaptionCycle(), 9000 + Math.random() * 14000);
      }
    }, 120);
  }
};
