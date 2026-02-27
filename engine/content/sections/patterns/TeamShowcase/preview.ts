import { content } from './content'
import type { TeamShowcaseProps } from './types'

export const previewProps: Partial<TeamShowcaseProps> = {
  ...content.sampleContent,
}
