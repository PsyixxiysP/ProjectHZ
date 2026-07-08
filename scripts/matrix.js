/**
 * matrix.js
 * ------------------------------------
 * PURPOSE:
 * Runs the transition between boot and terminal mode, displaying a matrix-like effect with falling characters, log messages, and ASCII art.
 */

const Matrix = {
  interval: null,
  logInterval: null,
  asciiInterval: null,

  async start(duration = 7000) {
    const screen = document.getElementById("matrix-screen");
    const canvas = document.getElementById("matrix-canvas");
    const matrixLog = document.getElementById("matrix-log");
    const asciiArt = document.getElementById("ascii-art");
    const ctx = canvas.getContext("2d");

    screen.classList.remove("hidden");
    matrixLog.textContent = "";
    asciiArt.textContent = "";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.startRain(canvas, ctx);
    this.startLog(matrixLog);
    this.startAscii(asciiArt, matrixLog);

    await this.wait(duration);

    this.stop();

    screen.classList.add("hidden");
  },

  startRain(canvas, ctx) {
    const chars = "01THDATEGREETINGPEOPLEOFEARTHFICTIONVISUALMEDIA";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    this.interval = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px Courier New`;

      const redZone = canvas.width - Math.max(170, canvas.width * 0.18);

      drops.forEach((y, index) => {
        const x = index * fontSize;
        const char = chars[Math.floor(Math.random() * chars.length)];

        ctx.fillStyle = x > redZone ? "#ff3355" : "#00ff66";
        ctx.fillText(char, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.97) {
          drops[index] = 0;
        }

        drops[index]++;
      });
    }, 38);
  },

  startLog(matrixLog) {
    const lines = [
      "INITIALISING THDATE...",
      "ANALYSING ALL RECORDED MEDIA ON THE INTERWEBS...",
      "BOOTING TempleOS...",
      "INPUT READY.",
      "FICTION READY.",
      "VISUAL_MEDIA READY.",
      "GALLERIES READY.",
      "WINDOW MANAGER READY.",
      "PUBLIC ACCESS GRANTED."
    ];

    let lineIndex = 0;

    this.logInterval = setInterval(() => {
      if (lineIndex < lines.length) {
        matrixLog.textContent += lines[lineIndex] + "\n";
        lineIndex++;
        return;
      }

      const randomLine =
        THDATE_CONFIG.matrixExtraLines[
          Math.floor(Math.random() * THDATE_CONFIG.matrixExtraLines.length)
        ];

      matrixLog.textContent += randomLine + "\n";
    }, 650);
  },

  startAscii(asciiArt) {
  const logoFrames = THDATE_CONFIG.asciiLogo || [];

  if (!logoFrames.length) {
    asciiArt.textContent = "THDATE";
    return;
  }

  let artIndex = 0;

  const renderFrame = () => {
    const isFinalFrame = artIndex >= logoFrames.length;

    asciiArt.textContent = isFinalFrame
      ? logoFrames[logoFrames.length - 1]
      : logoFrames[artIndex];

    artIndex++;
  };

  renderFrame();
  this.asciiInterval = setInterval(renderFrame, 340);
},

  stop() {
    clearInterval(this.interval);
    clearInterval(this.logInterval);
    clearInterval(this.asciiInterval);

    this.interval = null;
    this.logInterval = null;
    this.asciiInterval = null;
  },

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};