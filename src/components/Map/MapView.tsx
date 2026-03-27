import { useEffect, useRef, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useAppStore } from '@/stores/useAppStore'
import { useMapFeatures } from '@/hooks/useMapFeatures'
import { RouteLayer } from './RouteLayer'
import { LockLayer } from './LockLayer'
import { SeamarkLayer } from './SeamarkLayer'
import { WaypointLayer } from './WaypointLayer'

// OpenFreeMap — free OSM-based vector tiles, no API key needed
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

// OpenSeaMap raster tile overlay
const OPENSEAMAP_TILES = 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'

// Terrain DEM tiles (Terrain-RGB from AWS/MapTiler open)
const TERRAIN_SOURCE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'

const DEFAULT_CENTER: [number, number] = [2.35, 46.8]
const DEFAULT_ZOOM = 5.5
const DEFAULT_PITCH_3D = 50
const DEFAULT_PITCH_2D = 0

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const addWaypoint = useAppStore((s) => s.addWaypoint)
  const viewMode = useAppStore((s) => s.viewMode)
  const layers = useAppStore((s) => s.layers)

  useMapFeatures(mapRef as React.RefObject<maplibregl.Map | null>)

  const handleMapClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat
      addWaypoint({
        id: `wp-${Date.now()}`,
        lngLat: [lng, lat],
      })
    },
    [addWaypoint],
  )

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH_3D,
      bearing: 0,
      maxPitch: 70,
      attributionControl: {
        customAttribution:
          '© <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://www.openseamap.org">OpenSeaMap</a>',
      },
    })

    // Expose for debugging
    ;(window as unknown as Record<string, unknown>).__reeverMap = map

    // Navigation controls
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true,
      }),
      'top-right',
    )
    map.addControl(new maplibregl.ScaleControl({ unit: 'nautical' }), 'bottom-right')

    map.on('click', handleMapClick)
    map.getCanvas().style.cursor = 'crosshair'

    map.on('load', () => {
      // Add 3D terrain
      map.addSource('terrain-dem', {
        type: 'raster-dem',
        tiles: [TERRAIN_SOURCE],
        tileSize: 256,
        encoding: 'terrarium',
      })
      map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 })

      // Add OpenSeaMap overlay
      map.addSource('openseamap', {
        type: 'raster',
        tiles: [OPENSEAMAP_TILES],
        tileSize: 256,
        attribution: '© <a href="https://www.openseamap.org">OpenSeaMap</a>',
      })
      map.addLayer({
        id: 'openseamap-layer',
        type: 'raster',
        source: 'openseamap',
        paint: {
          'raster-opacity': 0.7,
        },
      })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [handleMapClick])

  // Toggle 2D/3D view mode
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const pitch = viewMode === '3d' ? DEFAULT_PITCH_3D : DEFAULT_PITCH_2D
    map.easeTo({ pitch, duration: 500 })
    if (viewMode === '3d') {
      const source = map.getSource('terrain-dem')
      if (source) {
        map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 })
      }
    } else {
      map.setTerrain(null as unknown as null)
    }
  }, [viewMode])

  // Toggle OpenSeaMap overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const layer = map.getLayer('openseamap-layer')
    if (layer) {
      map.setLayoutProperty(
        'openseamap-layer',
        'visibility',
        layers.seaOverlay ? 'visible' : 'none',
      )
    }
  }, [layers.seaOverlay])

  return (
    <div className="relative flex-1 h-full" data-testid="map-container">
      <div ref={containerRef} className="w-full h-full" />
      {mapRef.current && (
        <>
          <RouteLayer map={mapRef.current} />
          <LockLayer map={mapRef.current} />
          <SeamarkLayer map={mapRef.current} />
          <WaypointLayer map={mapRef.current} />
        </>
      )}
    </div>
  )
}
