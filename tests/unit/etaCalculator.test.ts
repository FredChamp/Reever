import { describe, it, expect } from 'vitest'
import { calculateETA, formatDuration, kmToNm, kmhToKnots, knotsToKmh, KM_PER_NM } from '@/utils/etaCalculator'

describe('calculateETA', () => {
  it('computes correct travel time for known distance and speed', () => {
    const result = calculateETA({ distanceKm: 80, boatSpeedKmh: 8, lockCount: 0, lockTransitMin: 30 })
    expect(result.waterTimeMin).toBe(600)
    expect(result.lockTimeMin).toBe(0)
    expect(result.totalTimeMin).toBe(600)
    expect(result.distanceKm).toBeCloseTo(80, 1)
  })

  it('adds lock time correctly', () => {
    const result = calculateETA({ distanceKm: 40, boatSpeedKmh: 8, lockCount: 3, lockTransitMin: 30 })
    expect(result.waterTimeMin).toBe(300)
    expect(result.lockTimeMin).toBe(90)
    expect(result.totalTimeMin).toBe(390)
    expect(result.lockCount).toBe(3)
  })

  it('uses custom boat speed', () => {
    const result = calculateETA({ distanceKm: 20, boatSpeedKmh: 10, lockCount: 0, lockTransitMin: 30 })
    expect(result.waterTimeMin).toBe(120)
    expect(result.totalTimeMin).toBe(120)
  })

  it('uses custom lock transit time', () => {
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
    const result = calculateETA({ distanceKm: 500, boatSpeedKmh: 8, lockCount: 10, lockTransitMin: 30 })
    expect(result.totalTimeMin).toBe(4050)
    expect(result.totalFormatted).toBe('67 h 30 min')
  })

  it('formats 90 minutes as "1 h 30 min"', () => {
    const result = calculateETA({ distanceKm: 0, boatSpeedKmh: 8, lockCount: 3, lockTransitMin: 30 })
    expect(result.totalFormatted).toBe('1 h 30 min')
  })

  it('includes distanceNm in result', () => {
    const result = calculateETA({ distanceKm: 18.52, boatSpeedKmh: 8, lockCount: 0, lockTransitMin: 30 })
    expect(result.distanceNm).toBeCloseTo(10, 0)
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

describe('unit conversions', () => {
  it('converts km to nautical miles', () => {
    expect(kmToNm(1.852)).toBeCloseTo(1, 2)
    expect(kmToNm(0)).toBe(0)
  })

  it('converts knots to km/h', () => {
    expect(knotsToKmh(1)).toBeCloseTo(KM_PER_NM, 3)
    expect(knotsToKmh(10)).toBeCloseTo(18.52, 1)
  })

  it('converts km/h to knots', () => {
    expect(kmhToKnots(KM_PER_NM)).toBeCloseTo(1, 3)
    expect(kmhToKnots(18.52)).toBeCloseTo(10, 1)
  })

  it('round-trips knots → km/h → knots', () => {
    const knots = 5
    expect(kmhToKnots(knotsToKmh(knots))).toBeCloseTo(knots, 5)
  })
})
