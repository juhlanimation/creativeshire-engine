/**
 * BrandFooter chrome pattern types.
 * Footer pattern with centered brand, navigation, and contact details.
 */

export interface BrandFooterProps {
  brandName: string
  /** Binding expression for nav links array, or omit to hide nav column */
  navLinks?: string
  email: string
  phone?: string
  /** Display text for phone (e.g. formatted local number). Falls back to phone. */
  phoneDisplay?: string
  address?: string
  copyright: string
}
