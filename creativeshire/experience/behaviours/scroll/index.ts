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

// Re-export for explicit imports
export { default as scrollFade } from './fade'
export { default as scrollFadeOut } from './fade-out'
export { default as scrollProgress } from './progress'
export { default as scrollColorShift } from './color-shift'
export { default as scrollImageCycle } from './image-cycle'
