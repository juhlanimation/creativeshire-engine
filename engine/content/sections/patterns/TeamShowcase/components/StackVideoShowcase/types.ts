/**
 * StackVideoShowcase widget props.
 * Fullscreen video showcase triggered by hovering/scrolling through member names.
 *
 * Desktop: Hover on name to play associated video.
 * Mobile: Scroll-based detection selects the member closest to viewport center.
 *
 * Members are read from child widgets (CMS hierarchy), not a flat array prop.
 * Each child widget provides name, videoSrc, videoPoster, href via its props.
 */

import type { WidgetBaseProps } from '../../../../../widgets/types'
import type { WidgetSchema } from '../../../../../../schema'

/**
 * Extracted member data from a child widget.
 */
export interface ShowcaseMember {
  /** Display name */
  name: string
  /** Video source URL (played as background when active) */
  videoSrc?: string
  /** Video poster/thumbnail */
  videoPoster?: string
  /** External link URL (opens on click when active) */
  href?: string
}

/**
 * Props for the StackVideoShowcase widget.
 */
export interface StackVideoShowcaseProps extends WidgetBaseProps {
  /** Child widgets — each represents one member (populated via __repeat) */
  widgets?: WidgetSchema[]
  /** Prefix text above names (e.g., "Vi er") */
  labelText?: string
  /** Opacity for non-selected names (default: 0.2) */
  inactiveOpacity?: number
  /** Video fade duration in ms (default: 500) */
  videoTransitionMs?: number
  /** Name opacity transition in ms (default: 300) */
  nameTransitionMs?: number
  /** Action prefix for dispatching selection events (e.g., section id) */
  actionPrefix?: string
}
