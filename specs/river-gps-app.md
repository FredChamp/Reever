# Spec: Reever — River Boat GPS Web Application

**Version**: 1.0
**Date**: 2026-02-28
**Status**: Approved

---

## 1. Overview

Reever is a browser-based GPS navigation aid for river and canal boat pilots. It displays an interactive waterway map with locks (écluses), navigation signs, and a route planner that estimates arrival time accounting for lock transit delays.

---

## 2. Requirements

### 2.1 Map Display

- **REQ-MAP-01**: The app MUST display an interactive map centred on French waterways by default (lat: 46.8, lng: 2.35, zoom 6).
- **REQ-MAP-02**: Waterways (rivers, canals) MUST be visually prominent — wider and more saturated blue than roads.
- **REQ-MAP-03**: Écluses (locks) MUST be shown as distinct map markers with an anchor/lock icon.
- **REQ-MAP-04**: Navigation signs (CEVNI standard) MUST be shown as map markers categorised by type (prohibition, obligation, warning, information).
- **REQ-MAP-05**: Clicking a lock or sign marker MUST open a popup with its name and relevant details.
- **REQ-MAP-06**: The map MUST support pan, zoom, and touch gestures.

### 2.2 Route Planning

- **REQ-ROUTE-01**: Clicking on the map MUST add a waypoint at the clicked location.
- **REQ-ROUTE-02**: With 2+ waypoints, the app MUST draw a route line connecting them in order.
- **REQ-ROUTE-03**: A user MAY remove individual waypoints via the sidebar list.
- **REQ-ROUTE-04**: A "Clear route" action MUST remove all waypoints and reset the ETA panel.
- **REQ-ROUTE-05**: Waypoints MUST be shown as numbered markers on the map.

### 2.3 ETA Calculation

- **REQ-ETA-01**: The app MUST display total route distance in kilometres.
- **REQ-ETA-02**: The app MUST display estimated travel time in hours and minutes.
- **REQ-ETA-03**: Travel time MUST be computed as: `distance_km / boat_speed_kmh * 60` (minutes).
- **REQ-ETA-04**: The app MUST count locks within 100 m of the route and add `lock_count * lock_transit_min` to the ETA.
- **REQ-ETA-05**: Boat speed MUST be configurable between 3 and 20 km/h (default 8 km/h).
- **REQ-ETA-06**: Lock transit time MUST be configurable between 10 and 60 minutes (default 30 min).
- **REQ-ETA-07**: ETA MUST update reactively when speed, lock time, or waypoints change.
- **REQ-ETA-08**: The app MUST display the number of locks along the route.

### 2.4 Lock & Sign Data

- **REQ-DATA-01**: The app MUST attempt to load lock data from the OSM Overpass API for the current map viewport.
- **REQ-DATA-02**: If the Overpass API is unavailable, the app MUST fall back to built-in mock lock data.
- **REQ-DATA-03**: Mock data MUST include at least 15 real French locks across multiple waterways.
- **REQ-DATA-04**: Navigation signs MUST be loaded from built-in mock data (static, curated set).

### 2.5 Design & UX

- **REQ-UX-01**: The UI MUST use a light, flat, modern design aesthetic.
- **REQ-UX-02**: The layout MUST have a sidebar (320px) on the left and the map filling the remaining space.
- **REQ-UX-03**: A top navigation bar MUST display the Reever brand name.
- **REQ-UX-04**: The app MUST be usable on desktop screens (min-width 768px). Mobile layout is optional.
- **REQ-UX-05**: All interactive controls MUST have clear visual affordance (hover states, focus rings).

---

## 3. Acceptance Criteria

| ID | Criterion | Test |
|---|---|---|
| AC-01 | Map renders on load with waterways visible | E2E: mapDisplay.spec.ts |
| AC-02 | Lock markers appear within 5 s of map load | E2E: mapDisplay.spec.ts |
| AC-03 | Clicking map adds waypoint marker | E2E: routePlanning.spec.ts |
| AC-04 | Two clicks produce a route line on map | E2E: routePlanning.spec.ts |
| AC-05 | ETA panel shows distance and time after 2 waypoints | E2E: routePlanning.spec.ts |
| AC-06 | ETA updates when speed slider changes | E2E: routePlanning.spec.ts |
| AC-07 | Lock count in ETA equals locks within 100m of route | Unit: etaCalculator.test.ts |
| AC-08 | ETA formula is correct: (dist/speed)*60 + locks*lockTime | Unit: etaCalculator.test.ts |
| AC-09 | Clear route removes waypoints and resets ETA | E2E: routePlanning.spec.ts |
| AC-10 | Overpass API parser correctly extracts lock nodes | Unit: overpassApi.test.ts |

---

## 4. Edge Cases

- **Zero waypoints**: ETA panel shows placeholder ("Add waypoints to plan a route").
- **One waypoint**: Route line not drawn; ETA shows 0 km / 0 min.
- **No locks near route**: Lock count = 0; ETA = travel time only.
- **Very long route (>500 km)**: ETA shown in hours; no overflow in display.
- **Overpass API timeout**: Silent fallback to mock data; no error shown to user.
- **Duplicate waypoint click (same coords)**: Ignored or added at 1m offset.

---

## 5. API Contracts

### 5.1 ETA Calculator

**Input**:
```typescript
interface ETAInput {
  distanceKm: number;       // total route distance
  boatSpeedKmh: number;     // 3–20
  lockCount: number;        // non-negative integer
  lockTransitMin: number;   // 10–60
}
```

**Output**:
```typescript
interface ETAResult {
  travelTimeMin: number;    // distance-based travel time
  lockTimeMin: number;      // total lock delay
  totalTimeMin: number;     // sum of above
  totalTimeFormatted: string; // e.g. "4 h 35 min"
  distanceKm: number;       // rounded to 1 decimal
}
```

### 5.2 Overpass API Query

Endpoint: `https://overpass-api.de/api/interpreter`

Query template (POST body):
```
[out:json][timeout:10];
node["waterway"="lock_gate"]({{bbox}});
out body;
```

Response parsed to `Lock[]`:
```typescript
interface Lock {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  type: 'lock';
}
```

---

## 6. Non-Functional Requirements

- **Performance**: Initial map render < 3 s on a 10 Mbps connection.
- **Accessibility**: WCAG AA colour contrast for all text; keyboard-navigable controls.
- **No backend**: All logic runs client-side; no server required.
- **No paid APIs**: All tile and data sources must be free/open.
