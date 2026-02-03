'use client'

/**
 * useScrollProgress - tracks scroll position and updates store.
 *
 * Writes:
 * - scrollProgress: 0-1 ratio of scroll position
 * - isScrolling: true while actively scrolling
 *
 * Container-aware:
 * In contained mode, tracks the container's scroll instead of window scroll.
 */

import { useEffect, useRef } from 'react'
import type { TriggerProps } from './types'

/**
 * Scroll progress trigger hook.
 * Updates store.scrollProgress (0-1) and store.isScrolling on scroll events.
 *
 * Uses requestAnimationFrame for 60fps updates during active scroll.
 * Debounces isScrolling state to prevent flickering.
 *
 * In contained mode, listens to container scroll instead of window scroll.
 */
export function useScrollProgress({ store, containerMode, containerRef }: TriggerProps): void {
  const isScrollingTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const rafId = useRef<number>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Determine scroll target based on container mode
    const isContained = containerMode === 'contained' && containerRef?.current
    const scrollTarget = isContained ? containerRef.current : window

    const updateScroll = () => {
      let scrollProgress: number

      if (isContained && containerRef?.current) {
        // Container mode: use container's scroll dimensions
        const container = containerRef.current
        const scrollHeight = container.scrollHeight - container.clientHeight
        scrollProgress = scrollHeight > 0 ? container.scrollTop / scrollHeight : 0
      } else {
        // Fullpage mode: use window scroll
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0
      }

      store.setState({
        scrollProgress: Math.max(0, Math.min(1, scrollProgress)),
        isScrolling: true,
      })

      // Debounce isScrolling = false
      if (isScrollingTimeout.current) {
        clearTimeout(isScrollingTimeout.current)
      }
      isScrollingTimeout.current = setTimeout(() => {
        store.setState({ isScrolling: false })
      }, 150)
    }

    const handleScroll = () => {
      // Cancel previous frame to avoid stacking
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      rafId.current = requestAnimationFrame(updateScroll)
    }

    // Initial update
    updateScroll()

    scrollTarget?.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollTarget?.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      if (isScrollingTimeout.current) {
        clearTimeout(isScrollingTimeout.current)
      }
    }
  }, [store, containerMode, containerRef])
}
