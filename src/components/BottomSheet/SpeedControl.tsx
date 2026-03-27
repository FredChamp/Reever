import { useAppStore } from '@/stores/useAppStore'
import { kmhToKnots } from '@/utils/etaCalculator'
import type { SpeedUnit } from '@/types'

export function SpeedControl() {
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)

  const toggleUnit = () => {
    const newUnit: SpeedUnit = settings.speedUnit === 'kmh' ? 'knots' : 'kmh'
    updateSettings({ speedUnit: newUnit })
  }

  const displaySpeed = settings.speedUnit === 'knots'
    ? kmhToKnots(settings.boatSpeedKmh).toFixed(1)
    : String(settings.boatSpeedKmh)

  const unitLabel = settings.speedUnit === 'knots' ? 'kn' : 'km/h'

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider">
        Boat Settings
      </h3>

      {/* Speed */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="speed-slider" className="text-sm font-medium text-slate-300">
            Cruising speed
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-marine-400 tabular-nums">
              {displaySpeed} {unitLabel}
            </span>
            <button
              onClick={toggleUnit}
              className="text-[10px] text-navy-500 hover:text-marine-400 border border-navy-700 hover:border-marine-500/30 rounded px-1.5 py-0.5 transition-colors"
            >
              {settings.speedUnit === 'kmh' ? 'kn' : 'km/h'}
            </button>
          </div>
        </div>
        <input
          id="speed-slider"
          type="range"
          min={3}
          max={40}
          step={0.5}
          value={settings.boatSpeedKmh}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            updateSettings({ boatSpeedKmh: val })
          }}
          className="w-full cursor-pointer"
          data-testid="speed-slider"
        />
        <div className="flex justify-between text-[10px] text-navy-600 mt-0.5">
          <span>3 km/h</span>
          <span>40 km/h</span>
        </div>
      </div>

      {/* Lock transit */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="lock-slider" className="text-sm font-medium text-slate-300">
            Lock transit time
          </label>
          <span className="text-sm font-semibold text-lock-500 tabular-nums">
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
          className="w-full cursor-pointer"
          data-testid="lock-time-slider"
        />
        <div className="flex justify-between text-[10px] text-navy-600 mt-0.5">
          <span>10 min</span>
          <span>60 min</span>
        </div>
      </div>
    </div>
  )
}
