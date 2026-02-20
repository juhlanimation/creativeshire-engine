/**
 * CursorLabel overlay types.
 * Shows label text near cursor when activated.
 *
 * Three activation modes (can coexist):
 * 1. Action system: overlayKey → registers {key}.show / {key}.hide handlers
 * 2. CSS selector delegation: targetSelector → mouseover/mouseout on matching elements
 * 3. Direct control: active prop (for inline usage)
 */

export interface CursorLabelProps {
  /** Label text to display (default: "ENTER") */
  label?: string
  /** X offset from cursor (default: 24) */
  offsetX?: number
  /** Y offset from cursor (default: 8) */
  offsetY?: number
  /** Overlay key for action registration (injected by ChromeRenderer) */
  overlayKey?: string
  /**
   * CSS selector for native DOM elements that activate the label.
   * Used for elements below widget level (e.g. `<a>` tags in rich text).
   * Uses event delegation on the site container.
   */
  targetSelector?: string
  /** Direct control for inline usage (bypasses action system) */
  active?: boolean
}
