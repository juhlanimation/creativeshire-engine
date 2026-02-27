import type { BaseSectionProps } from '../base'

export interface CollageImage {
  src: string
  alt: string
}

export interface HeroStatementProps extends BaseSectionProps {
  // === Content ===
  heading?: string
  bodyTextLeft?: string
  bodyTextRight?: string
  collageImages?: CollageImage[] | string
  ctaLabel?: string
  ctaEmail?: string

  // === Settings ===
  headingColor?: string
  bodyColumns?: '1' | '2'
  blendMode?: 'screen' | 'multiply' | 'normal'
}
