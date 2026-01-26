/**
 * Text widget props interface.
 * Text renders static text content and reads CSS variables for animation.
 */

import type { FeatureSet } from '../../../../schema/features'

/**
 * HTML element types that Text can render as.
 */
export type TextElement = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

/**
 * Props for the Text widget.
 */
export interface TextProps {
  /** Text content to display */
  content: string
  /** HTML element to render (default: 'p') */
  as?: TextElement
  /** Static styling features */
  features?: FeatureSet
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
