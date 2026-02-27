import { content } from './content'
import type { ProjectScrollProps } from './types'

export const previewProps: Partial<ProjectScrollProps> = {
  ...content.sampleContent,
  colorMode: 'dark',
}
