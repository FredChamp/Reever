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

  let bg = '#6366f1'
  let glow = 'rgba(99, 102, 241, 0.4)'
  if (isStart) { bg = '#10b981'; glow = 'rgba(16, 185, 129, 0.4)' }
  if (isEnd) { bg = '#ef4444'; glow = 'rgba(239, 68, 68, 0.4)' }

  const el = document.createElement('div')
  el.style.cssText = `
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${bg};
    border: 3px solid rgba(255,255,255,0.9);
    box-shadow: 0 0 12px ${glow}, 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
    cursor: grab;
    font-family: system-ui, sans-serif;
    transition: box-shadow 0.15s ease;
  `
  el.textContent = isStart ? 'A' : isEnd ? 'B' : String(index + 1)
  el.addEventListener('mouseenter', () => { el.style.boxShadow = `0 0 20px ${glow}, 0 4px 12px rgba(0,0,0,0.4)` })
  el.addEventListener('mouseleave', () => { el.style.boxShadow = `0 0 12px ${glow}, 0 2px 8px rgba(0,0,0,0.3)` })
  return el
}

export function WaypointLayer({ map }: WaypointLayerProps) {
  const waypoints = useAppStore((s) => s.waypoints)
  const updateWaypointPosition = useAppStore((s) => s.updateWaypointPosition)
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())

  useEffect(() => {
    const currentIds = new Set(waypoints.map((w) => w.id))
    const existingIds = new Set(markersRef.current.keys())

    for (const id of existingIds) {
      if (!currentIds.has(id)) {
        markersRef.current.get(id)?.remove()
        markersRef.current.delete(id)
      }
    }

    waypoints.forEach((wp: Waypoint, index: number) => {
      const el = createWaypointEl(index, waypoints.length)

      if (markersRef.current.has(wp.id)) {
        const marker = markersRef.current.get(wp.id)!
        marker.setLngLat(wp.lngLat)
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

  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
    }
  }, [])

  return null
}
