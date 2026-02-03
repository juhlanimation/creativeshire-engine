/**
 * HeroRoles widget types.
 */

import type { CSSProperties } from 'react'

export interface HeroRolesProps {
  /** Array of role titles to display, or binding expression */
  roles: string[] | string
  /** HTML element to use for the first role (default: h1) */
  firstAs?: 'h1' | 'h2' | 'h3'
  /** HTML element to use for subsequent roles (default: h2) */
  restAs?: 'h1' | 'h2' | 'h3'
  /** Style to apply to each role text (passed via widget style prop) */
  style?: CSSProperties
}
