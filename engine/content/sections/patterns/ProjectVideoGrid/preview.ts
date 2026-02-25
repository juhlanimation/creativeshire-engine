import type { ProjectVideoGridProps } from './types'

const VIDEO_BASE = '/videos/bishoy-gendi'
const IMAGE_BASE = '/images/bishoy-gendi'

const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/bishoygendi' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/bishoy-gendi-a48b4944/' },
  { platform: 'email', url: 'bishoygendi@yahoo.co.uk' },
]

export const previewProps: Partial<ProjectVideoGridProps> = {
  sectionTheme: 'supercell',
  colorMode: 'dark',
  textColor: 'light',
  logo: {
    src: `${IMAGE_BASE}/Supercell-logo-alpha.webp`,
    alt: 'Supercell',
    width: 200,
    invert: true,
  },
  hoverPlay: true,
  videos: [
    { src: `${VIDEO_BASE}/clash-royale/bigboi-green.webm`, title: 'BigBoi Green', aspectRatio: '9/16', posterTime: 1 },
    { src: `${VIDEO_BASE}/clash-royale/goblin-machine.webm`, title: 'Goblin Machine', aspectRatio: '9/16', posterTime: 1 },
    { src: `${VIDEO_BASE}/clash-royale/dagger-duchess.webm`, title: 'Dagger Duchess', aspectRatio: '16/9', posterTime: 1 },
    { src: `${VIDEO_BASE}/clash-royale/rune-giant.webm`, title: 'Rune Giant', aspectRatio: '16/9', posterTime: 1 },
  ],
  socialLinks,
}
