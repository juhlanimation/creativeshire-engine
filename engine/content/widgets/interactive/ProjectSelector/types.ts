/**
 * ProjectSelector widget props.
 * Thumbnail strip for selecting active project in showcases.
 */

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
  /** External URL (optional, for click-through) */
  url?: string
}

export interface ProjectSelectorProps extends WidgetBaseProps {
  /** Array of project items */
  projects: ProjectSelectorItem[]
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
  /** Additional class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
