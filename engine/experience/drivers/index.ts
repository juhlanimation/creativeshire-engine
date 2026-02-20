/**
 * Drivers barrel export.
 *
 * Drivers are CONTINUOUS 60fps infrastructure — they bridge L2 behaviours to the DOM.
 * They accept element registrations, run RAF loops or scroll listeners,
 * call behaviour.compute() each frame, and apply CSS vars via element.style.setProperty().
 *
 * For DISCRETE animations (play → complete), see timeline/.
 *
 * Two patterns available:
 * 1. Class-based (recommended): ScrollDriver with register/unregister/destroy lifecycle
 * 2. Hook-based (legacy): useScrollFadeDriver for existing code
 */

// Scroll lock service (generic key-based, any system can participate)
export { ScrollLockProvider, useScrollLock } from './ScrollLockContext'

// Smooth scroll driver (GSAP ScrollSmoother or Lenis) - page-level
export { SmoothScrollProvider, useSmoothScroll } from './SmoothScrollProvider'

// Smooth scroll for any container - unified hook
export {
  useSmoothScrollContainer,
  type SmoothScrollContainerConfig,
  type SmoothScrollContainerReturn,
  type BoundaryDirection,
} from './useSmoothScrollContainer'

// Class-based drivers (spec-compliant)
export { ScrollDriver } from './ScrollDriver'
export { MomentumDriver } from './MomentumDriver'

// Container-aware driver factory
export { getDriver, releaseDriver, getDriverRefCount, hasDriver } from './getDriver'

// Hook-based drivers (legacy - for migration)
export { useScrollFadeDriver } from './useScrollFadeDriver'
export type { UseScrollFadeDriverOptions } from './useScrollFadeDriver'

// GSAP-powered animation drivers (re-exported from timeline/gsap)
export { RevealTransition, useGsapReveal } from '../timeline/gsap'
export type { RevealType, UseGsapRevealOptions, RevealTransitionProps } from '../timeline/gsap'

// Types
export type { DriverConfig, ElementDriverProps, Driver, Target, MomentumDriverConfig } from './types'
