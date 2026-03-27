import type { Lock, Seamark, SeamarkCategory, OverpassResponse, OverpassElement } from '@/types'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const TIMEOUT_MS = 15_000

// ─── Coordinate extraction ───────────────────────────────────────────────────

function extractCoords(el: OverpassElement): [number, number] | null {
  if (el.type === 'node' && el.lat !== undefined && el.lon !== undefined) {
    return [el.lon, el.lat]
  }
  if (el.center) {
    return [el.center.lon, el.center.lat]
  }
  return null
}

// ─── Lock parsing (unchanged logic) ─────────────────────────────────────────

export function parseOverpassLocks(response: OverpassResponse): Lock[] {
  const locks: Lock[] = []
  for (const el of response.elements) {
    const coords = extractCoords(el)
    if (!coords) continue
    locks.push({
      id: `osm-${el.id}`,
      name: el.tags?.name ?? 'Unnamed lock',
      coordinates: coords,
      lockRef: el.tags?.ref,
      operator: el.tags?.operator,
      openingHours: el.tags?.opening_hours,
    })
  }
  return locks
}

// ─── Seamark parsing ─────────────────────────────────────────────────────────

function resolveSeamarkCategory(tags: Record<string, string>): SeamarkCategory | null {
  const seamarkType = tags['seamark:type']
  if (seamarkType) {
    const mapping: Record<string, SeamarkCategory> = {
      'buoy_lateral': 'buoy_lateral',
      'buoy_cardinal': 'buoy_cardinal',
      'buoy_isolated_danger': 'buoy_isolated_danger',
      'buoy_safe_water': 'buoy_safe_water',
      'buoy_special_purpose': 'buoy_special_purpose',
      'light_major': 'light_major',
      'light_minor': 'light_minor',
      'harbour': 'harbour',
      'beacon_lateral': 'beacon_lateral',
      'beacon_cardinal': 'beacon_cardinal',
      'notice': 'notice',
    }
    if (mapping[seamarkType]) return mapping[seamarkType]
  }
  // Fallback heuristics
  if (tags['man_made'] === 'lighthouse') return 'light_major'
  if (tags['leisure'] === 'marina') return 'harbour'
  return null
}

export function parseOverpassSeamarks(response: OverpassResponse): Seamark[] {
  const seamarks: Seamark[] = []
  for (const el of response.elements) {
    const coords = extractCoords(el)
    if (!coords) continue
    const tags = el.tags ?? {}
    const category = resolveSeamarkCategory(tags)
    if (!category) continue

    const seamark: Seamark = {
      id: `osm-${el.id}`,
      name: tags.name ?? tags['seamark:name'] ?? formatCategoryName(category),
      coordinates: coords,
      category,
      tags,
    }

    // Lateral side
    const lateralCategory = tags['seamark:buoy_lateral:category'] ?? tags['seamark:beacon_lateral:category']
    if (lateralCategory === 'port') seamark.side = 'port'
    else if (lateralCategory === 'starboard') seamark.side = 'starboard'

    // Cardinal direction
    const cardinalCategory = tags['seamark:buoy_cardinal:category'] ?? tags['seamark:beacon_cardinal:category']
    if (cardinalCategory === 'north') seamark.cardinal = 'north'
    else if (cardinalCategory === 'south') seamark.cardinal = 'south'
    else if (cardinalCategory === 'east') seamark.cardinal = 'east'
    else if (cardinalCategory === 'west') seamark.cardinal = 'west'

    // Light character
    seamark.lightCharacter = tags['seamark:light:character'] ?? tags['seamark:light:1:character']
    seamark.lightColor = tags['seamark:light:colour'] ?? tags['seamark:light:1:colour']

    // Color and shape
    seamark.color = tags['seamark:buoy_lateral:colour']
      ?? tags['seamark:buoy_cardinal:colour']
      ?? tags['seamark:buoy_isolated_danger:colour']
      ?? tags['seamark:buoy_safe_water:colour']
      ?? tags['seamark:buoy_special_purpose:colour']
      ?? tags['seamark:colour']

    seamark.shape = tags['seamark:buoy_lateral:shape']
      ?? tags['seamark:buoy_cardinal:shape']
      ?? tags['seamark:shape']

    // CEVNI notice code
    seamark.noticeCode = tags['seamark:notice:function']

    seamarks.push(seamark)
  }
  return seamarks
}

