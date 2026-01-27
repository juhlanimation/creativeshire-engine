/**
 * OtherProjectsSection composite - factory function for thumbnail galleries.
 * Horizontal thumbnail gallery (hidden on mobile).
 */

import type { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import type { OtherProjectsProps } from './types'

/**
 * Creates an OtherProjectsSection schema with expanding thumbnails.
 * Hidden on mobile, visible as horizontal gallery on tablet+.
 *
 * @param props - Other projects section configuration
 * @returns SectionSchema for the other projects section
 */
export function createOtherProjectsSection(props: OtherProjectsProps): SectionSchema {
  const widgets: WidgetSchema[] = []

  // Section heading
  if (props.heading) {
    widgets.push({
      id: 'other-projects-heading',
      type: 'Text',
      props: {
        content: props.heading,
        as: 'h2'
      }
    })
  }

  // Year range label
  if (props.yearRange) {
    widgets.push({
      id: 'other-projects-year-range',
      type: 'Text',
      props: {
        content: props.yearRange,
        as: 'span'
      }
    })
  }

  // Project thumbnails as VideoThumbnail widgets
  props.projects.forEach((project, index) => {
    widgets.push({
      id: `other-project-${index}`,
      type: 'VideoThumbnail',
      props: {
        src: project.thumbnailSrc,
        alt: project.thumbnailAlt,
        aspectRatio: '9/16', // Portrait aspect ratio for gallery
        showWatchButton: true
      }
    })
  })

  return {
    id: props.id ?? 'other-projects',
    layout: {
      type: 'flex',
      direction: 'row',
      align: 'center',
      gap: 4
    },
    features: {
      background: {
        color: 'rgb(255, 255, 255)'
      },
      spacing: {
        padding: '128px 0'
      }
    },
    behaviour: 'gallery-thumbnail-expand',
    widgets
  }
}
