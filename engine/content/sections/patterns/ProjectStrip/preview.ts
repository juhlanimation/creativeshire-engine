import type { ProjectStripProps } from './types'

// Public test video for Storybook previews
const TEST_VIDEO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const previewProps: Partial<ProjectStripProps> = {
  heading: 'Other Projects',
  yearRange: '2020 \u2014 2024',
  projects: [
    {
      id: 'op1',
      thumbnailSrc: 'https://picsum.photos/seed/op-thumb1/400/300',
      thumbnailAlt: 'Short film thumbnail',
      videoUrl: TEST_VIDEO_URL,
      title: 'Short Film',
      client: 'Film Festival',
      studio: 'Indie Studio',
      year: '2024',
      role: 'Director',
    },
    {
      id: 'op2',
      thumbnailSrc: 'https://picsum.photos/seed/op-thumb2/400/300',
      thumbnailAlt: 'Fashion spot thumbnail',
      videoUrl: TEST_VIDEO_URL,
      title: 'Fashion Spot',
      client: 'Fashion House',
      studio: 'Visual Works',
      year: '2023',
      role: 'Editor',
    },
    {
      id: 'op3',
      thumbnailSrc: 'https://picsum.photos/seed/op-thumb3/400/300',
      thumbnailAlt: 'Documentary thumbnail',
      videoUrl: TEST_VIDEO_URL,
      title: 'Documentary',
      client: 'Streaming Network',
      studio: 'Creative Studio',
      year: '2022',
      role: 'Producer',
    },
    {
      id: 'op4',
      thumbnailSrc: 'https://picsum.photos/seed/op-thumb4/400/300',
      thumbnailAlt: 'Sports commercial thumbnail',
      videoUrl: TEST_VIDEO_URL,
      title: 'Sports Commercial',
      client: 'Athletic Brand',
      studio: 'Motion Lab',
      year: '2021',
      role: 'Director',
    },
  ],
}
