import { content } from './content'
import type { ProjectShowcaseProps } from './types'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectShowcaseProps> = {
  ...content.sampleContent,
  sectionTheme: 'boy-mole',
  colorMode: 'light',
  textColor: 'dark',
  videoBorder: true,
  socialLinks,
}
