import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { useAppStore } from '@/stores/useAppStore'
import type { RiverSign, SignCategory } from '@/types'

interface SignLayerProps {
  map: maplibregl.Map
}

const CATEGORY_COLORS: Record<SignCategory, { bg: string; border: string; text: string; icon: string }> = {
  prohibition: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '🚫' },
  obligation:  { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', icon: '🔵' },
  warning:     { bg: '#fef9c3', border: '#eab308', text: '#854d0e', icon: '⚠️' },
  information: { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: 'ℹ️' },
}

function createSignEl(sign: RiverSign): HTMLElement {
  const colors = CATEGORY_COLORS[sign.category]
  const el = document.createElement('div')
  el.style.cssText = `
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${colors.bg};
    border: 2px solid ${colors.border};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 11px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    transition: transform 0.15s ease;
  `
  el.title = sign.name
  el.textContent = colors.icon
  el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.15)' })
  el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })
  return el
}

export function SignLayer({ map }: SignLayerProps) {
  const signs = useAppStore((s) => s.signs)
  const markersRef = useRef<maplibregl.Marker[]>([])

  useEffect(() => {
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    signs.forEach((sign: RiverSign) => {
      const colors = CATEGORY_COLORS[sign.category]
      const el = createSignEl(sign)

      const popup = new maplibregl.Popup({
        offset: 16,
        closeButton: false,
        className: 'reever-popup',
      }).setHTML(`
        <div style="padding:6px 10px;min-width:160px;">
          <div style="font-weight:600;font-size:13px;color:#1e293b;margin-bottom:2px;">
            ${sign.name}
          </div>
          ${sign.code ? `<div style="font-size:10px;color:#94a3b8;margin-bottom:4px;">CEVNI ${sign.code}</div>` : ''}
          <div style="font-size:11px;color:${colors.text};background:${colors.bg};border-radius:4px;padding:3px 6px;border:1px solid ${colors.border};">
            ${sign.description}
          </div>
        </div>
      `)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(sign.coordinates)
        .setPopup(popup)
        .addTo(map)

      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
    }
  }, [map, signs])

  return null
}
