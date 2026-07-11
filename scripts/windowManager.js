/**
 * windowManager.js
 * ------------------------------------
 * PURPOSE:
 * Opens, closes, and manages THDATE windows.
 */

const WindowManager = {
  layer: null,

  init() {
    this.layer = document.getElementById("window-layer");
  },

  async loadDocx(docxPath) {
    if (!docxPath) return "<p>No document content loaded.</p>";

    try {
      const response = await fetch(docxPath, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Could not fetch DOCX: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      return result.value;
    } catch (error) {
      return `
        <p>Could not load document.</p>
        <pre>${error.message}</pre>
      `;
    }
  },

  async loadIllustration(illustration) {
  if (!illustration) return "";

  if (illustration.type === "ascii") {
    try {
      const response = await fetch(illustration.path, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Could not fetch illustration.`);
      }

      const ascii = await response.text();

      return `
        <div class="illustration">
          <pre>${ascii}</pre>
        </div>
      `;
    } catch (error) {
      console.warn(error);
      return "";
    }
  }

  if (illustration.type === "image") {
    return `
      <div class="illustration">
        <img src="${illustration.path}" alt="">
      </div>
    `;
  }

  return "";
},

  async openDocument(fileNode) {
  let metadata = {
    title: fileNode.title,
    author: fileNode.author || "",
    docxPath: fileNode.docxPath || "",
    themePath: fileNode.themePath || "",
  };

  if (fileNode.metadataPath) {
    try {
      const metadataResponse = await fetch(fileNode.metadataPath, {
        cache: "no-store",
      });

      if (!metadataResponse.ok) {
        throw new Error(`Could not fetch metadata: ${metadataResponse.status}`);
      }

      metadata = await metadataResponse.json();
    } catch (error) {
      console.warn("Could not load story metadata:", error);
    }
  }

  const content = await this.loadDocx(metadata.docxPath);
  const illustration = await this.loadIllustration(metadata.illustration);

  const useStoryPage = metadata.useStoryPage === true;

  if (metadata.themePath) {
    this.loadTheme(metadata.themePath);
  }

  const win = document.createElement("article");
  win.className = "thdate-window";
  win.dataset.story = fileNode.storyId || "";

  win.innerHTML = `
    <header class="window-bar">
      <span>${metadata.title}</span>

      <nav class="window-controls">
        <button type="button" data-action="fullscreen">□</button>
        <button type="button" data-action="close">✕</button>
      </nav>
    </header>

    <section class="window-body">
    ${
        useStoryPage
            ? `
                <article class="story-page">
                    <h1>${metadata.title}</h1>
                    <div class="author">${metadata.author || ""}</div>

                    ${illustration}

                    ${content}
                </article>
            `
            : `
                <h1>${metadata.title}</h1>
                <div class="author">${metadata.author || ""}</div>

                ${illustration}

                ${content}
            `
    }
</section>
  `;
if (fileNode.storyId) {
  history.pushState(
    null,
    "",
    `?story=${encodeURIComponent(fileNode.storyId)}`
  );
}
  this.attachWindowControls(win);
  this.layer.appendChild(win);
},

 async openCollection(fileNode) {
  let metadata = {
    title: fileNode.title,
    author: fileNode.author || "",
    themePath: "",
    tabs: [],
  };

  if (fileNode.metadataPath) {
    try {
      const response = await fetch(fileNode.metadataPath, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Could not fetch metadata: ${response.status}`);
      }

      metadata = await response.json();
    } catch (error) {
      console.warn("Could not load collection metadata:", error);
    }
  }

  if (metadata.themePath) {
    this.loadTheme(metadata.themePath);
  }

  if (!metadata.tabs || !metadata.tabs.length) {
    metadata.tabs = [
      {
        title: "Empty Collection",
        docxPath: "",
      },
    ];
  }

  const firstTab = metadata.tabs[0];
  const firstContent = await this.loadDocx(firstTab.docxPath);
  const firstIllustration = await this.loadIllustration(firstTab.illustration);

  const win = document.createElement("article");
  win.className = "thdate-window collection-window";
  win.dataset.collection = fileNode.collectionId || "";

  win.innerHTML = `
    <header class="window-bar">
      <span>${metadata.title}</span>

      <nav class="window-controls">
        <button type="button" data-action="fullscreen">□</button>
        <button type="button" data-action="close">✕</button>
      </nav>
    </header>

    <section class="collection-shell">
      <nav class="collection-tabs">
        ${metadata.tabs.map((tab, index) => `
          <button
            type="button"
            class="${index === 0 ? "active" : ""}"
            data-tab-index="${index}"
          >
            ${tab.title}
          </button>
        `).join("")}
      </nav>

      <section class="window-body collection-body">
        <h1>${firstTab.title}</h1>
        <div class="author">${metadata.author || ""}</div>
        <div class="collection-content">
          ${firstIllustration}
          ${firstContent}
        </div>
      </section>
    </section>
  `;

  const body = win.querySelector(".collection-body");

  win.querySelectorAll("[data-tab-index]").forEach((button) => {
    button.addEventListener("click", async () => {
      const tab = metadata.tabs[Number(button.dataset.tabIndex)];

      win.querySelectorAll("[data-tab-index]").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const tabContent = await this.loadDocx(tab.docxPath);
      const tabIllustration = await this.loadIllustration(tab.illustration);

      body.innerHTML = `
        <h1>${tab.title}</h1>
        <div class="author">${metadata.author || ""}</div>
        <div class="collection-content">
          ${tabIllustration}
          ${tabContent}
        </div>
      `;
    });
  });

if (fileNode.collectionId) {
  history.pushState(
    null,
    "",
    `?collection=${encodeURIComponent(fileNode.collectionId)}`
  );
}
  
  this.attachWindowControls(win);
  this.layer.appendChild(win);
},

  attachWindowControls(win) {
    win.querySelector('[data-action="close"]').addEventListener("click", () => {
      win.remove();
    });

    win.querySelector('[data-action="fullscreen"]').addEventListener("click", () => {
      win.classList.toggle("fullscreen");
    });
  },

findNodeById(node, targetId) {
  if (!node || typeof node !== "object") return null;

  if (
    node.storyId === targetId ||
    node.collectionId === targetId
  ) {
    return node;
  }

  if (node.children) {
    for (const child of Object.values(node.children)) {
      const match = this.findNodeById(child, targetId);

      if (match) return match;
    }
  }

  return null;
},

openFromUrl() {
  const params = new URLSearchParams(window.location.search);

  let type = "";
  let id = "";

  if (params.has("story")) {
    type = "story";
    id = params.get("story");
  } else if (params.has("collection")) {
    type = "collection";
    id = params.get("collection");
  } else {
    const hashMatch = window.location.hash.match(
      /^#(story|collection)=(.+)$/
    );

    if (hashMatch) {
      type = hashMatch[1];
      id = decodeURIComponent(hashMatch[2]);
    }
  }

  if (!id) return;

  const fileNode = this.findNodeById(FileSystem.tree, id);

  if (!fileNode) {
    console.warn(`Could not find linked document: ${id}`);
    return;
  }

  if (type === "collection" && fileNode.type === "collection") {
    this.openCollection(fileNode);
    return;
  }

  if (type === "story" && fileNode.type === "document") {
    this.openDocument(fileNode);
  }
},

  loadTheme(themePath) {
    const existing = document.querySelector(`link[href="${themePath}"]`);

    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = themePath;
    document.head.appendChild(link);
  },
};

