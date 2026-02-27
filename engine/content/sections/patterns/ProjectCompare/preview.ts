import { content } from './content'
import type { ProjectCompareProps } from './types'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectCompareProps> = {
  ...content.sampleContent,
  sectionTheme: 'the21',
  colorMode: 'light',
  textColor: 'dark',
  contentBackground: '#3B3D2E',
  videoBackground: '#232416',
  descriptionColor: '#FDF9F0',
  studio: 'WellHello Productions',
  role: 'Character Animator',
  socialLinks,
}
