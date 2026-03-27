import { create } from 'zustand'
import type {
  Waypoint, Lock, Seamark, ETAResult, AppSettings,
  LayerVisibility, MapViewMode, BottomSheetSnap,
} from '@/types'
import { buildRoute, getLocksOnRoute } from '@/utils/routeUtils'
import { calculateETA } from '@/utils/etaCalculator'

const DEFAULT_SETTINGS: AppSettings = {
  boatSpeedKmh: 8,
  lockTransitMin: 30,
  speedUnit: 'kmh',
}

const DEFAULT_LAYERS: LayerVisibility = {
  lateralMarks: true,
  cardinalMarks: true,
  dangerMarks: true,
  lights: true,
  ports: true,
  locks: true,
  notices: true,
  specialMarks: true,
  seaOverlay: true,
}

interface AppState {
  // Waypoints
  waypoints: Waypoint[]
  addWaypoint: (waypoint: Waypoint) => void
  removeWaypoint: (id: string) => void
  clearWaypoints: () => void
  updateWaypointPosition: (id: string, lngLat: [number, number]) => void

  // All known locks (from Overpass)
  allLocks: Lock[]
  setAllLocks: (locks: Lock[]) => void

  // Seamarks (from Overpass — buoys, lights, ports, etc.)
  seamarks: Seamark[]
  setSeamarks: (seamarks: Seamark[]) => void

  // Derived: computed route
  route: GeoJSON.Feature<GeoJSON.LineString> | null

  // Derived: locks on the current route
  locksOnRoute: Lock[]

  // Derived: ETA
  etaResult: ETAResult | null

  // Settings
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void

  // Layer visibility
  layers: LayerVisibility
  toggleLayer: (key: keyof LayerVisibility) => void

  // Map view mode
  viewMode: MapViewMode
  setViewMode: (mode: MapViewMode) => void

  // Bottom sheet
  bottomSheet: BottomSheetSnap
  setBottomSheet: (snap: BottomSheetSnap) => void

  // Loading / error
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

function recompute(
  waypoints: Waypoint[],
  allLocks: Lock[],
  settings: AppSettings,
): {
  route: GeoJSON.Feature<GeoJSON.LineString> | null
  locksOnRoute: Lock[]
  etaResult: ETAResult | null
} {
  const route = buildRoute(waypoints)
  if (!route) {
    return { route: null, locksOnRoute: [], etaResult: null }
  }

  const locksOnRoute = getLocksOnRoute(route, allLocks)
  const distanceKm = (route.properties?.distanceKm as number) ?? 0

  const etaResult = calculateETA({
    distanceKm,
    boatSpeedKmh: settings.boatSpeedKmh,
    lockCount: locksOnRoute.length,
    lockTransitMin: settings.lockTransitMin,
  })

  return { route, locksOnRoute, etaResult }
}

export const useAppStore = create<AppState>((set, get) => ({
  waypoints: [],
  allLocks: [],
  seamarks: [],
  route: null,
  locksOnRoute: [],
  etaResult: null,
  settings: DEFAULT_SETTINGS,
  layers: DEFAULT_LAYERS,
  viewMode: '3d',
  bottomSheet: 'collapsed',
  loading: false,
  error: null,

  addWaypoint: (waypoint) => {
    const { waypoints, allLocks, settings } = get()
    const newWaypoints = [...waypoints, waypoint]
    const derived = recompute(newWaypoints, allLocks, settings)
    set({ waypoints: newWaypoints, ...derived })
  },

  removeWaypoint: (id) => {
    const { waypoints, allLocks, settings } = get()
    const newWaypoints = waypoints.filter((w) => w.id !== id)
    const derived = recompute(newWaypoints, allLocks, settings)
    set({ waypoints: newWaypoints, ...derived })
  },

  clearWaypoints: () => {
    set({ waypoints: [], route: null, locksOnRoute: [], etaResult: null })
  },

  updateWaypointPosition: (id, lngLat) => {
    const { waypoints, allLocks, settings } = get()
    const newWaypoints = waypoints.map((w) =>
      w.id === id ? { ...w, lngLat } : w,
    )
    const derived = recompute(newWaypoints, allLocks, settings)
    set({ waypoints: newWaypoints, ...derived })
  },

  setAllLocks: (allLocks) => {
    const { waypoints, settings } = get()
    const derived = recompute(waypoints, allLocks, settings)
    set({ allLocks, ...derived })
  },

  setSeamarks: (seamarks) => set({ seamarks }),

  updateSettings: (patch) => {
    const { waypoints, allLocks, settings } = get()
    const newSettings = { ...settings, ...patch }
    const derived = recompute(waypoints, allLocks, newSettings)
    set({ settings: newSettings, ...derived })
  },

  toggleLayer: (key) => set((s) => ({
    layers: { ...s.layers, [key]: !s.layers[key] },
  })),

  setViewMode: (viewMode) => set({ viewMode }),
  setBottomSheet: (bottomSheet) => set({ bottomSheet }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
