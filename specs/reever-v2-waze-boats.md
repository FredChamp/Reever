# Reever v2 — Waze for Boat Navigation (Rivers + Coastal)

## Overview

Transform Reever into a marine Waze-like navigation app for inland waterways and coastal waters with 3D terrain, real maritime sign data, and a modern dark-themed mobile-first UI.

## Requirements

### REQ-3D: 3D Terrain Map

- MapLibre GL JS with 3D terrain using free DEM tiles (AWS Terrain Tiles or equivalent)
- Pitched camera (default ~45°) for 3D perspective
- Sky atmosphere layer
- Smooth terrain with exaggeration factor for visual effect
- User can toggle between 2D/3D views

### REQ-SEA: Coastal & Sea Support

- OpenSeaMap raster tile overlay for nautical chart information
- Support for both inland waterways and coastal navigation
- Speed units toggle: km/h and knots
- IALA Region A (Europe) buoyage system

### REQ-SIGNS: Maritime Navigation Signs (Real Data)

All sign data fetched from Overpass API using OpenSeaMap/OSM seamark tags. NO mock data.

#### Data Sources (Overpass API queries):

- `seamark:type=buoy_lateral` — lateral marks (port/starboard)
- `seamark:type=buoy_cardinal` — cardinal marks (N/S/E/W)
- `seamark:type=buoy_isolated_danger` — isolated danger marks
- `seamark:type=buoy_safe_water` — safe water marks
- `seamark:type=buoy_special_purpose` — special marks
- `seamark:type=light_major` or `man_made=lighthouse` — lighthouses
- `seamark:type=light_minor` — minor lights
- `seamark:type=harbour` or `leisure=marina` — ports and marinas
- `seamark:type=beacon_lateral` — lateral beacons
- `seamark:type=beacon_cardinal` — cardinal beacons
- `waterway=lock_gate` or `waterway=lock` — locks (existing)
- `seamark:type=notice` — CEVNI inland signs

#### Sign Categories for Display:

1. **Lateral Marks** (IALA Region A): Port (red, can shape), Starboard (green, cone shape)
2. **Cardinal Marks**: N (black/yellow), S (yellow/black), E (black/yellow/black), W (yellow/black/yellow)
3. **Danger Marks**: Isolated danger (black/red horizontal bands), Safe water (red/white vertical stripes)
4. **Lights & Lighthouses**: Major lights, minor lights, sectors
5. **Ports & Marinas**: Harbor icons with services info
6. **Inland Signs (CEVNI)**: Prohibition, obligation, warning, information
7. **Special Marks**: Yellow — pipelines, cables, military areas

### REQ-UI: Modern Dark Marine UI/UX

- **Dark navy theme** (#0a1628 background, cyan/white accents)
- **Full-screen map** with overlaying controls (no sidebar)
- **Bottom sheet** (draggable up/down) replacing sidebar:
  - Collapsed: Route summary bar (distance, ETA, hazards count)
  - Half-open: Route details, waypoints, speed controls
  - Full-open: Sign legend, layer toggles, settings
- **Floating action buttons**: Add waypoint, GPS center, 2D/3D toggle
- **Top bar**: Minimal — app name + route info pill
- **Layer toggle panel**: Toggle visibility per sign category
- **Large touch targets** (min 44px) for use on boats
- **Smooth animations** with CSS transitions/transforms
- Mobile-first responsive design

### REQ-ROUTE: Route Planning (Enhanced)

- Click map to add waypoints (existing)
- Draggable waypoints (existing)
- Route line with 3D-aware rendering (follows terrain)
- Distance in km and nautical miles
- ETA with speed in km/h or knots
- Lock/bridge count on route
- Clear all / undo last waypoint

### REQ-DATA: Real Data Pipeline

- All navigation data from Overpass API (OpenStreetMap + OpenSeaMap tags)
- Fetch on map move/zoom (debounced, 500ms)
- Cache fetched data in Zustand store to avoid re-fetching
- Bounding box queries for current viewport
- Graceful error handling (show toast on API failure, keep cached data)
- No mock data files — everything is live

## Acceptance Criteria

- AC-01: Map renders in 3D with terrain, sky, and pitched camera
- AC-02: User can toggle between 2D and 3D views
- AC-03: Lateral marks (port/starboard) display with correct IALA Region A colors
- AC-04: Cardinal marks display with correct color patterns and top marks
- AC-05: Lighthouses and lights display with appropriate icons
- AC-06: Ports and marinas display with harbor icon
- AC-07: All sign data is fetched from Overpass API (no hardcoded/mock data)
- AC-08: Bottom sheet opens/closes with drag gestures and snap points
- AC-09: Dark marine theme applied consistently across all components
- AC-10: Layer toggles show/hide each sign category independently
- AC-11: Route displays distance in km + nautical miles
- AC-12: Speed can be set in knots or km/h
- AC-13: Floating action buttons work (add waypoint mode, GPS center, 2D/3D)
- AC-14: OpenSeaMap tile overlay can be toggled on/off
- AC-15: Data fetches on viewport change with debounce
- AC-16: App works on mobile with touch-friendly targets

## Edge Cases

- No internet: Show last cached data, display offline indicator
- Overpass API rate limit: Exponential backoff, max 3 retries
- Empty area (no seamarks): Show empty state, no errors
- Very zoomed out: Don't fetch seamarks (min zoom level 8 for fetching)
- 3D terrain tiles unavailable: Fall back to flat 2D map gracefully

## Non-Functional

- First render < 3 seconds
- Seamark fetch < 5 seconds per viewport
- No paid APIs or API keys required
- WCAG AA contrast ratios (especially on dark theme)
- Works in latest Chrome, Firefox, Safari
