/**
 * Drivers barrel export.
 *
 * Drivers apply CSS variables at 60fps, bypassing React for performance.
 * Use drivers when animations need to be butter-smooth (scroll-based effects).
 *
 * Architecture:
 * - Triggers write TO store (input)
 * - Behaviours define WHAT to compute (logic)
 * - Drivers apply CSS vars at 60fps (output, performance path)
 */

export { useScrollFadeDriver } from './useScrollFadeDriver'
export type { UseScrollFadeDriverOptions } from './useScrollFadeDriver'
export type { DriverConfig, ElementDriverProps } from './types'
