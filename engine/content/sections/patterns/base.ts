/**
 * Shared base props for all section pattern factories.
 * Every pattern's Props type extends this interface.
 */

import type { CSSProperties } from 'react'
import type { LayoutPreset } from '../../../themes/types'

/** Shared props available on all section pattern factories. */
export interface BaseSectionProps {
  /** Section ID override */
  id?: string
  /** Human-readable label for UI hierarchy/inspector */
  label?: string
  /** Whether section content is constrained to --site-max-width */
  constrained?: boolean
  /** Per-section color mode — resolves palette from the active theme */
  colorMode?: 'dark' | 'light'
  /** Per-section theme override — resolves full palette from a different theme */
  sectionTheme?: string
  /** Section-level inline styles (merged over factory defaults) */
  style?: CSSProperties
  /** CSS class names */
  className?: string
  /** Section gap — layout preset name, CSS string, or pixel number */
  gap?: LayoutPreset | string | number
  /** Section padding — layout preset name or raw CSS value */
  padding?: LayoutPreset | string
  /** Container padding top in px */
  paddingTop?: number
  /** Container padding bottom in px */
  paddingBottom?: number
  /** Container padding left in px */
  paddingLeft?: number
  /** Container padding right in px */
  paddingRight?: number
  /** Section height mode: auto (default), viewport (min-height), viewport-fixed (locked height) */
  sectionHeight?: 'auto' | 'viewport' | 'viewport-fixed'
}
