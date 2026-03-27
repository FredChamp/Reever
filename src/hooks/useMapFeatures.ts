import { useEffect, useRef, useCallback } from 'react'
import type maplibregl from 'maplibre-gl'
import { useAppStore } from '@/stores/useAppStore'
import { fetchLocksFromOverpass, fetchSeamarksFromOverpass } from '@/utils/overpassApi'

/** Minimum zoom level to start fetching seamarks (avoid huge queries) */
const MIN_FETCH_ZOOM = 8

/** Debounce delay for viewport changes */
const DEBOUNCE_MS = 800

/**
 * Fetches locks and seamarks from Overpass API when the map viewport changes.
 * Debounced to avoid excessive API calls. No mock data — everything is live.
 */
export function useMapFeatures(mapRef: React.RefObject<maplibregl.Map | null>) {
  const setAllLocks = useAppStore((s) => s.setAllLocks)
  const setSeamarks = useAppStore((s) => s.setSeamarks)
  const setLoading = useAppStore((s) => s.setLoading)
  const setError = useAppStore((s) => s.setError)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastBboxRef = useRef<string>('')

  const fetchData = useCallback(async () => {
    const map = mapRef.current
    if (!map) return

    const zoom = map.getZoom()
    if (zoom < MIN_FETCH_ZOOM) return

    const bounds = map.getBounds()
    const bboxKey = [
      bounds.getSouth().toFixed(3),
      bounds.getWest().toFixed(3),
      bounds.getNorth().toFixed(3),
      bounds.getEast().toFixed(3),
    ].join(',')

    // Skip if viewport hasn't changed enough
    if (bboxKey === lastBboxRef.current) return
    lastBboxRef.current = bboxKey

    setLoading(true)
    setError(null)

    // Fetch locks and seamarks in parallel
    const [locks, seamarks] = await Promise.all([
      fetchLocksFromOverpass(bounds),
      fetchSeamarksFromOverpass(bounds),
    ])

    if (locks) {
      setAllLocks(locks)
    } else {
      // Keep existing data on failure, just show error
      setError('Could not fetch lock data')
    }

    if (seamarks) {
      setSeamarks(seamarks)
    } else {
      setError('Could not fetch seamark data')
    }

    setLoading(false)
  }, [mapRef, setAllLocks, setSeamarks, setLoading, setError])

  const debouncedFetch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(fetchData, DEBOUNCE_MS)
  }, [fetchData])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const onReady = () => {
      // Initial fetch
      fetchData()
      // Fetch on viewport change
      map.on('moveend', debouncedFetch)
    }

    if (map.loaded()) {
      onReady()
    } else {
      map.once('load', onReady)
    }

    return () => {
      map.off('moveend', debouncedFetch)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [mapRef, fetchData, debouncedFetch])
}
