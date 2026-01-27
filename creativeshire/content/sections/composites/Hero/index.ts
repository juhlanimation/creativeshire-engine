/**
 * HeroSection composite - factory function for hero sections.
 * Full viewport hero with video background and role titles.
 */

import type { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import type { HeroProps } from './types'

/**
 * Creates a HeroSection schema with video background, role titles, and scroll indicator.
 *
 * @param props - Hero section configuration
 * @returns SectionSchema for the hero section
 */
export function createHeroSection(props: HeroProps): SectionSchema {
  const widgets: WidgetSchema[] = []

  // Video background widget
  widgets.push({
    id: 'hero-video',
    type: 'Video',
    props: {
      src: props.videoSrc,
      ...(props.videoPoster ? { poster: props.videoPoster } : {}),
      autoplay: true,
      loop: true,
      muted: true
    }
  })

  // Intro text widget
  widgets.push({
    id: 'hero-intro',
    type: 'Text',
    props: {
      content: props.introText,
      as: 'p'
    }
  })

  // Role titles as HeroTitle widgets
  props.roles.forEach((role, index) => {
    widgets.push({
      id: `hero-role-${index}`,
      type: 'HeroTitle',
      props: {
        text: role,
        as: index === 0 ? 'h1' : 'h2',
        useBlendMode: true
      }
    })
  })

  // Scroll indicator widget
  widgets.push({
    id: 'hero-scroll',
    type: 'ScrollIndicator',
    props: {
      text: props.scrollIndicatorText ?? '(SCROLL)',
      useBlendMode: true
    }
  })

  return {
    id: props.id ?? 'hero',
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'start',
      gap: 13
    },
    behaviour: 'scroll-background-slideshow',
    widgets
  }
}
