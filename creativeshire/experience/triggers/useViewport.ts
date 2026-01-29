'use client'

/**
 * useViewport - tracks viewport dimensions.
 *
 * Writes:
 * - viewportHeight: current viewport height in pixels
 *
 * Debounces resize events to prevent excessive updates.
 */

import { useEffect, useRef } from 'react'
import type { TriggerProps } from './types'

/**
 * Viewport trigger hook.
 * Updates store.viewportHeight on window resize.
 * Debounced to avoid performance issues during resize.
 */
export function useViewport({ store }: TriggerProps): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateViewport = () => {
      store.setState({ viewportHeight: window.innerHeight })
    }

    const handleResize = () => {
      // Debounce resize events
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(updateViewport, 100)
    }

    // Initial update
    updateViewport()

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [store])
}
