import { useEffect } from 'react'
import type maplibregl from 'maplibre-gl'
import { useAppStore } from '@/stores/useAppStore'

const SOURCE_ID = 'route-source'
const LAYER_ID = 'route-line'
const LAYER_GLOW_ID = 'route-line-glow'

interface RouteLayerProps {
  map: maplibregl.Map
}

export function RouteLayer({ map }: RouteLayerProps) {
  const route = useAppStore((s) => s.route)

  useEffect(() => {
    if (!map.isStyleLoaded()) return

    const emptyFeature: GeoJSON.Feature<GeoJSON.LineString> = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [] },
      properties: {},
    }

    // Add source if not present
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: emptyFeature,
      })

      // Glow / shadow layer for visual depth
      map.addLayer({
        id: LAYER_GLOW_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#93c5fd',
          'line-width': 10,
          'line-opacity': 0.5,
          'line-blur': 4,
        },
      })

      // Main route line
      map.addLayer({
        id: LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#2563eb',
          'line-width': 4,
          'line-opacity': 0.95,
        },
      })
    }

    // Update source data
    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined
    if (source) {
      source.setData(route ?? emptyFeature)
    }
  }, [map, route])

  return null
}
