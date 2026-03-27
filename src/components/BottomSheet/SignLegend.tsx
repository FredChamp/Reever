import { useAppStore } from '@/stores/useAppStore'
import type { LayerVisibility } from '@/types'

interface LegendEntry {
  key: keyof LayerVisibility
  label: string
  color: string
  icon: string
}

const LEGEND: LegendEntry[] = [
  { key: 'lateralMarks', label: 'Lateral marks (port/starboard)', color: 'bg-red-500', icon: 'P' },
  { key: 'cardinalMarks', label: 'Cardinal marks (N/S/E/W)', color: 'bg-yellow-500', icon: 'C' },
  { key: 'dangerMarks', label: 'Danger & safe water', color: 'bg-red-700', icon: 'D' },
  { key: 'lights', label: 'Lighthouses & lights', color: 'bg-amber-400', icon: 'L' },
  { key: 'ports', label: 'Ports & marinas', color: 'bg-cyan-500', icon: 'H' },
  { key: 'locks', label: 'Locks (écluses)', color: 'bg-amber-500', icon: 'K' },
  { key: 'notices', label: 'CEVNI notices', color: 'bg-blue-500', icon: '!' },
  { key: 'specialMarks', label: 'Special marks', color: 'bg-yellow-400', icon: 'X' },
  { key: 'seaOverlay', label: 'OpenSeaMap overlay', color: 'bg-marine-500', icon: 'S' },
]

export function SignLegend() {
  const layers = useAppStore((s) => s.layers)
  const toggleLayer = useAppStore((s) => s.toggleLayer)

  return (
    <div>
      <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">
        Layers & Legend
      </h3>
      <div className="space-y-1">
        {LEGEND.map((entry) => (
          <button
            key={entry.key}
            onClick={() => toggleLayer(entry.key)}
            className={[
              'layer-toggle w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left',
              layers[entry.key] ? 'opacity-100' : 'opacity-40',
            ].join(' ')}
          >
            <div className={[
              'w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0',
              entry.color,
            ].join(' ')}>
              {entry.icon}
            </div>
            <span className="text-xs text-slate-400 flex-1">{entry.label}</span>
            <div className={[
              'w-8 h-4 rounded-full transition-colors flex items-center px-0.5',
              layers[entry.key] ? 'bg-marine-600' : 'bg-navy-700',
            ].join(' ')}>
              <div className={[
                'w-3 h-3 rounded-full bg-white transition-transform',
                layers[entry.key] ? 'translate-x-4' : 'translate-x-0',
              ].join(' ')} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
