/**
 * ProjectShowcase section pattern.
 * Single project display (The Boy, Mole, Fox & Horse style).
 *
 * Backgrounds: set via `style.backgroundColor` from the preset.
 * Text colors: resolved from theme CSS variables in styles.css.
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import type { SettingConfig } from '../../../../schema/settings'
import { extractDefaults } from '../../../../schema/settings'
import type { ProjectShowcaseProps } from './types'
import { meta } from './meta'
import './components/FlexButtonRepeater'  // scoped widget registration

/** Meta-derived defaults — single source of truth for factory fallbacks. */
const d = extractDefaults(meta.settings as Record<string, SettingConfig>)

export function createProjectShowcaseSection(props: ProjectShowcaseProps): SectionSchema {
  const sectionId = props.id ?? 'project-showcase'

  // Header with logo and info
  const header: WidgetSchema = {
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-showcase__header',
    props: { direction: 'row', align: 'center', justify: 'between' },
    widgets: [
      // Logo
      {
        id: `${sectionId}-logo`,
        type: 'Image',
        props: {
          src: props.logo.src,
          alt: props.logo.alt,
          decorative: false
        },
        style: { width: props.logo.width ?? 300 }
      },
      // Info (studio + role)
      {
        id: `${sectionId}-info`,
        type: 'Flex',
        props: { direction: 'column', align: 'end', gap: 'var(--spacing-xs, 0.25rem)' },
        widgets: [
          {
            type: 'Text',
            props: { content: props.studio, as: props.studioScale ?? (d.studioScale as string) },
            className: 'project-showcase__studio'
          },
          {
            type: 'Text',
            props: { content: props.role, as: props.roleScale ?? (d.roleScale as string) },
            className: 'project-showcase__role'
          }
        ]
      }
    ]
  }

  // Video container with optional border and shot indicator
  const videoWidgets: WidgetSchema[] = [
    {
      id: `${sectionId}-video`,
      type: 'Video',
      props: {
        src: props.videoSrc,
        poster: props.videoPoster,
        ...(props.posterTime != null ? { posterTime: props.posterTime } : {}),
        aspectRatio: '16/9'
      },
      className: 'project-showcase__video'
    }
  ]

  // Add shot indicator if shots provided (positioned via Box, not baked into widget)
  if (props.shots) {
    videoWidgets.push({
      id: `${sectionId}-shots-container`,
      type: 'Box',
      style: {
        position: 'absolute',
        top: 'var(--spacing-md, 1rem)',
        right: 'var(--spacing-md, 1rem)',
        zIndex: 10,
      },
      widgets: [{
        id: `${sectionId}-shots`,
        type: 'ProjectShowcase__FlexButtonRepeater',
        props: {
          prefix: 'sh',
        },
        ...(typeof props.shots === 'string' ? {
          widgets: [{
            __repeat: props.shots,
            id: 'shot-marker',
            type: 'Button',
            props: {
              label: '{{ item.frame }}',
              'data-video-src': '{{ item.videoSrc }}',
            },
          }]
        } : {})
      }]
    })
  }

  const videoContainer: WidgetSchema = {
    id: `${sectionId}-video-container`,
    type: 'Box',
    className: 'project-showcase__video-container',
    style: { position: 'relative', ...(props.videoBorder ? { border: '1px solid currentColor' } : {}) },
    widgets: videoWidgets
  }

  const widgets: WidgetSchema[] = [header, videoContainer]

  return {
    id: sectionId,
    patternId: 'ProjectShowcase',
    label: props.label ?? 'Project Showcase',
    constrained: props.constrained,
    colorMode: props.colorMode,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between'
    },
    style: {
      ...props.style,
    },
    className: ['section-project-showcase', props.className].filter(Boolean).join(' '),
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'viewport',
    widgets
  }
}
