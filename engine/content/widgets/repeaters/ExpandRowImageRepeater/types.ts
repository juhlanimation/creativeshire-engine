/**
 * ExpandRowImageRepeater types.
 * Container that renders image thumbnails in a horizontal row with coordinated hover expansion.
 */

import type { WidgetBaseProps } from '../../types'
import type { WidgetSchema } from '../../../../schema'
import type { ExpandRowItem, ExpandRowClickPayload } from './ExpandRowThumbnail/types'

// Re-export item types for consumer convenience
export type { ExpandRowItem, ExpandRowClickPayload }

/**
 * Props for the ExpandRowImageRepeater widget.
 */
export interface ExpandRowImageRepeaterProps extends WidgetBaseProps {
  /**
   * Child widgets (via __repeat). Preferred pattern - visible in hierarchy.
   * Each child should have props: thumbnailSrc, thumbnailAlt, videoSrc, videoUrl,
   * title, client, studio, year, role.
   */
  widgets?: WidgetSchema[]
  /**
   * Legacy: Array of items to display OR binding expression string.
   * @deprecated Use widgets via __repeat instead for hierarchy visibility.
   */
  projects?: ExpandRowItem[] | string
  /** Row height (default: '32rem') */
  height?: string
  /** Gap between thumbnails (default: '4px') */
  gap?: string
  /** Expanded thumbnail width (default: '32rem') */
  expandedWidth?: string
  /** Transition duration in ms (default: 400) */
  transitionDuration?: number
  /** Cursor label text (default: 'WATCH') */
  cursorLabel?: string
  /** Animation type for modal opening (default: 'expand') */
  modalAnimationType?: 'wipe-left' | 'wipe-right' | 'expand'

  /**
   * Click handler injected by WidgetRenderer from schema.on.
   * When provided with item.videoUrl, clicking triggers this with payload.
   */
  onClick?: (payload: ExpandRowClickPayload) => void
}
