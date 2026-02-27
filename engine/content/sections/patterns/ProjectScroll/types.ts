import type { BaseSectionProps } from '../base'

export interface ProjectItem {
  title: string
  client: string
  description: string
  imageSrc: string
  overlayImageSrc?: string
  videoSrc?: string
}

export interface ProjectScrollProps extends BaseSectionProps {
  // === Content ===
  sectionTitle?: string
  introText?: string
  projects?: ProjectItem[] | string

  // === Settings ===
  sidebarWidth?: 'narrow' | 'default' | 'wide'
  cardBorder?: boolean
  fadeOverlay?: boolean
  fadeStart?: number
}
