import { MapView } from '@/components/Map/MapView'
import { BottomSheet } from '@/components/BottomSheet/BottomSheet'
import { FloatingActions } from '@/components/Controls/FloatingActions'
import { useAppStore } from '@/stores/useAppStore'

export function App() {
  const error = useAppStore((s) => s.error)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-navy-950 font-sans">
      {/* Top bar — minimal, translucent */}
      <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex items-center px-4 py-3 pointer-events-auto">
          {/* Logo + brand */}
          <div className="flex items-center gap-2 bg-navy-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-marine-500/15">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-marine-500 to-marine-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20 L6 16 L10 18 L14 14 L18 16 L22 12" />
                <path d="M18 16 V12 H22" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-sm">Reever</span>
              <span className="hidden sm:inline text-[10px] text-marine-400 font-normal ml-1.5">Marine Navigation</span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Error toast */}
          {error && (
            <div className="bg-red-900/80 backdrop-blur-sm text-red-200 text-xs px-3 py-2 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}
        </div>
      </header>

      {/* Full-screen map */}
      <main className="absolute inset-0">
        <MapView />
      </main>

      {/* Floating action buttons */}
      <FloatingActions />

      {/* Bottom sheet */}
      <BottomSheet />
    </div>
  )
}
