/**
 * CenteredNav chrome pattern types.
 * Widget-based centered header with brand name and navigation links.
 */

export interface CenteredNavProps {
  brandName: string
  /** Binding expression for nav links array, or omit to hide nav row */
  navLinks?: string
}
