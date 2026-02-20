'use client'

import React, { memo, forwardRef, useState, useCallback, useMemo } from 'react'
import type { FlexGalleryCardRepeaterProps, FlexGalleryCardRepeaterItem } from './types'
import type { WidgetSchema } from '../../../../../../schema'
import SelectorCard from './SelectorCard'

/**
 * Extract project items from widget children.
 * Children should be widgets with props containing project data.
 */
function extractProjectsFromWidgets(widgets: WidgetSchema[]): FlexGalleryCardRepeaterItem[] {
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

const FlexGalleryCardRepeater = memo(forwardRef<HTMLDivElement, FlexGalleryCardRepeaterProps>(function FlexGalleryCardRepeater(
  {
    widgets,
    activeIndex: controlledIndex = 0,
    onClick,
    orientation = 'horizontal',
    showInfo = true,
    thumbnailWidth,
    activeThumbnailWidth,
    accentColor,
    showPlayingIndicator = true,
    showPlayIcon = true,
    showOverlay = true,
    thumbnailBorder,
    thumbnailBorderRadius,
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const projects = useMemo(() => {
    if (widgets && widgets.length > 0) {
      return extractProjectsFromWidgets(widgets)
    }
    return []
  }, [widgets])

  const [activeIndex, setActiveIndex] = useState(controlledIndex)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleClick = useCallback((index: number, project: FlexGalleryCardRepeaterItem) => {
    setActiveIndex(index)
    onClick?.({
      index,
      videoSrc: project.url,
      title: project.title,
    })
  }, [onClick])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const isHorizontal = orientation === 'horizontal'
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

    if (e.key === prevKey) {
      e.preventDefault()
      const newIndex = Math.max(0, activeIndex - 1)
      setActiveIndex(newIndex)
      onClick?.({
        index: newIndex,
        videoSrc: projects[newIndex]?.url,
        title: projects[newIndex]?.title,
      })
    } else if (e.key === nextKey) {
      e.preventDefault()
      const newIndex = Math.min(projects.length - 1, activeIndex + 1)
      setActiveIndex(newIndex)
      onClick?.({
        index: newIndex,
        videoSrc: projects[newIndex]?.url,
        title: projects[newIndex]?.title,
      })
    }
  }, [orientation, activeIndex, projects, onClick])

  // Empty state
  if (projects.length === 0) {
    return null
  }

  const classNames = [
    'flex-gcr',
    `flex-gcr--${orientation}`,
    className
  ].filter(Boolean).join(' ')

  // CSS custom properties for configurable sizing
  const cssVars: Record<string, string | undefined> = {}
  if (thumbnailWidth) cssVars['--ps-thumb-w'] = `${thumbnailWidth}px`
  if (activeThumbnailWidth) cssVars['--ps-active-thumb-w'] = `${activeThumbnailWidth}px`
  if (thumbnailBorder) cssVars['--ps-border'] = thumbnailBorder

  return (
    <div
      ref={ref}
      className={classNames}
      style={Object.keys(cssVars).length > 0 ? cssVars as React.CSSProperties : undefined}
      data-accent={accentColor}
      data-radius={thumbnailBorderRadius}
      data-behaviour={dataBehaviour}
      role="listbox"
      aria-label="Project selector"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {projects.map((project, index) => {
        // Info shows on the hovered card if one is hovered, otherwise on the active card
        const showInfoIndex = hoveredIndex !== null ? hoveredIndex : activeIndex
        const cardShowInfo = showInfo && index === showInfoIndex

        return (
          <SelectorCard
            key={project.id}
            thumbnailSrc={project.thumbnail}
            thumbnailAlt={project.alt}
            title={project.title}
            year={project.year}
            studio={project.studio}
            role={project.role}
            videoSrc={project.url}
            posterTime={project.posterTime}
            isActive={index === activeIndex}
            showInfo={cardShowInfo}
            accentColor={accentColor}
            showPlayingIndicator={showPlayingIndicator}
            showPlayIcon={showPlayIcon}
            showOverlay={showOverlay}
            thumbnailBorderRadius={thumbnailBorderRadius}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleClick(index, project)}
          />
        )
      })}
    </div>
  )
}))

export default FlexGalleryCardRepeater

import { registerScopedWidget } from '../../../../../widgets/registry'
registerScopedWidget('ProjectGallery__FlexGalleryCardRepeater', FlexGalleryCardRepeater)
