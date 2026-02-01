'use client'

/**
 * ExpandableGalleryRow layout widget.
 * Horizontal row of expandable thumbnails with coordinated hover.
 *
 * Architecture (matches reference):
 * - Thumbnails row: expandable images/videos
 * - Labels row: separate row below with matching flex sizing
 * - Uses CursorLabel overlay for "WATCH" cursor
 * - Click calls onClick with payload (for modal via action registry)
 *
 * Reference: bojuhl.com more-projects-section.tsx
 */

import { useState, useCallback, useRef, useEffect, memo, type CSSProperties } from 'react'
import CursorLabel from '@/engine/content/chrome/overlays/CursorLabel'
import type { ExpandableGalleryRowProps, GalleryProject } from './types'
import './styles.css'

/** Thumbnail component - just image/video, no labels */
const Thumbnail = memo(function Thumbnail({
  project,
  isExpanded,
  wasJustLocked,
  onExpand,
  onLock,
  onClick,
  expandedWidth,
  transitionDuration,
}: {
  project: GalleryProject
  isExpanded: boolean
  wasJustLocked: boolean
  onExpand: () => void
  onLock: () => void
  onClick: (rect: DOMRect) => void
  expandedWidth: string
  transitionDuration: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Control video playback based on expanded state
  // (autoPlay attribute only works on initial render, not on prop changes)
  useEffect(() => {
    const video = videoRef.current
    if (!video || !project.videoSrc) return

    if (isExpanded) {
      video.play().catch(() => {
        // Autoplay may be blocked by browser - silent fail
      })
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isExpanded, project.videoSrc])

  // Wait for flex transition to complete before capturing rect
  // This ensures modal expand animation starts from correct bounds
  useEffect(() => {
    const container = containerRef.current
    if (!container || !wasJustLocked) return

    let captured = false
    const captureAndProceed = () => {
      if (captured) return
      captured = true
      const rect = container.getBoundingClientRect()
      onClick(rect)
    }

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== container) return
      if (e.propertyName !== 'flex' && e.propertyName !== 'width') return
      captureAndProceed()
    }

    container.addEventListener('transitionend', handleTransitionEnd)

    // Fallback: if already at target size (no transition fires), use timeout
    const timeoutId = setTimeout(captureAndProceed, transitionDuration + 50)

    return () => {
      container.removeEventListener('transitionend', handleTransitionEnd)
      clearTimeout(timeoutId)
    }
  }, [wasJustLocked, onClick, transitionDuration])

  const style: CSSProperties = {
    flex: isExpanded ? `0 0 ${expandedWidth}` : 1,
    width: isExpanded ? expandedWidth : undefined,
    transition: `flex ${transitionDuration}ms ease-out, width ${transitionDuration}ms ease-out`,
    minWidth: 0,
    height: '100%',
    cursor: project.videoUrl ? 'pointer' : undefined,
  }

  const handleClick = useCallback(() => {
    if (!project.videoUrl || !containerRef.current) return
    const container = containerRef.current

    // Check if already at target size (no transition in progress)
    const currentWidth = container.getBoundingClientRect().width
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const targetWidthPx = parseFloat(expandedWidth) * rootFontSize

    if (isExpanded && Math.abs(currentWidth - targetWidthPx) < 2) {
      // Already fully expanded - capture immediately (no delay)
      onClick(container.getBoundingClientRect())
      return
    }

    // Mid-transition or not expanded - lock and wait for transition
    onLock()
  }, [project.videoUrl, onClick, onLock, isExpanded, expandedWidth])

  return (
    <div
      ref={containerRef}
      className="expandable-gallery-row__thumbnail"
      style={style}
      onMouseEnter={onExpand}
      onClick={handleClick}
      data-cursor-label-target={project.videoUrl ? true : undefined}
    >
      {/* Poster image */}
      <img
        src={project.thumbnailSrc}
        alt={project.thumbnailAlt}
        className={`expandable-gallery-row__poster ${isExpanded && project.videoSrc ? 'expandable-gallery-row__poster--hidden' : ''}`}
      />

      {/* Video - plays when expanded */}
      {project.videoSrc && (
        <video
          ref={videoRef}
          src={project.videoSrc}
          loop
          muted
          playsInline
          preload="metadata"
          className={`expandable-gallery-row__video ${isExpanded ? 'expandable-gallery-row__video--visible' : ''}`}
        />
      )}
    </div>
  )
})

