/**
 * FlexButtonRepeater widget props.
 * Extracts IndexNavItem[] from __repeat Button children and renders an IndexNav.
 *
 * Items are provided as __repeat children (widgets array),
 * making each item visible in the hierarchy panel.
 */

import type { WidgetSchema } from '../../../../../../schema'
import type { WidgetBaseProps } from '../../../../../widgets/types'
import type { IndexNavItem } from './IndexNav/types'

export interface FlexButtonRepeaterProps extends WidgetBaseProps {
  /** Children widgets from __repeat containing button data */
  widgets?: WidgetSchema[]
  /** Currently active index */
  activeIndex?: number
  /** Callback when an item is selected */
  onSelect?: (index: number, item: IndexNavItem) => void
  /** Prefix label displayed before buttons */
  prefix?: string
  /** Layout direction */
  direction?: 'row' | 'column'
}
