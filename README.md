# Reever

River navigation GPS for boats — plan your route with lock (écluse) timing.

## Features

- **Interactive map** — rivers and canals prominently displayed (OpenFreeMap / OSM)
- **Locks (écluses)** — shown as markers with name, operator and opening hours; highlighted when on your route
- **Navigation signs** — CEVNI signs (prohibition, obligation, warning, information) with descriptions
- **Route planning** — click the map to add waypoints; route line drawn automatically
- **ETA calculation** — travel time + per-lock transit time, configurable boat speed (3–20 km/h)
- **Draggable waypoints** — refine your route by dragging markers

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite 5 |
| Map | MapLibre GL JS |
| Map tiles | OpenFreeMap (free, no API key) |
| Geospatial | Turf.js |
| Styling | TailwindCSS v3 |
| Unit tests | Vitest |
| E2E tests | Playwright |

## Getting Started

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
```

## Testing

```bash
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright)
npx tsc --noEmit   # type check
```

## Building

```bash
npm run build      # produces dist/
```

## How to Use

1. The map opens centred on France — pan and zoom to your waterway.
2. **Click on the map** to place waypoints along your route.
3. The **Route Info** panel shows distance, lock count and total ETA.
4. Adjust **Cruising speed** and **Lock transit time** sliders in Boat Settings.
5. Click a lock or sign marker to see details in a popup.
6. **Clear all** removes all waypoints and resets the route.

## Lock Data

On load the app queries the [Overpass API](https://overpass-api.de) for lock gates in the current viewport. If the API is unavailable, 20 real French locks (Seine, Rhône, Canal du Midi, Saône, Moselle, Garonne…) are used as fallback.

## Specifications

See `specs/river-gps-app.md` for the full requirements and acceptance criteria.

## License

[Unlicense](LICENSE) — public domain.
