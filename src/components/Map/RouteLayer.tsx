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

    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: emptyFeature,
      })

      // Outer glow — cyan for dark theme
      map.addLayer({
        id: LAYER_GLOW_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#22d3ee',
          'line-width': 12,
          'line-opacity': 0.3,
          'line-blur': 6,
        },
      })

      // Main route line — bright cyan
      map.addLayer({
        id: LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#06b6d4',
          'line-width': 4,
          'line-opacity': 0.95,
        },
      })
    }

    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined
    if (source) {
      source.setData(route ?? emptyFeature)
    }
  }, [map, route])

  return null
}
