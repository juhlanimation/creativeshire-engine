import type { BaseSectionProps } from '../base'

export interface TeamMember {
  name: string
  bio: string
  imageSrc: string
  overlayImageSrc?: string
  accentColor: string
  email?: string
  linkedinUrl?: string
}

export interface TeamBioProps extends BaseSectionProps {
  // === Content ===
  members?: TeamMember[] | string

  // === Settings ===
  columns?: '1' | '2'
  nameScale?: 'large' | 'xl'
}
