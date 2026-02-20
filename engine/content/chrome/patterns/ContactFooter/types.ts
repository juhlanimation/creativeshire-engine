/**
 * ContactFooter chrome pattern types.
 * Footer pattern with navigation, contact info, and studio links.
 */

export interface NavLink {
  label: string
  href: string
}

export interface ContactFooterProps {
  /** Binding expression or direct array of nav links. Omit to hide nav column. */
  navLinks?: string | NavLink[]
  contactHeading: string
  contactEmail: string
  linkedinUrl: string
  studioHeading: string
  studioUrl: string
  studioUrlLabel?: string
  studioEmail: string
  /** Binding expression for studio social links array, or omit to hide */
  studioSocials?: string
  copyright: string
  /** Top padding above the content area (rem). 0 = use theme default. */
  paddingTop?: number
  /** Bottom padding below the content area (rem). 0 = use theme default. */
  paddingBottom?: number
}
