/**
 * HeroSection pattern - factory function for hero sections.
 * Full viewport hero with video background and bottom-aligned role titles.
 *
 * Structure:
 * - Video (background) - absolute positioned
 * - Flex (content wrapper) - bottom-aligned intro + roles
 * - Text (scroll indicator) - positioned absolutely at bottom center
 *
 * Styling is configurable via props.styles, with sensible defaults.
 * Presets define site-specific styles; content comes from site data.
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { HeroVideoProps } from './types'
import { DEFAULT_HERO_STYLES } from './types'
import { isBindingExpression } from '../utils'
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
 * Creates a HeroSection schema with video background and role titles.
 *
 * @param props - Hero section configuration (content + optional styles)
 * @returns SectionSchema for the hero section
 */
export function createHeroVideoSection(rawProps?: HeroVideoProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings: check rawProps to avoid meta defaults suppressing bindings
  const introText = rawProps?.introText ?? '{{ content.hero.introText }}'
  const roles = rawProps?.roles ?? '{{ content.hero.roles }}'
  const videoSrc = rawProps?.videoSrc ?? '{{ content.hero.videoSrc }}'
  const scrollIndicatorText = rawProps?.scrollIndicatorText ?? '{{ content.hero.scrollIndicatorText }}'

  // Merge provided styles with defaults
  const styles = {
    intro: mergeStyles(DEFAULT_HERO_STYLES.intro, p.styles?.intro),
    roleTitle: mergeStyles(DEFAULT_HERO_STYLES.roleTitle, p.styles?.roleTitle),
    scrollIndicator: mergeStyles(DEFAULT_HERO_STYLES.scrollIndicator, p.styles?.scrollIndicator),
  }

  // Settings: auto-filled by applyMetaDefaults
  const bottomOffset = p.bottomOffset as number
  const introScale = p.introScale as TextElement
  const roleTitleScale = p.roleTitleScale as TextElement
  const scrollIndicatorScale = p.scrollIndicatorScale as TextElement

  // Build content widgets
  const contentWidgets: WidgetSchema[] = [
    {
      id: 'hero-intro',
      type: 'Text',
      props: { content: introText, as: introScale },
      style: styles.intro
    },
    {
      id: 'hero-roles',
      type: 'Stack',
      props: { gap: 'tight' },
      widgets: isBindingExpression(roles)
        ? [{
            __repeat: roles,
            id: 'role',
            type: 'Text',
            props: { content: '{{ item }}', as: roleTitleScale },
            style: styles.roleTitle,
          }]
        : (roles as string[]).map((role, index) => ({
            id: `hero-role-${index}`,
            type: 'Text',
            props: { content: role, as: roleTitleScale },
            style: styles.roleTitle,
          })),
    }
  ]

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
      props: { direction: 'column', align: 'start', justify: 'end' },
      widgets: contentWidgets
    },
    {
      id: 'hero-scroll',
      type: 'Text',
      props: { content: scrollIndicatorText, as: scrollIndicatorScale },
      style: scrollStyle
    }
  ]

  return {
    id: p.id ?? 'hero',
    patternId: 'HeroVideo',
    label: p.label ?? 'Hero',
    constrained: p.constrained,
    colorMode: p.colorMode,
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'start'
    },
    style: {
      maxWidth: 'none',
      '--hero-bottom-offset': bottomOffset,
      ...p.style,
    } as CSSProperties,
    className: p.className,
    paddingTop: p.paddingTop,
    paddingBottom: p.paddingBottom,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'viewport-fixed',
    widgets
  }
}
