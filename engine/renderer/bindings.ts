/**
 * Binding Resolution
 *
 * Resolves binding expressions ({{ content.x }}) in schemas against content data.
 * This is part of the render pipeline: Schema + Content → Resolved Schema → React.
 *
 * Binding Patterns:
 * - `{{ content.contact.name }}` - Content property access
 * - `{{ content.projects }}` - Array for __repeat
 * - `{{ item.title }}` - Current item property (within __repeat)
 * - `{{ item.$index }}` - Current iteration index (0-based)
 *
 * @example
 * ```typescript
 * const content = { contact: { name: 'Mia Chen' }, projects: [...] }
 *
 * // Simple binding
 * resolveBinding('{{ content.contact.name }}', content) // 'Mia Chen'
 *
 * // Array binding for repeater
 * resolveBinding('{{ content.projects }}', content) // [project1, project2, ...]
 *
 * // Item binding within iteration
 * resolveBinding('{{ item.title }}', content, { title: 'Project 1', $index: 0 })
 * // 'Project 1'
 * ```
 */

import type { WidgetSchema } from '../schema/widget'
import { getValueAtPath } from '../schema/utils'

// =============================================================================
// Types
// =============================================================================

/**
 * Content context for binding resolution.
 * Generic record - platform provides the actual content structure.
 */
export type BindingContext = Record<string, unknown>

/**
 * Item context for __repeat iteration.
 * Contains the current item plus $index for alternating layouts.
 */
export interface ItemContext {
  /** Properties from the array item */
  [key: string]: unknown
  /** Current iteration index (0-based) */
  $index: number
  /** For primitive arrays, the raw value */
  $value?: unknown
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Regex to match binding expressions.
 * Matches `{{ path.to.value }}` with optional whitespace.
 */
const BINDING_REGEX = /^\{\{\s*(.+?)\s*\}\}$/

// =============================================================================
// Core Functions
// =============================================================================

/**
 * Check if a string value is a binding expression.
 *
 * @param value - String to check
 * @returns true if the string is a binding expression
 *
 * @example
 * ```typescript
 * isBinding('{{ content.name }}') // true
 * isBinding('Hello World') // false
 * isBinding('{{ item.title }}') // true
 * ```
 */
export function isBinding(value: unknown): value is string {
  return typeof value === 'string' && BINDING_REGEX.test(value)
}

/**
 * Extract the path from a binding expression.
 *
 * @param expression - Binding expression like '{{ content.name }}'
 * @returns The extracted path or null if not a valid binding
 *
 * @example
 * ```typescript
 * extractBindingPath('{{ content.contact.name }}') // 'content.contact.name'
 * extractBindingPath('Hello') // null
 * ```
 */
export function extractBindingPath(expression: string): string | null {
  const match = BINDING_REGEX.exec(expression)
  return match ? match[1] : null
}

/**
 * Resolve a single binding expression against content.
 * Returns the expression unchanged if path not found (for debugging).
 *
 * @param expression - Binding expression like '{{ content.contact.name }}'
 * @param content - Content object to resolve against
 * @param item - Optional current item for iteration context
 * @returns Resolved value or original expression if not resolvable
 *
 * @example
 * ```typescript
 * const content = { contact: { name: 'Mia Chen' } }
 *
 * resolveBinding('{{ content.contact.name }}', content)
 * // Returns: 'Mia Chen'
 *
 * resolveBinding('{{ content.missing.path }}', content)
 * // Returns: '{{ content.missing.path }}' (unchanged for debugging)
 *
 * resolveBinding('{{ item.title }}', content, { title: 'Project 1', $index: 0 })
 * // Returns: 'Project 1'
 * ```
 */
export function resolveBinding(
  expression: string,
  content: BindingContext,
  item?: ItemContext | unknown
): unknown {
  const path = extractBindingPath(expression)

  if (!path) {
    // Not a binding expression, return as-is
    return expression
  }

  // Build the context object for resolution
  const context: Record<string, unknown> = {
    content,
    item,
  }

  // Handle {{ item }} binding for wrapped primitives
  // When iterating over primitive arrays, items are wrapped as { $value: primitive, $index: n }
  if (path === 'item' && item !== null && typeof item === 'object') {
    const itemObj = item as Record<string, unknown>
    if ('$value' in itemObj) {
      return itemObj.$value
    }
  }

  // Resolve the path against the context
  const value = getValueAtPath(context, path)

  // Return original expression if path doesn't resolve (for debugging)
  if (value === undefined) {
    return expression
  }

  return value
}

/**
 * Deep traverse any value and resolve all bindings.
 * Handles objects, arrays, and nested structures.
 *
 * @param value - Value to process (can be any type)
 * @param content - Content object to resolve bindings against
 * @param item - Optional current item for iteration context
 * @returns Value with all binding expressions resolved
 *
 * @example
 * ```typescript
 * const schema = {
 *   type: 'Text',
 *   props: { content: '{{ content.contact.name }}' }
 * }
 *
 * resolveBindings(schema, { contact: { name: 'Mia Chen' } })
 * // Returns: { type: 'Text', props: { content: 'Mia Chen' } }
 * ```
 */
export function resolveBindings<T>(
  value: T,
  content: BindingContext,
  item?: ItemContext | unknown
): T {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return value
  }

