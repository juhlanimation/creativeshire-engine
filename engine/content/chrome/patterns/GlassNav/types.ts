/**
 * GlassNav chrome pattern types.
 * Fixed transparent header that morphs to frosted glass on scroll.
 */

import type { CSSProperties } from 'react'
import type { RegionLayout } from '../../../../schema/chrome'

export interface GlassNavProps {
  // === Content ===
  logoSrc?: string
  logoAlt?: string
  navLinks?: Array<{ label: string; href: string }>

  // === Settings ===
  scrollThreshold?: number
  blurStrength?: number
  glassBgOpacity?: number
  forceOpaque?: boolean

  // === Layout ===
  layout?: Partial<RegionLayout>
  overlay?: boolean
  style?: CSSProperties
}
