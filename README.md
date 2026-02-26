# World Clock

A multi-timezone world clock app built with React and TypeScript. Add up to 5 timezones simultaneously, remove them individually, and drag to reorder.

## Features

- **Search timezones** by city name or IANA timezone ID, with accent-normalized matching (e.g. typing "Gijon" finds "Gijón")
- **Multiple clocks** — display up to 5 timezones at once, all ticking in sync
- **Delete** any timezone with the X button
- **Drag and drop** to reorder clocks, with visual drop indicators
- **City aliases** — search for cities not in the IANA database (e.g. Barcelona, Munich, San Francisco) and get the correct timezone

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19
- TypeScript
- Vite
- HTML5 native drag-and-drop (no external libraries)
