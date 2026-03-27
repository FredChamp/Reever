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
  lockRef?: string
  operator?: string
  openingHours?: string
}

// ─── Maritime Seamark Types ──────────────────────────────────────────────────

export type SeamarkCategory =
  | 'buoy_lateral'
  | 'buoy_cardinal'
  | 'buoy_isolated_danger'
  | 'buoy_safe_water'
  | 'buoy_special_purpose'
  | 'light_major'
  | 'light_minor'
  | 'harbour'
  | 'beacon_lateral'
  | 'beacon_cardinal'
  | 'notice'       // CEVNI inland signs

export type LateralSide = 'port' | 'starboard'
export type CardinalDirection = 'north' | 'south' | 'east' | 'west'

export interface Seamark {
  id: string
  name: string
  coordinates: LngLat
  category: SeamarkCategory
  /** For lateral marks: port or starboard */
  side?: LateralSide
  /** For cardinal marks: direction */
  cardinal?: CardinalDirection
  /** Light character (e.g. "Fl(3) 10s") */
  lightCharacter?: string
  /** Light color */
  lightColor?: string
  /** CEVNI code for notices */
  noticeCode?: string
  /** Color description */
  color?: string
  /** Shape description */
  shape?: string
  /** Raw OSM tags for extra info */
  tags?: Record<string, string>
}

// ─── River Navigation Sign (CEVNI) — kept for backwards compat ──────────────

export type SignCategory =
  | 'prohibition'
  | 'obligation'
  | 'warning'
  | 'information'

export interface RiverSign {
  id: string
  name: string
  description: string
  coordinates: LngLat
  category: SignCategory
  code?: string
}

// ─── Route ───────────────────────────────────────────────────────────────────

export interface Route {
  geojson: GeoJSON.Feature<GeoJSON.LineString>
  distanceKm: number
  locksOnRoute: Lock[]
}

// ─── ETA ─────────────────────────────────────────────────────────────────────

export interface ETAResult {
  distanceKm: number
  distanceNm: number
  lockCount: number
  waterTimeMin: number
  lockTimeMin: number
  totalTimeMin: number
  totalFormatted: string
}

// ─── Speed Unit ──────────────────────────────────────────────────────────────

export type SpeedUnit = 'kmh' | 'knots'

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  /** Cruising speed in km/h (3–40) */
  boatSpeedKmh: number
  /** Average time per lock in minutes (10–60) */
  lockTransitMin: number
  /** Display unit for speed */
  speedUnit: SpeedUnit
}

// ─── Layer Visibility ────────────────────────────────────────────────────────

export interface LayerVisibility {
  lateralMarks: boolean
  cardinalMarks: boolean
  dangerMarks: boolean
  lights: boolean
  ports: boolean
  locks: boolean
  notices: boolean
  specialMarks: boolean
  seaOverlay: boolean
}

// ─── Map View State ──────────────────────────────────────────────────────────

export type MapViewMode = '2d' | '3d'

// ─── Bottom Sheet ────────────────────────────────────────────────────────────

export type BottomSheetSnap = 'collapsed' | 'half' | 'full'

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
