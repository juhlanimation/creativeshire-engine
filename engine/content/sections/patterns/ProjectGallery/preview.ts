import type { ProjectGalleryProps } from './types'

export const previewProps: Partial<ProjectGalleryProps> = {
  logo: {
    src: 'https://picsum.photos/seed/pg-logo/200/60',
    alt: 'Studio logo',
  },
  projects: [
    {
      id: 'pg1',
      thumbnail: 'https://picsum.photos/seed/pg-thumb1/400/300',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Brand Campaign',
      year: '2024',
      studio: 'Creative Studio',
    },
    {
      id: 'pg2',
      thumbnail: 'https://picsum.photos/seed/pg-thumb2/400/300',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      title: 'Product Launch',
      year: '2023',
      studio: 'Motion Lab',
    },
    {
      id: 'pg3',
      thumbnail: 'https://picsum.photos/seed/pg-thumb3/400/300',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      title: 'Music Video',
      year: '2024',
      studio: 'Visual Works',
    },
    {
      id: 'pg4',
      thumbnail: 'https://picsum.photos/seed/pg-thumb4/400/300',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'Documentary',
      year: '2022',
      studio: 'Indie Studio',
    },
  ],
}
