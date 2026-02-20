/**
 * PhotoCollage section pattern props.
 * Text block with scattered photo images — desktop uses absolute positioning,
 * mobile uses vertical stack with alternating alignment.
 */

import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { BaseSectionProps } from '../base'

export interface AboutCollageProps extends BaseSectionProps {
  /** Text content (binding expression or literal) */
  text: string
  /** CSS class for the text element */
  textClassName?: string
  /** Array of images (binding expression or literal) */
  images: string | AboutCollageImage[]
  /** CSS class applied to each image element */
  imageClassName?: string

  // === Typography scale ===
  /** Scale for text content (default: 'p') */
  textScale?: TextElement
}

export interface AboutCollageImage {
  src: string
  alt: string
}
