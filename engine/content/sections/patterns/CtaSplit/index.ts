/**
 * CtaSplit pattern - CTA section with split layout.
 *
 * Featured: heading upper-left, collage lower-left, body right, arrow+label bottom-right
 * Compact: heading + body + ArrowLink (no images)
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { isBindingExpression } from '../utils'
import type { CtaSplitProps } from './types'
import { meta } from './meta'

export function createCtaSplitSection(rawProps?: CtaSplitProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings
  const heading = rawProps?.heading ?? '{{ content.cta.heading }}'
  const bodyText = rawProps?.bodyText ?? '{{ content.cta.bodyText }}'
  const ctaLabel = rawProps?.ctaLabel ?? '{{ content.cta.ctaLabel }}'
  const ctaEmail = rawProps?.ctaEmail ?? '{{ content.cta.ctaEmail }}'
  const collageImages = rawProps?.collageImages ?? '{{ content.cta.collageImages }}'

  // Settings
  const layout = p.layout as 'featured' | 'compact'
  const blendMode = p.blendMode as string

  // Typography
  const headingScale = 'h1'
  const bodyScale = 'body'

  const isFeatured = layout === 'featured'

  // Heading
  const headingWidget: WidgetSchema = {
    id: 'cta-heading',
    type: 'Text',
    props: { content: heading, as: headingScale },
    className: 'section-cta-split__heading',
    style: { fontSize: 'clamp(80px, 11.1cqw, 160px)' } as CSSProperties,
  }

  // Body text
  const bodyWidget: WidgetSchema = {
    id: 'cta-body',
    type: 'Text',
    props: { content: bodyText, as: bodyScale },
    className: 'section-cta-split__body',
  }

  // ArrowLink (large arrow for featured)
  const arrowLinkWidget: WidgetSchema = {
    id: 'cta-arrow-link',
    type: 'ArrowLink',
    props: {
      email: ctaEmail,
      label: ctaLabel,
      variant: isFeatured ? 'swap' : 'slide',
      ...(isFeatured && { arrowSize: 'large' }),
    },
    className: 'section-cta-split__arrow-link',
  }

  const widgets: WidgetSchema[] = []

  if (isFeatured) {
    // Featured layout: CSS Grid with 4 areas
    // heading (top-left), collage (bottom-left), body (right), cta (bottom-right)
    const imageWidgets: WidgetSchema[] = isBindingExpression(collageImages)
      ? [{
          __repeat: collageImages,
          id: 'collage-img',
          type: 'Image',
          props: { src: '{{ item.src }}', alt: '{{ item.alt }}' },
          style: { mixBlendMode: blendMode } as CSSProperties,
          className: 'section-cta-split__collage-img',
        }]
      : (collageImages as Array<{ src: string; alt: string }>).map((img, i) => ({
          id: `collage-img-${i}`,
          type: 'Image' as const,
          props: { src: img.src, alt: img.alt },
          style: { mixBlendMode: blendMode } as CSSProperties,
          className: 'section-cta-split__collage-img',
        }))

    widgets.push({
      id: 'cta-grid',
      type: 'Box',
      props: {},
      className: 'section-cta-split__grid',
      widgets: [
        // Heading — top left area
        {
          id: 'cta-heading-area',
          type: 'Box',
          props: {},
          className: 'section-cta-split__heading-area',
          widgets: [headingWidget],
        },
        // Body — right area
        {
          id: 'cta-body-area',
          type: 'Box',
          props: {},
          className: 'section-cta-split__body-area',
          widgets: [bodyWidget],
        },
        // Collage — bottom left area
        {
          id: 'cta-collage',
          type: 'Flex',
          props: { direction: 'row', gap: 16 },
          className: 'section-cta-split__collage',
          widgets: imageWidgets,
        },
        // CTA — bottom right area
        {
          id: 'cta-action-area',
          type: 'Flex',
          props: { direction: 'row', gap: 16, align: 'center' },
          className: 'section-cta-split__action-area',
          widgets: [
            arrowLinkWidget,
          ],
        },
      ],
    })
  } else {
    // Compact layout: split heading left, body + CTA right
    widgets.push({
      id: 'cta-split-layout',
      type: 'Split',
      props: { ratio: '1:1', gap: 64 },
      widgets: [
        headingWidget,
        {
          id: 'cta-right',
          type: 'Stack',
          props: { gap: 32 },
          widgets: [bodyWidget, arrowLinkWidget],
        },
      ],
    })
  }

  return {
    id: p.id ?? 'cta',
    patternId: 'CtaSplit',
    label: p.label ?? 'Call to Action',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode,
    sectionTheme: p.sectionTheme,
    layout: { type: 'stack', direction: 'column', align: 'stretch' },
    style: p.style,
    className: `section-cta-split--${layout} ${p.className ?? ''}`.trim(),
    paddingTop: p.paddingTop ?? (isFeatured ? 160 : 80),
    paddingBottom: p.paddingBottom ?? (isFeatured ? 160 : 80),
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'auto',
    widgets,
  }
}
