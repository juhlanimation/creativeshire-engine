/**
 * FeaturedProjectsGrid widget - renders featured project cards.
 *
 * Accepts either:
 * - An array of FeaturedProject objects (renders immediately)
 * - A binding expression string (returns null, platform resolves and re-renders)
 *
 * This widget exists to support binding expressions in presets where
 * the project array isn't known at definition time.
 */

'use client'

import { memo } from 'react'
import { WidgetRenderer } from '../../../../renderer/WidgetRenderer'
import { createProjectCard } from '../../patterns'
import type { FeaturedProjectsGridProps } from './types'
import './styles.css'

/**
 * Check if a value is a binding expression (starts with {{ content.)
 */
function isBindingExpression(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{{ content.')
}

function FeaturedProjectsGrid({
  projects,
  startReversed = false,
  className,
  style,
}: FeaturedProjectsGridProps) {
  // If projects is a binding expression, render nothing
  // Platform will resolve the binding and re-render with actual array
  if (isBindingExpression(projects)) {
    return null
  }

  // If not an array (shouldn't happen but defensive), render nothing
  if (!Array.isArray(projects)) {
    return null
  }

  // Map projects to createProjectCard() with alternating reversed flag
  const projectCards = projects.map((project, index) =>
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
      reversed: (index + (startReversed ? 1 : 0)) % 2 === 1,
    })
  )

  // Render each project card via WidgetRenderer
  return (
    <div
      className={className ? `featured-projects-grid ${className}` : 'featured-projects-grid'}
      style={style}
    >
      {projectCards.map((card, index) => (
        <WidgetRenderer key={card.id ?? index} widget={card} index={index} />
      ))}
    </div>
  )
}

export default memo(FeaturedProjectsGrid)
