import { content } from './content'
import type { IntroStatementProps } from './types'

export const previewProps: Partial<IntroStatementProps> = {
  ...content.sampleContent,
  colorMode: 'dark',
}
