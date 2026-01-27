/**
 * AboutSection composite - factory function for about/bio sections.
 * Bio section with photo background and logo marquee.
 */

import type { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import type { AboutProps } from './types'

/**
 * Creates an AboutSection schema with bio text, photo, and logo marquee.
 *
 * @param props - About section configuration
 * @returns SectionSchema for the about section
 */
export function createAboutSection(props: AboutProps): SectionSchema {
  const widgets: WidgetSchema[] = []

  // Bio paragraphs as Text widgets
  props.bioParagraphs.forEach((paragraph, index) => {
    widgets.push({
      id: `about-bio-${index}`,
      type: 'Text',
      props: {
        content: paragraph,
        as: 'p'
      }
    })
  })

  // Signature text
  widgets.push({
    id: 'about-signature',
    type: 'Text',
    props: {
      content: props.signature,
      as: 'p'
    },
    features: {
      typography: {
        align: 'right'
      }
    }
  })

  // Logo marquee (visible tablet+)
  if (props.clientLogos && props.clientLogos.length > 0) {
    widgets.push({
      id: 'about-logos',
      type: 'LogoMarquee',
      props: {
        logos: props.clientLogos.map(logo => ({
          name: logo.name,
          src: logo.src,
          alt: logo.alt
        }))
      }
    })
  }

  return {
    id: props.id ?? 'about',
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'start',
      gap: 16
    },
    features: {
      background: {
        color: 'rgb(0, 0, 0)'
      }
    },
    behaviour: 'fade-in',
    widgets
  }
}
