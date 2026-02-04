/**
 * AboutSection pattern props interface.
 * Bio section with photo background and logo marquee.
 */

/**
 * Logo item for marquee display.
 */
export interface LogoItem {
  /** Logo name for identification */
  name: string
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Display height in pixels - adjust per logo for visual balance */
  height: number
}

/**
 * Link item for bio text.
 */
export interface BioLink {
  /** Link display text */
  text: string
  /** Link destination */
  href: string
}

/**
 * Props for the createAboutSection factory.
 */
export interface AboutProps {
  /** Section ID override (default: 'about') */
  id?: string
  /** Bio paragraphs - supports binding expressions */
  bioParagraphs: string[] | string
  /** Links within bio text (optional) - supports binding expressions */
  links?: BioLink[] | string
  /** Signature text (e.g., "Bo Juhl") */
  signature: string
  /** Photo background source */
  photoSrc: string
  /** Photo alt text */
  photoAlt: string
  /** Client logos for marquee (visible tablet+) - supports binding expressions */
  clientLogos?: LogoItem[] | string
  /** Marquee animation duration in seconds (default: 30) */
  marqueeDuration?: number
}
