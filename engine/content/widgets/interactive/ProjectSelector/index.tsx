'use client'

import React, { memo, forwardRef, useState, useCallback, useMemo } from 'react'
import type { ProjectSelectorProps, ProjectSelectorItem } from './types'
import type { WidgetSchema } from '../../../../schema'
import './styles.css'

/**
 * Extract project items from widget children.
 * Children should be GalleryThumbnail widgets with props containing project data.
 */
function extractProjectsFromWidgets(widgets: WidgetSchema[]): ProjectSelectorItem[] {
  return widgets.map((widget, index) => {
    const props = widget.props ?? {}
    return {
      id: widget.id ?? `project-${index}`,
      thumbnail: (props.thumbnailSrc as string) ?? (props.thumbnail as string) ?? '',
      alt: (props.thumbnailAlt as string) ?? (props.alt as string),
      title: (props.title as string) ?? '',
      year: props.year as string | undefined,
      studio: props.studio as string | undefined,
      url: (props.videoSrc as string) ?? (props.url as string),
    }
  })
}

const ProjectSelector = memo(forwardRef<HTMLDivElement, ProjectSelectorProps>(function ProjectSelector(
  {
    projects: projectsProp,
    widgets,
    activeIndex = 0,
    onSelect,
    onActiveClick,
    orientation = 'horizontal',
    showInfo = true,
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  // Prefer widgets (children via __repeat) over projects prop
  const projects = useMemo(() => {
    if (widgets && widgets.length > 0) {
      return extractProjectsFromWidgets(widgets)
    }
    return projectsProp ?? []
  }, [widgets, projectsProp])

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleClick = useCallback((index: number, project: ProjectSelectorItem) => {
    if (index === activeIndex && project.url && onActiveClick) {
      onActiveClick(project)
    } else if (onSelect) {
      onSelect(index)
    }
  }, [activeIndex, onSelect, onActiveClick])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!onSelect) return

    const isHorizontal = orientation === 'horizontal'
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

    if (e.key === prevKey) {
      e.preventDefault()
      onSelect(Math.max(0, activeIndex - 1))
    } else if (e.key === nextKey) {
      e.preventDefault()
      onSelect(Math.min(projects.length - 1, activeIndex + 1))
    } else if (e.key === 'Enter' && projects[activeIndex]?.url && onActiveClick) {
      onActiveClick(projects[activeIndex])
    }
  }, [orientation, activeIndex, projects, onSelect, onActiveClick])

  // Empty state
  if (projects.length === 0) {
    return null
  }

  const classNames = [
    'project-selector',
    `project-selector--${orientation}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
      role="listbox"
      aria-label="Project selector"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {projects.map((project, index) => {
        const isActive = index === activeIndex
        const isHovered = index === hoveredIndex

        return (
          <div
            key={project.id}
            className={`project-selector__item ${isActive ? 'project-selector__item--active' : ''}`}
            role="option"
            aria-selected={isActive}
            onClick={() => handleClick(index, project)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Thumbnail */}
            <div className="project-selector__thumbnail">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnail}
                alt={project.alt ?? project.title}
                className="project-selector__image"
              />

              {/* Progress bar for active item */}
              {isActive && (
                <div className="project-selector__progress" />
              )}
            </div>

            {/* Info card on hover */}
            {showInfo && isHovered && (
              <div className="project-selector__info">
                <span className="project-selector__title">{project.title}</span>
                {project.year && (
                  <span className="project-selector__year">{project.year}</span>
                )}
                {project.studio && (
                  <span className="project-selector__studio">{project.studio}</span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}))

export default ProjectSelector
