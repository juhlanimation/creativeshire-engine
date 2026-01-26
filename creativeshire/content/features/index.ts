/**
 * Features utility for converting FeatureSet to CSS properties.
 * Pure functions only - no hooks, no side effects.
 */

import type { CSSProperties } from 'react'
import type {
  FeatureSet,
  SpacingFeature,
  TypographyFeature,
  BackgroundFeature,
  BorderFeature,
} from './types'

/**
 * Typography size to CSS font-size mapping.
 */
const sizeMap: Record<string, string> = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
}

/**
 * Apply spacing feature to CSS properties.
 */
function applySpacing(feature?: SpacingFeature): CSSProperties {
  if (!feature) return {}
  return {
    margin: feature.margin,
    padding: feature.padding,
    gap: feature.gap,
  }
}

/**
 * Apply typography feature to CSS properties.
 */
function applyTypography(feature?: TypographyFeature): CSSProperties {
  if (!feature) return {}
  return {
    fontSize: feature.size ? sizeMap[feature.size] : undefined,
    fontWeight: feature.weight,
    textAlign: feature.align,
    color: feature.color,
  }
}

/**
 * Apply background feature to CSS properties.
 */
function applyBackground(feature?: BackgroundFeature): CSSProperties {
  if (!feature) return {}

  const styles: CSSProperties = {}

  if (feature.color) {
    styles.backgroundColor = feature.color
  }

  if (feature.image) {
    styles.backgroundImage = `url(${feature.image})`
    styles.backgroundSize = 'cover'
    styles.backgroundPosition = 'center'
  }

  if (feature.gradient) {
    styles.backgroundImage = feature.gradient
  }

  return styles
}

/**
 * Apply border feature to CSS properties.
 */
function applyBorder(feature?: BorderFeature): CSSProperties {
  if (!feature) return {}
  return {
    borderWidth: feature.width,
    borderColor: feature.color,
    borderRadius: feature.radius,
    borderStyle: feature.width || feature.color ? 'solid' : undefined,
  }
}

/**
 * Convert a FeatureSet to CSS properties.
 * Pure function - no hooks, no side effects.
 *
 * @param features - Optional FeatureSet to convert
 * @returns CSSProperties object ready for inline styles
 */
export function featuresToStyle(features?: FeatureSet): CSSProperties {
  if (!features) return {}

  return {
    ...applySpacing(features.spacing),
    ...applyTypography(features.typography),
    ...applyBackground(features.background),
    ...applyBorder(features.border),
  }
}

// Re-export types for convenience
export type {
  FeatureSet,
  SpacingFeature,
  TypographyFeature,
  BackgroundFeature,
  BorderFeature,
} from './types'
