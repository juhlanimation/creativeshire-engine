/**
 * TeamShowcase widget props.
 * Fullscreen video showcase triggered by hovering/scrolling through team member names.
 *
 * Desktop: Hover on name to play associated video.
 * Mobile: Scroll-based detection selects the member closest to viewport center.
 */

import type { WidgetBaseProps } from '../../types'

/**
 * A single team member entry.
 */
export interface TeamMember {
  /** Display name */
  name: string
  /** Video source URL (played as background when active) */
  videoSrc?: string
  /** External portfolio URL (opens on click when active) */
  portfolioUrl?: string
}

/**
 * Props for the TeamShowcase widget.
 */
export interface TeamShowcaseProps extends WidgetBaseProps {
  /** Array of team members or binding expression */
  members: TeamMember[] | string
  /** Prefix text above names (e.g., "Vi er") */
  labelText?: string
  /** Opacity for non-selected names (default: 0.2) */
  inactiveOpacity?: number
  /** Video fade duration in ms (default: 500) */
  videoTransitionMs?: number
  /** Name opacity transition in ms (default: 300) */
  nameTransitionMs?: number
}
