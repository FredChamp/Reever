import { useAppStore } from '@/stores/useAppStore'
import { formatSpeed } from '@/utils/etaCalculator'

export function RouteInfo() {
  const etaResult = useAppStore((s) => s.etaResult)
  const waypoints = useAppStore((s) => s.waypoints)
  const settings = useAppStore((s) => s.settings)
  const loading = useAppStore((s) => s.loading)
  const seamarks = useAppStore((s) => s.seamarks)
  const allLocks = useAppStore((s) => s.allLocks)

  return (
    <div className="px-4 pb-3">
      {/* Stats bar — always visible */}
      <div className="flex items-center gap-3">
        {loading && (
          <div className="loading-pulse text-marine-400 text-xs font-medium">Loading...</div>
        )}

        {etaResult ? (
          <div className="flex items-center gap-4 flex-1">
            {/* Distance */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-navy-500 font-medium">Distance</span>
              <span className="text-sm font-semibold text-marine-300 tabular-nums">
                {etaResult.distanceKm.toFixed(1)} km
                <span className="text-navy-500 mx-1">/</span>
                {etaResult.distanceNm.toFixed(1)} nm
              </span>
            </div>

            {/* ETA */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-navy-500 font-medium">ETA</span>
              <span className="text-sm font-semibold text-white tabular-nums">
                {etaResult.totalFormatted}
              </span>
            </div>

            {/* Locks */}
            {etaResult.lockCount > 0 && (
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-navy-500 font-medium">Locks</span>
                <span className="text-sm font-semibold text-lock-500 tabular-nums">
                  {etaResult.lockCount}
                </span>
              </div>
            )}

            {/* Speed */}
            <div className="flex flex-col ml-auto">
              <span className="text-[10px] uppercase tracking-wider text-navy-500 font-medium">Speed</span>
              <span className="text-sm font-medium text-marine-400 tabular-nums">
                {formatSpeed(settings.boatSpeedKmh, settings.speedUnit)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-navy-500">
                {waypoints.length === 0
                  ? 'Tap the map to plan your route'
                  : 'Add one more point to plan route'}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3 text-[10px] text-navy-500">
              <span>{seamarks.length} seamarks</span>
              <span>{allLocks.length} locks</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
