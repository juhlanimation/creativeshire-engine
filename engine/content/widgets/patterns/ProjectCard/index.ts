/**
 * ProjectCard composite factory.
 * Creates a widget schema for featured project display using primitives.
 *
 * Architecture: Composite (factory function returning WidgetSchema)
 * Composes: Flex, Box, Video, Text
 */

import type { WidgetSchema } from '../../../../schema'
import type { ProjectCardConfig } from './types'

export type { ProjectCardConfig }

/**
 * Creates a project card widget schema.
 *
 * Layout controlled by data-reversed attribute:
 * - data-reversed="false": Thumbnail LEFT, Content RIGHT
 * - data-reversed="true": Content LEFT, Thumbnail RIGHT (via CSS row-reverse)
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
          videoUrl: config.videoUrl,
          // modalAnimationType computed by Video from --card-reversed CSS variable
        },
        // Wire click to open-video-modal action (only when videoUrl is set)
        ...(config.videoUrl ? { on: { click: 'open-video-modal' } } : {}),
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

  // DOM order is always [thumbnail, content]
  // CSS handles visual reversal via flex-direction: row-reverse when data-reversed="true"
  const children = [thumbnailColumn, contentColumn]

  return {
    id: cardId,
    type: 'Flex',
    className: 'project-card',
    'data-reversed': String(!!config.reversed), // Controls layout via CSS
    props: {
      // direction and gap handled by CSS for responsive behavior
      align: 'start'
    },
    widgets: children
  }
}
