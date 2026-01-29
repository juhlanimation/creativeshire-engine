/**
 * AboutSection pattern - factory function for about/bio sections.
 * Structure matches bojuhl.com about-section.tsx exactly:
 * - Mobile: background image (30% opacity), centered bio text
 * - Desktop: two-column (bio left, image right)
 * - Logo marquee absolute positioned at bottom
 * - Gradient overlay above marquee
 */

import type { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import type { AboutProps } from './types'

/**
 * Creates an AboutSection schema matching bojuhl.com layout.
 *
 * @param props - About section configuration
 * @returns SectionSchema for the about section
 */
export function createAboutSection(props: AboutProps): SectionSchema {
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
          src: props.photoSrc,
          alt: '',
          decorative: true
        }
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
            widgets: [
              // Single paragraph with all bio text (pre-line handles line breaks)
              {
                id: 'about-bio-text',
                type: 'Text',
                props: {
                  content: props.bioParagraphs.join('\n\n'),
                  as: 'p',
                  html: true
                }
              },
              // Signature
              {
                id: 'about-signature',
                type: 'Text',
                props: {
                  content: props.signature,
                  as: 'p',
                  variant: 'signature'
                }
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
              src: props.photoSrc,
              alt: props.photoAlt
            }
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
  // Structure: Box (overflow:hidden, effect) > Flex (track) > [Box > Image, ...] x2 (duplicated)
  if (props.clientLogos && props.clientLogos.length > 0) {
    const duration = props.marqueeDuration ?? 43
    const logoWidth = 120
    const logoGap = 96

    // Calculate max height from all logos for uniform container height
    const maxHeight = Math.max(...props.clientLogos.map(l => l.height), 48)

    // Create logo container widgets (Box with Image inside)
    const createLogoWidgets = (prefix: string): WidgetSchema[] =>
      props.clientLogos!.map((logo, index) => ({
        id: `about-logo-${prefix}-${index}`,
        type: 'Box',
        props: {},
        style: {
          width: `${logoWidth}px`,
          height: `${maxHeight}px`,
          marginRight: `${logoGap}px`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        widgets: [
          {
            id: `about-logo-${prefix}-${index}-img`,
            type: 'Image',
            props: {
              src: logo.src,
              alt: logo.alt,
              decorative: true,
              objectFit: 'contain'
            },
            style: {
              width: 'auto',
              height: `${logo.height}px`,
              maxWidth: `${logoWidth}px`,
              filter: 'brightness(0) invert(1)',
              opacity: 0.5
            }
          }
        ]
      }))

    widgets.push({
      id: 'about-logos',
      type: 'Box',
      props: {
        'data-effect': 'marquee-scroll'
      },
      style: {
        '--marquee-duration': `${duration}s`,
        minHeight: `${maxHeight}px`
      } as React.CSSProperties,
      widgets: [
        {
          id: 'about-logos-track',
          type: 'Flex',
          props: {
            direction: 'row',
            'data-marquee-track': true
          },
          widgets: [...createLogoWidgets('a'), ...createLogoWidgets('b')]
        }
      ]
    })
  }

  return {
    id: props.id ?? 'about',
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'stretch'
    },
    style: {
      backgroundColor: 'rgb(0, 0, 0)'
    },
    behaviour: 'scroll-fade',
    widgets
  }
}
