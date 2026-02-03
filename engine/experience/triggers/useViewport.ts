'use client'

/**
 * useViewport - tracks viewport dimensions.
 *
 * Writes:
 * - viewportHeight: current viewport height in pixels
 *
 * Debounces resize events to prevent excessive updates.
 *
 * Container-aware:
 * In contained mode, tracks the container's dimensions instead of window.
 */

import { useEffect, useRef } from 'react'
import type { TriggerProps } from './types'

/**
 * Viewport trigger hook.
 * Updates store.viewportHeight on window resize.
 * Debounced to avoid performance issues during resize.
 *
 * In contained mode, uses ResizeObserver on the container.
 */
export function useViewport({ store, containerMode, containerRef }: TriggerProps): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isContained = containerMode === 'contained' && containerRef?.current

    const updateViewport = () => {
      const height = isContained && containerRef?.current
        ? containerRef.current.clientHeight
        : window.innerHeight
      store.setState({ viewportHeight: height })
    }

    // Initial update
    updateViewport()

    if (isContained && containerRef?.current) {
      // Container mode: use ResizeObserver
      const resizeObserver = new ResizeObserver(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(updateViewport, 100)
      })
      resizeObserver.observe(containerRef.current)

      return () => {
        resizeObserver.disconnect()
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    } else {
      // Fullpage mode: use window resize
      const handleResize = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(updateViewport, 100)
      }

      window.addEventListener('resize', handleResize, { passive: true })

      return () => {
        window.removeEventListener('resize', handleResize)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }
  }, [store, containerMode, containerRef])
}
