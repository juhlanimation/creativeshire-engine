import type { ProjectTabsProps } from './types'

export const previewProps: Partial<ProjectTabsProps> = {
  tabs: [
    {
      id: 'commercials',
      label: 'Commercials',
      layout: 'standard' as const,
      info: {
        title: 'Commercial Reel',
        client: 'Various Brands',
        studio: 'Creative Studio',
        role: 'Director',
      },
      videos: [
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Brand Film' },
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', title: 'Product Spot' },
      ],
    },
    {
      id: 'music-videos',
      label: 'Music Videos',
      layout: 'compact' as const,
      videos: [
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', title: 'Visual Narrative' },
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', title: 'Performance Piece' },
      ],
    },
    {
      id: 'short-films',
      label: 'Short Films',
      layout: 'standard' as const,
      info: {
        title: 'Short Film Collection',
        client: 'Film Festival',
        studio: 'Indie Studio',
        role: 'Writer / Director',
      },
      videos: [
        { src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Drama' },
      ],
    },
  ],
  defaultTab: 'commercials',
}
