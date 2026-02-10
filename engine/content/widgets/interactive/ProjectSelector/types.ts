/**
 * ProjectSelector widget props.
 * Thumbnail strip for selecting active project in showcases.
 *
 * Supports two patterns:
 * 1. Children via __repeat (preferred): Receives widgets array, visible in hierarchy
 * 2. Legacy projects prop: Receives projects array directly (hidden in hierarchy)
 */

import type { WidgetSchema } from '../../../../schema'
import type { WidgetBaseProps } from '../../types'

export interface ProjectSelectorItem {
  /** Unique identifier */
  id: string
  /** Thumbnail image source */
  thumbnail: string
  /** Thumbnail alt text */
  alt?: string
  /** Project title */
  title: string
  /** Project year (optional) */
  year?: string
  /** Studio name (optional) */
  studio?: string
  /** Role (optional, shown in info card) */
  role?: string
  /** External URL (optional, for click-through) */
  url?: string
  /** Time in seconds to seek to for thumbnail frame display */
  posterTime?: number
}

export interface ProjectSelectorProps extends WidgetBaseProps {
  /** Array of project items (legacy, prefer widgets) */
  projects?: ProjectSelectorItem[]
  /** Children widgets from __repeat (preferred) */
  widgets?: WidgetSchema[]
  /** Currently active index (controlled) */
  activeIndex?: number
  /** Callback when selection changes */
  onSelect?: (index: number) => void
  /** Callback when active item is clicked (for external URL) */
  onActiveClick?: (project: ProjectSelectorItem) => void
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Show info card on hover */
  showInfo?: boolean

  // Visual enhancement props
  /** Inactive thumbnail width in px */
  thumbnailWidth?: number
  /** Active thumbnail width in px (defaults to thumbnailWidth) */
  activeThumbnailWidth?: number
  /** Accent color for progress bar and playing indicator */
  accentColor?: string
  /** Show "Playing" indicator (pulsing dot + label) on active card */
  showPlayingIndicator?: boolean
  /** Show play icon on hover for inactive cards */
  showPlayIcon?: boolean
  /** Show dark overlay on active/hover cards */
  showOverlay?: boolean
  /** CSS border value for thumbnails */
  thumbnailBorder?: string
  /** Border radius for thumbnails */
  thumbnailBorderRadius?: string

  /** Additional class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
