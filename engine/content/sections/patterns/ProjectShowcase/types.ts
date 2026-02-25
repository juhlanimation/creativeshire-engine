/**
 * ProjectShowcase section props.
 * Single project display with video, metadata, and optional shot navigation.
 */

import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { SocialLink } from '../../../widgets/interactive/ContactBar/types'
import type { BaseSectionProps } from '../base'

export interface LogoConfig {
  src: string
  alt: string
  width?: number
}

export interface ShotConfig {
  /** Shot/frame number (e.g. 275, 300) */
  id: number
  /** Video source for this shot */
  videoSrc: string
}

export interface ProjectShowcaseProps extends BaseSectionProps {
  /** Project logo */
  logo: LogoConfig
  /** Studio name */
  studio: string
  /** Role in project */
  role: string
  /** Main video source */
  videoSrc: string
  /** Video poster image */
  videoPoster?: string
  /** Video poster time (binding expression support) */
  posterTime?: string | number
  /** Show border around video */
  videoBorder?: boolean
  /** Shot configs for navigation (optional) — supports binding expressions */
  shots?: ShotConfig[] | string

  // === Footer ===
  /** Social links for footer bar (array or binding expression) */
  socialLinks?: SocialLink[] | string
  /** Text/icon color scheme for footer */
  textColor?: 'light' | 'dark'

  // === Typography scale ===
  /** Scale for studio name text (default: 'span') */
  studioScale?: TextElement
  /** Scale for role text (default: 'span') */
  roleScale?: TextElement
}
