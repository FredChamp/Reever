import { describe, it, expect } from 'vitest'
import { calculateETA, formatDuration } from '@/utils/etaCalculator'

describe('calculateETA', () => {
  it('computes correct travel time for known distance and speed', () => {
    // 80 km at 8 km/h = 600 min travel; 0 locks
    const result = calculateETA({ distanceKm: 80, boatSpeedKmh: 8, lockCount: 0, lockTransitMin: 30 })
    expect(result.waterTimeMin).toBe(600)
    expect(result.lockTimeMin).toBe(0)
    expect(result.totalTimeMin).toBe(600)
    expect(result.distanceKm).toBeCloseTo(80, 1)
  })

  it('adds lock time correctly', () => {
    // 40 km at 8 km/h = 300 min; 3 locks × 30 min = 90 min; total = 390
    const result = calculateETA({ distanceKm: 40, boatSpeedKmh: 8, lockCount: 3, lockTransitMin: 30 })
    expect(result.waterTimeMin).toBe(300)
    expect(result.lockTimeMin).toBe(90)
    expect(result.totalTimeMin).toBe(390)
    expect(result.lockCount).toBe(3)
  })

  it('uses custom boat speed', () => {
    // 20 km at 10 km/h = 120 min travel; 0 locks
    const result = calculateETA({ distanceKm: 20, boatSpeedKmh: 10, lockCount: 0, lockTransitMin: 30 })
    expect(result.waterTimeMin).toBe(120)
    expect(result.totalTimeMin).toBe(120)
  })

  it('uses custom lock transit time', () => {
    // 0 km; 2 locks × 45 min = 90 min
    const result = calculateETA({ distanceKm: 0, boatSpeedKmh: 8, lockCount: 2, lockTransitMin: 45 })
    expect(result.waterTimeMin).toBe(0)
    expect(result.lockTimeMin).toBe(90)
    expect(result.totalTimeMin).toBe(90)
  })

  it('returns zero for zero distance and zero locks', () => {
    const result = calculateETA({ distanceKm: 0, boatSpeedKmh: 8, lockCount: 0, lockTransitMin: 30 })
    expect(result.totalTimeMin).toBe(0)
    expect(result.totalFormatted).toBe('0 min')
  })

  it('handles very long route (>500 km)', () => {
    // 500 km at 8 km/h = 3750 min ≈ 62.5 h; 10 locks × 30 = 300 min
    const result = calculateETA({ distanceKm: 500, boatSpeedKmh: 8, lockCount: 10, lockTransitMin: 30 })
    expect(result.totalTimeMin).toBe(4050)
    expect(result.totalFormatted).toBe('67 h 30 min')
  })

  it('formats 90 minutes as "1 h 30 min"', () => {
    const result = calculateETA({ distanceKm: 0, boatSpeedKmh: 8, lockCount: 3, lockTransitMin: 30 })
    expect(result.totalFormatted).toBe('1 h 30 min')
  })
})

describe('formatDuration', () => {
  it('formats 0 minutes', () => {
    expect(formatDuration(0)).toBe('0 min')
  })

  it('formats minutes only (< 60)', () => {
    expect(formatDuration(45)).toBe('45 min')
  })

  it('formats exactly 60 minutes', () => {
    expect(formatDuration(60)).toBe('1 h 0 min')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1 h 30 min')
    expect(formatDuration(125)).toBe('2 h 5 min')
  })

  it('formats very long duration', () => {
    expect(formatDuration(1500)).toBe('25 h 0 min')
  })
})
