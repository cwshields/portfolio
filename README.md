# Chase Shields — Portfolio

My personal portfolio site, built with React and TypeScript. It showcases my professional experience, personal projects, and education, and includes a full Scrabble clone I built from scratch.

## About Me

I'm a full-stack web developer based in Fort Worth, TX with 8+ years of experience building and maintaining production React/TypeScript applications. I'm currently a Front-End Web Developer at Cavco Industries, maintaining React/TypeScript apps for Cavco and its sister brands (Fleetwood Homes, Palm Harbor Homes) and migrating a legacy business-rules system to C#/.NET. Before that, I built full-stack apps at Fueland Inc. (React + Java/IBM DB2) and front-end workflows for major sponsor brands at PDI Technologies. I hold a Full-Stack Web Development certificate from DevMountain (2019).

- Email: [cwshields2@gmail.com](mailto:cwshields2@gmail.com)
- LinkedIn: [linkedin.com/in/chase-shields-236bb4126](https://www.linkedin.com/in/chase-shields-236bb4126/)
- GitHub: [github.com/cwshields](https://github.com/cwshields/)

**Note: this project runs on Node.js v18** (see `.nvmrc`).

## Project Structure

- `src/pages` — top-level routed pages (`Welcome`, `Home`, `ScrabbleGame`)
- `src/components` — shared UI components (e.g. `Showcase`, social media icons)
- `src/data` — content for the professional experience and personal projects lists
- `src/styles` — SASS stylesheets

## Scrabble Game

Try out my Scrabble clone at [`/scrabble-game`](https://chaseshields.dev/scrabble-game)! It's a full Words with Friends–style implementation built with React and TypeScript, including:

- 1-player (vs. a bot with Easy/Medium/Hard difficulty) or 2-player local hotseat play
- Drag-and-drop tile placement onto the board
- Dictionary-backed word validation and standard Scrabble scoring, including double/triple letter and word bonus squares
- Hints, a turn-by-turn move history with word highlighting, and save/load of a game to a file

### Developer panel

> [!TIP]
> Press `Ctrl+Shift+D` while a game is in progress to open the hidden developer panel.

The panel is handy for testing and reproducing specific board states. It lets you:

- Reshuffle either player's rack from the bag
- Force-set either player's rack to specific letters
- Reveal the bot's rack (1-player mode)
- Toggle whether already-submitted (locked) tiles can be moved
- View the tile bag's remaining letters
- Reset both players' used-hint counts
- Run the "does anyone have a legal move" stalemate check on demand
- Inspect the bot's most recently considered candidate moves and the one it chose
