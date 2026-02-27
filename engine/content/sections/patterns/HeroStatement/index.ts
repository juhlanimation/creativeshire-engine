/**
 * HeroStatement pattern - statement hero with heading, collage, body columns, CTA.
 *
 * Structure:
 * - Grid layout: heading top-left (wide), images right, body below, ArrowLink bottom-right
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { isBindingExpression } from '../utils'
import type { HeroStatementProps } from './types'
import { meta } from './meta'

export function createHeroStatementSection(rawProps?: HeroStatementProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings
  const heading = rawProps?.heading ?? '{{ content.about.heading }}'
  const bodyTextLeft = rawProps?.bodyTextLeft ?? '{{ content.about.bodyTextLeft }}'
  const bodyTextRight = rawProps?.bodyTextRight ?? '{{ content.about.bodyTextRight }}'
  const collageImages = rawProps?.collageImages ?? '{{ content.about.collageImages }}'
  const ctaLabel = rawProps?.ctaLabel ?? '{{ content.about.ctaLabel }}'
  const ctaEmail = rawProps?.ctaEmail ?? '{{ content.about.ctaEmail }}'

  // Settings
  const headingColor = p.headingColor as string
  const bodyColumns = p.bodyColumns as string
  const blendMode = p.blendMode as string

  // Typography
  const headingScale = 'display'
  const bodyScale = 'body'

  // Heading
  const headingWidget: WidgetSchema = {
    id: 'hero-stmt-heading',
    type: 'Text',
    props: { content: heading, as: headingScale },
    className: 'section-hero-statement__heading',
    style: { color: headingColor } as CSSProperties,
  }

  // Collage images
  const imageWidgets: WidgetSchema[] = isBindingExpression(collageImages)
    ? [{
        __repeat: collageImages,
        id: 'collage-img',
        type: 'Image',
        props: { src: '{{ item.src }}', alt: '{{ item.alt }}' },
        style: { mixBlendMode: blendMode } as CSSProperties,
        className: 'section-hero-statement__collage-img',
      }]
    : (collageImages as Array<{ src: string; alt: string }>).map((img, i) => ({
        id: `collage-img-${i}`,
        type: 'Image' as const,
        props: { src: img.src, alt: img.alt },
        style: { mixBlendMode: blendMode } as CSSProperties,
        className: 'section-hero-statement__collage-img',
      }))

  // Body columns
  const bodyWidgets: WidgetSchema[] = [
    {
      id: 'hero-stmt-body-left',
      type: 'Text',
      props: { content: bodyTextLeft, as: bodyScale },
    },
  ]

  if (bodyColumns === '2') {
    bodyWidgets.push({
      id: 'hero-stmt-body-right',
      type: 'Text',
      props: { content: bodyTextRight, as: bodyScale },
    })
  }

  // ArrowLink
  const arrowLinkWidget: WidgetSchema = {
    id: 'hero-stmt-cta',
    type: 'ArrowLink',
    props: {
      email: ctaEmail,
      label: ctaLabel,
      variant: 'slide',
    },
  }

  const widgets: WidgetSchema[] = [
    {
      id: 'hero-stmt-grid',
      type: 'Grid',
      props: { columns: 2, gap: 48 },
      className: 'section-hero-statement__grid',
      widgets: [
        headingWidget,
        {
          id: 'hero-stmt-collage',
          type: 'Flex',
          props: { direction: 'column', gap: 16 },
          className: 'section-hero-statement__collage',
          widgets: imageWidgets,
        },
        {
          id: 'hero-stmt-body',
          type: bodyColumns === '2' ? 'Grid' : 'Stack',
          props: bodyColumns === '2' ? { columns: 2, gap: 32 } : { gap: 16 },
          className: 'section-hero-statement__body',
          widgets: bodyWidgets,
        },
        {
          id: 'hero-stmt-cta-wrap',
          type: 'Flex',
          props: { direction: 'column', justify: 'end', align: 'start' },
          widgets: [arrowLinkWidget],
        },
      ],
    },
  ]

  return {
    id: p.id ?? 'about-hero',
    patternId: 'HeroStatement',
    label: p.label ?? 'About Hero',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode ?? 'light',
    sectionTheme: p.sectionTheme,
    layout: { type: 'stack', direction: 'column', align: 'stretch' },
    style: p.style,
    className: p.className,
    paddingTop: p.paddingTop ?? 120,
    paddingBottom: p.paddingBottom ?? 80,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'auto',
    widgets,
  }
}
