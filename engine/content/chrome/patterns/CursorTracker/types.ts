/**
 * CursorTracker chrome pattern types.
 * Cursor overlay wrapping the CursorLabel chrome component.
 */

export interface CursorTrackerProps {
  label: string
  offsetX?: number
  offsetY?: number
  /** CSS selector for native DOM elements (e.g. '<a>' tags in rich text) */
  targetSelector?: string
}
