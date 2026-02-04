/**
 * Breakpoint Configuration
 *
 * Defines responsive breakpoints for container-relative queries.
 * These work in both fullpage mode (viewport) and contained mode (container width).
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Semantic breakpoint values for responsive behavior.
 * - mobile: < 768px (md)
 * - tablet: 768px - 1023px
 * - desktop: >= 1024px (lg)
 */
export type BreakpointValue = 'mobile' | 'tablet' | 'desktop'

/**
 * Determines the semantic breakpoint value based on width.
 * Used by both ContainerContext (contained mode) and SiteRenderer (fullpage mode).
 */
export function getBreakpointValue(width: number): BreakpointValue {
  if (width >= BREAKPOINTS.lg) return 'desktop'
  if (width >= BREAKPOINTS.md) return 'tablet'
  return 'mobile'
}
