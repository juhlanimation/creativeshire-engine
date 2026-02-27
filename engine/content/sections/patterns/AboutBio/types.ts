/**
 * AboutSection pattern props interface.
 * Bio section with photo background and logo marquee.
 */

import type { BaseSectionProps } from '../base'

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
 * Props for the createAboutBioSection factory.
 */
export interface AboutBioProps extends BaseSectionProps {
  /** Bio paragraphs — defaults to {{ content.about.bioParagraphs }} */
  bioParagraphs?: string[] | string
  /** Links within bio text (optional) - supports binding expressions */
  links?: BioLink[] | string
  /** Signature text — defaults to {{ content.about.signature }} */
  signature?: string
  /** Photo background source — defaults to {{ content.about.photoSrc }} */
  photoSrc?: string
  /** Photo alt text — defaults to {{ content.about.photoAlt }} */
  photoAlt?: string
  /** Client logos for marquee — defaults to {{ content.about.clientLogos }} */
  clientLogos?: LogoItem[] | string
  /** Marquee animation duration in seconds (default: 43) */
  marqueeDuration?: number
  /** Apply inverted color filter to logos — white on dark backgrounds (default: true) */
  invertLogos?: boolean
  /** Distance from bottom edge as % of section height (default: 2). 0 = flush bottom. */
  marqueeOffset?: number

  // === Bio layout ===
  /** Max width of bio text container in px (default: 500) */
  bioMaxWidth?: number
  /** Vertical offset of bio content from top as % of section height (default: 0). Pushes content down. */
  bioOffset?: number

}
