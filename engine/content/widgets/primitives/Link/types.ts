/**
 * Link widget props interface.
 * Link renders a navigation link and reads CSS variables for animation.
 *
 * Uses framework-provided Link for internal routes, native <a> for external URLs.
 */

import type { CSSProperties, ReactNode } from 'react'

/**
 * Link visual variants.
 */
export type LinkVariant = 'default' | 'underline' | 'hover-underline'

/**
 * Props for the Link widget.
 */
export interface LinkProps {
  /** Element ID for CSS targeting */
  id?: string
  /** Navigation URL (internal paths start with /) */
  href: string
  /** Link content (text or nested elements) */
  children?: ReactNode
  /** Link target - use _blank for external links */
  target?: '_blank' | '_self'
  /** Relationship attribute - use 'noopener noreferrer' for external links */
  rel?: string
  /** Visual variant */
  variant?: LinkVariant
  /** Inline styles */
  style?: CSSProperties
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
  /** Data attribute for effect binding */
  'data-effect'?: string

  // Page transition options

  /** Skip page transitions for this link (navigate immediately) */
  skipTransition?: boolean
  /** Click handler (called before transition starts) */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}
