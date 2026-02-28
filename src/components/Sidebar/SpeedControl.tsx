import { useAppStore } from '@/stores/useAppStore'
import { Card, CardHeader, CardTitle } from '@/components/UI/Card'

export function SpeedControl() {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Boat Settings</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        {/* Boat speed */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="speed-slider" className="text-sm font-medium text-gray-700">
              Cruising speed
            </label>
            <span className="text-sm font-semibold text-water-600 tabular-nums">
              {settings.boatSpeedKmh} km/h
            </span>
          </div>
          <input
            id="speed-slider"
            type="range"
            min={3}
            max={20}
            step={0.5}
            value={settings.boatSpeedKmh}
            onChange={(e) =>
              updateSettings({ boatSpeedKmh: parseFloat(e.target.value) })
            }
            className="w-full h-1.5 rounded-full bg-gray-200 accent-water-600 cursor-pointer"
            data-testid="speed-slider"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>3 km/h</span>
            <span>20 km/h</span>
          </div>
        </div>

        {/* Lock transit time */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="lock-slider" className="text-sm font-medium text-gray-700">
              Lock transit time
            </label>
            <span className="text-sm font-semibold text-amber-600 tabular-nums">
              {settings.lockTransitMin} min
            </span>
          </div>
          <input
            id="lock-slider"
            type="range"
            min={10}
            max={60}
            step={5}
            value={settings.lockTransitMin}
            onChange={(e) =>
              updateSettings({ lockTransitMin: parseInt(e.target.value, 10) })
            }
            className="w-full h-1.5 rounded-full bg-gray-200 accent-amber-500 cursor-pointer"
            data-testid="lock-time-slider"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>10 min</span>
            <span>60 min</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
