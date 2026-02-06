/**
 * Intro-based behaviours.
 * Triggered by intro sequence phase changes.
 */

// Auto-register by importing
import './content-reveal'
import './text-reveal'
import './chrome-reveal'
import './scroll-indicator'
import './step'

// Re-export for explicit imports
export { default as introContentReveal } from './content-reveal'
export { default as introTextReveal } from './text-reveal'
export { default as introChromeReveal } from './chrome-reveal'
export { default as introScrollIndicator } from './scroll-indicator'
export { default as introStep } from './step'
