import { useEffect, useRef, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useAppStore } from '@/stores/useAppStore'
import { useMapFeatures } from '@/hooks/useMapFeatures'
import { RouteLayer } from './RouteLayer'
import { LockLayer } from './LockLayer'
import { SignLayer } from './SignLayer'
import { WaypointLayer } from './WaypointLayer'

// OpenFreeMap — free OSM-based vector tiles, no API key needed
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

const DEFAULT_CENTER: [number, number] = [2.35, 46.8]
const DEFAULT_ZOOM = 5.5

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const addWaypoint = useAppStore((s) => s.addWaypoint)

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

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: {
        customAttribution:
          '© <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      },
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true,
      }),
      'top-right',
    )
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right')

    map.on('click', handleMapClick)

    // Change cursor to crosshair to signal "click to add waypoint"
    map.on('mouseenter', () => { map.getCanvas().style.cursor = 'crosshair' })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [handleMapClick])

  return (
    <div className="relative flex-1 h-full" data-testid="map-container">
      <div ref={containerRef} className="absolute inset-0" />
      {mapRef.current && (
        <>
          <RouteLayer map={mapRef.current} />
          <LockLayer map={mapRef.current} />
          <SignLayer map={mapRef.current} />
          <WaypointLayer map={mapRef.current} />
        </>
      )}
    </div>
  )
}
