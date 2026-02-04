/**
 * HeroRoles widget types.
 */

import type { CSSProperties } from 'react'
import type { WidgetBaseProps } from '../../types'
import type { WidgetSchema } from '../../../../schema'

export interface HeroRolesProps extends WidgetBaseProps {
  /**
   * Child widgets (via __repeat). Preferred pattern - visible in hierarchy.
   * Each child should be a Text widget with content prop.
   */
  widgets?: WidgetSchema[]
  /**
   * Legacy: Array of role titles to display, or binding expression.
   * @deprecated Use widgets via __repeat instead for hierarchy visibility.
   */
  roles?: string[] | string
  /** HTML element to use for the first role (default: h1) */
  firstAs?: 'h1' | 'h2' | 'h3'
  /** HTML element to use for subsequent roles (default: h2) */
  restAs?: 'h1' | 'h2' | 'h3'
  /** Style to apply to each role text (passed via widget style prop) */
  style?: CSSProperties
}
