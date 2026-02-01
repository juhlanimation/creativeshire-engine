/**
 * HeroSection pattern - factory function for hero sections.
 * Full viewport hero with video background and role titles.
 *
 * Structure (stacked layouts):
 * - Video (background) - absolute positioned
 * - Flex (content wrapper) - full height, column
 *   - Text (intro) - with inline styles
 *   - Text x N (roles) - with display typography
 * - Text (scroll indicator) - positioned absolutely at bottom center
 *
 * Styling is configurable via props.styles, with sensible defaults.
 * Presets define site-specific styles; content comes from site data.
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema } from '@/engine/schema'
import type { HeroProps } from './types'
import { DEFAULT_HERO_STYLES } from './types'

/**
 * Merge two style objects.
 */
function mergeStyles(base?: CSSProperties, override?: CSSProperties): CSSProperties {
  if (!override) return base ?? {}
  if (!base) return override
  return { ...base, ...override }
}

/**
 * Creates a HeroSection schema with video background, role titles, and scroll indicator.
 * Uses Text widgets with inline styles for all text content.
 *
 * @param props - Hero section configuration (content + optional styles)
 * @returns SectionSchema for the hero section
 */
export function createHeroSection(props: HeroProps): SectionSchema {
  // Merge provided styles with defaults
  const styles = {
    intro: mergeStyles(DEFAULT_HERO_STYLES.intro, props.styles?.intro),
    roleTitle: mergeStyles(DEFAULT_HERO_STYLES.roleTitle, props.styles?.roleTitle),
    scrollIndicator: mergeStyles(DEFAULT_HERO_STYLES.scrollIndicator, props.styles?.scrollIndicator)
  }

  // Build the content widgets (intro + roles)
  const contentWidgets: WidgetSchema[] = [
    // Intro text with inline styles
    {
      id: 'hero-intro',
      type: 'Text',
      props: {
        content: props.introText,
        as: 'p'
      },
      style: styles.intro
    },
    // Role titles as Text widgets with display typography
    ...props.roles.map((role, index) => ({
      id: `hero-role-${index}`,
      type: 'Text',
      props: {
        content: role,
        as: index === 0 ? 'h1' : 'h2'
      },
      style: styles.roleTitle
    }))
  ]

  // Main widgets array
  const widgets: WidgetSchema[] = [
    // Video background widget - positioned absolute via CSS
    {
      id: 'hero-video',
      type: 'Video',
      props: {
        src: props.videoSrc,
        ...(props.videoPoster ? { poster: props.videoPoster } : {}),
        autoplay: true,
        loop: true,
        muted: true,
        background: true
      }
    },
    // Content wrapper - positioned at bottom
    // Uses flex column with justify-end to push content to bottom of container
    {
      id: 'hero-content',
      type: 'Flex',
      props: {
        direction: 'column',
        align: 'start',
        justify: 'end'
      },
      widgets: contentWidgets
    },
    // Scroll indicator as Text widget - positioned absolutely at bottom center via CSS
    {
      id: 'hero-scroll',
      type: 'Text',
      props: {
        content: props.scrollIndicatorText ?? '(SCROLL)',
        as: 'span'
      },
      style: styles.scrollIndicator
    }
  ]

  return {
    id: props.id ?? 'hero',
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'start'
    },
    widgets
  }
}
