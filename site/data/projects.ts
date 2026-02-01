/**
 * Project data for the bojuhl portfolio.
 * Sourced from reference implementation.
 */

import type { FeaturedProject } from '@/engine/content/sections/patterns/FeaturedProjects/types'
import type { OtherProject } from '@/engine/content/sections/patterns/OtherProjects/types'

/**
 * Featured projects - shown with full cards and descriptions.
 * Using 2 projects with video sets as requested.
 */
// Public test video for development (Big Buck Bunny - Blender Foundation, CC)
const TEST_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export const featuredProjects: FeaturedProject[] = [
  {
    thumbnailSrc: '/images/01-elements-of-time/thumbnail.webp',
    thumbnailAlt: 'Elements of Time thumbnail',
    videoSrc: '/videos/01-elements-of-time/hover.webm',
    videoUrl: TEST_VIDEO_URL, // Using test video for development
    title: 'ELEMENTS OF TIME',
    description: "The film brings to life the Elementals' four domains, blending anime-inspired storytelling with the timeless craft of Swiss watchmaking.",
    year: '2025',
    role: 'Executive Producer, Producer',
    client: 'AZUKI',
    studio: 'CROSSROAD STUDIO',
  },
  {
    thumbnailSrc: '/images/02-tower-reveal/thumbnail.webp',
    thumbnailAlt: 'Tower Reveal thumbnail',
    videoSrc: '/videos/02-tower-reveal/hover.webm',
    videoUrl: TEST_VIDEO_URL, // Using test video for development
    title: 'TOWER REVEAL',
    description: "A two-film campaign announcing Tower Troops, a new card type that introduces a fresh defensive strategy to Clash Royale. The spots positioned Tower Troops as a significant evolution of the Clash Royale meta.",
    year: '2024',
    role: 'Executive Producer',
    client: 'SUPERCELL',
    studio: 'SUN CREATURE',
  },
]

/**
 * Other projects - shown as thumbnails in horizontal gallery.
 */
export const otherProjects: OtherProject[] = [
  {
    id: 'genshin-impact',
    thumbnailSrc: '/images/other-projects/genshin-impact-thumbnail.webp',
    thumbnailAlt: 'Genshin Impact thumbnail',
    videoSrc: '/videos/other-projects/genshin-impact-hover.webm',
    videoUrl: '/videos/other-projects/genshin-impact-full.webm',
    title: 'SCENERY AND SENTIMENT',
    year: '2023',
    role: 'Executive Producer',
    client: 'HOYOVERSE',
    studio: 'SUN CREATURE',
  },
  {
    id: 'its-on',
    thumbnailSrc: '/images/other-projects/its-on-thumbnail.webp',
    thumbnailAlt: "It's On thumbnail",
    videoSrc: '/videos/other-projects/its-on-hover.webm',
    videoUrl: '/videos/other-projects/its-on-full.webm',
    title: "IT'S ON!",
    year: '2018',
    role: 'Executive Producer, Editor',
    client: 'RIOT GAMES',
    studio: 'SUN CREATURE',
  },
  {
    id: 'marvel-midnight-sun',
    thumbnailSrc: '/images/other-projects/marvel-thumbnail.webp',
    thumbnailAlt: 'Marvel Midnight Sun thumbnail',
    videoSrc: '/videos/other-projects/marvel-hover.webm',
    videoUrl: '/videos/other-projects/marvel-full.webm',
    title: 'MARVEL MIDNIGHT SUN',
    year: '2022',
    role: 'Executive Producer',
    client: '2K GAMES',
    studio: 'SUN CREATURE',
  },
  {
    id: 'ninjago-legacy',
    thumbnailSrc: '/images/other-projects/ninjago-thumbnail.webp',
    thumbnailAlt: 'Ninjago Legacy thumbnail',
    videoSrc: '/videos/other-projects/ninjago-hover.webm',
    videoUrl: '/videos/other-projects/ninjago-full.webm',
    title: 'NINJAGO LEGACY',
    year: '2021',
    role: 'Executive Producer',
    client: 'LEGO',
    studio: 'SUN CREATURE',
  },
  {
    id: 'the-goblin-queen',
    thumbnailSrc: '/images/other-projects/the-goblin-queen-thumbnail.webp',
    thumbnailAlt: 'The Goblin Queen thumbnail',
    videoSrc: '/videos/other-projects/the-goblin-queen-hover.webm',
    videoUrl: '/videos/other-projects/the-goblin-queen-full.webm',
    title: 'THE GOBLIN QUEEN',
    year: '2024',
    role: 'Executive Producer',
    client: 'SUPERCELL',
    studio: 'SUN CREATURE',
  },
]
