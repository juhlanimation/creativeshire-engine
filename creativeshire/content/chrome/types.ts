/**
 * Chrome component type definitions.
 * Chrome provides persistent UI outside page content.
 */

import type { FeatureSet } from '../../schema/features'

/**
 * Base props that all chrome components must accept.
 */
export interface ChromeBaseProps {
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}

/**
 * Navigation link item.
 */
export interface NavLink {
  /** Display text */
  label: string
  /** Link destination */
  href: string
}

/**
 * Social link item.
 */
export interface SocialLink {
  /** Platform name (e.g., "linkedin", "instagram") */
  platform: string
  /** Link URL */
  url: string
}
