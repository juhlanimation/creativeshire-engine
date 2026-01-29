/**
 * ProjectCard composite factory.
 * Creates a widget schema for featured project display using primitives.
 *
 * Architecture: Composite (factory function returning WidgetSchema)
 * Composes: Flex, Box, Video, Text
 */

import type { WidgetSchema } from '@/creativeshire/schema'
import type { ProjectCardConfig } from './types'

export type { ProjectCardConfig }

/**
 * Creates a project card widget schema.
 *
 * Layout:
 * - Normal: [Thumbnail Column] [Content Column]
 * - Reversed: [Content Column] [Thumbnail Column]
 *
 * Thumbnail Column contains:
 * - Video with hoverPlay (16:9 aspect ratio, plays on hover)
 * - Metadata row (Client + Studio)
 *
 * Content Column contains:
 * - Title (h3)
 * - Description (p)
 */
export function createProjectCard(config: ProjectCardConfig): WidgetSchema {
  const cardId = config.id ?? 'project-card'

  // Determine modal direction based on layout
  // When reversed, thumbnail is on right → wipe from right
  // When not reversed, thumbnail is on left → wipe from left
  const modalDirection = config.reversed ? 'right' : 'left'

  // Thumbnail column with metadata below
  const thumbnailColumn: WidgetSchema = {
    id: `${cardId}-thumbnail-col`,
    type: 'Box',
    className: 'project-card__thumbnail-column',
    widgets: [
      {
        id: `${cardId}-thumbnail`,
        type: 'Video',
        props: {
          src: config.videoSrc ?? '',
          poster: config.thumbnailSrc,
          alt: config.thumbnailAlt,
          hoverPlay: true,
          aspectRatio: '16/9',
          // Modal props
          videoUrl: config.videoUrl,
          modalTransition: 'mask-wipe',
          modalDirection,
        }
      },
      {
        id: `${cardId}-meta`,
        type: 'Flex',
        className: 'project-card__meta',
        props: {
          direction: 'row'
          // gap handled by CSS for proper responsive values
        },
        widgets: [
          {
            type: 'Text',
            props: {
              content: `Client ${config.client}`,
              as: 'span'
            },
            className: 'project-card__meta-item'
          },
          {
            type: 'Text',
            props: {
              content: `Studio ${config.studio}`,
              as: 'span'
            },
            className: 'project-card__meta-item'
          }
        ]
      }
    ]
  }

  // Content column with project details
  const contentColumn: WidgetSchema = {
    id: `${cardId}-content`,
    type: 'Box',
    className: 'project-card__content',
    widgets: [
      {
        type: 'Text',
        props: {
          content: config.title,
          as: 'h3'
        },
        className: 'project-card__title'
      },
      {
        type: 'Text',
        props: {
          content: config.description,
          as: 'p'
        },
        className: 'project-card__description'
      },
      {
        type: 'Text',
        props: {
          content: config.year,
          as: 'p'
        },
        className: 'project-card__year'
      },
      {
        type: 'Text',
        props: {
          content: config.role,
          as: 'p'
        },
        className: 'project-card__role'
      }
    ]
  }

  // Order columns based on reversed flag
  const children = config.reversed
    ? [contentColumn, thumbnailColumn]
    : [thumbnailColumn, contentColumn]

  // Build class name
  const className = [
    'project-card',
    config.reversed ? 'project-card--reversed' : ''
  ].filter(Boolean).join(' ')

  return {
    id: cardId,
    type: 'Flex',
    className,
    props: {
      // direction and gap handled by CSS for responsive behavior
      align: 'start'
    },
    widgets: children
  }
}
