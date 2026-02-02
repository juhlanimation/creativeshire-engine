/**
 * NavTimeline props interface.
 */

export interface NavTimelineProps {
  /** Whether the timeline is visible */
  show?: boolean
  /** Position: 'center' (default), 'left', 'right' */
  position?: 'center' | 'left' | 'right'
  /** Whether to show navigation arrows */
  showArrows?: boolean
  /** Whether to autohide after inactivity */
  autohide?: boolean
  /** Autohide delay in ms (default: 2000) */
  autohideDelay?: number
  /** Label for current section */
  currentLabel?: string
  /** Label for next section */
  nextLabel?: string
  /** Section number for current section */
  currentNumber?: number | string
  /** Section number for next section */
  nextNumber?: number | string
  /** Color for current section elements */
  currentColor?: string
  /** Color for next section elements */
  nextColor?: string
  /** Label alignment: 'left' | 'right' */
  alignment?: 'left' | 'right'
  /** Whether to show the top arrow (hide on first section before scroll) */
  showTopArrow?: boolean
  /** Callback when reveal animation completes */
  onAnimationComplete?: () => void
}
