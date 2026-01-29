/**
 * Reveal behaviours barrel export.
 * Generic reveal animations for modals, drawers, tooltips, page transitions, etc.
 */

// Auto-register by importing
import './mask-reveal'
import './fade-reveal'
import './scale-reveal'

// Re-export for explicit imports if needed
export { default as maskReveal } from './mask-reveal'
export { default as fadeReveal } from './fade-reveal'
export { default as scaleReveal } from './scale-reveal'
