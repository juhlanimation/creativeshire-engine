/**
 * Footer chrome component props interface.
 * Global site footer with navigation, contact info, and studio links.
 */

import type { ChromeBaseProps, NavLink, SocialLink } from '../../types'

/**
 * Props for the Footer chrome component.
 */
export interface FooterProps extends ChromeBaseProps {
  /** Navigation links (e.g., HOME, ABOUT, PROJECTS) */
  navLinks: NavLink[]

  /** Contact section heading */
  contactHeading?: string
  /** Contact email address */
  contactEmail: string
  /** Contact LinkedIn URL */
  contactLinkedin?: string

  /** Studio section heading */
  studioHeading?: string
  /** Studio website URL */
  studioUrl?: string
  /** Studio email address */
  studioEmail?: string
  /** Studio social links */
  studioSocials?: SocialLink[]

  /** Copyright text */
  copyrightText: string
}
