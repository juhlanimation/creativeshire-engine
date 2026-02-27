import type { BaseSectionProps } from '../base'

export interface HeroImageProps extends BaseSectionProps {
  // === Content ===
  imageSrc?: string
  imageAlt?: string

  // === Settings ===
  showScrollArrow?: boolean
  parallaxRate?: number
  overlayOpacity?: number
}
