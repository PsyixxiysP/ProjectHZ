/**
 * filesystem.js
 * ------------------------------------
 * PURPOSE:
 * Stores THDATE's virtual filesystem.
 *
 * RESPONSIBILITIES:
 * - Define directories and files.
 * - Resolve paths.
 * - List directory contents.
 *
 * DOES NOT:
 * - Render the terminal.
 * - Open windows directly.
 */

const FileSystem = {
  currentPath: ["THDATE"],

  tree: {
    name: "THDATE",
    type: "directory",
    children: {
      fiction: {
        type: "directory",
        children: {
          "long_form": { type: "empty", title: "Long Form" },
          poetry: {
  type: "directory",
  title: "Poetry",
  children: {
    freeform: {
      type: "directory",
      title: "Freeform",
      children: {
        "tree-photography": {
          type: "document",
          title: "Tree Photography",
          author: "Harrison Szell",
          storyId: "tree-photography",
          metadataPath: "poetry/freeform/tree-photography/metadata.json"
        },

        "the-lion": {
          type: "document",
          title: "The Lion",
          author: "Harrison Szell",
          storyId: "the-lion",
          metadataPath: "poetry/freeform/the-lion/metadata.json"
        }
      }
    },

    haikus: {
      type: "directory",
      title: "Haikus",
      children: {
        "collection-001": {
          type: "collection",
          title: "Collection 001",
          author: "Harrison Szell",
          collectionId: "haiku-collection-001",
          metadataPath: "poetry/haikus/collection-001/metadata.json"
        }
      }
    }
  }
},
          "anthologies_short_stories": {
            type: "directory",
            title: "Anthologies + Short Stories",
            children: {
              fantasy: { type: "directory",
                title: "Fantasy",
                children: {
                         "on-running-a-small-business": {type: "document",
                    title: "On Running a Small Business",
                    storyId: "on-running-a-small-business",
                    metadataPath: "stories/fantasy/on-running-a-small-business/metadata.json"},
},},
              "sci-fi": { 
                type: "directory",
                title: "Sci-Fi",
                children: {
                         "rom-comm": {type: "document",
                    title: "Rom-Comm",
                    storyId: "rom-comm",
                    metadataPath: "stories/sci-fi/rom-comm/metadata.json"},
                        "the-cowardly-thing": {type: "document",
                    title: "The Cowardly Thing",
                    storyId: "the-cowardly-thing",
                    metadataPath: "stories/sci-fi/the-cowardly-thing/metadata.json"},
                        "ophiocordyceps": {type: "document",
                    title: "Ophiocordyceps",
                    storyId: "ophiocordyceps",
                    metadataPath: "stories/sci-fi/ophiocordyceps/metadata.json"}
} },
              literary: {
                type: "directory",
                title: "Literary",
                children: {
                  "i-dont-really-love-you": {
                    type: "document",
                    title: "I DON'T REALLY LOVE YOU",
                    storyId: "i-dont-really-love-you",
                    metadataPath: "stories/literary/i-dont-really-love-you/metadata.json"
                  },
                  "the-depressed-man": {
                    type: "document",
                    title: "The Depressed Man",
                    storyId: "the-depressed-man",
                    metadataPath: "stories/literary/the-depressed-man/metadata.json"
                  },
                  "and-then-he-died": {
                    type: "document",
                    title: "And Then He Died",
                    storyId: "and-then-he-died",
                    metadataPath: "stories/literary/and-then-he-died/metadata.json"
                  },
                  "girl-child-of-war": {
                    type: "document",
                    title: "Girl, Child of War",
                    storyId: "girl-child-of-war",
                    metadataPath: "stories/literary/girl-child-of-war/metadata.json"
                  },
                }
              }
            }
          }
        }
      },

      visual_media: {
        type: "directory",
        children: {
          galleries: {
            type: "directory",
            children: {
              gallery1: { type: "empty", title: "Gallery 1" },
              gallery2: { type: "empty", title: "Gallery 2" },
              gallery3: { type: "empty", title: "Gallery 3" },
            }
          },
          instagram: {
            type: "external",
            title: "Instagram",
            url: "https://www.instagram.com/hszellt/"
          },
          youtube: { type: "empty", title: "YouTube" }
        }
      },

      new: {
  type: "directory",
  children: {
    "i-dont-really-love-you": {
      type: "document",
      title: "I DON'T REALLY LOVE YOU (Short Story)",
      author: "Harrison Szell",
      storyId: "i-dont-really-love-you",
      metadataPath: "stories/literary/i-dont-really-love-you/metadata.json"
    },
    "collection-001": {
     type: "collection",
     title: "Collection 001 (Haiku Collection)",
     author: "Harrison Szell",
     collectionId: "haiku-collection-001",
     metadataPath: "poetry/haikus/collection-001/metadata.json"
},
    "the-lion": {
      type: "document",
  title: "The Lion (Freeform Poem)",
  author: "Harrison Szell",
  storyId: "the-lion",
  metadataPath: "poetry/freeform/the-lion/metadata.json"
    }
  }
},

       bio: {
        type: "empty",
        title: "Bio"
      },

      contact: {
        type: "empty",
        title: "Contact"
      },

      credits: {
        type: "directory",
        title: "Credits",
        children: {
          mammoth: {
            type: "external",
            title: "Mammoth.js",
            url: "https://github.com/mwilliamson/mammoth.js"
          },

          ascii_art: {
            type: "empty",
            title: "ASCII Art Sources",
            url: "https://www.asciiart.eu/gallery"
          },

          site_notes: {
            type: "empty",
            title: "Site Notes"
          }
        }
      }
    }
  },
  


  getCurrentNode() {
    let node = this.tree;
    for (const part of this.currentPath.slice(1)) {
      node = node.children[part];
    }
    return node;
  },

  getPrompt() {
    return `C:\\${this.currentPath.join("\\")}>`;
  },

  listCurrentDirectory() {
    const node = this.getCurrentNode();
    if (!node.children) return [];
    return Object.entries(node.children).map(([key, value]) => ({
      key,
      title: value.title || key,
      type: value.type
    }));
  },

  cd(name) {
    const node = this.getCurrentNode();
    if (name === "..") {
      if (this.currentPath.length > 1) this.currentPath.pop();
      return true;
    }

    if (!node.children || !node.children[name]) return false;
    if (node.children[name].type !== "directory") return false;

    this.currentPath.push(name);
    return true;
  },

  findInCurrentDirectory(name) {
    const node = this.getCurrentNode();
    if (!node.children) return null;
    return node.children[name] || null;
  }
};
