/**
 * IndexNav widget props.
 * Generic active-index button group for numbered/labeled navigation.
 *
 * Supports two patterns:
 * 1. Children via __repeat (preferred): Receives widgets array, visible in hierarchy
 * 2. Direct items prop: Receives items array directly
 */

import type { WidgetBaseProps } from '../../../../../../widgets/types'

export interface IndexNavItem {
  /** Display label for the button */
  label: string
  /** Optional value associated with this item */
  value?: string | number
}

export interface IndexNavProps extends WidgetBaseProps {
  /** Array of items to display */
  items?: IndexNavItem[]
  /** Currently active index (controlled mode when onSelect provided) */
  activeIndex?: number
  /** Callback when an item is selected */
  onSelect?: (index: number, item: IndexNavItem) => void
  /** Prefix label displayed before buttons */
  prefix?: string
  /** Layout direction */
  direction?: 'row' | 'column'
}
