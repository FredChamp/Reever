import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { useAppStore } from '@/stores/useAppStore'
import type { Seamark, SeamarkCategory, LayerVisibility } from '@/types'

interface SeamarkLayerProps {
  map: maplibregl.Map
}

// ─── SVG icon generators for maritime signs ──────────────────────────────────

function lateralPortSvg(): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="12" height="16" rx="2" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
    <rect x="7" y="6" width="6" height="2" rx="1" fill="#fca5a5"/>
  </svg>`
}

function lateralStarboardSvg(): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <polygon points="10,2 18,18 2,18" fill="#16a34a" stroke="#166534" stroke-width="1.5"/>
    <circle cx="10" cy="12" r="2" fill="#86efac"/>
  </svg>`
}

function cardinalSvg(direction: string): string {
  const colors: Record<string, [string, string]> = {
    north: ['#000', '#eab308'],
    south: ['#eab308', '#000'],
    east:  ['#000', '#eab308'],
    west:  ['#eab308', '#000'],
  }
  const [top, bottom] = colors[direction] ?? ['#eab308', '#000']
  return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2" width="8" height="8" fill="${top}" stroke="#78350f" stroke-width="1"/>
    <rect x="6" y="10" width="8" height="8" fill="${bottom}" stroke="#78350f" stroke-width="1"/>
    <circle cx="10" cy="10" r="2" fill="#fff" stroke="#78350f" stroke-width="1"/>
  </svg>`
}

function isolatedDangerSvg(): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="10" height="16" rx="2" fill="#000" stroke="#dc2626" stroke-width="1.5"/>
    <rect x="5" y="6" width="10" height="3" fill="#dc2626"/>
    <rect x="5" y="13" width="10" height="3" fill="#dc2626"/>
  </svg>`
}

function safeWaterSvg(): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" fill="#fff" stroke="#dc2626" stroke-width="1.5"/>
    <line x1="10" y1="2" x2="10" y2="18" stroke="#dc2626" stroke-width="2"/>
  </svg>`
}

function specialMarkSvg(): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2 L18 10 L10 18 L2 10 Z" fill="#eab308" stroke="#a16207" stroke-width="1.5"/>
    <text x="10" y="14" text-anchor="middle" font-size="10" font-weight="bold" fill="#78350f">X</text>
  </svg>`
}

function lighthouseSvg(): string {
  return `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="6" height="14" rx="1" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <polygon points="11,2 15,6 7,6" fill="#fbbf24" stroke="#b45309" stroke-width="1"/>
    <rect x="9" y="9" width="4" height="3" rx="0.5" fill="#fef3c7"/>
    <line x1="3" y1="5" x2="7" y2="7" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="19" y1="5" x2="15" y2="7" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="11" y1="0" x2="11" y2="3" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`
}

