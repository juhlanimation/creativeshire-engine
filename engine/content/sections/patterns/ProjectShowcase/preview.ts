import type { ProjectShowcaseProps } from './types'

const VIDEO_BASE = '/videos/bishoy-gendi'
const IMAGE_BASE = '/images/bishoy-gendi'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectShowcaseProps> = {
  sectionTheme: 'boy-mole',
  colorMode: 'light',
  textColor: 'dark',
  logo: {
    src: `${IMAGE_BASE}/the-boy-mole-fox-horse-logo.webp`,
    alt: 'The Boy, the Mole, the Fox and the Horse',
    width: 300,
  },
  studio: 'WellHello Productions',
  role: 'Character Animator',
  videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/reel.webm`,
  videoBorder: true,
  shots: [
    { id: 275, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/275.webm` },
    { id: 300, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/300.webm` },
    { id: 310, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/310.webm` },
    { id: 330, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/330.webm` },
    { id: 490, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/490.webm` },
    { id: 500, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/500.webm` },
    { id: 510, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/510.webm` },
    { id: 520, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/520.webm` },
  ],
  socialLinks,
}
