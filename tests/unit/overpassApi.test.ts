import { describe, it, expect } from 'vitest'
import { parseOverpassLocks } from '@/utils/overpassApi'
import type { OverpassResponse } from '@/types'

describe('parseOverpassLocks', () => {
  it('parses node elements into Lock objects', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'node',
          id: 12345,
          lat: 48.8566,
          lon: 2.3522,
          tags: { name: 'Écluse de Test', 'ref': 'SN-01', operator: 'VNF' },
        },
      ],
    }
    const locks = parseOverpassLocks(response)
    expect(locks).toHaveLength(1)
    expect(locks[0].id).toBe('osm-12345')
    expect(locks[0].name).toBe('Écluse de Test')
    expect(locks[0].coordinates).toEqual([2.3522, 48.8566])
    expect(locks[0].operator).toBe('VNF')
  })

  it('uses "Unnamed lock" when no name tag exists', () => {
    const response: OverpassResponse = {
      elements: [
        { type: 'node', id: 99, lat: 45.0, lon: 5.0, tags: {} },
      ],
    }
    const locks = parseOverpassLocks(response)
    expect(locks[0].name).toBe('Unnamed lock')
  })

  it('uses center for way elements', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'way',
          id: 55555,
          center: { lat: 47.5, lon: 3.5 },
          tags: { name: 'Canal Lock' },
        },
      ],
    }
    const locks = parseOverpassLocks(response)
    expect(locks[0].coordinates).toEqual([3.5, 47.5])
  })

  it('skips elements without coordinates', () => {
    const response: OverpassResponse = {
      elements: [
        { type: 'way', id: 1, tags: { name: 'Bad Lock' } }, // no lat/lon and no center
      ],
    }
    const locks = parseOverpassLocks(response)
    expect(locks).toHaveLength(0)
  })

  it('returns empty array for empty response', () => {
    const response: OverpassResponse = { elements: [] }
    expect(parseOverpassLocks(response)).toHaveLength(0)
  })
})
