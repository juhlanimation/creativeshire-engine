/**
 * ProjectVideoGrid section pattern.
 * Mixed aspect ratio video grid (Clash Royale style).
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { createContactBar } from '../../../widgets/patterns'
import { isBindingExpression } from '../utils'
import type { ProjectVideoGridProps, VideoGridItem } from './types'

/**
 * Creates a video widget from a VideoGridItem.
 */
function createVideoWidget(
  video: VideoGridItem,
  index: number,
  columnId: string,
  sectionId: string,
  hoverPlay: boolean
): WidgetSchema {
  return {
    id: `${sectionId}-${columnId}-video-${index}`,
    type: 'Video',
    props: {
      src: video.src,
      hoverPlay,
      aspectRatio: video.aspectRatio.replace(':', '/'),
      alt: video.title,
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
      hoverPlay,
      aspectRatio: '{{ item.aspectRatio }}',
      alt: '{{ item.title }}',
    },
    className: 'project-video-grid__video',
  }
}

/**
 * Creates a ProjectVideoGrid section schema.
 *
 * Layout:
 * - Header with project logo
 * - Two-column grid with mixed aspect ratio videos
 * - ContactBar at bottom
 *
 * @param props - ProjectVideoGrid section configuration
 * @returns SectionSchema for the project video grid section
 */
export function createProjectVideoGridSection(
  props: ProjectVideoGridProps
): SectionSchema {
  const sectionId = props.id ?? 'project-video-grid'
  const hoverPlay = props.hoverPlay ?? true

  // Header with logo
  const header: WidgetSchema = {
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-video-grid__header',
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
    // Binding expression: use __repeat pattern for platform expansion
    // Platform will expand this template for each item in the array
    // Use condition to filter by column
    const templateVideo = createTemplateVideoWidget(sectionId, hoverPlay)

    // Left column - only renders videos where column === 'left'
    const leftColumn: WidgetSchema = {
      id: `${sectionId}-left-col`,
      type: 'Flex',
      className: 'project-video-grid__column project-video-grid__column--left',
      props: { direction: 'column', gap: '0.5rem' },
      widgets: [
        {
          ...templateVideo,
          id: `${sectionId}-left-video`,
          __repeat: props.videos,
          // Condition filters to only left column items
          condition: "{{ item.column === 'left' }}",
        },
      ],
    }

    // Right column - only renders videos where column === 'right'
    const rightColumn: WidgetSchema = {
      id: `${sectionId}-right-col`,
      type: 'Flex',
      className: 'project-video-grid__column project-video-grid__column--right',
      props: { direction: 'column', gap: '0.5rem' },
      widgets: [
        {
          ...templateVideo,
          id: `${sectionId}-right-video`,
          __repeat: props.videos,
          // Condition filters to only right column items
          condition: "{{ item.column === 'right' }}",
        },
      ],
    }

    grid = {
      id: `${sectionId}-grid`,
      type: 'Grid',
      className: 'project-video-grid__grid',
      props: { columns: 2, gap: '0.5rem' },
      widgets: [leftColumn, rightColumn],
    }
  } else {
    // Real array: generate video widgets at definition time
    const leftVideos = props.videos.filter((v) => v.column === 'left')
    const rightVideos = props.videos.filter((v) => v.column === 'right')

    const leftColumn: WidgetSchema = {
      id: `${sectionId}-left-col`,
      type: 'Flex',
      className: 'project-video-grid__column project-video-grid__column--left',
      props: { direction: 'column', gap: '0.5rem' },
      widgets: leftVideos.map((v, i) =>
        createVideoWidget(v, i, 'left', sectionId, hoverPlay)
      ),
    }

    const rightColumn: WidgetSchema = {
      id: `${sectionId}-right-col`,
      type: 'Flex',
      className: 'project-video-grid__column project-video-grid__column--right',
      props: { direction: 'column', gap: '0.5rem' },
      widgets: rightVideos.map((v, i) =>
        createVideoWidget(v, i, 'right', sectionId, hoverPlay)
      ),
    }

    grid = {
      id: `${sectionId}-grid`,
      type: 'Grid',
      className: 'project-video-grid__grid',
      props: { columns: 2, gap: '0.5rem' },
      widgets: [leftColumn, rightColumn],
    }
  }

  // ContactBar
  const contactBar = createContactBar({
    id: `${sectionId}-contact`,
    email: props.email,
    textColor: props.textColor ?? 'light',
  })

  return {
    id: sectionId,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between',
    },
    style: {
      backgroundColor: props.backgroundColor ?? '#000000',
      color: props.textColor === 'dark' ? '#000' : '#fff',
      minHeight: '100vh',
      padding: '2rem',
    },
    className: 'project-video-grid',
    widgets: [header, grid, contactBar],
  }
}
