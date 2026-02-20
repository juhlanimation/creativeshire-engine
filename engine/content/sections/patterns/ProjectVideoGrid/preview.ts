import type { ProjectVideoGridProps } from './types'

export const previewProps: Partial<ProjectVideoGridProps> = {
  logo: {
    src: 'https://picsum.photos/seed/pvg-logo/200/60',
    alt: 'Studio logo',
  },
  videos: [
    { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Brand Film', aspectRatio: '16:9', column: 'left' },
    { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', title: 'Social Spot', aspectRatio: '9:16', column: 'right' },
    { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', title: 'Product Reel', aspectRatio: '1:1', column: 'left' },
    { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'Event Recap', aspectRatio: '16:9', column: 'right' },
  ],
}
