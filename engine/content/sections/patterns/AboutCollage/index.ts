/**
 * PhotoCollage section pattern factory.
 * Creates a text + scattered photo collage section.
 *
 * Mobile: vertical stack with alternating image alignment.
 * Desktop: absolute-positioned scattered layout via CSS.
 */

import type { SectionSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { AboutCollageImage, AboutCollageProps } from './types'
import { meta } from './meta'

export function createAboutCollageSection(rawProps: AboutCollageProps): SectionSchema {
  const {
    id = 'photo-collage',
    label = 'Photo Collage',
    constrained,
    colorMode,
    sectionTheme,
    style,
    className,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    sectionHeight,
    text,
    textClassName = '',
    images,
    imageClassName = '',
    textScale,
  } = applyMetaDefaults(meta, rawProps)

  return {
    id,
    patternId: 'AboutCollage',
    label,
    constrained,
    colorMode,
    sectionTheme,
    layout: { type: 'stack', direction: 'column' },
    className: ['photo-collage', className].filter(Boolean).join(' '),
    style,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    sectionHeight,
    widgets: [
      {
        id: `${id}-text`,
        type: 'Text',
        props: { content: text, as: textScale },
        className: `photo-collage__text ${textClassName}`.trim(),
      },
      ...(typeof images === 'string'
        ? [{
            __repeat: images,
            id: `${id}-image`,
            type: 'Image' as const,
            props: { src: '{{ item.src }}', alt: '{{ item.alt }}' },
            className: `photo-collage__image ${imageClassName}`.trim(),
          }]
        : (images as AboutCollageImage[]).map((img, i) => ({
            id: `${id}-image-${i}`,
            type: 'Image' as const,
            props: { src: img.src, alt: img.alt },
            className: `photo-collage__image ${imageClassName}`.trim(),
          }))
      ),
    ],
  }
}
