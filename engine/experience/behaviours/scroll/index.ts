/**
 * Scroll-based behaviours.
 * Triggered by scroll position/progress.
 *
 * Note: For 60fps scroll animations, use useScrollFadeDriver from drivers/.
 */

// Auto-register by importing
import './fade'
import './fade-out'
import './progress'
import './color-shift'
import './image-cycle'
import './cover-progress'
import './collapse'
import './reveal'
import './glass'

// Re-export for explicit imports
export { default as scrollFade } from './fade'
export { default as scrollFadeOut } from './fade-out'
export { default as scrollProgress } from './progress'
export { default as scrollColorShift } from './color-shift'
export { default as scrollImageCycle } from './image-cycle'
export { default as scrollCoverProgress } from './cover-progress'
export { default as scrollCollapse } from './collapse'
export { default as scrollReveal } from './reveal'
export { default as scrollGlass } from './glass'
