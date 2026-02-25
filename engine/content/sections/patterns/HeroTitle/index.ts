/**
 * HeroTitle pattern - factory function for hero sections with centered title.
 * Full viewport hero with video background and centered title + optional tagline.
 *
 * Structure:
 * - Video (background) - absolute positioned
 * - Flex (content wrapper) - centered vertically and horizontally
 * - Text (scroll indicator) - positioned absolutely at bottom center
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { HeroTitleProps } from './types'
import { DEFAULT_HERO_TITLE_STYLES } from './types'
import { meta } from './meta'

/**
 * Merge two style objects.
 */
function mergeStyles(base?: CSSProperties, override?: CSSProperties): CSSProperties {
  if (!override) return base ?? {}
  if (!base) return override
  return { ...base, ...override }
}

/**
 * Creates a HeroTitle section schema with video background and centered title.
 *
 * @param props - Hero title section configuration (content + optional styles)
 * @returns SectionSchema for the hero title section
 */
export function createHeroTitleSection(rawProps?: HeroTitleProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings: check rawProps to avoid meta defaults suppressing bindings
  const title = rawProps?.title ?? '{{ content.hero.title }}'
  const tagline = p.tagline
  const videoSrc = rawProps?.videoSrc ?? '{{ content.hero.videoSrc }}'
  const scrollIndicatorText = rawProps?.scrollIndicatorText ?? '{{ content.hero.scrollIndicatorText }}'

  // Merge provided styles with defaults
  const styles = {
    title: mergeStyles(DEFAULT_HERO_TITLE_STYLES.title, p.styles?.title),
    tagline: mergeStyles(DEFAULT_HERO_TITLE_STYLES.tagline, p.styles?.tagline),
    scrollIndicator: mergeStyles(DEFAULT_HERO_TITLE_STYLES.scrollIndicator, p.styles?.scrollIndicator),
  }

  // Settings: auto-filled by applyMetaDefaults
  const titleScale = p.titleScale as TextElement
  const taglineScale = p.taglineScale as TextElement
  const scrollIndicatorScale = p.scrollIndicatorScale as TextElement
  const titleSizeMultiplier = p.titleSizeMultiplier as number

  // When introVideo is enabled, text visibility is gated by --intro-complete CSS variable
  const introGateStyle = p.introVideo
    ? { opacity: 'var(--intro-complete, 1)' as unknown as number }
    : undefined

  // Use container-query units so title scales with container width (no overflow clipping)
  const titleSizeStyle: CSSProperties = {
    fontSize: `${titleSizeMultiplier * 5}cqw`
  }

  // Build content widgets
  const contentWidgets: WidgetSchema[] = [
    {
      id: 'hero-title-heading',
      type: 'Text',
      props: { content: title, as: titleScale },
      style: {
        ...styles.title,
        ...titleSizeStyle,
        ...introGateStyle,
      }
    },
  ]

  if (tagline) {
    contentWidgets.push({
      id: 'hero-tagline',
      type: 'Text',
      props: { content: tagline, as: taglineScale },
      style: introGateStyle
        ? { ...styles.tagline, ...introGateStyle }
        : styles.tagline
    })
  }

  // Build Video widget props
  const videoProps: Record<string, SerializableValue> = {
    src: videoSrc,
    background: true,
  }
  if (p.videoPoster) videoProps.poster = p.videoPoster
  if (p.loopStartTime != null) videoProps.loopStartTime = p.loopStartTime
  if (p.introVideo) videoProps.introVideo = true

  // Scroll indicator style — gate with intro-complete when introVideo is set
  const scrollStyle = p.introVideo
    ? { ...styles.scrollIndicator, opacity: 'var(--intro-complete, 1)' as unknown as number }
    : styles.scrollIndicator

  // Main widgets array
  const widgets: WidgetSchema[] = [
    {
      id: 'hero-video',
      type: 'Video',
      props: videoProps
    },
    {
      id: 'hero-content',
      type: 'Flex',
      props: { direction: 'column', align: 'center', justify: 'center' },
      style: { top: 0, paddingBottom: 0 },
      widgets: contentWidgets
    },
    {
      id: 'hero-title-scroll',
      type: 'Text',
      props: { content: scrollIndicatorText, as: scrollIndicatorScale },
      style: scrollStyle
    }
  ]

  return {
    id: p.id ?? 'hero-title',
    patternId: 'HeroTitle',
    label: p.label ?? 'Hero',
    constrained: p.constrained,
    colorMode: p.colorMode,
    sectionTheme: p.sectionTheme,
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'start'
    },
    style: {
      maxWidth: 'none',
      ...p.style,
    },
    className: p.className,
    paddingTop: p.paddingTop,
    paddingBottom: p.paddingBottom,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'viewport-fixed',
    widgets
  }
}