  // Handle strings - check for binding
  if (typeof value === 'string') {
    return resolveBinding(value, content, item) as T
  }

  // Handle arrays - recursively process each element
  if (Array.isArray(value)) {
    return value.map((element) => resolveBindings(element, content, item)) as T
  }

  // Handle objects - recursively process each property
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}

    for (const [key, propValue] of Object.entries(value as Record<string, unknown>)) {
      // Skip __repeat prop as it's handled separately by expandRepeater
      if (key === '__repeat') {
        result[key] = propValue
      } else {
        result[key] = resolveBindings(propValue, content, item)
      }
    }

    return result as T
  }

  // Primitives (number, boolean) pass through unchanged
  return value
}

/**
 * Expand a widget with __repeat prop into multiple widgets.
 * Clones the widget (and its children) for each item in the array.
 *
 * Item bindings available within __repeat:
 * - `{{ item.propertyName }}` - Access item properties
 * - `{{ item.$index }}` - Current iteration index (0-based)
 *
 * @param widget - Widget with optional __repeat prop
 * @param content - Content object containing the array to iterate over
 * @returns Array of expanded widgets (or single widget if no __repeat)
 *
 * @example
 * ```typescript
 * const widget = {
 *   __repeat: '{{ content.projects }}',
 *   type: 'Flex',
 *   props: { direction: 'column' },
 *   widgets: [
 *     { type: 'Text', props: { content: '{{ item.title }}' } }
 *   ]
 * }
 *
 * expandRepeater(widget, { projects: [{ title: 'A' }, { title: 'B' }] })
 * // Returns: [
 * //   { id: 'widget-0', type: 'Flex', widgets: [{ type: 'Text', props: { content: 'A' } }] },
 * //   { id: 'widget-1', type: 'Flex', widgets: [{ type: 'Text', props: { content: 'B' } }] }
 * // ]
 * ```
 */
export function expandRepeater(
  widget: WidgetSchema,
  content: BindingContext
): WidgetSchema[] {
  const repeatExpression = widget.__repeat

  // No __repeat prop - just resolve bindings and return as single-item array
  if (!repeatExpression) {
    return [resolveBindings(widget, content)]
  }

  // Resolve the repeat expression to get the array
  const arrayPath = extractBindingPath(repeatExpression)
  if (!arrayPath) {
    // Invalid binding expression - return widget as-is
    console.warn(`Invalid __repeat expression: ${repeatExpression}`)
    return [resolveBindings(widget, content)]
  }

  // Get the array from content
  const context: Record<string, unknown> = { content }
  const items = getValueAtPath(context, arrayPath)

  if (!Array.isArray(items)) {
    // Path doesn't resolve to an array - return widget as-is
    console.warn(`__repeat path does not resolve to array: ${repeatExpression}`)
    return [resolveBindings(widget, content)]
  }

  // Clone and resolve bindings for each item
  const expandedWidgets: WidgetSchema[] = []

  for (let index = 0; index < items.length; index++) {
    const item = items[index]

    // Create enhanced item context with $index for alternating layouts
    const itemContext: ItemContext =
      typeof item === 'object' && item !== null
        ? { ...(item as Record<string, unknown>), $index: index }
        : { $value: item, $index: index }

    // Create a copy of the widget without __repeat
    const { __repeat: _, ...widgetWithoutRepeat } = widget

    // Resolve all bindings with item context
    const resolvedWidget = resolveBindings(widgetWithoutRepeat, content, itemContext) as WidgetSchema

    // Add unique ID suffix if widget has an ID
    if (resolvedWidget.id) {
      resolvedWidget.id = `${resolvedWidget.id}-${index}`
    }

    expandedWidgets.push(resolvedWidget)
  }

  return expandedWidgets
}

/**
 * Process a tree of widgets, expanding any repeaters and resolving bindings.
 * This is the main entry point for processing widget schemas with bindings.
 *
 * @param widgets - Array of widgets to process
 * @param content - Content object to resolve bindings against
 * @returns Processed widgets with all repeaters expanded and bindings resolved
 *
 * @example
 * ```typescript
 * const widgets = [
 *   { type: 'Text', props: { content: '{{ content.contact.name }}' } },
 *   {
 *     __repeat: '{{ content.projects }}',
 *     type: 'Card',
 *     widgets: [{ type: 'Text', props: { content: '{{ item.title }}' } }]
 *   }
 * ]
 *
 * processWidgets(widgets, content)
 * // Returns widgets with resolved names and one Card per project
 * ```
 */
export function processWidgets(
  widgets: WidgetSchema[],
  content: BindingContext
): WidgetSchema[] {
  const result: WidgetSchema[] = []

  for (const widget of widgets) {
    // Expand repeater (also resolves bindings)
    const expanded = expandRepeater(widget, content)

    // Recursively process nested widgets
    for (const expandedWidget of expanded) {
      if (expandedWidget.widgets && expandedWidget.widgets.length > 0) {
        expandedWidget.widgets = processWidgets(expandedWidget.widgets, content)
      }
      result.push(expandedWidget)
    }
  }

  return result
}
