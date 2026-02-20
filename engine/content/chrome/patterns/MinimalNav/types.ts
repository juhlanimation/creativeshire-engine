/**
 * MinimalNav chrome pattern types.
 * Right-aligned header pattern with navigation links and contact email.
 */

export interface MinimalNavProps {
  navLinks: Array<{ label: string; href: string }> | string
  email: string
  blendMode?: 'normal' | 'difference'
  linkHoverStyle?: 'opacity' | 'underline'
}
