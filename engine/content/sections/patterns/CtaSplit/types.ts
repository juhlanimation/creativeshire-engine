import type { BaseSectionProps } from '../base'

export interface CollageImage {
  src: string
  alt: string
}

export interface CtaSplitProps extends BaseSectionProps {
  // === Content ===
  heading?: string
  bodyText?: string
  ctaLabel?: string
  ctaEmail?: string
  collageImages?: CollageImage[] | string

  // === Settings ===
  layout?: 'featured' | 'compact'
  blendMode?: 'screen' | 'multiply' | 'normal'
}
