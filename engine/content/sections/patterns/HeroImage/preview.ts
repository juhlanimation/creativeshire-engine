import { content } from './content'
import type { HeroImageProps } from './types'

export const previewProps: Partial<HeroImageProps> = {
  ...content.sampleContent,
  colorMode: 'dark',
}
