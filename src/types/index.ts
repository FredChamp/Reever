// ─── Coordinates ─────────────────────────────────────────────────────────────

/** [longitude, latitude] tuple */
export type LngLat = [number, number]

// ─── Waypoint ─────────────────────────────────────────────────────────────────

export interface Waypoint {
  id: string
  lngLat: LngLat
  /** Reverse-geocoded place name (optional, loaded asynchronously) */
  label?: string
}

// ─── Lock / Écluse ────────────────────────────────────────────────────────────

export interface Lock {
  id: string
  name: string
  coordinates: LngLat
  /** Optional extra metadata from OSM */
  lockRef?: string
  operator?: string
  openingHours?: string
}

// ─── River Navigation Sign (CEVNI) ────────────────────────────────────────────

export type SignCategory =
  | 'prohibition'   // red border, white/blue — no entry, no overtaking, etc.
  | 'obligation'    // blue circle — keep right, sound horn, etc.
  | 'warning'       // yellow/diamond — hazard, low bridge, shallow water
  | 'information'   // white rectangle — information, distances

export interface RiverSign {
  id: string
  name: string
  description: string
  coordinates: LngLat
  category: SignCategory
  /** CEVNI sign code, e.g. "A.1", "B.1" */
  code?: string
}

// ─── Route ───────────────────────────────────────────────────────────────────

export interface Route {
  geojson: GeoJSON.Feature<GeoJSON.LineString>
  distanceKm: number
  /** Locks detected within the route corridor */
  locksOnRoute: Lock[]
}

// ─── ETA ─────────────────────────────────────────────────────────────────────

export interface ETAResult {
  distanceKm: number
  lockCount: number
  /** Time underway excluding locks */
  waterTimeMin: number
  /** Total lock waiting and transit time */
  lockTimeMin: number
  totalTimeMin: number
  /** Human-readable total, e.g. "4 h 35 min" */
  totalFormatted: string
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  /** Cruising speed in km/h (3–20) */
  boatSpeedKmh: number
  /** Average time per lock in minutes (10–60) */
  lockTransitMin: number
}

// ─── Overpass API ─────────────────────────────────────────────────────────────

export interface OverpassNode {
  type: 'node'
  id: number
  lat: number
  lon: number
  tags?: Record<string, string>
}

export interface OverpassElement {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

export interface OverpassResponse {
  elements: OverpassElement[]
}
