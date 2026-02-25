import type { ProjectGalleryProps } from './types'

const VIDEO_BASE = '/videos/bishoy-gendi'
const IMAGE_BASE = '/images/bishoy-gendi'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectGalleryProps> = {
  sectionHeight: 'viewport-fixed',
  sectionTheme: 'azuki',
  logo: {
    src: `${IMAGE_BASE}/Azuki_logo.png`,
    alt: 'Azuki',
    width: 300,
    invert: true,
  },
  backgroundColor: '#C03540',
  socialLinks,
  textColor: 'light',
  thumbnailBorder: '2px solid #ffffff',
  contentBorder: '2px solid #ffffff',
  accentColor: '#C03540',
  projects: [
    {
      id: 'azuki-reel',
      thumbnail: `${VIDEO_BASE}/azuki-elementals/azuki-reel-vimeo.webm`,
      video: `${VIDEO_BASE}/azuki-elementals/azuki-reel-vimeo.webm`,
      title: 'Azuki Reel',
      year: '2024',
      studio: 'Crossroad',
      role: 'Animation Lead',
      posterTime: 4,
    },
    {
      id: 'proof-of-skate',
      thumbnail: `${VIDEO_BASE}/azuki-elementals/proof-of-skate.webm`,
      video: `${VIDEO_BASE}/azuki-elementals/proof-of-skate.webm`,
      title: 'Proof of Skate',
      year: '2022',
      studio: 'Juhl Animation',
      role: 'Animation Lead',
      posterTime: 3,
    },
    {
      id: 'azukimoser',
      thumbnail: `${VIDEO_BASE}/azuki-elementals/azukimoser.webm`,
      video: `${VIDEO_BASE}/azuki-elementals/azukimoser.webm`,
      title: 'H. Moser & Cie',
      year: '2025',
      studio: 'Crossroad',
      role: 'Animation Lead',
      posterTime: 2,
    },
    {
      id: 'animecoin',
      thumbnail: `${VIDEO_BASE}/azuki-elementals/animecoin.webm`,
      video: `${VIDEO_BASE}/azuki-elementals/animecoin.webm`,
      title: 'AnimeCoin',
      year: '2025',
      studio: 'Crossroad',
      role: 'Animation Lead',
      posterTime: 5,
    },
  ],
}
