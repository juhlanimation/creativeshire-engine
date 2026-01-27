/**
 * AboutSection composite props interface.
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
  /** Bio paragraphs */
  bioParagraphs: string[]
  /** Links within bio text (optional) */
  links?: BioLink[]
  /** Signature text (e.g., "Bo Juhl") */
  signature: string
  /** Photo background source */
  photoSrc: string
  /** Photo alt text */
  photoAlt: string
  /** Client logos for marquee (visible tablet+) */
  clientLogos?: LogoItem[]
}
