/**
 * LogoMarquee widget props interface.
 * Animated horizontal scroll of client logos.
 */

import type { FeatureSet } from '../../../../schema/features'

/**
 * Logo item for the marquee.
 */
export interface LogoItem {
  /** Logo name for identification */
  name: string
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
}

/**
 * Props for the LogoMarquee widget.
 */
export interface LogoMarqueeProps {
  /** Array of logo items to display */
  logos: LogoItem[]
  /** Animation duration in seconds (default: 30) */
  speed?: number
  /** Scroll direction (default: 'left') */
  direction?: 'left' | 'right'
  /** Gap between logos (default: '4px') */
  gap?: string
  /** Static styling features */
  features?: FeatureSet
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
