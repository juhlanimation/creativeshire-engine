/**
 * Theme schema types.
 * Global visual tokens that can be configured per site.
 */

import type { ScrollbarType } from '../themes/types'

/**
 * Scrollbar styling configuration.
 */
export interface ScrollbarConfig {
  /** Scrollbar shape: thin (sharp), pill (rounded), hidden (none). Default: theme definition or 'thin'. */
  type?: ScrollbarType
  /** Scrollbar width in pixels (default: 6) */
  width?: number
  /** Thumb (handle) color */
  thumb?: string
  /** Track (background) color */
  track?: string
  /** Thumb color in dark mode */
  thumbDark?: string
  /** Track color in dark mode */
  trackDark?: string
}

/**
 * Lenis-specific scroll configuration.
 * Only used when provider is 'lenis'.
 */
export interface LenisConfig {
  /** Scroll animation duration in seconds (default: 0.8) */
  duration?: number
  /** Touch scroll sensitivity multiplier (default: 1.5) */
  touchMultiplier?: number
  /** Wheel scroll sensitivity multiplier (default: 1) */
  wheelMultiplier?: number
}

/**
 * Smooth scroll configuration.
 * Supports GSAP ScrollSmoother or Lenis as the scroll engine.
 */
export interface SmoothScrollConfig {
  /** Enable smooth scrolling (default: true) */
  enabled?: boolean
  /** Scroll engine provider (default: 'gsap') */
  provider?: 'gsap' | 'lenis'
  /** Smoothing intensity for desktop (default: 1.2) */
  smooth?: number
  /** Smoothing intensity for Mac trackpads (default: 0.5) */
  smoothMac?: number
  /** Enable ScrollTrigger effects like parallax (default: true) */
  effects?: boolean
  /** Lenis-specific configuration (ignored when provider is 'gsap') */
  lenis?: LenisConfig
}

/** Font provider for dynamic loading. */
export type FontProvider = 'google' | 'bunny' | 'fontshare'

/**
 * Typography configuration.
 * Maps semantic font roles to CSS variable names.
 */
export interface TypographyConfig {
  /** Font for display / brand text (maps to --font-title) */
  title?: string
  /** Font for section headings h1–h3 (maps to --font-heading) */
  heading?: string
  /** Font for body/paragraph text (maps to --font-paragraph) */
  paragraph?: string
  /** Font for UI elements (maps to --font-ui) */
  ui?: string
  /** Font CDN provider (default: 'google') */
  provider?: FontProvider
}

/**
 * Section transition configuration.
 * Controls how sections animate during scroll-fade effects.
 */
export interface SectionTransitionConfig {
  /** Fade transition duration (e.g., '0.15s', '150ms') */
  fadeDuration?: string
  /** Fade transition easing (e.g., 'ease-out', 'cubic-bezier(...)') */
  fadeEasing?: string
}

/**
 * Site container configuration.
 * Constrains the entire site canvas to a centered column on ultrawide monitors.
 */
export interface ContainerConfig {
  /** Maximum width of site content (CSS value, e.g., '1440px') */
  maxWidth?: string
  /** Background color for the area outside the container */
  outerBackground?: string
  /** Gap between sections — layout preset name, CSS string, or px number */
  sectionGap?: string | number
  /** Multiplier for the section gap value (e.g., 2 doubles the gap) */
  sectionGapScale?: number
}

/**
 * Motion design tokens.
 * Controls animation timing and easing across the site.
 * Injected as CSS variables: --motion-fast, --motion-normal, --motion-slow,
 * --ease-default, --ease-expressive, --ease-smooth.
 *
 * Effect CSS files consume these instead of hardcoded values,
 * enabling "motion personality" swaps via theme alone.
 */
export interface MotionConfig {
  /** Named timing presets (CSS durations) */
  timing?: {
    /** Fast interactions: hovers, toggles (default: '150ms') */
    fast?: string
    /** Standard transitions: fades, slides (default: '300ms') */
    normal?: string
    /** Dramatic reveals: page transitions, hero animations (default: '600ms') */
    slow?: string
  }
  /** Named easing presets (CSS timing functions) */
  easing?: {
    /** Default easing for most transitions (default: 'ease-out') */
    default?: string
    /** Overshooting easing for playful/bouncy feel (default: 'cubic-bezier(0.34, 1.56, 0.64, 1)') */
    expressive?: string
    /** Smooth easing for elegant, understated motion (default: 'ease-in-out') */
    smooth?: string
  }
}

/** Color mode for named themes. */
export type ColorMode = 'dark' | 'light'

/**
 * Theme schema for site-wide visual tokens.
 * Injected as CSS variables at the root level.
 */
export interface ThemeSchema {
  /** Scrollbar styling */
  scrollbar?: ScrollbarConfig
  /** Smooth scroll behavior */
  smoothScroll?: SmoothScrollConfig
  /** Typography font mappings */
  typography?: TypographyConfig
  /** Section transition styling */
  sectionTransition?: SectionTransitionConfig
  /** Site container max-width and outer background */
  container?: ContainerConfig
  /** Motion design tokens (timing and easing presets) */
  motion?: MotionConfig
  /** Named color theme ID (references registered ThemeDefinition) */
  colorTheme?: string
  /** Color mode override (overrides theme's defaultMode) */
  colorMode?: ColorMode
}
