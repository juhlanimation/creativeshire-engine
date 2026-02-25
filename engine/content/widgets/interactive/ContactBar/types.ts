/**
 * ContactBar widget types.
 * Social links bar with click-to-copy email support.
 */

import type { WidgetBaseProps } from '../../types'

export type SocialPlatform =
  | 'instagram'
  | 'linkedin'
  | 'email'
  | 'twitter'
  | 'vimeo'
  | 'youtube'
  | 'behance'
  | 'dribbble'

export interface SocialLink {
  /** Platform identifier — determines icon and behaviour (email = copy-to-clipboard) */
  platform: SocialPlatform
  /** URL for link platforms, or email address for 'email' platform */
  url: string
  /** Accessible label override (defaults to platform name) */
  label?: string
}

export interface ContactBarProps extends WidgetBaseProps {
  /** Social links to display */
  links: SocialLink[]
  /** Icon size in pixels. Default: 20 */
  iconSize?: number
  /** Gap between icons in pixels. Default: 16 */
  gap?: number
  /** Text/icon color scheme. Default: 'light' */
  textColor?: 'light' | 'dark'
}
