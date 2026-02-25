/**
 * FeaturedProjectsSection pattern - factory function for project grids.
 * Featured projects grid with alternating ProjectCard layouts.
 */

import { createProjectCard } from './components/ProjectCard'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import type { FeaturedProject, ProjectFeaturedProps } from './types'
import { isBindingExpression } from '../utils'

/**
 * Creates a FeaturedProjectsSection schema with project cards.
 * Cards use alternating layout (thumbnail left/right).
 *
 * Structure:
 * - Section (full width background, vertical padding)
 *   - Content wrapper Flex (max-width 2400px, centered, gap between cards)
 *     - ProjectCard widgets
 *
 * @param props - Featured projects section configuration
 * @returns SectionSchema for the featured projects section
 */
export function createProjectFeaturedSection(props?: ProjectFeaturedProps): SectionSchema {
  const p = props ?? {}

  // Resolve content with default bindings
  const projects = p.projects ?? '{{ content.projects.featured }}'
  const thumbnailDecorators = p.thumbnailDecorators  // undefined = use ProjectCard meta defaults

  // Handle binding expressions: if projects is a binding, use __repeat pattern
  let contentWrapper: WidgetSchema

  if (isBindingExpression(projects)) {
    // Binding expression: use __repeat pattern for platform expansion
    // Platform will clone this template for each item in the array
    // and resolve {{ item.xxx }} bindings per-clone
    const templateCard = createProjectCard({
      id: 'project-card',
      thumbnailSrc: '{{ item.thumbnailSrc }}',
      thumbnailAlt: '{{ item.thumbnailAlt }}',
      videoSrc: '{{ item.videoSrc }}',
      videoUrl: '{{ item.videoUrl }}',
      client: '{{ item.client }}',
      studio: '{{ item.studio }}',
      title: '{{ item.title }}',
      description: '{{ item.description }}',
      year: '{{ item.year }}',
      role: '{{ item.role }}',
      // Binding mode: emit data-index so Flex computes reversed at render time
      dataIndex: '{{ item.$index }}',
      thumbnailDecorators,
    })

    contentWrapper = {
      id: 'featured-projects-content',
      type: 'Flex',
      className: 'featured-projects__content',
      props: {
        direction: 'column',
        align: 'stretch',
        gap: p.gap ?? 'loose',
        gapScale: 3,
      },
      widgets: [{
        ...templateCard,
        __repeat: projects,  // Platform expands this at render time
      }]
    }
  } else {
    // Real array: generate project cards at definition time
    const projectCards = (projects as FeaturedProject[]).map((project, index) =>
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
        reversed: (index + (p.startReversed ? 1 : 0)) % 2 === 1,
        thumbnailDecorators,
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
        align: 'stretch' as const,
        gap: p.gap ?? 'loose',
        gapScale: 3,
      },
      widgets: projectCards
    }
  }

  return {
    id: p.id ?? 'projects',
    patternId: 'ProjectFeatured',
    label: p.label ?? 'Featured Projects',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode,
    sectionTheme: p.sectionTheme,
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'stretch'
    },
    style: p.style,
    className: p.className,
    paddingTop: p.paddingTop ?? 100,
    paddingBottom: p.paddingBottom ?? 100,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight,
    widgets: [contentWrapper]
  }
}
