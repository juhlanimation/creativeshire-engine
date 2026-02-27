import { content } from './content'
import type { ProjectExpandProps } from './types'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectExpandProps> = {
  ...content.sampleContent,
  sectionTheme: 'riot-games',
  textColor: 'light',
  galleryHeight: '24rem',
  cursorLabel: 'PLAY',
  logo: {
    ...content.sampleContent.logo,
    invert: true,
  },
  socialLinks,
}
