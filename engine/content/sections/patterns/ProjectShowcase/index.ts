/**
 * ProjectShowcase section pattern.
 * Single project display (The Boy, Mole, Fox & Horse style).
 *
 * Backgrounds: set via `style.backgroundColor` from the preset.
 * Text colors: resolved from theme CSS variables in styles.css.
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { ProjectShowcaseProps } from './types'
import { meta } from './meta'
import './components/FlexButtonRepeater'  // scoped widget registration

export function createProjectShowcaseSection(rawProps: ProjectShowcaseProps): SectionSchema {
  const props = applyMetaDefaults(meta, rawProps)
  const sectionId = props.id ?? 'project-showcase'

  // Header with logo and info — paddingBottom matches ProjectGallery
  const header: WidgetSchema = {
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-frame__header project-showcase__header',
    props: { direction: 'row', align: 'center', justify: 'between' },
    style: { paddingBottom: 16 },
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
            props: { content: props.studio, as: props.studioScale },
            className: 'project-showcase__studio'
          },
          {
            type: 'Text',
            props: { content: props.role, as: props.roleScale },
            className: 'project-showcase__role'
          }
        ]
      }
    ]
  }

  // Video — no aspectRatio so it fills the entire content area
  const videoWidgets: WidgetSchema[] = [
    {
      id: `${sectionId}-video`,
      type: 'Video',
      props: {
        src: props.videoSrc,
        poster: props.videoPoster,
        ...(props.posterTime != null ? { posterTime: props.posterTime } : {}),
      },
      className: 'project-showcase__video'
    }
  ]

  // Shot nav — vertical, centered on right edge of video container
  // Frame counter is created by FlexButtonRepeater via DOM (bottom-right)
  const hasShots = typeof props.shots === 'string'
    ? props.shots.length > 0
    : Array.isArray(props.shots) && props.shots.length > 0

  if (hasShots) {
    const shotChildren: WidgetSchema[] = typeof props.shots === 'string'
      ? [{
          __repeat: props.shots,
          id: 'shot-marker',
          type: 'Button',
          props: {
            label: '{{ item.id }}',
            'data-video-src': '{{ item.videoSrc }}',
          },
        }]
      : (props.shots as Array<{ id: number; videoSrc: string }>).map((shot, i) => ({
          id: `${sectionId}-shot-${i}`,
          type: 'Button' as const,
          props: {
            label: String(shot.id),
            'data-video-src': shot.videoSrc,
          },
        }))

    videoWidgets.push({
      id: `${sectionId}-shots-container`,
      type: 'Box',
      style: {
        position: 'absolute',
        right: 'var(--spacing-md, 1rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
      },
      widgets: [{
        id: `${sectionId}-shots`,
        type: 'ProjectShowcase__FlexButtonRepeater',
        props: { prefix: 'sh', direction: 'column' },
        widgets: shotChildren,
      }]
    })
  }

  const videoContainer: WidgetSchema = {
    id: `${sectionId}-video-container`,
    type: 'Box',
    className: 'project-frame__content project-showcase__video-container',
    style: { position: 'relative', ...(props.videoBorder ? { border: '1px solid currentColor' } : {}) },
    widgets: videoWidgets
  }

  const widgets: WidgetSchema[] = [header, videoContainer]

  // Footer social links bar (optional)
  const socialLinks = rawProps.socialLinks
  if (socialLinks && (typeof socialLinks === 'string' || socialLinks.length > 0)) {
    widgets.push({
      id: `${sectionId}-contact-bar`,
      type: 'ContactBar',
      className: 'project-frame__footer',
      props: {
        links: socialLinks,
        textColor: props.textColor,
      },
    })
  }

  return {
    id: sectionId,
    patternId: 'ProjectShowcase',
    label: props.label ?? 'Project Showcase',
    constrained: props.constrained,
    colorMode: props.colorMode,
    sectionTheme: props.sectionTheme,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between'
    },
    style: {
      ...props.style,
    },
    className: ['project-frame', props.className].filter(Boolean).join(' '),
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'viewport',
    widgets
  }
}
