/**
 * ScrollRevealBrand chrome pattern types.
 * Scroll-reveal brand logo driven by cover-progress CSS variables.
 */

export interface ScrollRevealBrandProps {
  /** Brand name text or binding expression */
  brandName: string
  /** CSS custom property for cover progress (0-100). Must match behaviour config. Default: '--hero-cover-progress' */
  progressVar?: string
  /** CSS custom property for content edge (px). Must match behaviour config. Default: '--hero-content-edge' */
  contentEdgeVar?: string
}
