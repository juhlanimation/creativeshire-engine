/**
 * ProjectCompare section props.
 * Before/after video comparison with draggable divider.
 *
 * Backgrounds: use `style.backgroundColor` (from BaseSectionProps).
 * Text colors: resolved from theme CSS variables.
 */

import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { BaseSectionProps } from '../base'

export interface LogoConfig {
  src: string
  alt: string
  width?: number
}

export interface ProjectCompareProps extends BaseSectionProps {
  /** Project logo */
  logo: LogoConfig
  /** "Before" video (breakdown/process) */
  beforeVideo: string
  /** "After" video (final result) */
  afterVideo: string
  /** Label for before video (optional) */
  beforeLabel?: string
  /** Label for after video (optional) */
  afterLabel?: string
  /** Project description text (optional, supports HTML) */
  description?: string
  /** Whether description contains HTML */
  descriptionHtml?: boolean

  // === Typography scale ===
  /** Scale for description text (default: 'p') */
  descriptionScale?: TextElement
}
