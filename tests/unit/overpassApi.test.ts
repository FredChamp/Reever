import { describe, it, expect } from 'vitest'
import { parseOverpassLocks, parseOverpassSeamarks, buildLockQuery, buildSeamarkQuery } from '@/utils/overpassApi'
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
        { type: 'way', id: 1, tags: { name: 'Bad Lock' } },
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

describe('parseOverpassSeamarks', () => {
  it('parses a lateral buoy with port side', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'node',
          id: 100,
          lat: 48.0,
          lon: -3.0,
          tags: {
            'seamark:type': 'buoy_lateral',
            'seamark:buoy_lateral:category': 'port',
            'seamark:buoy_lateral:colour': 'red',
            'seamark:buoy_lateral:shape': 'can',
            name: 'Port Marker A',
          },
        },
      ],
    }
    const seamarks = parseOverpassSeamarks(response)
    expect(seamarks).toHaveLength(1)
    expect(seamarks[0].category).toBe('buoy_lateral')
    expect(seamarks[0].side).toBe('port')
    expect(seamarks[0].color).toBe('red')
    expect(seamarks[0].shape).toBe('can')
    expect(seamarks[0].name).toBe('Port Marker A')
  })

  it('parses a cardinal buoy with north direction', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'node',
          id: 200,
          lat: 47.5,
          lon: -2.5,
          tags: {
            'seamark:type': 'buoy_cardinal',
            'seamark:buoy_cardinal:category': 'north',
            'seamark:buoy_cardinal:colour': 'black;yellow',
          },
        },
      ],
    }
    const seamarks = parseOverpassSeamarks(response)
    expect(seamarks).toHaveLength(1)
    expect(seamarks[0].category).toBe('buoy_cardinal')
    expect(seamarks[0].cardinal).toBe('north')
  })

  it('parses a lighthouse from man_made=lighthouse', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'node',
          id: 300,
          lat: 48.5,
          lon: -4.0,
          tags: {
            'man_made': 'lighthouse',
            name: 'Phare de Test',
            'seamark:light:character': 'Fl(3) 15s',
            'seamark:light:colour': 'white',
          },
        },
      ],
    }
    const seamarks = parseOverpassSeamarks(response)
    expect(seamarks).toHaveLength(1)
    expect(seamarks[0].category).toBe('light_major')
    expect(seamarks[0].lightCharacter).toBe('Fl(3) 15s')
    expect(seamarks[0].lightColor).toBe('white')
    expect(seamarks[0].name).toBe('Phare de Test')
  })

  it('parses a harbour/marina', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'node',
          id: 400,
          lat: 43.3,
          lon: 5.3,
          tags: {
            'leisure': 'marina',
            name: 'Port de Test',
          },
        },
      ],
    }
    const seamarks = parseOverpassSeamarks(response)
    expect(seamarks).toHaveLength(1)
    expect(seamarks[0].category).toBe('harbour')
    expect(seamarks[0].name).toBe('Port de Test')
  })

  it('skips elements without valid seamark category', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'node',
          id: 500,
          lat: 45.0,
          lon: 5.0,
          tags: { 'amenity': 'restaurant' },
        },
      ],
    }
    const seamarks = parseOverpassSeamarks(response)
    expect(seamarks).toHaveLength(0)
  })

  it('uses default name from category when no name tag', () => {
    const response: OverpassResponse = {
      elements: [
        {
          type: 'node',
          id: 600,
          lat: 48.0,
          lon: -3.0,
          tags: { 'seamark:type': 'buoy_safe_water' },
        },
      ],
    }
    const seamarks = parseOverpassSeamarks(response)
    expect(seamarks[0].name).toBe('Safe water')
  })

  it('returns empty array for empty response', () => {
    const response: OverpassResponse = { elements: [] }
    expect(parseOverpassSeamarks(response)).toHaveLength(0)
  })
})

describe('buildLockQuery', () => {
  it('generates valid Overpass QL for locks', () => {
    const query = buildLockQuery([43.0, 5.0, 44.0, 6.0])
    expect(query).toContain('waterway')
    expect(query).toContain('lock_gate')
    expect(query).toContain('43')
    expect(query).toContain('out center tags')
  })
})

describe('buildSeamarkQuery', () => {
  it('generates valid Overpass QL for seamarks', () => {
    const query = buildSeamarkQuery([43.0, 5.0, 44.0, 6.0])
    expect(query).toContain('seamark:type')
    expect(query).toContain('buoy_lateral')
    expect(query).toContain('buoy_cardinal')
    expect(query).toContain('lighthouse')
    expect(query).toContain('marina')
    expect(query).toContain('light_major')
    expect(query).toContain('harbour')
  })
})
