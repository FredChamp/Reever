import { useRef, useCallback } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import type { BottomSheetSnap } from '@/types'
import { RouteInfo } from './RouteInfo'
import { WaypointList } from './WaypointList'
import { SpeedControl } from './SpeedControl'
import { SignLegend } from './SignLegend'

const SNAP_HEIGHTS: Record<BottomSheetSnap, string> = {
  collapsed: 'translate-y-[calc(100%-80px)]',
  half: 'translate-y-[calc(100%-380px)]',
  full: 'translate-y-0',
}

export function BottomSheet() {
  const bottomSheet = useAppStore((s) => s.bottomSheet)
  const setBottomSheet = useAppStore((s) => s.setBottomSheet)
  const startYRef = useRef(0)

  const handleDragStart = useCallback((clientY: number) => {
    startYRef.current = clientY
  }, [])

  const handleDragEnd = useCallback((clientY: number) => {
    const delta = clientY - startYRef.current
    if (delta < -50) {
      // Swiped up
      if (bottomSheet === 'collapsed') setBottomSheet('half')
      else if (bottomSheet === 'half') setBottomSheet('full')
    } else if (delta > 50) {
      // Swiped down
      if (bottomSheet === 'full') setBottomSheet('half')
      else if (bottomSheet === 'half') setBottomSheet('collapsed')
    }
  }, [bottomSheet, setBottomSheet])

  const handleClick = useCallback(() => {
    if (bottomSheet === 'collapsed') setBottomSheet('half')
  }, [bottomSheet, setBottomSheet])

  return (
    <div
      className={[
        'bottom-sheet absolute bottom-0 left-0 right-0 z-20',
        'bg-navy-900/95 backdrop-blur-xl border-t border-marine-500/20',
        'rounded-t-2xl shadow-2xl',
        'h-[85vh] md:left-4 md:right-auto md:w-96 md:rounded-t-2xl',
        SNAP_HEIGHTS[bottomSheet],
      ].join(' ')}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onMouseUp={(e) => handleDragEnd(e.clientY)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientY)}
        onClick={handleClick}
      >
        <div className="w-10 h-1 rounded-full bg-marine-500/40" />
      </div>

      {/* Collapsed: route summary bar */}
      <RouteInfo />

      {/* Scrollable content (visible in half/full) */}
      <div className="overflow-y-auto px-4 pb-8 space-y-4" style={{ maxHeight: 'calc(85vh - 120px)' }}>
        <WaypointList />
        <SpeedControl />
        <SignLegend />

        {/* Attribution */}
        <p className="text-[10px] text-navy-500 text-center pb-2">
          Map © OpenFreeMap / OpenStreetMap · Seamarks © OpenSeaMap · Locks © Overpass API
        </p>
      </div>
    </div>
  )
}
