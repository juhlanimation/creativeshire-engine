'use client'

/**
 * useScrollProgress - tracks global scroll position and updates store.
 *
 * Writes:
 * - scrollProgress: 0-1 ratio of scroll position
 * - isScrolling: true while actively scrolling
 */

import { useEffect, useRef } from 'react'
import type { TriggerProps } from './types'

/**
 * Scroll progress trigger hook.
 * Updates store.scrollProgress (0-1) and store.isScrolling on scroll events.
 *
 * Uses requestAnimationFrame for 60fps updates during active scroll.
 * Debounces isScrolling state to prevent flickering.
 */
export function useScrollProgress({ store }: TriggerProps): void {
  const isScrollingTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const rafId = useRef<number>(undefined)

  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0

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

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      if (isScrollingTimeout.current) {
        clearTimeout(isScrollingTimeout.current)
      }
    }
  }, [store])
}
