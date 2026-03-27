import { useAppStore } from '@/stores/useAppStore'

export function FloatingActions() {
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)
  const loading = useAppStore((s) => s.loading)

  return (
    <div className="absolute top-20 right-3 z-10 flex flex-col gap-2">
      {/* 2D/3D Toggle */}
      <button
        onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
        className="fab-glow w-10 h-10 rounded-xl bg-navy-800/90 backdrop-blur-sm border border-marine-500/20 flex items-center justify-center text-marine-400 hover:text-marine-300"
        aria-label={`Switch to ${viewMode === '3d' ? '2D' : '3D'} view`}
        title={`Switch to ${viewMode === '3d' ? '2D' : '3D'} view`}
      >
        <span className="text-xs font-bold">{viewMode === '3d' ? '2D' : '3D'}</span>
      </button>

      {/* Loading indicator */}
      {loading && (
        <div className="w-10 h-10 rounded-xl bg-navy-800/90 backdrop-blur-sm border border-marine-500/20 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-marine-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
