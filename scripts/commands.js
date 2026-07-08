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
    if (lower === "ipconfig") return this.ipconfig();
    if (lower === "random") return this.random();
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
  if (name === "bio") {
    document.body.classList.add("page-glitch");

    setTimeout(() => {
      document.body.classList.remove("page-glitch");

      Terminal.print(`
${FileSystem.getPrompt()}

Harrison Szell writes things. He also takes photos. This is a website. His website. There is no reason to panic.

COMMANDS:
  <button class="terminal-link" data-command="back">back</button>
  <button class="terminal-link" data-command="menu">menu</button>
`);
    }, 450);

    return;
  }

  Terminal.print(`
${FileSystem.getPrompt()}

${node.output || node.title || name}

COMMANDS:
  <button class="terminal-link" data-command="back">back</button>
  <button class="terminal-link" data-command="menu">menu</button>
`);

  document.body.classList.add("page-glitch");
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

random() {
  const items = [];

  const scan = (node) => {
    if (!node) return;

    if (node.type === "document" || node.type === "collection") {
      items.push(node);
    }

    if (node.children) {
      Object.values(node.children).forEach(scan);
    }
  };

  scan(FileSystem.tree);

  if (!items.length) {
    return this.error("No readable archive entries found.");
  }

  const item = items[Math.floor(Math.random() * items.length)];

  Terminal.print(`
${FileSystem.getPrompt()}

RANDOM ARCHIVE RETRIEVAL...
OPENING: ${item.title || "UNKNOWN ENTRY"}

${this.navButtons()}
`);

  if (item.type === "collection") {
    WindowManager.openCollection(item);
    return;
  }

  WindowManager.openDocument(item);
},

ipconfig() {
  Terminal.print(`Windows IP Configuration

Host Name . . . . . . . . . . . . : THDATE
Primary DNS Suffix  . . . . . . . :
Node Type . . . . . . . . . . . . : Hybrid
IP Routing Enabled. . . . . . . . : No
WINS Proxy Enabled. . . . . . . . : No


Ethernet adapter Archive:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . : THDATE Archive Network Adapter
   Physical Address. . . . . . . . : 00-13-37-66-66-42
   DHCP Enabled. . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . : Yes

   IPv4 Address. . . . . . . . . . : 192.168.0.13
   Subnet Mask . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . : 192.168.0.1


Tunnel adapter Localhost:

   Media State . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  :

   IPv6 Address. . . . . . . . . . : ::1
   Link-local IPv6 Address . . . . : fe80::1


Tunnel adapter Loopback:

   Media State . . . . . . . . . . : Connected

   IPv4 Address. . . . . . . . . . : 127.0.0.1
   IPv4 Address. . . . . . . . . . : 127.0.0.1
   IPv4 Address. . . . . . . . . . : 127.0.0.1

ERROR:
Duplicate localhost detected.

Repairing...

Repair failed.

Reason:
files no longer exist...

${this.navButtons()}`);
},

  tree() {
  Terminal.print(`THDATE
│
├── fiction
│   ├── long_form
│   ├── poetry
│   │   ├── freeform
|   │   │   ├── tree-photography
|   │   │   └── the-lion
│   │   └── haikus
│   │       └── collection-001
│   └── anthologies_short_stories
│       ├── literary
│       │   ├── i-dont-really-love-you
│       │   ├── and-then-he-died
│       │   ├── the-depressed-man
│       │   └── girl-child-of-war
│       │
│       ├── sci-fi
│       │   ├── rom-comm
│       │   ├── the-cowardly-thing
│       │   └── ophiocordyceps
│       │
│       └── fantasy
│           ├── on-running-a-small-business
│           ├── the-exact-details-of-history
│           └── total-world-domination
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
  random
  ipconfig
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

