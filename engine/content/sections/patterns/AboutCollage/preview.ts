/**
 * AboutCollage section preview data for Storybook.
 */

import type { AboutCollageProps } from './types'

export const previewProps: Partial<AboutCollageProps> = {
  text: 'We are a creative studio based in Copenhagen, specializing in brand identity, digital experiences, and visual storytelling. Our approach combines strategic thinking with bold design to create memorable experiences.',
  images: [
    { src: 'https://picsum.photos/seed/collage1/800/1067', alt: 'Studio photo 1' },
    { src: 'https://picsum.photos/seed/collage2/800/533', alt: 'Studio photo 2' },
    { src: 'https://picsum.photos/seed/collage3/800/1067', alt: 'Studio photo 3' },
    { src: 'https://picsum.photos/seed/collage4/800/533', alt: 'Studio photo 4' },
  ],
}
