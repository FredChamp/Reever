import { useEffect, useRef } from 'react'
import type maplibregl from 'maplibre-gl'
import { useAppStore } from '@/stores/useAppStore'
import { fetchLocksFromOverpass } from '@/utils/overpassApi'
import { MOCK_LOCKS } from '@/data/mockLocks'
import { MOCK_SIGNS } from '@/data/mockSigns'

/**
 * Loads navigation signs from static mock data on mount.
 * Loads locks from Overpass API on mount, falling back to mock data.
 */
export function useMapFeatures(mapRef: React.RefObject<maplibregl.Map | null>) {
  const setAllLocks = useAppStore((s) => s.setAllLocks)
  const setSigns = useAppStore((s) => s.setSigns)
  const hasLoaded = useRef(false)

  // Load signs once on mount
  useEffect(() => {
    setSigns(MOCK_SIGNS)
  }, [setSigns])

  // Load locks: try Overpass, fall back to mock
  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true

    async function loadLocks() {
      const map = mapRef.current
      if (!map) {
        setAllLocks(MOCK_LOCKS)
        return
      }

      const bounds = map.getBounds()
      const locks = await fetchLocksFromOverpass(bounds)

      if (locks && locks.length > 0) {
        setAllLocks(locks)
      } else {
        setAllLocks(MOCK_LOCKS)
      }
    }

    // Wait for map to be ready before checking bounds
    const map = mapRef.current
    if (map?.loaded()) {
      loadLocks()
    } else {
      map?.once('load', loadLocks)
    }
  }, [mapRef, setAllLocks])
}
