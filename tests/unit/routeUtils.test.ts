import { describe, it, expect } from 'vitest'
import { buildRoute, countLocksOnRoute } from '@/utils/routeUtils'
import type { Lock, Waypoint } from '@/types'

// Helper to make waypoints
const wp = (id: string, lng: number, lat: number): Waypoint => ({
  id,
  lngLat: [lng, lat],
})

describe('buildRoute', () => {
  it('returns null for empty waypoints', () => {
    expect(buildRoute([])).toBeNull()
  })

  it('returns null for single waypoint', () => {
    expect(buildRoute([wp('a', 2.35, 48.85)])).toBeNull()
  })

  it('returns a GeoJSON LineString for two waypoints', () => {
    const route = buildRoute([wp('a', 2.35, 48.85), wp('b', 2.40, 48.90)])
    expect(route).not.toBeNull()
    expect(route!.type).toBe('Feature')
    expect(route!.geometry.type).toBe('LineString')
    expect(route!.geometry.coordinates).toHaveLength(2)
  })

  it('puts coordinates in waypoint order', () => {
    const w1 = wp('a', 1.0, 45.0)
    const w2 = wp('b', 2.0, 46.0)
    const w3 = wp('c', 3.0, 47.0)
    const route = buildRoute([w1, w2, w3])
    expect(route!.geometry.coordinates[0]).toEqual([1.0, 45.0])
    expect(route!.geometry.coordinates[1]).toEqual([2.0, 46.0])
    expect(route!.geometry.coordinates[2]).toEqual([3.0, 47.0])
  })

  it('calculates a reasonable distance for Paris-to-Rouen corridor', () => {
    // Paris (2.35, 48.85) to Rouen (1.10, 49.44) — approx 110-130 km straight line
    const route = buildRoute([wp('a', 2.35, 48.85), wp('b', 1.10, 49.44)])
    expect(route).not.toBeNull()
    expect(route!.properties!.distanceKm).toBeGreaterThan(100)
    expect(route!.properties!.distanceKm).toBeLessThan(150)
  })
})

describe('countLocksOnRoute', () => {
  it('returns 0 when there are no locks', () => {
    const route = buildRoute([wp('a', 2.35, 48.85), wp('b', 2.40, 48.90)])!
    expect(countLocksOnRoute(route, [])).toBe(0)
  })

  it('counts a lock that is exactly on the route line', () => {
    // Route from (2.35, 48.85) to (2.45, 48.85) — a horizontal line
    // Lock at (2.40, 48.85) is on the line — within 100 m buffer
    const route = buildRoute([wp('a', 2.35, 48.85), wp('b', 2.45, 48.85)])!
    const lock: Lock = {
      id: 'l1',
      name: 'Test Lock',
      coordinates: [2.40, 48.85],
    }
    expect(countLocksOnRoute(route, [lock])).toBe(1)
  })

  it('does not count a lock far from the route', () => {
    // Route Paris to Rouen
    const route = buildRoute([wp('a', 2.35, 48.85), wp('b', 1.10, 49.44)])!
    const lock: Lock = {
      id: 'l1',
      name: 'Distant Lock',
      coordinates: [5.0, 43.0], // Marseille area — far away
    }
    expect(countLocksOnRoute(route, [lock])).toBe(0)
  })

  it('counts multiple locks near the route', () => {
    // Route from Paris area along a line
    // Segment a→b: [2.35,48.85] → [2.10,48.86] — midpoint [2.225,48.855]
    // Segment b→c: [2.10,48.86] → [1.90,49.00] — midpoint [2.00,48.93]
    const route = buildRoute([
      wp('a', 2.35, 48.85),
      wp('b', 2.10, 48.86),
      wp('c', 1.90, 49.00),
    ])!
    const locks: Lock[] = [
      // Lock at the midpoint of segment a→b — definitely within 100m buffer
      { id: 'l1', name: 'Lock A', coordinates: [2.225, 48.855] },
      // Lock at the midpoint of segment b→c — definitely within 100m buffer
      { id: 'l2', name: 'Lock B', coordinates: [2.00, 48.93] },
      { id: 'l3', name: 'Lock Far', coordinates: [5.0, 43.0] }, // should not count
    ]
    expect(countLocksOnRoute(route, locks)).toBe(2)
  })
})
