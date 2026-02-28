import { useAppStore } from '@/stores/useAppStore'
import { MapView } from '@/components/Map/MapView'
import { RoutePlanner } from '@/components/Sidebar/RoutePlanner'
import { ETAPanel } from '@/components/Sidebar/ETAPanel'
import { SpeedControl } from '@/components/Sidebar/SpeedControl'

export function App() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Top navigation bar */}
      <header className="h-12 bg-white border-b border-gray-100 shadow-sm flex items-center px-4 gap-3 z-10 flex-shrink-0">
        {/* Logo + brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-water-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" />
              <path d="M12 8v10" />
              <path d="M6 22c1.5-1 4-1.5 6-1.5s4.5.5 6 1.5" />
              <path d="M6 16h12" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight text-base">Reever</span>
          <span className="hidden sm:inline text-xs text-gray-400 font-normal ml-1">River Navigation</span>
        </div>

        <div className="flex-1" />

        {/* Info pill */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1">
          <span>⚓</span>
          <span>Click the map to plan your route</span>
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="ml-2 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {sidebarOpen
              ? <><path d="M15 18l-6-6 6-6" /></>
              : <><path d="M9 18l6-6-6-6" /></>
            }
          </svg>
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={[
            'w-80 flex-shrink-0 bg-gray-50 border-r border-gray-100 overflow-y-auto',
            'transition-all duration-200 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-10 h-full shadow-xl',
          ].join(' ')}
          data-testid="sidebar"
        >
          <div className="p-3 space-y-3">
            <RoutePlanner />
            <ETAPanel />
            <SpeedControl />

            {/* Legend */}
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Legend</p>
              <div className="space-y-2">
                <LegendItem color="bg-water-600" label="Your route" />
                <LegendItem color="bg-emerald-500" label="Start waypoint" />
                <LegendItem color="bg-red-500" label="End waypoint" />
                <LegendItem color="bg-amber-400 border border-amber-500" label="Écluse (lock) on route" />
                <LegendItem color="bg-amber-100 border border-amber-300" label="Écluse (lock) off route" />
              </div>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">Navigation Signs</p>
              <div className="space-y-1.5">
                <SignLegend color="bg-red-100 border-red-400" label="Prohibition (no entry, speed limit…)" />
                <SignLegend color="bg-blue-100 border-blue-400" label="Obligation (keep right…)" />
                <SignLegend color="bg-yellow-100 border-yellow-400" label="Warning (hazard, shallow…)" />
                <SignLegend color="bg-green-100 border-green-400" label="Information (mooring, fuel…)" />
              </div>
            </div>

            {/* Attribution */}
            <p className="text-[10px] text-gray-300 text-center pb-1">
              Map © OpenFreeMap / OpenStreetMap contributors · Lock data © Overpass API
            </p>
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapView />
        </main>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={['w-3 h-3 rounded-full flex-shrink-0', color].join(' ')} />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  )
}

function SignLegend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={['w-3 h-3 rounded-full border flex-shrink-0', color].join(' ')} />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  )
}
