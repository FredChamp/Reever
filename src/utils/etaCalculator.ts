import type { ETAResult, SpeedUnit } from '@/types'

/** 1 nautical mile = 1.852 km */
export const KM_PER_NM = 1.852

export interface ETAInput {
  distanceKm: number
  boatSpeedKmh: number
  lockCount: number
  lockTransitMin: number
}

/**
 * Format a duration in minutes to a human-readable string.
 * Examples: 0 → "0 min", 45 → "45 min", 90 → "1 h 30 min"
 */
export function formatDuration(totalMin: number): string {
  const rounded = Math.round(totalMin)
  if (rounded === 0) return '0 min'
  if (rounded < 60) return `${rounded} min`
  const hours = Math.floor(rounded / 60)
  const minutes = rounded % 60
  return `${hours} h ${minutes} min`
}

/**
 * Convert km to nautical miles.
 */
export function kmToNm(km: number): number {
  return km / KM_PER_NM
}

/**
 * Convert knots to km/h.
 */
export function knotsToKmh(knots: number): number {
  return knots * KM_PER_NM
}

/**
 * Convert km/h to knots.
 */
export function kmhToKnots(kmh: number): number {
  return kmh / KM_PER_NM
}

/**
 * Format speed with the appropriate unit.
 */
export function formatSpeed(kmh: number, unit: SpeedUnit): string {
  if (unit === 'knots') {
    return `${kmhToKnots(kmh).toFixed(1)} kn`
  }
  return `${kmh} km/h`
}

/**
 * Calculate ETA for a boat trip.
 *
 * Formula:
 *   waterTimeMin = (distanceKm / boatSpeedKmh) * 60
 *   lockTimeMin  = lockCount * lockTransitMin
 *   totalTimeMin = waterTimeMin + lockTimeMin
 */
export function calculateETA(input: ETAInput): ETAResult {
  const { distanceKm, boatSpeedKmh, lockCount, lockTransitMin } = input

  const waterTimeMin = boatSpeedKmh > 0 ? (distanceKm / boatSpeedKmh) * 60 : 0
  const lockTimeMin = lockCount * lockTransitMin
  const totalTimeMin = waterTimeMin + lockTimeMin

  return {
    distanceKm,
    distanceNm: Math.round(kmToNm(distanceKm) * 10) / 10,
    lockCount,
    waterTimeMin,
    lockTimeMin,
    totalTimeMin,
    totalFormatted: formatDuration(totalTimeMin),
  }
}
