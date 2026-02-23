/**
 * HeroTitle pattern props interface.
 * Full viewport hero with video background and centered title + tagline.
 */

import type { CSSProperties } from 'react'
import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { BaseSectionProps } from '../base'

/**
 * Text style configuration for hero title elements.
 */
export interface HeroTitleStyles {
  /** Style for centered title */
  title?: CSSProperties
  /** Style for tagline below title */
  tagline?: CSSProperties
  /** Style for scroll indicator */
  scrollIndicator?: CSSProperties
}

/**
 * Default styles used when not overridden by preset.
 */
export const DEFAULT_HERO_TITLE_STYLES: HeroTitleStyles = {
  title: {
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'white',
    mixBlendMode: 'difference'
  },
  tagline: {
    fontWeight: 400,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    marginTop: 'var(--spacing-md, 1rem)',
    color: 'white',
    mixBlendMode: 'difference'
  },
  scrollIndicator: {
    fontWeight: 700,
    letterSpacing: '1.4px',
    color: 'white',
    mixBlendMode: 'difference'
  }
}

/**
 * Props for the createHeroTitleSection factory.
 *
 * Centered title + optional tagline layout over a video background.
 */
export interface HeroTitleProps extends BaseSectionProps {
  // === Content ===
  /** Large centered title */
  title?: string
  /** Subtitle below centered title */
  tagline?: string
  /** Scroll indicator text */
  scrollIndicatorText?: string

  // === Media ===
  /** Background video source */
  videoSrc?: string
  /** Video poster/fallback image */
  videoPoster?: string
  /** Custom loop point passed to Video widget (seconds to restart from) */
  loopStartTime?: number | string
  /** Mark video as intro video for the intro timing system */
  introVideo?: boolean

  // === Typography scale ===
  /** Scale for centered title (default: 'display') */
  titleScale?: TextElement
  /** Multiplier applied to title font-size (default: 3) */
  titleSizeMultiplier?: number
  /** Scale for tagline below title (default: 'h3') */
  taglineScale?: TextElement
  /** Scale for scroll indicator (default: 'small') */
  scrollIndicatorScale?: TextElement

  // === Styles (how to display - from preset) ===
  /** Text style configuration - overrides defaults */
  styles?: HeroTitleStyles
}
