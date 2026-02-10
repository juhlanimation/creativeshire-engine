'use client'

import React, { memo, forwardRef, useState, useCallback, useMemo } from 'react'
import type { ProjectSelectorProps, ProjectSelectorItem } from './types'
import type { WidgetSchema } from '../../../../schema'
import './styles.css'

const VIDEO_EXTENSIONS = /\.(webm|mp4|ogg|mov)$/i

/** Detect if a URL points to a video file */
function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.test(src)
}

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
      role: props.role as string | undefined,
      url: (props.videoSrc as string) ?? (props.url as string),
      posterTime: props.posterTime as number | undefined,
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
    thumbnailWidth,
    activeThumbnailWidth,
    accentColor,
    showPlayingIndicator = false,
    showPlayIcon = false,
    showOverlay = false,
    thumbnailBorder,
    thumbnailBorderRadius,
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

  // CSS custom properties for configurable sizing/colors
  const cssVars: Record<string, string | undefined> = {}
  if (thumbnailWidth) cssVars['--ps-thumb-w'] = `${thumbnailWidth}px`
  if (activeThumbnailWidth) cssVars['--ps-active-thumb-w'] = `${activeThumbnailWidth}px`
  if (accentColor) cssVars['--ps-accent'] = accentColor
  if (thumbnailBorder) cssVars['--ps-border'] = thumbnailBorder
  if (thumbnailBorderRadius !== undefined) cssVars['--ps-radius'] = thumbnailBorderRadius

  return (
    <div
      ref={ref}
      className={classNames}
      style={Object.keys(cssVars).length > 0 ? cssVars as React.CSSProperties : undefined}
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
              {isVideoSrc(project.thumbnail) ? (
                <video
                  src={project.thumbnail}
                  muted
                  playsInline
                  preload="auto"
                  className="project-selector__image"
                  aria-label={project.alt ?? project.title}
                  onLoadedData={(e) => {
                    const v = e.currentTarget
                    const t = project.posterTime ?? 0.001
                    if (v.currentTime === 0) v.currentTime = t
                  }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnail}
                  alt={project.alt ?? project.title}
                  className="project-selector__image"
                />
              )}

              {/* Dark overlay on active/hover */}
              {showOverlay && (isActive || isHovered) && (
                <div className={`project-selector__overlay ${isActive ? 'project-selector__overlay--active' : ''}`} />
              )}

              {/* Play icon on hover (inactive only) */}
              {showPlayIcon && isHovered && !isActive && (
                <div className="project-selector__play-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}

              {/* Playing indicator on active card */}
              {showPlayingIndicator && isActive && (
                <div className="project-selector__playing">
                  <span className="project-selector__playing-dot" />
                  <span className="project-selector__playing-label">Playing</span>
                </div>
              )}

              {/* Progress bar for active item */}
              {isActive && (
                <div className="project-selector__progress" />
              )}
            </div>

            {/* Info card on hover */}
            {showInfo && isHovered && (
              <div className="project-selector__info">
                <span className="project-selector__title">{project.title}</span>
                {project.role && (
                  <span className="project-selector__role">{project.role}</span>
                )}
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
