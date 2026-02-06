'use client'

/**
 * useTimer - timer trigger for timed intro patterns.
 */

import { useEffect, useRef } from 'react'
import type { StoreApi } from 'zustand'
import type { IntroStore } from '../IntroContext'

export interface UseTimerOptions {
  /** Duration in milliseconds */
  duration: number
  /** Whether timer is active (default: true) */
  enabled?: boolean
  /** Callback when timer completes */
  onComplete?: () => void
}

/**
 * Hook that runs a timer and updates intro store.
 */
export function useTimer(
  store: StoreApi<IntroStore>,
  options: UseTimerOptions
): void {
  const { duration, enabled = true, onComplete } = options
  const hasCompleted = useRef(false)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    hasCompleted.current = false
    startTime.current = performance.now()

    let rafId: number

    const tick = () => {
      if (startTime.current === null) return

      const elapsed = performance.now() - startTime.current
      store.getState().setTimerElapsed(elapsed)

      if (!hasCompleted.current && elapsed >= duration) {
        hasCompleted.current = true
        onComplete?.()
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [store, duration, enabled, onComplete])
}
