'use client'

/**
 * useCursorPosition - tracks cursor position and updates store.
 *
 * Writes:
 * - cursorX: cursor X position in pixels
 * - cursorY: cursor Y position in pixels
 *
 * Observation trigger for cursor movement.
 * Uses throttling for performance (16ms ~ 60fps).
 *
 * Container-aware:
 * In contained mode, tracks cursor position relative to the container.
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
 *
 * In contained mode, positions are relative to the container element.
 */
export function useCursorPosition(
  { store, containerMode, containerRef }: TriggerProps,
  options?: CursorPositionOptions
): void {
  const lastTime = useRef(0)
  const throttleMs = options?.throttleMs ?? 16

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isContained = containerMode === 'contained' && containerRef?.current
    const target = isContained ? containerRef.current : document

    const handler = (e: MouseEvent) => {
      // Throttle for performance
      const now = performance.now()
      if (now - lastTime.current < throttleMs) return
      lastTime.current = now

      if (isContained && containerRef?.current) {
        // Container mode: calculate position relative to container
        const rect = containerRef.current.getBoundingClientRect()
        store.setState({
          cursorX: e.clientX - rect.left,
          cursorY: e.clientY - rect.top,
        })
      } else {
        // Fullpage mode: use viewport position
        store.setState({
          cursorX: e.clientX,
          cursorY: e.clientY,
        })
      }
    }

    target?.addEventListener('mousemove', handler as EventListener, { passive: true })
    return () => target?.removeEventListener('mousemove', handler as EventListener)
  }, [store, containerMode, containerRef, throttleMs])
}
