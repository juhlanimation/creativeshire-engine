import { content } from './content'
import type { TeamBioProps } from './types'

export const previewProps: Partial<TeamBioProps> = {
  ...content.sampleContent,
  colorMode: 'dark',
}
