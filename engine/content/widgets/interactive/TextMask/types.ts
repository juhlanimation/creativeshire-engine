/**
 * TextMask widget types.
 * SVG text cutout mask that reveals background content through letter shapes.
 */

import type { WidgetBaseProps } from '../../types'

export interface TextMaskProps extends WidgetBaseProps {
  /** Text to display as mask cutout */
  text: string
  /** Font size (CSS value, default: '25vw') */
  fontSize?: string
  /** Font weight (default: 900) */
  fontWeight?: number
  /** Font family (default: 'var(--font-title)') */
  fontFamily?: string
  /** Mask background color (default: 'black') */
  maskColor?: string
  /** Letter spacing (CSS value, e.g. '-0.02em') */
  letterSpacing?: string
  /** Max SVG width in px (default: 2400) */
  maxWidth?: number
}
