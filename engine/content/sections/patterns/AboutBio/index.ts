/**
 * AboutSection pattern - factory function for about/bio sections.
 * Structure:
 * - Mobile: background image (30% opacity), centered bio text
 * - Desktop: two-column (bio left, image right)
 * - Logo marquee absolute positioned at bottom
 * - Gradient overlay above marquee
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { AboutBioProps, LogoItem } from './types'
import { isBindingExpression } from '../utils'
import { meta } from './meta'
import './components/MarqueeImageRepeater'  // scoped widget registration

/**
 * Creates an AboutSection schema.
 *
 * @param props - About section configuration
 * @returns SectionSchema for the about section
 */
export function createAboutBioSection(rawProps?: AboutBioProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings: check rawProps to avoid meta defaults suppressing bindings
  const bioParagraphs = rawProps?.bioParagraphs ?? '{{ content.about.bioParagraphs }}'
  const signature = rawProps?.signature ?? '{{ content.about.signature }}'
  const photoSrc = rawProps?.photoSrc ?? '{{ content.about.photoSrc }}'
  const photoAlt = rawProps?.photoAlt ?? '{{ content.about.photoAlt }}'
  const clientLogos = rawProps?.clientLogos ?? '{{ content.about.clientLogos }}'

  // Settings: auto-filled by applyMetaDefaults
  const bioTextScale = p.bioTextScale as string
  const signatureScale = p.signatureScale as string

  const widgets: WidgetSchema[] = []

  // Mobile background image (hidden on desktop via CSS)
  widgets.push({
    id: 'about-mobile-bg',
    type: 'Box',
    props: {},
    widgets: [
      {
        id: 'about-mobile-bg-image',
        type: 'Image',
        props: {
          src: photoSrc,
          alt: '',
          decorative: true
        },
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          opacity: 0.3,
        },
      }
    ]
  })

  // Main content wrapper (flex container)
  widgets.push({
    id: 'about-content',
    type: 'Flex',
    props: {
      direction: 'row'
    },
    widgets: [
      // Bio column (left)
      {
        id: 'about-bio-column',
        type: 'Box',
        props: {},
        widgets: [
          // Inner container with max-width
          {
            id: 'about-bio-inner',
            type: 'Box',
            props: {},
            style: {
              maxWidth: 'var(--bio-max-width, 500px)',
            },
            widgets: [
              // Single paragraph with all bio text (pre-line handles line breaks)
              // Handle both real arrays and binding expressions
              {
                id: 'about-bio-text',
                type: 'Text',
                props: {
                  content: isBindingExpression(bioParagraphs)
                    ? bioParagraphs  // Pass binding through for runtime resolution
                    : (bioParagraphs as string[]).join('\n\n'),
                  as: bioTextScale,
                  html: true,
                  lineHeight: '1.625',
                  textAlign: 'justify',
                },
                style: {
                  display: 'block',
                  whiteSpace: 'pre-line',
                },
              },
              // Signature
              {
                id: 'about-signature',
                type: 'Text',
                props: {
                  content: signature,
                  as: signatureScale,
                  variant: 'signature',
                  fontWeight: '400',
                  textAlign: 'right',
                  lineHeight: '1.625',
                },
                style: {
                  fontStyle: 'italic',
                  display: 'block',
                  whiteSpace: 'pre-line',
                  marginTop: 'var(--spacing-md, 1rem)',
                },
              }
            ]
          }
        ]
      },
      // Image column (right, hidden on mobile via CSS)
      {
        id: 'about-image-column',
        type: 'Box',
        props: {},
        widgets: [
          {
            id: 'about-image',
            type: 'Image',
            props: {
              src: photoSrc,
              alt: photoAlt,
              objectFit: 'cover',
            },
            style: {
              width: '100%',
              height: '110%',
            },
          }
        ]
      }
    ]
  })

  // Gradient overlay (absolute positioned via CSS)
  widgets.push({
    id: 'about-gradient',
    type: 'Box',
    props: {}
  })

  // Logo marquee (absolute positioned at bottom via CSS)
  const hasLogos = isBindingExpression(clientLogos)
    ? true  // Assume logos exist when binding - platform will resolve
    : clientLogos && (clientLogos as LogoItem[]).length > 0

  if (hasLogos) {
    const duration = p.marqueeDuration as number
    const logoWidth = 120
    const logoGap = 96
    const invertLogos = p.invertLogos as boolean

    if (isBindingExpression(clientLogos)) {
      // Binding expression: MarqueeImageRepeater handles runtime resolution
      widgets.push({
        id: 'about-logos',
        type: 'AboutBio__MarqueeImageRepeater',
        props: {
          logos: clientLogos,
          duration,
          logoWidth,
          logoGap,
        },
        style: invertLogos
          ? {
              '--logo-filter': 'brightness(0) invert(1)',
              '--logo-opacity': '0.5',
            } as React.CSSProperties
          : undefined,
      })
    } else {
      // Static logos: use Marquee layout with Image widgets directly
      const logos = clientLogos as LogoItem[]
      const maxHeight = Math.max(...logos.map(l => l.height), 48)

      const imageWidgets: WidgetSchema[] = logos.map((logo, index) => ({
        id: `about-logo-${index}`,
        type: 'Image',
        props: {
          src: logo.src,
          alt: logo.alt,
          decorative: true,
          objectFit: 'contain',
        },
        style: {
          width: 'auto',
          maxWidth: `${logoWidth}px`,
          height: `${logo.height}px`,
          flexShrink: 0,
          ...(invertLogos && {
            filter: 'brightness(0) invert(1)',
            opacity: 0.5,
          }),
        },
      }))

      widgets.push({
        id: 'about-logos',
        type: 'Marquee',
        props: {
          duration,
          gap: logoGap,
        },
        style: {
          minHeight: `${maxHeight}px`,
        },
        widgets: imageWidgets,
      })
    }
  }

  // Merge layout CSS variables into section style
  const marqueeOffset = p.marqueeOffset as number
  const bioMaxWidth = p.bioMaxWidth as number
  const bioOffset = p.bioOffset as number
  const sectionStyle: React.CSSProperties = {
    ...p.style,
    '--marquee-offset': `${marqueeOffset}%`,
    '--bio-max-width': `${bioMaxWidth}px`,
    '--bio-offset': `${bioOffset}%`,
  } as React.CSSProperties

  return {
    id: p.id ?? 'about',
    patternId: 'AboutBio',
    label: p.label ?? 'About',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode,
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'stretch'
    },
    style: sectionStyle,
    className: p.className,
    paddingTop: p.paddingTop,
    paddingBottom: p.paddingBottom,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'viewport',
    widgets
  }
}
