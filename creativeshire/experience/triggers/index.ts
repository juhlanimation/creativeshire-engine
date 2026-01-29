/**
 * Triggers barrel export.
 *
 * Triggers observe browser events and write to the experience store.
 * They are the input side of the experience layer.
 *
 * Architecture:
 * Browser Event → Trigger → Store → BehaviourWrapper → CSS Variables
 */

export { useScrollProgress } from './useScrollProgress'
export { useIntersection } from './useIntersection'
export { usePrefersReducedMotion } from './usePrefersReducedMotion'
export { useViewport } from './useViewport'
export { useCursorPosition } from './useCursorPosition'
export type { TriggerConfig, TriggerProps } from './types'
