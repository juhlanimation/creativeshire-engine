/**
 * Feature types - static styling decorators for widgets and sections.
 * Features configure intrinsic appearance only (spacing, typography, background, border).
 * Features never animate - if a property changes with scroll/events, use a behaviour.
 */

/**
 * Spacing feature - margin, padding, and gap.
 */
export interface SpacingFeature {
  margin?: string
  padding?: string
  gap?: string | number
}

/**
 * Typography feature - text styling.
 */
export interface TypographyFeature {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right'
  color?: string
}

/**
 * Background feature - color, image, or gradient.
 */
export interface BackgroundFeature {
  color?: string
  image?: string
  gradient?: string
}

/**
 * Border feature - width, color, and radius.
 */
export interface BorderFeature {
  width?: number
  color?: string
  radius?: string
}

/**
 * Collection of feature categories applied to a component.
 * All properties are optional - components use defaults when not specified.
 */
export interface FeatureSet {
  spacing?: SpacingFeature
  typography?: TypographyFeature
  background?: BackgroundFeature
  border?: BorderFeature
}
