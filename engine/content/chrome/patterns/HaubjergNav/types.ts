/**
 * HaubjergNav chrome pattern types.
 * Dark fixed navbar with brand text, desktop links, and mobile menu.
 */

import type { CSSProperties } from 'react'
import type { RegionLayout } from '../../../../schema/chrome'

export interface HaubjergNavProps {
  // === Content ===
  /** Two-part brand text: [dimmed prefix, bright suffix] */
  brandParts?: [string, string]
  /** Navigation links */
  navLinks?: Array<{ label: string; href: string }>

  // === Layout ===
  layout?: Partial<RegionLayout>
  overlay?: boolean
  style?: CSSProperties
}
