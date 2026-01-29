/**
 * Theme schema types.
 * Global visual tokens that can be configured per site.
 */

/**
 * Scrollbar styling configuration.
 */
export interface ScrollbarConfig {
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
 * Smooth scroll configuration.
 * Uses GSAP ScrollSmoother for butter-smooth scrolling.
 */
export interface SmoothScrollConfig {
  /** Enable smooth scrolling (default: true) */
  enabled?: boolean
  /** Smoothing intensity for desktop (default: 1.2) */
  smooth?: number
  /** Smoothing intensity for Mac trackpads (default: 0.5) */
  smoothMac?: number
  /** Enable ScrollTrigger effects like parallax (default: true) */
  effects?: boolean
}

/**
 * Typography configuration.
 * Maps semantic font roles to CSS variable names.
 */
export interface TypographyConfig {
  /** Font for titles/headings (maps to --font-title) */
  title?: string
  /** Font for body/paragraph text (maps to --font-paragraph) */
  paragraph?: string
  /** Font for UI elements (maps to --font-ui) */
  ui?: string
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
}
