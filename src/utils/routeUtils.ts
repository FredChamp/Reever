import * as turf from '@turf/turf'
import type { Waypoint, Lock } from '@/types'

/** Buffer radius in km used to detect locks along a route */
const LOCK_BUFFER_KM = 0.1

/**
 * Build a GeoJSON LineString feature from an ordered list of waypoints.
 * Returns null if fewer than 2 waypoints are provided.
 */
export function buildRoute(
  waypoints: Waypoint[],
): GeoJSON.Feature<GeoJSON.LineString> | null {
  if (waypoints.length < 2) return null

  const coordinates = waypoints.map((w) => w.lngLat as [number, number])
  const line = turf.lineString(coordinates)
  const distanceKm = turf.length(line, { units: 'kilometers' })

  return {
    ...line,
    properties: {
      distanceKm: Math.round(distanceKm * 10) / 10,
    },
  }
}

/**
 * Count how many locks fall within LOCK_BUFFER_KM of the route.
 */
export function countLocksOnRoute(
  route: GeoJSON.Feature<GeoJSON.LineString>,
  locks: Lock[],
): number {
  if (locks.length === 0) return 0

  const buffer = turf.buffer(route, LOCK_BUFFER_KM, { units: 'kilometers' })
  if (!buffer) return 0

  return locks.filter((lock) => {
    const point = turf.point(lock.coordinates)
    return turf.booleanPointInPolygon(point, buffer)
  }).length
}

/**
 * Get all locks that fall within LOCK_BUFFER_KM of the route.
 */
export function getLocksOnRoute(
  route: GeoJSON.Feature<GeoJSON.LineString>,
  locks: Lock[],
): Lock[] {
  if (locks.length === 0) return []

  const buffer = turf.buffer(route, LOCK_BUFFER_KM, { units: 'kilometers' })
  if (!buffer) return []

  return locks.filter((lock) => {
    const point = turf.point(lock.coordinates)
    return turf.booleanPointInPolygon(point, buffer)
  })
}
