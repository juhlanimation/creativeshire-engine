/**
 * HeroSection pattern props interface.
 * Full viewport hero with video background and role titles.
 *
 * Separates content (what to display) from styles (how to display).
 * Presets provide style configuration; content comes from site data.
 */

import type { CSSProperties } from 'react'

/**
 * Text style configuration for hero elements.
 * Uses CSSProperties for direct inline styling.
 */
export interface HeroTextStyles {
  /** Style for intro text (e.g., "I'm Bo Juhl") */
  intro?: CSSProperties
  /** Style for role title headings */
  roleTitle?: CSSProperties
  /** Style for scroll indicator */
  scrollIndicator?: CSSProperties
}

/**
 * Default styles used when not overridden by preset.
 */
export const DEFAULT_HERO_STYLES: HeroTextStyles = {
  intro: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.05em',
    color: 'white',
    mixBlendMode: 'difference'
  },
  roleTitle: {
    fontFamily: 'var(--font-title, Inter, system-ui, sans-serif)',
    fontSize: '2.25rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'white'
  },
  scrollIndicator: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: 'white'
  }
}

/**
 * Props for the createHeroSection factory.
 */
export interface HeroProps {
  /** Section ID override (default: 'hero') */
  id?: string

  // === Content (what to display) ===
  /** Intro text (e.g., "I'm Bo Juhl") */
  introText: string
  /** Array of role titles (e.g., ["EXECUTIVE PRODUCER", "PRODUCER", "EDITOR"]) - supports binding expressions */
  roles: string[] | string
  /** Scroll indicator text (default: "(SCROLL)") */
  scrollIndicatorText?: string
  /** Background video source */
  videoSrc: string
  /** Video poster/fallback image */
  videoPoster?: string

  // === Styles (how to display - from preset) ===
  /** Text style configuration - overrides defaults */
  styles?: HeroTextStyles
}
