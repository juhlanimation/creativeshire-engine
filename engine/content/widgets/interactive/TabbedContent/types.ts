/**
 * TabbedContent widget props.
 * Tab interface with switchable content panels.
 *
 * Supports two patterns:
 * 1. Children via __repeat (preferred): Receives widgets array, visible in hierarchy
 * 2. Legacy tabs prop: Receives tabs array directly (hidden in hierarchy)
 */

import type { WidgetSchema } from '../../../../schema'
import type { WidgetBaseProps } from '../../types'

export interface TabItem {
  /** Unique identifier for the tab */
  id: string
  /** Tab label displayed in header */
  label: string
  /** Content widgets for this tab panel */
  content: WidgetSchema[]
}

export interface TabbedContentProps extends WidgetBaseProps {
  /** Array of tab items (legacy, prefer widgets) */
  tabs?: TabItem[]
  /** Children widgets from __repeat (preferred) */
  widgets?: WidgetSchema[]
  /** Default active tab ID */
  defaultTab?: string
  /** Controlled active tab ID */
  activeTab?: string
  /** Callback when tab changes */
  onChange?: (tabId: string) => void
  /** Tab bar position */
  position?: 'top' | 'bottom'
  /** Tab alignment */
  align?: 'start' | 'center' | 'end'
  /** Additional class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
