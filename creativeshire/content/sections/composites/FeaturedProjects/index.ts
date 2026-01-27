/**
 * FeaturedProjectsSection composite - factory function for project grids.
 * Featured projects grid with alternating ProjectCard layouts.
 */

import type { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import type { FeaturedProjectsProps } from './types'

/**
 * Creates a FeaturedProjectsSection schema with project cards.
 * Cards use alternating layout (odd = thumbnail left, even = thumbnail right).
 *
 * @param props - Featured projects section configuration
 * @returns SectionSchema for the featured projects section
 */
export function createFeaturedProjectsSection(props: FeaturedProjectsProps): SectionSchema {
  const widgets: WidgetSchema[] = props.projects.map((project, index) => ({
    id: `project-${index}`,
    type: 'ProjectCard',
    props: {
      thumbnailSrc: project.thumbnailSrc,
      thumbnailAlt: project.thumbnailAlt,
      ...(project.videoSrc ? { videoSrc: project.videoSrc } : {}),
      client: project.client,
      studio: project.studio,
      title: project.title,
      description: project.description,
      year: project.year,
      role: project.role,
      // Alternating layout: even indices are reversed (0-indexed, so 1, 3, 5... are reversed)
      reversed: index % 2 === 1
    }
  }))

  return {
    id: props.id ?? 'projects',
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'center',
      gap: 64 // Mobile gap, increases on tablet via CSS
    },
    features: {
      background: {
        color: 'rgb(255, 255, 255)'
      },
      spacing: {
        padding: '128px 0'
      }
    },
    widgets
  }
}
