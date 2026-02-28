import type { ETAResult } from '@/types'

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
 * Calculate ETA for a river boat trip.
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
    lockCount,
    waterTimeMin,
    lockTimeMin,
    totalTimeMin,
    totalFormatted: formatDuration(totalTimeMin),
  }
}
