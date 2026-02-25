/**
 * ProjectVideoGrid section pattern.
 * Mixed aspect ratio video grid (Clash Royale style).
 *
 * Layout: vertical (9/16) videos side-by-side on the left,
 * horizontal (16/9) videos stacked on the right.
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { isBindingExpression } from '../utils'
import type { ProjectVideoGridProps, VideoGridItem } from './types'
import { meta } from './meta'

/** Returns true for vertical (portrait) aspect ratios. */
function isVertical(aspectRatio: string): boolean {
  return aspectRatio === '9/16'
}

/**
 * Creates a video widget from a VideoGridItem.
 */
function createVideoWidget(
  video: VideoGridItem,
  index: number,
  groupId: string,
  sectionId: string,
  hoverPlay: boolean
): WidgetSchema {
  return {
    id: `${sectionId}-${groupId}-video-${index}`,
    type: 'Video',
    props: {
      src: video.src,
      poster: video.poster,
      posterTime: video.posterTime,
      hoverPlay,
      aspectRatio: video.aspectRatio,
      alt: video.title,
      overlayTitle: video.title,
    },
    className: 'project-video-grid__video',
  }
}

/**
 * Creates a template video widget for binding expression expansion.
 */
function createTemplateVideoWidget(
  sectionId: string,
  hoverPlay: boolean
): WidgetSchema {
  return {
    id: `${sectionId}-video`,
    type: 'Video',
    props: {
      src: '{{ item.src }}',
      poster: '{{ item.poster }}',
      posterTime: '{{ item.posterTime }}',
      hoverPlay,
      aspectRatio: '{{ item.aspectRatio }}',
      alt: '{{ item.title }}',
      overlayTitle: '{{ item.title }}',
    },
    className: 'project-video-grid__video',
  }
}

/**
 * Creates a ProjectVideoGrid section schema.
 *
 * Layout:
 * - Header with project logo
 * - Flex row: vertical group (9/16 side-by-side) + horizontal group (16/9 stacked)
 *
 * Visual styles (padding, gap, colors) are in styles.css using theme variables.
 * Background color should be set via `style.backgroundColor` from the preset.
 */
export function createProjectVideoGridSection(
  rawProps: ProjectVideoGridProps
): SectionSchema {
  const props = applyMetaDefaults(meta, rawProps)
  const sectionId = props.id ?? 'project-video-grid'
  const hoverPlay = props.hoverPlay as boolean

  // Header with logo
  const header: WidgetSchema = {
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-frame__header project-video-grid__header',
    props: { direction: 'row', align: 'center' },
    widgets: [
      {
        id: `${sectionId}-logo`,
        type: 'Image',
        props: {
          src: props.logo.src,
          alt: props.logo.alt,
          decorative: false,
        },
        style: {
          width: props.logo.width ?? 200,
          filter: props.logo.invert ? 'invert(1)' : undefined,
        },
        className: 'project-video-grid__logo',
      },
    ],
  }

  // Build grid content based on whether videos is a binding or array
  let grid: WidgetSchema

  if (isBindingExpression(props.videos)) {
    // Binding expression: use __repeat pattern with conditions for grouping
    const templateVideo = createTemplateVideoWidget(sectionId, hoverPlay)

    // Vertical group — 9/16 videos side-by-side in a row
    const verticalGroup: WidgetSchema = {
      id: `${sectionId}-vertical-group`,
      type: 'Flex',
      className: 'project-video-grid__vertical-group',
      props: { direction: 'row' },
      widgets: [
        {
          ...templateVideo,
          id: `${sectionId}-vertical-video`,
          __repeat: props.videos,
          condition: "{{ item.aspectRatio === '9/16' }}",
        },
      ],
    }

    // Horizontal group — 16/9 videos stacked in a column
    const horizontalGroup: WidgetSchema = {
      id: `${sectionId}-horizontal-group`,
      type: 'Flex',
      className: 'project-video-grid__horizontal-group',
      props: { direction: 'column' },
      widgets: [
        {
          ...templateVideo,
          id: `${sectionId}-horizontal-video`,
          __repeat: props.videos,
          condition: "{{ item.aspectRatio !== '9/16' }}",
        },
      ],
    }

    grid = {
      id: `${sectionId}-grid`,
      type: 'Flex',
      className: 'project-video-grid__grid',
      props: { direction: 'row' },
      widgets: [verticalGroup, horizontalGroup],
    }
  } else {
    // Real array: group by aspect ratio
    const verticalVideos = props.videos.filter((v) => isVertical(v.aspectRatio))
    const horizontalVideos = props.videos.filter((v) => !isVertical(v.aspectRatio))

    const verticalGroup: WidgetSchema = {
      id: `${sectionId}-vertical-group`,
      type: 'Flex',
      className: 'project-video-grid__vertical-group',
      props: { direction: 'row' },
      widgets: verticalVideos.map((v, i) =>
        createVideoWidget(v, i, 'vertical', sectionId, hoverPlay)
      ),
    }

    const horizontalGroup: WidgetSchema = {
      id: `${sectionId}-horizontal-group`,
      type: 'Flex',
      className: 'project-video-grid__horizontal-group',
      props: { direction: 'column' },
      widgets: horizontalVideos.map((v, i) =>
        createVideoWidget(v, i, 'horizontal', sectionId, hoverPlay)
      ),
    }

    grid = {
      id: `${sectionId}-grid`,
      type: 'Flex',
      className: 'project-video-grid__grid',
      props: { direction: 'row' },
      widgets: [verticalGroup, horizontalGroup],
    }
  }

  // Content area wraps grid for shared frame centering
  const content: WidgetSchema = {
    id: `${sectionId}-content`,
    type: 'Box',
    className: 'project-frame__content',
    widgets: [grid],
  }

  const widgets: WidgetSchema[] = [header, content]

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
    patternId: 'ProjectVideoGrid',
    label: props.label ?? 'Project Video Grid',
    constrained: props.constrained,
    colorMode: props.colorMode,
    sectionTheme: props.sectionTheme,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between',
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
    widgets,
  }
}
