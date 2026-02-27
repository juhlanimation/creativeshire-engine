import { content } from './content'
import type { HeroStatementProps } from './types'

export const previewProps: Partial<HeroStatementProps> = {
  ...content.sampleContent,
  colorMode: 'light',
}
