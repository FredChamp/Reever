import { useAppStore } from '@/stores/useAppStore'
import type { Waypoint } from '@/types'

export function WaypointList() {
  const waypoints = useAppStore((s) => s.waypoints)
  const removeWaypoint = useAppStore((s) => s.removeWaypoint)
  const clearWaypoints = useAppStore((s) => s.clearWaypoints)

  if (waypoints.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
          Waypoints
        </h3>
        <button
          onClick={clearWaypoints}
          className="text-[10px] text-red-400 hover:text-red-300 font-medium transition-colors"
          aria-label="Clear all waypoints"
        >
          Clear all
        </button>
      </div>

      <ol className="space-y-1" data-testid="waypoint-list">
        {waypoints.map((wp: Waypoint, index: number) => {
          const isStart = index === 0
          const isEnd = index === waypoints.length - 1
          const dotColor = isStart ? 'bg-emerald-500' : isEnd ? 'bg-red-500' : 'bg-indigo-400'
          const label = isStart ? 'Start' : isEnd ? 'End' : `Stop ${index}`

          return (
            <li
              key={wp.id}
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-navy-800/50 group transition-colors"
            >
              <div className={['w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white', dotColor].join(' ')}>
                {isStart ? 'A' : isEnd ? 'B' : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">
                  {wp.label ?? label}
                </p>
                <p className="text-[10px] text-navy-500 tabular-nums">
                  {wp.lngLat[1].toFixed(4)}, {wp.lngLat[0].toFixed(4)}
                </p>
              </div>
              <button
                onClick={() => removeWaypoint(wp.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-navy-500 hover:text-red-400 p-0.5 rounded"
                aria-label={`Remove waypoint ${index + 1}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
