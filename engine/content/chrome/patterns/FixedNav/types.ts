/**
 * FixedNav chrome pattern types.
 * Component-based header with fixed positioning, site title, nav links, and styling.
 */

export interface FixedNavProps {
  siteTitle: string
  navLinks: Array<{ label: string; href: string }>
  logo?: string
  background?: string
  color?: string
}
