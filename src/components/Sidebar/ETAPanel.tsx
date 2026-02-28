import { useAppStore } from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle } from '@/components/UI/Card'
import { Badge } from '@/components/UI/Badge'
import { formatDuration } from '@/utils/etaCalculator'

export function ETAPanel() {
  const etaResult = useAppStore((s) => s.etaResult)
  const waypoints = useAppStore((s) => s.waypoints)

  if (waypoints.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Info</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-400 text-center py-4">
          Click the map to add waypoints
        </p>
      </Card>
    )
  }

  if (!etaResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Route Info</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-400 text-center py-4">
          Add at least 2 waypoints to calculate ETA
        </p>
      </Card>
    )
  }

  return (
    <Card data-testid="eta-panel">
      <CardHeader>
        <CardTitle>Route Info</CardTitle>
        <Badge color="blue">{waypoints.length} waypoints</Badge>
      </CardHeader>

      {/* Main stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <StatBlock
          label="Distance"
          value={`${etaResult.distanceKm.toFixed(1)} km`}
          color="text-water-700"
        />
        <StatBlock
          label="Total ETA"
          value={etaResult.totalFormatted}
          color="text-gray-800"
        />
      </div>

      {/* Breakdown */}
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1.5">
            <span className="text-base">⛵</span> Underway
          </span>
          <span className="font-medium text-gray-700">
            {formatDuration(etaResult.waterTimeMin)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-1.5">
            <span className="text-base">⚓</span>
            <span>
              {etaResult.lockCount} lock{etaResult.lockCount !== 1 ? 's' : ''}
            </span>
          </span>
          <span className={['font-medium', etaResult.lockTimeMin > 0 ? 'text-amber-600' : 'text-gray-400'].join(' ')}>
            {formatDuration(etaResult.lockTimeMin)}
          </span>
        </div>
      </div>

      {/* Lock count badge */}
      {etaResult.lockCount > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
          <span className="text-amber-500 text-sm">⚓</span>
          <p className="text-xs text-amber-700">
            <span className="font-semibold">{etaResult.lockCount} écluse{etaResult.lockCount > 1 ? 's' : ''}</span> on this route — allow extra time.
          </p>
        </div>
      )}
    </Card>
  )
}

function StatBlock({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2.5">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={['text-lg font-semibold tabular-nums', color].join(' ')}>
        {value}
      </p>
    </div>
  )
}
