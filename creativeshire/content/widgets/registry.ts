/**
 * Widget registry - maps type strings to React components.
 * Content Layer (L1) - static component lookup.
 */

import type { ComponentType } from 'react'
import Text from './content/Text'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Widget props vary by type
type WidgetComponent = ComponentType<any>

/**
 * Registry mapping widget type strings to their components.
 */
export const widgetRegistry: Record<string, WidgetComponent> = {
  Text,
}

/**
 * Retrieves a widget component by type string.
 * @param type - Widget type identifier (e.g., 'Text')
 * @returns The widget component or undefined if not found
 */
export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry[type]
}