function lightMinorSvg(): string {
  return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5" r="4" fill="#fbbf24" stroke="#b45309" stroke-width="1"/>
    <rect x="8" y="8" width="2" height="8" fill="#92400e"/>
    <line x1="2" y1="5" x2="5" y2="5" stroke="#fbbf24" stroke-width="1" stroke-linecap="round"/>
    <line x1="13" y1="5" x2="16" y2="5" stroke="#fbbf24" stroke-width="1" stroke-linecap="round"/>
  </svg>`
}

function harbourSvg(): string {
  return `<svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="9" fill="#1e3a5f" stroke="#22d3ee" stroke-width="1.5"/>
    <text x="11" y="15" text-anchor="middle" font-size="12" font-weight="bold" fill="#22d3ee">H</text>
  </svg>`
}

function noticeSvg(): string {
  return `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="16" height="16" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
    <text x="9" y="13" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">!</text>
  </svg>`
}

// ─── Category → SVG mapping ──────────────────────────────────────────────────

function getSeamarkSvg(seamark: Seamark): string {
  switch (seamark.category) {
    case 'buoy_lateral':
    case 'beacon_lateral':
      return seamark.side === 'starboard' ? lateralStarboardSvg() : lateralPortSvg()
    case 'buoy_cardinal':
    case 'beacon_cardinal':
      return cardinalSvg(seamark.cardinal ?? 'north')
    case 'buoy_isolated_danger':
      return isolatedDangerSvg()
    case 'buoy_safe_water':
      return safeWaterSvg()
    case 'buoy_special_purpose':
      return specialMarkSvg()
    case 'light_major':
      return lighthouseSvg()
    case 'light_minor':
      return lightMinorSvg()
    case 'harbour':
      return harbourSvg()
    case 'notice':
      return noticeSvg()
  }
}

// ─── Layer visibility check ──────────────────────────────────────────────────

function isVisible(category: SeamarkCategory, layers: LayerVisibility): boolean {
  switch (category) {
    case 'buoy_lateral':
    case 'beacon_lateral':
      return layers.lateralMarks
    case 'buoy_cardinal':
    case 'beacon_cardinal':
      return layers.cardinalMarks
    case 'buoy_isolated_danger':
    case 'buoy_safe_water':
      return layers.dangerMarks
    case 'light_major':
    case 'light_minor':
      return layers.lights
    case 'harbour':
      return layers.ports
    case 'buoy_special_purpose':
      return layers.specialMarks
    case 'notice':
      return layers.notices
  }
}

// ─── Popup HTML ──────────────────────────────────────────────────────────────

function buildPopupHtml(seamark: Seamark): string {
  const details: string[] = []
  if (seamark.side) details.push(`<div class="text-xs" style="color:#94a3b8;">Side: <strong>${seamark.side}</strong></div>`)
  if (seamark.cardinal) details.push(`<div class="text-xs" style="color:#94a3b8;">Cardinal: <strong>${seamark.cardinal}</strong></div>`)
  if (seamark.lightCharacter) details.push(`<div class="text-xs" style="color:#fbbf24;">Light: ${seamark.lightCharacter}</div>`)
  if (seamark.lightColor) details.push(`<div class="text-xs" style="color:#94a3b8;">Color: ${seamark.lightColor}</div>`)
  if (seamark.color) details.push(`<div class="text-xs" style="color:#94a3b8;">Mark color: ${seamark.color}</div>`)
  if (seamark.shape) details.push(`<div class="text-xs" style="color:#94a3b8;">Shape: ${seamark.shape}</div>`)
  if (seamark.noticeCode) details.push(`<div class="text-xs" style="color:#94a3b8;">CEVNI: ${seamark.noticeCode}</div>`)

  return `
    <div style="padding:10px 14px;min-width:180px;">
      <div style="font-weight:600;font-size:13px;color:#e2e8f0;margin-bottom:2px;">${seamark.name}</div>
      <div style="font-size:10px;color:#67e8f9;margin-bottom:6px;text-transform:capitalize;">${seamark.category.replace(/_/g, ' ')}</div>
      ${details.join('')}
      <div style="font-size:9px;color:#475569;margin-top:6px;">${seamark.coordinates[1].toFixed(5)}, ${seamark.coordinates[0].toFixed(5)}</div>
    </div>
  `
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SeamarkLayer({ map }: SeamarkLayerProps) {
  const seamarks = useAppStore((s) => s.seamarks)
  const layers = useAppStore((s) => s.layers)
  const markersRef = useRef<maplibregl.Marker[]>([])

  useEffect(() => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    seamarks.forEach((seamark: Seamark) => {
      if (!isVisible(seamark.category, layers)) return

      const el = document.createElement('div')
      el.style.cssText = 'cursor:pointer;transition:transform 0.15s ease;'
      el.innerHTML = getSeamarkSvg(seamark)
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.3)' })
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)' })

      const popup = new maplibregl.Popup({
        offset: 14,
        closeButton: true,
        className: 'reever-popup',
      }).setHTML(buildPopupHtml(seamark))

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(seamark.coordinates)
        .setPopup(popup)
        .addTo(map)

      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
    }
  }, [map, seamarks, layers])

  return null
}
