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
                children: {}
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
              fantasy: { type: "empty", title: "Fantasy" },
              "sci-fi": { type: "empty", title: "Sci-Fi" },
              literary: {
                type: "directory",
                title: "Literary",
                children: {
                  "i-dont-really-love-you": {
                    type: "document",
                    title: "I DON'T REALLY LOVE YOU",
                    storyId: "i-dont-really-love-you",
                    metadataPath: "stories/literary/i-dont-really-love-you/metadata.json"
                  }
                }
              }
            }
          }
        }
      },

      visual_media: {
        type: "directory",
        children: {
          youtube: { type: "empty", title: "YouTube" },
          galleries: {
            type: "directory",
            children: {
              gallery1: { type: "empty", title: "Gallery 1" },
              gallery2: { type: "empty", title: "Gallery 2" },
              gallery3: { type: "empty", title: "Gallery 3" }
            }
          },
          instagram: {
            type: "external",
            title: "Instagram",
            url: "https://www.instagram.com/hszellt/"
          }
        }
      },

      new: {
  type: "directory",
  children: {
    "i-dont-really-love-you": {
      type: "document",
      title: "I DON'T REALLY LOVE YOU",
      author: "Harrison Szell",
      storyId: "i-dont-really-love-you",
      metadataPath: "stories/literary/i-dont-really-love-you/metadata.json"
    },
    "collection-001": {
     type: "collection",
     title: "Collection 001",
     author: "Harrison Szell",
     collectionId: "haiku-collection-001",
     metadataPath: "poetry/haikus/collection-001/metadata.json"
},
    untitled3: {
      type: "empty",
      title: "Untitled 3"
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
