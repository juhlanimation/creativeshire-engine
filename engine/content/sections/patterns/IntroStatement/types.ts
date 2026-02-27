import type { BaseSectionProps } from '../base'

export interface LogoItem {
  src: string
  alt: string
  name?: string
  height?: number
}

export interface IntroStatementProps extends BaseSectionProps {
  // === Content ===
  heading?: string
  bodyText?: string
  clientLogos?: LogoItem[] | string

  // === Settings ===
  showMarquee?: boolean
  marqueeSpeed?: number
  edgeFade?: boolean
}
