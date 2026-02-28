import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { useAppStore } from '@/stores/useAppStore'
import type { Waypoint } from '@/types'

interface WaypointLayerProps {
  map: maplibregl.Map
}

function createWaypointEl(index: number, total: number): HTMLElement {
  const isStart = index === 0
  const isEnd = index === total - 1

  let bg = '#6366f1' // mid-point: indigo
  if (isStart) bg = '#10b981'  // start: emerald green
  if (isEnd) bg = '#ef4444'    // end: red

  const el = document.createElement('div')
  el.style.cssText = `
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${bg};
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: white;
    cursor: grab;
    font-family: system-ui, sans-serif;
  `
  el.textContent = isStart ? 'A' : isEnd ? 'B' : String(index + 1)
  return el
}

export function WaypointLayer({ map }: WaypointLayerProps) {
  const waypoints = useAppStore((s) => s.waypoints)
  const updateWaypointPosition = useAppStore((s) => s.updateWaypointPosition)
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())

  useEffect(() => {
    const currentIds = new Set(waypoints.map((w) => w.id))
    const existingIds = new Set(markersRef.current.keys())

    // Remove markers for deleted waypoints
    for (const id of existingIds) {
      if (!currentIds.has(id)) {
        markersRef.current.get(id)?.remove()
        markersRef.current.delete(id)
      }
    }

    // Add/update markers
    waypoints.forEach((wp: Waypoint, index: number) => {
      const el = createWaypointEl(index, waypoints.length)

      if (markersRef.current.has(wp.id)) {
        // Update position and element
        const marker = markersRef.current.get(wp.id)!
        marker.setLngLat(wp.lngLat)
        // Replace element by removing and re-adding
        marker.remove()
        markersRef.current.delete(wp.id)
      }

      const marker = new maplibregl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat(wp.lngLat)
        .addTo(map)

      marker.on('dragend', () => {
        const { lng, lat } = marker.getLngLat()
        updateWaypointPosition(wp.id, [lng, lat])
      })

      markersRef.current.set(wp.id, marker)
    })
  }, [map, waypoints, updateWaypointPosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
    }
  }, [])

  return null
}
