/**
 * IntroStatement pattern - statement heading + body + optional logo marquee.
 *
 * Structure:
 * - Split (heading left, body text right-bottom)
 * - Marquee (logo images, infinite scroll)
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { isBindingExpression } from '../utils'
import type { IntroStatementProps } from './types'
import { meta } from './meta'

export function createIntroStatementSection(rawProps?: IntroStatementProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings
  const heading = rawProps?.heading ?? '{{ content.intro.heading }}'
  const bodyText = rawProps?.bodyText ?? '{{ content.intro.bodyText }}'
  const clientLogos = rawProps?.clientLogos ?? '{{ content.intro.clientLogos }}'

  // Settings
  const showMarquee = p.showMarquee as boolean
  const marqueeSpeed = p.marqueeSpeed as number
  const edgeFade = p.edgeFade as boolean

  // Typography: factory decisions
  const headingScale = 'h1'
  const bodyScale = 'body'

  const widgets: WidgetSchema[] = [
    // Split: heading left (~38%), body right (~62%)
    {
      id: 'intro-content',
      type: 'Split',
      props: { ratio: '2:3', gap: 64 },
      className: 'section-intro-statement__content',
      widgets: [
        {
          id: 'intro-heading',
          type: 'Text',
          props: { content: heading, as: headingScale },
          className: 'section-intro-statement__heading',
          style: { fontSize: 'clamp(80px, 11.1cqw, 160px)' } as CSSProperties,
        },
        {
          id: 'intro-body-wrap',
          type: 'Flex',
          props: { direction: 'column', justify: 'start', align: 'start' },
          className: 'section-intro-statement__body-wrap',
          style: { minHeight: '100%', paddingTop: '120px' } as CSSProperties,
          widgets: [
            {
              id: 'intro-body',
              type: 'Text',
              props: { content: bodyText, as: bodyScale },
              className: 'section-intro-statement__body',
            },
          ],
        },
      ],
    },
  ]

  // Marquee with logos
  if (showMarquee) {
    const logoWidgets: WidgetSchema[] = isBindingExpression(clientLogos)
      ? [{
          __repeat: clientLogos,
          id: 'logo',
          type: 'Image',
          props: { src: '{{ item.src }}', alt: '{{ item.alt }}' },
          style: { height: '32px', width: 'auto', opacity: 0.5 } as CSSProperties,
        }]
      : (clientLogos as Array<{ src: string; alt: string; height?: number }>).map((logo, i) => ({
          id: `logo-${i}`,
          type: 'Image' as const,
          props: { src: logo.src, alt: logo.alt },
          style: { height: `${logo.height ?? 32}px`, width: 'auto', opacity: 0.5 } as CSSProperties,
        }))

    widgets.push({
      id: 'intro-marquee',
      type: 'Marquee',
      props: { duration: marqueeSpeed, gap: 64 },
      className: edgeFade ? 'section-intro-statement__marquee section-intro-statement__marquee--edge-fade' : 'section-intro-statement__marquee',
      widgets: logoWidgets,
    })
  }

  return {
    id: p.id ?? 'intro-statement',
    patternId: 'IntroStatement',
    label: p.label ?? 'Intro Statement',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode ?? 'dark',
    sectionTheme: p.sectionTheme,
    layout: { type: 'stack', direction: 'column', align: 'stretch' },
    style: {
      paddingBlock: 'var(--spacing-xl, 4rem)',
      ...p.style,
    } as CSSProperties,
    className: p.className,
    paddingTop: p.paddingTop ?? 80,
    paddingBottom: p.paddingBottom ?? 80,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'auto',
    widgets,
  }
}
