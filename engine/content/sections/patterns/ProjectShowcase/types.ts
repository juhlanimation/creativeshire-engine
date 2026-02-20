/**
 * ProjectShowcase section props.
 * Single project display with video, metadata, and optional shot navigation.
 */

import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { BaseSectionProps } from '../base'

export interface LogoConfig {
  src: string
  alt: string
  width?: number
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
  /** Shot numbers for navigation (optional) — supports binding expressions */
  shots?: number[] | string

  // === Typography scale ===
  /** Scale for studio name text (default: 'span') */
  studioScale?: TextElement
  /** Scale for role text (default: 'span') */
  roleScale?: TextElement
}
