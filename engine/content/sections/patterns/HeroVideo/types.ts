/**
 * HeroSection pattern props interface.
 * Full viewport hero with video background and role titles.
 *
 * Separates content (what to display) from styles (how to display).
 * Presets provide style configuration; content comes from site data.
 */

import type { CSSProperties } from 'react'
import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { BaseSectionProps } from '../base'

/**
 * Text style configuration for hero elements.
 * Uses CSSProperties for direct inline styling.
 */
export interface HeroTextStyles {
  /** Style for intro text (e.g., "I'm Alex Morgan") */
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
    fontWeight: 500,
    letterSpacing: '0.025em',
    color: 'white',
    mixBlendMode: 'difference'
  },
  roleTitle: {
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: 'white',
    mixBlendMode: 'difference'
  },
  scrollIndicator: {
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: '1.4px',
    color: 'white',
    mixBlendMode: 'difference'
  }
}

/**
 * Props for the createHeroVideoSection factory.
 *
 * Bottom-aligned intro text + role titles over a video background.
 */
export interface HeroVideoProps extends BaseSectionProps {
  // === Content ===
  /** Intro text (e.g., "I'm Alex Morgan") — defaults to {{ content.hero.introText }} */
  introText?: string
  /** Array of role titles (e.g., ["EXECUTIVE PRODUCER", "PRODUCER", "EDITOR"]) — defaults to {{ content.hero.roles }} */
  roles?: string[] | string
  /** Scroll indicator text — defaults to {{ content.hero.scrollIndicatorText }} */
  scrollIndicatorText?: string

  // === Media ===
  /** Background video source — defaults to {{ content.hero.videoSrc }} */
  videoSrc?: string
  /** Video poster/fallback image */
  videoPoster?: string
  /** Custom loop point passed to Video widget (seconds to restart from) */
  loopStartTime?: number | string
  /** Mark video as intro video for the intro timing system */
  introVideo?: boolean

  // === Layout ===
  /** Content distance from bottom edge as % of viewport height (default: 12) */
  bottomOffset?: number

  // === Typography scale ===
  /** Scale for intro text (default: 'body') */
  introScale?: TextElement
  /** Scale for role title headings (default: 'display') */
  roleTitleScale?: TextElement
  /** Scale for scroll indicator (default: 'small') */
  scrollIndicatorScale?: TextElement

  // === Styles (how to display - from preset) ===
  /** Text style configuration - overrides defaults */
  styles?: HeroTextStyles
}
