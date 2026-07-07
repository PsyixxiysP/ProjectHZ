# THDATE Modular Starter

## How to run

1. Open this folder in VS Code.
2. Install the VS Code extension: Live Server.
3. Right-click `index.html`.
4. Click `Open with Live Server`.

## Structure

- `index.html` contains the main HTML shell.
- `styles/` contains separate CSS files by responsibility.
- `scripts/` contains the engine modules.
- `filesystem.js` defines the fake operating-system directory tree.
- `commands.js` interprets typed and clicked commands.
- `windowManager.js` opens document windows.
- `config.js` contains editable site settings.

## Design rule

Everything visible in the terminal should be clickable, but everything clickable should also work as a typed command.

## Useful commands

- `dir`
- `tree`
- `cd fiction`
- `cd anthologies_short_stories`
- `cd literary`
- `open i-dont-really-love-you`
- `back`
- `menu`
- `clear`
