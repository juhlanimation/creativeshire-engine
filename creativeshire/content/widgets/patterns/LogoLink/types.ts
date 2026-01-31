/**
 * LogoLink composite configuration.
 * Factory function props for creating logo link widget schemas.
 */

import type { CSSProperties } from 'react'

/**
 * Configuration for the createLogoLink factory.
 */
export interface LogoLinkConfig {
  /** Unique identifier for the logo link */
  id?: string
  /** Logo text (if no image) */
  text?: string
  /** Logo image src (if no text) */
  imageSrc?: string
  /** Alt text for image (defaults to 'Logo') */
  imageAlt?: string
  /** Link href (defaults to '/') */
  href?: string
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: CSSProperties
}
