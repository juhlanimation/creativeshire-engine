import type { ProjectCompareProps } from './types'

const VIDEO_BASE = '/videos/bishoy-gendi'
const IMAGE_BASE = '/images/bishoy-gendi'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectCompareProps> = {
  sectionTheme: 'the21',
  colorMode: 'light',
  textColor: 'dark',
  contentBackground: '#3B3D2E',
  videoBackground: '#232416',
  descriptionColor: '#FDF9F0',
  logo: {
    src: `${IMAGE_BASE}/The21_Logo_Green.webp`,
    alt: 'THE 21',
    width: 120,
  },
  studio: 'WellHello Productions',
  role: 'Character Animator',
  beforeVideo: `${VIDEO_BASE}/the21/seq1-reel.webm`,
  afterVideo: `${VIDEO_BASE}/the21/seq1-tiedown.webm`,
  beforeLabel: 'Final',
  afterLabel: 'Tiedown',
  description: 'The 21 is a short animated film shaped by neo-Coptic iconography, produced in collaboration with the global Coptic Community by a team of 70+ artists from more than 24 countries.',
  socialLinks,
}
