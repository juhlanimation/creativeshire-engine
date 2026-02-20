import type { ProjectCompareProps } from './types'

export const previewProps: Partial<ProjectCompareProps> = {
  logo: {
    src: 'https://picsum.photos/seed/pc-logo/200/60',
    alt: 'Client logo',
  },
  beforeVideo:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  afterVideo:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  beforeLabel: 'Before',
  afterLabel: 'After',
  description: 'A detailed color grading breakdown showing the transformation from raw footage to final delivery.',
}
