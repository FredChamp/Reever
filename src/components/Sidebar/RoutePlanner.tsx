import { useAppStore } from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import type { Waypoint } from '@/types'

export function RoutePlanner() {
  const waypoints = useAppStore((s) => s.waypoints)
  const removeWaypoint = useAppStore((s) => s.removeWaypoint)
  const clearWaypoints = useAppStore((s) => s.clearWaypoints)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waypoints</CardTitle>
        {waypoints.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            onClick={clearWaypoints}
            aria-label="Clear all waypoints"
          >
            Clear all
          </Button>
        )}
      </CardHeader>

      {waypoints.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-2xl mb-2">🗺️</p>
          <p className="text-sm text-gray-400">
            Click anywhere on the map to add a waypoint
          </p>
        </div>
      ) : (
        <ol className="space-y-1.5" data-testid="waypoint-list">
          {waypoints.map((wp: Waypoint, index: number) => (
            <WaypointItem
              key={wp.id}
              waypoint={wp}
              index={index}
              total={waypoints.length}
              onRemove={() => removeWaypoint(wp.id)}
            />
          ))}
        </ol>
      )}

      {waypoints.length === 1 && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Add one more waypoint to plan a route
        </p>
      )}
    </Card>
  )
}

interface WaypointItemProps {
  waypoint: Waypoint
  index: number
  total: number
  onRemove: () => void
}

function WaypointItem({ waypoint, index, total, onRemove }: WaypointItemProps) {
  const isStart = index === 0
  const isEnd = index === total - 1

  const dotColor = isStart
    ? 'bg-emerald-500'
    : isEnd
    ? 'bg-red-500'
    : 'bg-indigo-400'

  const label = isStart ? 'Start' : isEnd ? 'End' : `Stop ${index}`

  return (
    <li className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 group">
      {/* Step dot */}
      <div className={['w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white', dotColor].join(' ')}>
        {isStart ? 'A' : isEnd ? 'B' : index + 1}
      </div>

      {/* Coords & label */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">
          {waypoint.label ?? label}
        </p>
        <p className="text-[10px] text-gray-400 tabular-nums">
          {waypoint.lngLat[1].toFixed(4)}°, {waypoint.lngLat[0].toFixed(4)}°
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-0.5 rounded"
        aria-label={`Remove waypoint ${index + 1}`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}
