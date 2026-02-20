/**
 * Event map merging utilities.
 * Combines multiple WidgetEventMaps into one, array-merging same-event bindings.
 */

import type { WidgetEventMap, ActionBinding } from '../../schema/widget'

/**
 * Normalize a binding value to an array.
 */
function toArray(value: ActionBinding | ActionBinding[]): ActionBinding[] {
  return Array.isArray(value) ? value : [value]
}

/**
 * Merge two WidgetEventMaps. Same event keys produce an array of all bindings.
 * `overlay` bindings are appended after `base` bindings.
 *
 * @example
 * ```typescript
 * mergeEventMaps(
 *   { click: 'modal.open' },
 *   { click: 'analytics.track', mouseenter: 'cursor.show' }
 * )
 * // → { click: ['modal.open', 'analytics.track'], mouseenter: 'cursor.show' }
 * ```
 */
export function mergeEventMaps(
  base: WidgetEventMap | undefined,
  overlay: WidgetEventMap | undefined,
): WidgetEventMap | undefined {
  if (!base && !overlay) return undefined
  if (!base) return overlay
  if (!overlay) return base

  const merged: WidgetEventMap = { ...base }

  for (const [event, bindings] of Object.entries(overlay)) {
    if (event in merged) {
      const existing = toArray(merged[event])
      const incoming = toArray(bindings)
      merged[event] = [...existing, ...incoming]
    } else {
      merged[event] = bindings
    }
  }

  return merged
}
