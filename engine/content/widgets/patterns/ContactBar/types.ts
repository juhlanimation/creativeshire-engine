/**
 * ContactBar pattern configuration.
 * Reusable footer bar with contact prompt for sections.
 */

export interface SocialLink {
  /** Platform identifier (e.g., 'instagram', 'linkedin') */
  platform: string
  /** URL to social profile */
  href: string
  /** Icon name or custom icon */
  icon?: string
}

export interface ContactBarConfig {
  /** Unique identifier */
  id?: string
  /** Email address for copy-to-clipboard */
  email: string
  /** Optional prompt text (default: none, just shows email) */
  prompt?: string
  /** Social media links (optional) */
  socialLinks?: SocialLink[]
  /** Text color mode */
  textColor?: 'light' | 'dark'
  /** Horizontal alignment */
  align?: 'start' | 'center' | 'end' | 'between'
}
