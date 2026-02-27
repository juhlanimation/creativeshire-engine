import { content } from './content'
import type { ProjectGalleryProps } from './types'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectGalleryProps> = {
  ...content.sampleContent,
  sectionHeight: 'viewport-fixed',
  sectionTheme: 'azuki',
  textColor: 'light',
  thumbnailBorder: '2px solid #ffffff',
  contentBorder: '2px solid #ffffff',
  logo: {
    ...content.sampleContent.logo,
    invert: true,
  },
  socialLinks,
}
