/**
 * Button widget props interface.
 * Button renders an interactive button and reads CSS variables for animation.
 *
 * NOTE: No onClick prop - use BehaviourWrapper for click handling.
 * Functions cannot be serialized across the React Server Component boundary.
 */

import type { CSSProperties } from 'react'

/**
 * Button variants for styling.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

/**
 * Props for the Button widget.
 */
export interface ButtonProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Button label text */
  label: string
  /** Visual variant */
  variant?: ButtonVariant
  /** Disabled state */
  disabled?: boolean
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset'
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
