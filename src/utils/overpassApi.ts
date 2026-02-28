import type { Lock, OverpassResponse, OverpassElement } from '@/types'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const TIMEOUT_MS = 15_000

/**
 * Parse an Overpass API JSON response into Lock objects.
 * Handles node, way, and relation elements.
 */
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

function extractCoords(el: OverpassElement): [number, number] | null {
  // Node elements have direct lat/lon
  if (el.type === 'node' && el.lat !== undefined && el.lon !== undefined) {
    return [el.lon, el.lat]
  }
  // Way/relation elements have a 'center' when queried with "out center"
  if (el.center) {
    return [el.center.lon, el.center.lat]
  }
  return null
}

/**
 * Build an Overpass QL query to find locks within a bounding box.
 * bbox = [minLat, minLng, maxLat, maxLng] (Overpass order)
 */
export function buildBboxQuery(bbox: [number, number, number, number]): string {
  const [minLat, minLng, maxLat, maxLng] = bbox
  return `[out:json][timeout:15];
(
  node["waterway"="lock_gate"](${minLat},${minLng},${maxLat},${maxLng});
  way["waterway"="lock"](${minLat},${minLng},${maxLat},${maxLng});
);
out center tags;`
}

/**
 * Fetch locks from the Overpass API for the given map bounds.
 * Returns null on error (caller should fall back to mock data).
 */
export async function fetchLocksFromOverpass(
  bounds: maplibregl.LngLatBounds,
): Promise<Lock[] | null> {
  // Dynamic import to avoid issues in test environments
  const bbox: [number, number, number, number] = [
    bounds.getSouth(),
    bounds.getWest(),
    bounds.getNorth(),
    bounds.getEast(),
  ]

  const query = buildBboxQuery(bbox)

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
    return parseOverpassLocks(json)
  } catch {
    return null
  }
}

// Type declaration for maplibre bounds used in function signature
declare namespace maplibregl {
  interface LngLatBounds {
    getSouth(): number
    getWest(): number
    getNorth(): number
    getEast(): number
  }
}
