/**
 * HeroTitle widget props interface.
 * Large display heading with mix-blend-mode effect for dynamic backgrounds.
 */

import type { FeatureSet } from '../../../../schema/features'

/**
 * HTML heading element types that HeroTitle can render as.
 */
export type HeroTitleElement = 'h1' | 'h2' | 'h3'

/**
 * Props for the HeroTitle widget.
 */
export interface HeroTitleProps {
  /** Text content to display (uppercase) */
  text: string
  /** HTML heading element to render (default: 'h1') */
  as?: HeroTitleElement
  /** Whether to apply mix-blend-mode: difference (default: true) */
  useBlendMode?: boolean
  /** Static styling features */
  features?: FeatureSet
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
