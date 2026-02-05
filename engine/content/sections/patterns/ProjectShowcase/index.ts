/**
 * ProjectShowcase section pattern.
 * Single project display (The Boy, Mole, Fox & Horse style).
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { createContactBar } from '../../../widgets/patterns'
import type { ProjectShowcaseProps } from './types'

export function createProjectShowcaseSection(props: ProjectShowcaseProps): SectionSchema {
  const sectionId = props.id ?? 'project-showcase'
  const isDark = props.textColor !== 'dark'

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
        props: { direction: 'column', align: 'end', gap: '0.25rem' },
        widgets: [
          {
            type: 'Text',
            props: { content: props.studio, as: 'span' },
            className: 'project-showcase__studio'
          },
          {
            type: 'Text',
            props: { content: props.role, as: 'span' },
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
        autoplay: true,
        loop: true,
        muted: true,
        aspectRatio: '16/9'
      },
      className: 'project-showcase__video'
    }
  ]

  // Add shot indicator if shots provided
  if (props.shots && props.shots.length > 0) {
    videoWidgets.push({
      id: `${sectionId}-shots`,
      type: 'ShotIndicator',
      props: {
        shots: props.shots,
        position: 'top-right'
      }
    })
  }

  const videoContainer: WidgetSchema = {
    id: `${sectionId}-video-container`,
    type: 'Box',
    className: 'project-showcase__video-container',
    style: props.videoBorder ? { border: '1px solid currentColor' } : undefined,
    widgets: videoWidgets
  }

  // ContactBar
  const contactBar = createContactBar({
    id: `${sectionId}-contact`,
    email: props.email,
    textColor: props.textColor ?? 'light'
  })

  return {
    id: sectionId,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between'
    },
    style: {
      backgroundColor: props.backgroundColor ?? '#FAF6ED',
      color: isDark ? '#fff' : '#000',
      minHeight: '100vh',
      padding: '2rem'
    },
    className: 'project-showcase',
    widgets: [header, videoContainer, contactBar]
  }
}
