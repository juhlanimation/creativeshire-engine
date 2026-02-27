'use client'

/**
 * useEntryTask - register an entry animation for page transitions.
 *
 * Entry tasks run after the new page has mounted.
 * Tasks can be GSAP animations, CSS transitions, or any async operation.
 *
 * @example
 * ```tsx
 * // GSAP animation
 * useEntryTask(() => ({
 *   type: 'promise',
 *   promise: gsap.from(ref.current, { opacity: 0, y: 20, duration: 0.4 }).then()
 * }))
 *
 * // Simple duration
 * useEntryTask(() => ({ type: 'duration', duration: 400 }))
 * ```
 */

import { useEffect, useRef } from 'react'
import { useTransitionOptional } from './TransitionProvider'
import type { TransitionTask } from '../compositions/types'

export interface UseEntryTaskOptions {
  /** Whether this task is enabled (default: true) */
  enabled?: boolean
}

/**
 * Register an entry task for page transitions.
 * The task factory is called when the page mounts.
 *
 * @param taskFactory - Function that returns the task to execute
 * @param options - Options including enabled flag
 */
export function useEntryTask(
  taskFactory: () => TransitionTask,
  options: UseEntryTaskOptions = {}
): void {
  const { enabled = true } = options
  const context = useTransitionOptional()
  const factoryRef = useRef(taskFactory)

  // Keep factory ref updated (in effect to avoid mutating during render)
  useEffect(() => {
    factoryRef.current = taskFactory
  }, [taskFactory])

  useEffect(() => {
    // Skip if disabled or no context
    if (!enabled || !context) return

    // Create and register the task
    const task = factoryRef.current()
    const unregister = context.registerEntryTask(task)

    return unregister
  }, [enabled, context])
}

export default useEntryTask
