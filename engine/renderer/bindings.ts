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

/**
 * Regex to match embedded binding expressions within template strings.
 * Unlike BINDING_REGEX, this is unanchored and global — matches multiple
 * `{{ path }}` occurrences within a larger string.
 *
 * @example 'Client {{ item.client }}' → replaces {{ item.client }} with resolved value
 */
const TEMPLATE_REGEX = /\{\{\s*(.+?)\s*\}\}/g

/**
 * Extract a display label from an item context.
 * Priority: title > name > label > $index
 *
 * Most content uses 'title' (projects, sections), so it takes precedence.
 * Falls back through name/label for other entity types.
 *
 * @param item - Item context from __repeat iteration
 * @returns Human-readable label string (never undefined)
 */
function extractLabelFromItem(item: ItemContext): string {
  const label = item.title ?? item.name ?? item.label
  if (label !== undefined && label !== null) {
    return String(label)
  }
  return String(item.$index)
}

/**
 * Resolve embedded {{ }} expressions within a template string.
 * If the string contains no template expressions, returns it unchanged.
 *
 * @example
 * resolveTemplateString('Client {{ item.client }}', content, item)
 * // → 'Client AZUKI'
 */
function resolveTemplateString(
  expression: string,
  content: BindingContext,
  item?: ItemContext | unknown
): string {
  // Quick check: does it contain any {{ }} at all?
  if (!expression.includes('{{')) return expression

  const context: Record<string, unknown> = { content, item }

  return expression.replace(TEMPLATE_REGEX, (match, pathStr: string) => {
    const trimmed = pathStr.trim()

    // Handle {{ item }} for wrapped primitives
    if (trimmed === 'item' && item !== null && typeof item === 'object') {
      const itemObj = item as Record<string, unknown>
      if ('$value' in itemObj) return String(itemObj.$value)
    }

    const value = getValueAtPath(context, trimmed)
    return value !== undefined ? String(value) : match
  })
}

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
 * Evaluate a condition binding expression for conditional rendering.
 * Returns true if the binding resolves to a truthy value.
 *
 * Falsy values: null, undefined, '', false, 0, unresolved binding
 *
 * @param expression - Binding expression like '{{ item.studio }}'
 * @param content - Content object to resolve against
 * @param item - Optional current item for iteration context
 * @returns true if condition is met (truthy), false otherwise
 *
 * @example
 * ```typescript
 * evaluateCondition('{{ item.studio }}', content, { studio: 'Netflix', $index: 0 })
 * // Returns: true
 *
 * evaluateCondition('{{ item.studio }}', content, { $index: 0 })
 * // Returns: false (studio is undefined)
 * ```
 */
export function evaluateCondition(
  expression: string,
  content: BindingContext,
  item?: ItemContext | unknown
): boolean {
  const resolved = resolveBinding(expression, content, item)
  // Unresolved binding (returns original expression) = falsy
  if (resolved === expression) return false
  return Boolean(resolved)
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
    // Not a pure binding — check for embedded template expressions
    return resolveTemplateString(expression, content, item)
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
      // Skip __repeat and condition — handled by expandRepeater/processWidgets.
      // Resolving condition here would break nested conditional widgets: the
      // parent's resolveBindings deep-resolves child conditions into plain
      // strings, then evaluateCondition treats them as "unresolved" and hides
      // the widget.
      if (key === '__repeat' || key === 'condition') {
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
    // Check condition for non-repeated widgets (no item context)
    if (widget.condition) {
      if (!evaluateCondition(widget.condition, content)) {
        return [] // Condition not met - skip widget
      }
    }
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

    // Check condition for repeated widgets (with item context)
    if (widget.condition) {
      if (!evaluateCondition(widget.condition, content, itemContext)) {
        continue // Condition not met - skip this item
      }
    }

    // Create a copy of the widget without __repeat
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructure to exclude __repeat
    const { __repeat: _repeat, ...widgetWithoutRepeat } = widget

    // Resolve all bindings with item context
    const resolvedWidget = resolveBindings(widgetWithoutRepeat, content, itemContext) as WidgetSchema

    // Extract label for platform hierarchy display
    resolvedWidget.__label = extractLabelFromItem(itemContext)

    // Determine stable item key for identity
    const keyField = widget.__key ?? 'id'
    const rawKey = itemContext[keyField]
    // Only use the key if it's a string or number, otherwise fallback to index
    const itemKey: string | number =
      typeof rawKey === 'string' || typeof rawKey === 'number' ? rawKey : index
    resolvedWidget.__itemKey = itemKey

    // Add unique ID suffix using stable key (or index as fallback)
    if (resolvedWidget.id) {
      resolvedWidget.id = `${resolvedWidget.id}-${itemKey}`
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

// =============================================================================
// Platform Introspection Utilities
// =============================================================================

/**
 * Repeater metadata for platform hierarchy display.
 */
export interface RepeaterInfo {
  /** The binding path to the data array (e.g., 'content.projects.featured') */
  dataPath: string
  /** Number of items in the array */
  itemCount: number
  /** Field used for item identity (defaults to 'id') */
  keyField: string
  /** Items with their keys and display labels */
  items: Array<{ key: string | number; label: string }>
}

/**
 * Check if a widget is a repeater template (has __repeat).
 * Platform uses this to show "Items (N)" in hierarchy instead of expanding.
 *
 * @param widget - Widget to check
 * @returns true if widget has __repeat directive
 *
 * @example
 * ```typescript
 * if (isRepeaterTemplate(widget)) {
 *   // Show as "Projects (5 items) [+]" in hierarchy
 *   const info = getRepeaterInfo(widget, content)
 * } else {
 *   // Render as normal widget node
 * }
 * ```
 */
export function isRepeaterTemplate(widget: WidgetSchema): boolean {
  return !!widget.__repeat
}

/**
 * Get repeater metadata without expanding.
 * Platform uses this for hierarchy display and data operations.
 *
 * @param widget - Widget with __repeat directive
 * @param content - Content object containing the data array
 * @returns Repeater metadata or null if not a repeater or data not found
 *
 * @example
 * ```typescript
 * const info = getRepeaterInfo(widget, content)
 * if (info) {
 *   console.log(`${info.itemCount} items at ${info.dataPath}`)
 *   info.items.forEach(({ key, label }) => {
 *     console.log(`  - ${label} (key: ${key})`)
 *   })
 * }
 * ```
 */
export function getRepeaterInfo(
  widget: WidgetSchema,
  content: BindingContext
): RepeaterInfo | null {
  if (!widget.__repeat) return null

  const arrayPath = extractBindingPath(widget.__repeat)
  if (!arrayPath) return null

  const context: Record<string, unknown> = { content }
  const items = getValueAtPath(context, arrayPath)

  if (!Array.isArray(items)) return null

  const keyField = widget.__key ?? 'id'

  return {
    dataPath: arrayPath,
    itemCount: items.length,
    keyField,
    items: items.map((item, index) => {
      // Create item context same as expandRepeater does
      const itemContext: ItemContext =
        typeof item === 'object' && item !== null
          ? { ...(item as Record<string, unknown>), $index: index }
          : { $value: item, $index: index }

      // Only use the key if it's a string or number, otherwise fallback to index
      const rawKey = itemContext[keyField]
      const key: string | number =
        typeof rawKey === 'string' || typeof rawKey === 'number' ? rawKey : index

      return {
        key,
        label: extractLabelFromItem(itemContext),
      }
    }),
  }
}
