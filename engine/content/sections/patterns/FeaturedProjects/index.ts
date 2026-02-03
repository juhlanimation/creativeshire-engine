/**
 * FeaturedProjectsSection pattern - factory function for project grids.
 * Featured projects grid with alternating ProjectCard layouts.
 */

import { createProjectCard } from '../../../widgets/patterns'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import type { FeaturedProjectsProps } from './types'
import { isBindingExpression } from '../utils'

/**
 * Creates a FeaturedProjectsSection schema with project cards.
 * Cards use alternating layout (thumbnail left/right).
 *
 * Structure matches bojuhl.com:
 * - Section (full width background, vertical padding)
 *   - Content wrapper Flex (max-width 2400px, centered, gap between cards)
 *     - ProjectCard widgets
 *
 * @param props - Featured projects section configuration
 * @returns SectionSchema for the featured projects section
 */
export function createFeaturedProjectsSection(props: FeaturedProjectsProps): SectionSchema {
  // Handle binding expressions: if projects is a binding, use a FeaturedProjectsGrid widget
  let contentWrapper: WidgetSchema

  if (isBindingExpression(props.projects)) {
    // Binding expression: create a widget that handles the array at runtime
    contentWrapper = {
      id: 'featured-projects-content',
      type: 'FeaturedProjectsGrid',
      className: 'featured-projects__content',
      props: {
        projects: props.projects,  // Binding expression passed through
        startReversed: props.startReversed ?? false
      }
    }
  } else {
    // Real array: generate project cards at definition time
    const projectCards = props.projects.map((project, index) =>
      createProjectCard({
        id: `project-${index}`,
        thumbnailSrc: project.thumbnailSrc,
        thumbnailAlt: project.thumbnailAlt,
        videoSrc: project.videoSrc,
        videoUrl: project.videoUrl,
        client: project.client,
        studio: project.studio,
        title: project.title,
        description: project.description,
        year: project.year,
        role: project.role,
        // Alternating layout: offset by startReversed flag
        reversed: (index + (props.startReversed ? 1 : 0)) % 2 === 1
      })
    )

    // Content wrapper - matches content-container from reference
    // This Flex widget centers and constrains the project cards
    contentWrapper = {
      id: 'featured-projects-content',
      type: 'Flex' as const,
      className: 'featured-projects__content',
      props: {
        direction: 'column' as const,
        align: 'stretch' as const
      },
      widgets: projectCards
    }
  }

  return {
    id: props.id ?? 'projects',
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'stretch'
    },
    style: {
      backgroundColor: '#fff' // White background to match reference
    },
    widgets: [contentWrapper]
  }
}
