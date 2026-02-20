import type { ProjectExpandProps } from './types'

export const previewProps: Partial<ProjectExpandProps> = {
  logo: {
    src: 'https://picsum.photos/seed/pe-logo/200/60',
    alt: 'Studio logo',
  },
  videos: [
    {
      id: 'pe1',
      thumbnailSrc: 'https://picsum.photos/seed/pe-thumb1/400/300',
      thumbnailAlt: 'Campaign thumbnail',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Brand Campaign',
      client: 'Global Agency',
      studio: 'Creative Studio',
      year: '2024',
      role: 'Director',
    },
    {
      id: 'pe2',
      thumbnailSrc: 'https://picsum.photos/seed/pe-thumb2/400/300',
      thumbnailAlt: 'Product launch thumbnail',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      title: 'Product Launch',
      client: 'Tech Corp',
      studio: 'Motion Lab',
      year: '2023',
      role: 'Editor',
    },
    {
      id: 'pe3',
      thumbnailSrc: 'https://picsum.photos/seed/pe-thumb3/400/300',
      thumbnailAlt: 'Music video thumbnail',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      title: 'Music Video',
      client: 'Record Label',
      studio: 'Visual Works',
      year: '2024',
      role: 'Producer',
    },
    {
      id: 'pe4',
      thumbnailSrc: 'https://picsum.photos/seed/pe-thumb4/400/300',
      thumbnailAlt: 'Documentary thumbnail',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'Documentary',
      client: 'Streaming Network',
      studio: 'Indie Studio',
      year: '2022',
      role: 'Director',
    },
  ],
}
