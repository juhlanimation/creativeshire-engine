/**
 * CursorLabel overlay types.
 * Shows label text near cursor when hovering target elements.
 */

export interface CursorLabelProps {
  /** Label text to display (default: "ENTER") */
  label?: string
  /** Selector for target links (default: ".text-widget a") */
  targetSelector?: string
  /** X offset from cursor (default: 24) */
  offsetX?: number
  /** Y offset from cursor (default: 8) */
  offsetY?: number
}
