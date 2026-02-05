/**
 * TabbedContent widget props.
 * Tab interface with switchable content panels.
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
  /** Array of tab items */
  tabs: TabItem[]
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
