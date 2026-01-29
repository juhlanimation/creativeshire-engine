'use client'

/**
 * useCursorPosition - tracks global cursor position and updates store.
 *
 * Writes:
 * - cursorX: cursor X position in viewport pixels
 * - cursorY: cursor Y position in viewport pixels
 *
 * Observation trigger for cursor movement.
 * Uses throttling for performance (16ms ~ 60fps).
 */

import { useEffect, useRef } from 'react'
import type { TriggerProps } from './types'

export interface CursorPositionOptions {
  /** Throttle interval in ms (default: 16 for ~60fps) */
  throttleMs?: number
}

/**
 * Cursor position trigger hook.
 * Updates store.cursorX and store.cursorY on mousemove events.
 *
 * Uses passive listener and throttling for 60fps updates.
 */
export function useCursorPosition(
  { store }: TriggerProps,
  options?: CursorPositionOptions
): void {
  const lastTime = useRef(0)
  const throttleMs = options?.throttleMs ?? 16

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (e: MouseEvent) => {
      // Throttle for performance
      const now = performance.now()
      if (now - lastTime.current < throttleMs) return
      lastTime.current = now

      store.setState({
        cursorX: e.clientX,
        cursorY: e.clientY,
      })
    }

    document.addEventListener('mousemove', handler, { passive: true })
    return () => document.removeEventListener('mousemove', handler)
  }, [store, throttleMs])
}
