import { content } from './content'
import type { ProjectVideoGridProps } from './types'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectVideoGridProps> = {
  ...content.sampleContent,
  sectionTheme: 'supercell',
  colorMode: 'dark',
  textColor: 'light',
  hoverPlay: true,
  logo: {
    ...content.sampleContent.logo,
    invert: true,
  },
  socialLinks,
}
