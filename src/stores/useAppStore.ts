import { create } from 'zustand'
import type { Waypoint, Lock, RiverSign, ETAResult, AppSettings } from '@/types'
import { buildRoute, getLocksOnRoute } from '@/utils/routeUtils'
import { calculateETA } from '@/utils/etaCalculator'

const DEFAULT_SETTINGS: AppSettings = {
  boatSpeedKmh: 8,
  lockTransitMin: 30,
}

interface AppState {
  // Waypoints
  waypoints: Waypoint[]
  addWaypoint: (waypoint: Waypoint) => void
  removeWaypoint: (id: string) => void
  clearWaypoints: () => void
  updateWaypointPosition: (id: string, lngLat: [number, number]) => void

  // All known locks (from Overpass or mock)
  allLocks: Lock[]
  setAllLocks: (locks: Lock[]) => void

  // Navigation signs
  signs: RiverSign[]
  setSigns: (signs: RiverSign[]) => void

  // Derived: computed route
  route: GeoJSON.Feature<GeoJSON.LineString> | null

  // Derived: locks on the current route
  locksOnRoute: Lock[]

  // Derived: ETA
  etaResult: ETAResult | null

  // Settings
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void

  // UI
  sidebarOpen: boolean
  toggleSidebar: () => void
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
  signs: [],
  route: null,
  locksOnRoute: [],
  etaResult: null,
  settings: DEFAULT_SETTINGS,
  sidebarOpen: true,

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

  setSigns: (signs) => set({ signs }),

  updateSettings: (patch) => {
    const { waypoints, allLocks, settings } = get()
    const newSettings = { ...settings, ...patch }
    const derived = recompute(waypoints, allLocks, newSettings)
    set({ settings: newSettings, ...derived })
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
