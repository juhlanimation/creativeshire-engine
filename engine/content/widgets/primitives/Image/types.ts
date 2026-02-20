/**
 * Image widget props interface.
 * Image renders static images and reads CSS variables for animation.
 */

import type { CSSProperties } from 'react'

/**
 * Props for the Image widget.
 */
export interface ImageProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Aspect ratio (e.g., '16/9', '1/1', '9/16') */
  aspectRatio?: string
  /** Object fit behavior */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  /** Object position (e.g., 'center', 'top', 'bottom 20%') */
  objectPosition?: string
  /** Whether this is a decorative image (sets alt="" and aria-hidden) */
  decorative?: boolean
  /** Inline styles */
  style?: CSSProperties
  /** CSS filter (e.g., 'brightness(0) invert(1)', 'grayscale(1)') */
  filter?: string
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
  /** Responsive sizes hint (e.g., '(max-width: 768px) 100vw, 50vw') */
  sizes?: string
  /** Mark as above-fold — disables lazy loading, adds fetchpriority="high" */
  priority?: boolean
  /** Image quality 1-100 (default: 75) */
  quality?: number
}
