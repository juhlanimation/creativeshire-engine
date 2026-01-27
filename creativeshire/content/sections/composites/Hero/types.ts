/**
 * HeroSection composite props interface.
 * Full viewport hero with video background and role titles.
 */

/**
 * Props for the createHeroSection factory.
 */
export interface HeroProps {
  /** Section ID override (default: 'hero') */
  id?: string
  /** Intro text (e.g., "I'm Bo Juhl") */
  introText: string
  /** Array of role titles (e.g., ["EXECUTIVE PRODUCER", "PRODUCER", "EDITOR"]) */
  roles: string[]
  /** Scroll indicator text (default: "(SCROLL)") */
  scrollIndicatorText?: string
  /** Background video source */
  videoSrc: string
  /** Video poster/fallback image */
  videoPoster?: string
}
