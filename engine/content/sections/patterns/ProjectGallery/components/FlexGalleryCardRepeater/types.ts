/**
 * FlexGalleryCardRepeater widget props.
 * Thumbnail strip for selecting active project in showcases.
 *
 * Projects are provided as __repeat children (widgets array),
 * making each item visible in the hierarchy panel.
 *
 * Renders SelectorCard items and manages selection state + keyboard nav.
 * Action bridge: onClick fires with SelectorCardClickPayload for action system.
 */

import type { WidgetSchema } from '../../../../../../schema'
import type { WidgetBaseProps } from '../../../../../widgets/types'
import type { SelectorCardClickPayload } from './SelectorCard/types'

export interface FlexGalleryCardRepeaterProps extends WidgetBaseProps {
  /** Children widgets from __repeat containing project data */
  widgets?: WidgetSchema[]
  /** Currently active index (controlled) */
  activeIndex?: number
  /** Action bridge: fires when a card is clicked (payload for action system) */
  onClick?: (payload: SelectorCardClickPayload) => void
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Show info card on hover */
  showInfo?: boolean

  // Visual enhancement props (passed through to SelectorCard)
  /** Inactive thumbnail width in px */
  thumbnailWidth?: number
  /** Active thumbnail width in px (defaults to thumbnailWidth) */
  activeThumbnailWidth?: number
  /** Semantic accent color for progress bar and playing indicator */
  accentColor?: 'accent' | 'interaction' | 'primary'
  /** Show "Playing" indicator (pulsing dot + label) on active card */
  showPlayingIndicator?: boolean
  /** Show play icon on hover for inactive cards */
  showPlayIcon?: boolean
  /** Show dark overlay on active/hover cards */
  showOverlay?: boolean
  /** CSS border value for thumbnails */
  thumbnailBorder?: string
  /** Semantic border radius for thumbnails */
  thumbnailBorderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

/**
 * Internal item extracted from widget children.
 */
export interface FlexGalleryCardRepeaterItem {
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
  /** Video/external URL (optional) */
  url?: string
  /** Time in seconds to seek to for thumbnail frame display */
  posterTime?: number
}
