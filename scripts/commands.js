/**
 * commands.js
 * ------------------------------------
 * PURPOSE:
 * Parses commands and routes them to the filesystem or window manager.
 */

const Commands = {
  navButtons() {
  return `
COMMANDS:
  <button class="terminal-link" data-command="back">back</button>
  <button class="terminal-link" data-command="menu">menu</button>
`;

},
  run(rawCommand) {
    const command = rawCommand.trim();
    const lower = command.toLowerCase();

    if (lower === "help") return this.help();
    if (lower === "dir" || lower === "ls") return this.dir();
    if (lower === "tree") return this.tree();
    if (lower === "back" || lower === "cd ..") return this.back();
    if (lower === "menu" || lower === "home") return this.menu();
    if (lower === "clear" || lower === "cls") return Terminal.print("");

    if (lower.startsWith("cd ")) {
      return this.cd(lower.replace("cd ", ""));
    }

    if (lower.startsWith("open ")) {
      return this.open(lower.replace("open ", ""));
    }

    // Convenience: visible items can be typed directly.
    const node = FileSystem.findInCurrentDirectory(lower);
    if (node) {
      if (node.type === "directory") return this.cd(lower);
      return this.open(lower);
    }

    this.error("Bad command or file name.");
  },

  dir() {
  const items = FileSystem.listCurrentDirectory();

  const lines = items.map((item) => {
    const command = item.type === "directory" ? `cd ${item.key}` : `open ${item.key}`;
    return `<button class="terminal-link" data-command="${command}">${item.key}</button>`;
  }).join("\n");

  Terminal.print([
    FileSystem.getPrompt(),
    "",
    "DIRECTORY:",
    lines,
    "",
    this.navButtons()
  ].join("\n"));

  Terminal.setPrompt(FileSystem.getPrompt());
},

  cd(name) {
    const ok = FileSystem.cd(name);
    if (!ok) return this.error("Directory not found.");
    this.dir();
  },

 open(name) {
  let node = FileSystem.findInCurrentDirectory(name);

  // Allows the right-side NEW panel to open items from anywhere.
  if (!node && FileSystem.tree.children.new.children[name]) {
    node = FileSystem.tree.children.new.children[name];
  }

  if (!node) return this.error("File not found.");

  if (node.type === "collection") {
   WindowManager.openCollection(node);
   return;
  }
  
  if (node.type === "document") {
    WindowManager.openDocument(node);
    return;
  }

  if (node.type === "external") {
    window.open(node.url, "_blank");
    return;
  }

  if (node.type === "empty") {
Terminal.print(`
${FileSystem.getPrompt()}

${node.title || name}

COMMANDS:
  <button class="terminal-link" data-command="back">back</button>
  <button class="terminal-link" data-command="menu">menu</button>
`);    document.body.classList.add("page-glitch");
    setTimeout(() => document.body.classList.remove("page-glitch"), 600);
    return;
  }

  this.error("Cannot open item.");
},

  back() {
    FileSystem.cd("..");
    this.dir();
  },

  menu() {
    FileSystem.currentPath = ["THDATE"];
    this.dir();
  },

  tree() {
  Terminal.print(`THDATE
│
├── fiction
│   ├── long_form
│   ├── poetry
│   │   ├── freeform
│   │   └── haikus
│   │       └── collection-001
│   └── anthologies_short_stories
│       ├── fantasy
│       ├── sci-fi
│       └── literary
│           └── i-dont-really-love-you
│
├── visual_media
│   ├── youtube
│   ├── galleries
│   └── instagram
│
├── new
├── bio
├── contact
└── credits
    ├── mammoth
    ├── ascii_art
    └── site_notes
   
    ${this.navButtons()}`
  );
},

  help() {
  Terminal.print(`COMMANDS:
  dir
  tree
  cd [directory]
  open [file]
  back
  menu
  clear

${this.navButtons()}`);
},

  error(message) {
  Terminal.print(`${message}

${FileSystem.getPrompt()}

${this.navButtons()}`);
  document.body.classList.add("page-glitch");
  setTimeout(() => document.body.classList.remove("page-glitch"), 600);
}

  

};
