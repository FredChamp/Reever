import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { useAppStore } from '@/stores/useAppStore'
import type { Lock } from '@/types'

interface LockLayerProps {
  map: maplibregl.Map
}

/** Create an SVG lock/anchor marker element */
function createLockEl(onRoute: boolean): HTMLElement {
  const el = document.createElement('div')
  el.className = 'lock-marker'
  el.style.cssText = `
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${onRoute ? '#f59e0b' : '#fde68a'};
    border: 2px solid ${onRoute ? '#d97706' : '#f59e0b'};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    transition: transform 0.15s ease;
  `
  el.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${onRoute ? '#78350f' : '#92400e'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `
  el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.15)' })
  el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
  return el
}

export function LockLayer({ map }: LockLayerProps) {
  const allLocks = useAppStore((s) => s.allLocks)
  const locksOnRoute = useAppStore((s) => s.locksOnRoute)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const popupsRef = useRef<maplibregl.Popup[]>([])

  useEffect(() => {
    // Remove old markers
    markersRef.current.forEach((m) => m.remove())
    popupsRef.current.forEach((p) => p.remove())
    markersRef.current = []
    popupsRef.current = []

    const onRouteIds = new Set(locksOnRoute.map((l) => l.id))

    allLocks.forEach((lock: Lock) => {
      const onRoute = onRouteIds.has(lock.id)
      const el = createLockEl(onRoute)

      const popup = new maplibregl.Popup({
        offset: 18,
        closeButton: false,
        className: 'reever-popup',
      }).setHTML(`
        <div style="padding:6px 10px; min-width:160px;">
          <div style="font-weight:600;font-size:13px;color:#1e293b;margin-bottom:4px;">
            ${lock.name}
          </div>
          ${lock.operator ? `<div style="font-size:11px;color:#64748b;">Operator: ${lock.operator}</div>` : ''}
          ${lock.lockRef ? `<div style="font-size:11px;color:#64748b;">Ref: ${lock.lockRef}</div>` : ''}
          ${lock.openingHours ? `<div style="font-size:11px;color:#64748b;">Hours: ${lock.openingHours}</div>` : ''}
          ${onRoute ? `<div style="font-size:11px;color:#d97706;margin-top:4px;font-weight:600;">⚓ On your route</div>` : ''}
        </div>
      `)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lock.coordinates)
        .setPopup(popup)
        .addTo(map)

      markersRef.current.push(marker)
      popupsRef.current.push(popup)
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
      popupsRef.current.forEach((p) => p.remove())
    }
  }, [map, allLocks, locksOnRoute])

  return null
}