function formatCategoryName(category: SeamarkCategory): string {
  const names: Record<SeamarkCategory, string> = {
    buoy_lateral: 'Lateral buoy',
    buoy_cardinal: 'Cardinal buoy',
    buoy_isolated_danger: 'Isolated danger',
    buoy_safe_water: 'Safe water',
    buoy_special_purpose: 'Special mark',
    light_major: 'Lighthouse',
    light_minor: 'Light',
    harbour: 'Port / Marina',
    beacon_lateral: 'Lateral beacon',
    beacon_cardinal: 'Cardinal beacon',
    notice: 'Notice',
  }
  return names[category]
}

// ─── Overpass queries ────────────────────────────────────────────────────────

export function buildLockQuery(bbox: [number, number, number, number]): string {
  const [minLat, minLng, maxLat, maxLng] = bbox
  return `[out:json][timeout:15];
(
  node["waterway"="lock_gate"](${minLat},${minLng},${maxLat},${maxLng});
  way["waterway"="lock"](${minLat},${minLng},${maxLat},${maxLng});
);
out center tags;`
}

/** @deprecated Use buildLockQuery instead */
export const buildBboxQuery = buildLockQuery

export function buildSeamarkQuery(bbox: [number, number, number, number]): string {
  const [minLat, minLng, maxLat, maxLng] = bbox
  return `[out:json][timeout:15];
(
  node["seamark:type"~"buoy_lateral|buoy_cardinal|buoy_isolated_danger|buoy_safe_water|buoy_special_purpose|beacon_lateral|beacon_cardinal|notice"](${minLat},${minLng},${maxLat},${maxLng});
  node["seamark:type"~"light_major|light_minor|harbour"](${minLat},${minLng},${maxLat},${maxLng});
  node["man_made"="lighthouse"](${minLat},${minLng},${maxLat},${maxLng});
  node["leisure"="marina"](${minLat},${minLng},${maxLat},${maxLng});
  way["seamark:type"="harbour"](${minLat},${minLng},${maxLat},${maxLng});
  way["leisure"="marina"](${minLat},${minLng},${maxLat},${maxLng});
);
out center tags;`
}

// ─── Fetch functions ─────────────────────────────────────────────────────────

async function fetchOverpass<T>(
  query: string,
  parser: (resp: OverpassResponse) => T[],
): Promise<T[] | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!response.ok) return null
    const json: OverpassResponse = await response.json()
    return parser(json)
  } catch {
    return null
  }
}

export async function fetchLocksFromOverpass(
  bounds: MapBounds,
): Promise<Lock[] | null> {
  const bbox = boundsToBbox(bounds)
  const query = buildLockQuery(bbox)
  return fetchOverpass(query, parseOverpassLocks)
}

export async function fetchSeamarksFromOverpass(
  bounds: MapBounds,
): Promise<Seamark[] | null> {
  const bbox = boundsToBbox(bounds)
  const query = buildSeamarkQuery(bbox)
  return fetchOverpass(query, parseOverpassSeamarks)
}

function boundsToBbox(bounds: MapBounds): [number, number, number, number] {
  return [
    bounds.getSouth(),
    bounds.getWest(),
    bounds.getNorth(),
    bounds.getEast(),
  ]
}

// Type declaration for maplibre bounds used in function signatures
interface MapBounds {
  getSouth(): number
  getWest(): number
  getNorth(): number
  getEast(): number
}
