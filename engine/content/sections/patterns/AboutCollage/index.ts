/**
 * PhotoCollage section pattern factory.
 * Creates a text + scattered photo collage section.
 *
 * Mobile: vertical stack with alternating image alignment.
 * Desktop: absolute-positioned scattered layout via CSS.
 */

import type { SectionSchema } from '../../../../schema'
import type { SettingConfig } from '../../../../schema/settings'
import { extractDefaults } from '../../../../schema/settings'
import type { AboutCollageImage, AboutCollageProps } from './types'
import { meta } from './meta'

/** Meta-derived defaults — single source of truth for factory fallbacks. */
const d = extractDefaults(meta.settings as Record<string, SettingConfig>)

export function createAboutCollageSection(props: AboutCollageProps): SectionSchema {
  const {
    id = 'photo-collage',
    label = 'Photo Collage',
    constrained,
    colorMode,
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
    textScale = d.textScale as string,
  } = props

  return {
    id,
    patternId: 'AboutCollage',
    label,
    constrained,
    colorMode,
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