/** Labels for a single project */
const ProjectLabels = memo(function ProjectLabels({
  project,
  isExpanded,
  expandedWidth,
  transitionDuration,
}: {
  project: GalleryProject
  isExpanded: boolean
  expandedWidth: string
  transitionDuration: number
}) {
  const containerStyle: CSSProperties = {
    flex: isExpanded ? `0 0 ${expandedWidth}` : 1,
    width: isExpanded ? expandedWidth : undefined,
    transition: `flex ${transitionDuration}ms ease-out, width ${transitionDuration}ms ease-out`,
    minWidth: 0,
  }

  return (
    <div className="expandable-gallery-row__label-container" style={containerStyle}>
      <div
        className={`expandable-gallery-row__labels ${isExpanded ? 'expandable-gallery-row__labels--visible' : ''}`}
        style={{
          transition: `opacity ${transitionDuration * 0.75}ms ease-out`,
        }}
      >
        <div className="expandable-gallery-row__labels-left">
          <span className="expandable-gallery-row__year">{project.year}</span>
          <span className="expandable-gallery-row__role">{project.role}</span>
        </div>
        <div className="expandable-gallery-row__labels-right">
          <span className="expandable-gallery-row__title">{project.title}</span>
          <span className="expandable-gallery-row__client">Client <span className="uppercase">{project.client}</span></span>
          <span className="expandable-gallery-row__studio">Studio <span className="uppercase">{project.studio}</span></span>
        </div>
      </div>
    </div>
  )
})

const ExpandableGalleryRow = memo(function ExpandableGalleryRow({
  projects,
  height = '32rem',
  gap = '4px',
  expandedWidth = '32rem',
  transitionDuration = 400,
  cursorLabel = 'WATCH',
  modalAnimationType = 'expand',
  className,
  onClick,
}: ExpandableGalleryRowProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [lockedId, setLockedId] = useState<string | null>(null)
  // Track which item was just locked (needs to wait for transition)
  const [justLockedId, setJustLockedId] = useState<string | null>(null)

  // Track current hover state (ref doesn't cause re-renders)
  // This lets us know what's hovered when modal closes
  const hoveredIdRef = useRef<string | null>(null)

  // Compute actual expanded ID - prioritize locked (clicked) over hover
  const activeExpandedId = lockedId ?? expandedId

  const handleMouseEnter = useCallback((id: string) => {
    hoveredIdRef.current = id
    setExpandedId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    hoveredIdRef.current = null
    // Only collapse if no locked expansion
    if (!lockedId) {
      setExpandedId(null)
    }
  }, [lockedId])

  // Handle lock - first phase of click (before transition completes)
  const handleLock = useCallback((projectId: string) => {
    setLockedId(projectId)
    setJustLockedId(projectId)
  }, [])

  // Handle thumbnail click - calls onClick with payload (after transition completes)
  const handleThumbnailClick = useCallback((project: GalleryProject, rect: DOMRect) => {
    if (!project.videoUrl || !onClick) return

    // Clear justLockedId since transition completed (or wasn't needed)
    setJustLockedId(null)
    // Ensure lockedId is set (may already be set by handleLock, or set now for already-expanded case)
    setLockedId(project.id)

    onClick({
      videoUrl: project.videoUrl,
      poster: project.thumbnailSrc,
      rect,
      animationType: modalAnimationType,
      onComplete: () => {
        // Modal closed - unlock and restore hover state
        setLockedId(null)
        setExpandedId(hoveredIdRef.current)
      },
    })
  }, [onClick, modalAnimationType])

  const containerClasses = [
    'expandable-gallery-row',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {/* Thumbnails row - onMouseLeave here so labels don't keep expansion */}
      <div
        className="expandable-gallery-row__thumbnails"
        style={{ height, gap }}
        onMouseLeave={handleMouseLeave}
      >
        {projects.map((project) => (
          <Thumbnail
            key={project.id}
            project={project}
            isExpanded={activeExpandedId === project.id}
            wasJustLocked={justLockedId === project.id}
            onExpand={() => handleMouseEnter(project.id)}
            onLock={() => handleLock(project.id)}
            onClick={(rect) => handleThumbnailClick(project, rect)}
            expandedWidth={expandedWidth}
            transitionDuration={transitionDuration}
          />
        ))}
      </div>

      {/* Labels row - separate from thumbnails */}
      <div
        className="expandable-gallery-row__labels-row"
        style={{ gap }}
      >
        {projects.map((project) => (
          <ProjectLabels
            key={project.id}
            project={project}
            isExpanded={activeExpandedId === project.id}
            expandedWidth={expandedWidth}
            transitionDuration={transitionDuration}
          />
        ))}
      </div>

      {/* Cursor label overlay - uses event delegation */}
      <CursorLabel
        label={cursorLabel}
        targetSelector="[data-cursor-label-target]"
      />
    </div>
  )
})

export default ExpandableGalleryRow
export type { ExpandableGalleryRowProps, GalleryProject } from './types'
