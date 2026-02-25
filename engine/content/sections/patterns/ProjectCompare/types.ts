/**
 * ProjectCompare section props.
 * Before/after video comparison with draggable divider.
 *
 * Backgrounds: use `style.backgroundColor` (from BaseSectionProps).
 * Text colors: resolved from theme CSS variables.
 */

import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { SocialLink } from '../../../widgets/interactive/ContactBar/types'
import type { BaseSectionProps } from '../base'

export interface LogoConfig {
  src: string
  alt: string
  width?: number
}

export interface ProjectCompareProps extends BaseSectionProps {
  /** Project logo */
  logo: LogoConfig
  /** Studio name */
  studio?: string
  /** Role in project */
  role?: string
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

  // === Video frame ===
  /** Background color for the frame container around the video */
  videoBackground?: string
  /** Background color for the content area (behind video frame + description) */
  contentBackground?: string
  /** Explicit color override for description text */
  descriptionColor?: string

  // === Footer ===
  /** Social links for footer bar (array or binding expression) */
  socialLinks?: SocialLink[] | string
  /** Text/icon color scheme for footer */
  textColor?: 'light' | 'dark'

  // === Typography scale ===
  /** Scale for description text (default: 'p') */
  descriptionScale?: TextElement
}
