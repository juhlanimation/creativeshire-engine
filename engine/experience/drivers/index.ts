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
 *
 * Two patterns available:
 * 1. Class-based (recommended): ScrollDriver with register/unregister/destroy lifecycle
 * 2. Hook-based (legacy): useScrollFadeDriver for existing code
 */

// Class-based drivers (spec-compliant)
export { ScrollDriver } from './ScrollDriver'

// Hook-based drivers (legacy - for migration)
export { useScrollFadeDriver } from './useScrollFadeDriver'
export type { UseScrollFadeDriverOptions } from './useScrollFadeDriver'

// GSAP-powered animation drivers
export { RevealTransition, useGsapReveal } from './gsap'
export type { RevealType, UseGsapRevealOptions, RevealTransitionProps } from './gsap'

// Types
export type { DriverConfig, ElementDriverProps, Driver, Target } from './types'
