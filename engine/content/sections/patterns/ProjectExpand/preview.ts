import type { ProjectExpandProps } from './types'

const IMAGE_BASE = '/images/bishoy-gendi'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectExpandProps> = {
  sectionTheme: 'riot-games',
  textColor: 'light',
  logo: {
    src: `${IMAGE_BASE}/Riot_Games_2022.svg.png`,
    alt: 'Riot Games',
    width: 120,
    invert: true,
  },
  galleryHeight: '24rem',
  cursorLabel: 'PLAY',
  socialLinks,
  videos: [
    {
      id: 'legends-of-runeterra',
      thumbnailSrc: '/videos/bishoy-gendi/riot-games/legends-of-runeterra.webm',
      thumbnailAlt: 'Legends of Runeterra',
      videoUrl: '/videos/bishoy-gendi/riot-games/legends-of-runeterra.webm',
      title: 'Legends of Runeterra',
      client: 'Riot Games',
      studio: 'Riot Games',
      year: '2024',
      role: 'Animator',
    },
    {
      id: 'lol-crcr',
      thumbnailSrc: '/videos/bishoy-gendi/riot-games/lol-crcr.webm',
      thumbnailAlt: 'LOL x Clash Royale',
      videoUrl: '/videos/bishoy-gendi/riot-games/lol-crcr.webm',
      title: 'LOL x Clash Royale',
      client: 'Riot Games',
      studio: 'Riot Games',
      year: '2023',
      role: 'Animator',
    },
    {
      id: 'star-guardian',
      thumbnailSrc: '/videos/bishoy-gendi/riot-games/star-guardian.webm',
      thumbnailAlt: 'Star Guardian',
      videoUrl: '/videos/bishoy-gendi/riot-games/star-guardian.webm',
      title: 'Star Guardian',
      client: 'Riot Games',
      studio: 'Riot Games',
      year: '2023',
      role: 'Animator',
    },
  ],
}
