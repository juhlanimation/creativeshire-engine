'use client'

/**
 * useExitTask - register an exit animation for page transitions.
 *
 * Exit tasks run before navigation when using EngineLink.
 * Tasks can be GSAP animations, CSS transitions, or any async operation.
 *
 * @example
 * ```tsx
 * // GSAP animation
 * useExitTask(() => ({
 *   type: 'promise',
 *   promise: gsap.to(ref.current, { opacity: 0, duration: 0.3 }).then()
 * }))
 *
 * // Simple duration
 * useExitTask(() => ({ type: 'duration', duration: 300 }))
 *
 * // Conditional
 * useExitTask(
 *   () => ({ type: 'duration', duration: 200 }),
 *   { enabled: isVisible }
 * )
 * ```
 */

import { useEffect, useRef } from 'react'
import { useTransitionOptional } from './TransitionProvider'
import type { TransitionTask } from '../compositions/types'

export interface UseExitTaskOptions {
  /** Whether this task is enabled (default: true) */
  enabled?: boolean
}

/**
 * Register an exit task for page transitions.
 * The task factory is called when transition starts.
 *
 * @param taskFactory - Function that returns the task to execute
 * @param options - Options including enabled flag
 */
export function useExitTask(
  taskFactory: () => TransitionTask,
  options: UseExitTaskOptions = {}
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
    const unregister = context.registerExitTask(task)

    return unregister
  }, [enabled, context])
}

export default useExitTask
