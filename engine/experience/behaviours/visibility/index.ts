/**
 * Visibility-based behaviours.
 * Triggered by IntersectionObserver (element entering/leaving viewport).
 */

// Auto-register by importing
import './fade-in'
import './center'

// Re-export for explicit imports
export { default as visibilityFadeIn } from './fade-in'
export { default as visibilityCenter } from './center'
