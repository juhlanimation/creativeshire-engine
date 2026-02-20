import type { TeamShowcaseProps } from './types'

export const previewProps: Partial<TeamShowcaseProps> = {
  members: [
    {
      id: 'member1',
      name: 'Alex Rivera',
      subtitle: 'Director',
      videoSrc:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoPoster: 'https://picsum.photos/seed/member1/1280/720',
    },
    {
      id: 'member2',
      name: 'Jordan Chen',
      subtitle: 'Producer',
      videoSrc:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      videoPoster: 'https://picsum.photos/seed/member2/1280/720',
    },
    {
      id: 'member3',
      name: 'Sam Taylor',
      subtitle: 'Editor',
      videoSrc:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      videoPoster: 'https://picsum.photos/seed/member3/1280/720',
    },
    {
      id: 'member4',
      name: 'Morgan Blake',
      subtitle: 'Colorist',
      videoSrc:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      videoPoster: 'https://picsum.photos/seed/member4/1280/720',
    },
  ],
  labelText: 'We are',
}
