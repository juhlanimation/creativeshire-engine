'use client'

/**
 * GalleryThumbnail composite widget.
 * Expandable thumbnail with video playback and metadata labels.
 *
 * Architecture:
 * - Receives isExpanded state from parent (ExpandableGalleryRow)
 * - Sets CSS variables for flex-expand effect
 * - Video plays when expanded
 * - Metadata labels fade in when expanded
 * - Click calls onClick with payload (for modal via action registry)
 */

import { useRef, useEffect, useCallback, memo, type CSSProperties } from 'react'
import { usePlaybackPosition } from '@/creativeshire/content/widgets/interactive/VideoPlayer/hooks'
import type { GalleryThumbnailProps } from './types'
import './styles.css'

const GalleryThumbnail = memo(function GalleryThumbnail({
  project,
  isExpanded = false,
  onExpand,
  onCollapse,
  expandedWidth = '32rem',
  transitionDuration = 400,
  className,
  onClick,
}: GalleryThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Playback position persistence
  const { getPosition } = usePlaybackPosition()

  // Control video playback based on expanded state
  useEffect(() => {
    const video = videoRef.current
    if (!video || !project.videoSrc) return

    if (isExpanded) {
      video.play().catch(() => {
        // Autoplay may be blocked - silent fail
      })
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isExpanded, project.videoSrc])

  // Handle click - calls onClick with payload if videoUrl and handler exist
  const handleClick = useCallback(() => {
    if (!project.videoUrl || !onClick || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const startTime = getPosition(project.videoUrl)

    onClick({
      videoUrl: project.videoUrl,
      poster: project.thumbnailSrc,
      rect,
      startTime: startTime > 0 ? startTime : undefined,
    })
  }, [project, onClick, getPosition])

  // Inline styles for flex (can't use CSS variable for shorthand)
  // CSS variables only for label opacity
  const style: CSSProperties = {
    flex: isExpanded ? `0 0 ${expandedWidth}` : 1,
    width: isExpanded ? expandedWidth : undefined,
    transition: `flex ${transitionDuration}ms ease-out, width ${transitionDuration}ms ease-out`,
    '--label-opacity': isExpanded ? 1 : 0,
    '--expand-duration': `${transitionDuration}ms`,
    cursor: project.videoUrl && onClick ? 'pointer' : undefined,
  } as CSSProperties

  const containerClasses = [
    'gallery-thumbnail',
    isExpanded && 'gallery-thumbnail--expanded',
    project.videoUrl && onClick && 'gallery-thumbnail--clickable',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={style}
      data-effect="flex-expand"
      data-expanded={isExpanded || undefined}
      onMouseEnter={onExpand}
      onClick={handleClick}
    >
      {/* Media container - thumbnail/video */}
      <div className="gallery-thumbnail__media">
        {/* Poster image - always present */}
        <img
          src={project.thumbnailSrc}
          alt={project.thumbnailAlt}
          className={`gallery-thumbnail__poster ${isExpanded && project.videoSrc ? 'gallery-thumbnail__poster--hidden' : ''}`}
          data-effect="media-crossfade"
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
            className={`gallery-thumbnail__video ${isExpanded ? 'gallery-thumbnail__video--visible' : ''}`}
            data-effect="media-crossfade"
          />
        )}
      </div>

      {/* Metadata labels - visible when expanded */}
      <div className="gallery-thumbnail__labels" data-expand="label">
        <div className="gallery-thumbnail__labels-left">
          <span className="gallery-thumbnail__year">{project.year}</span>
          <span className="gallery-thumbnail__role">{project.role}</span>
        </div>
        <div className="gallery-thumbnail__labels-right">
          <span className="gallery-thumbnail__title">{project.title}</span>
          <span className="gallery-thumbnail__client">Client {project.client}</span>
          <span className="gallery-thumbnail__studio">Studio {project.studio}</span>
        </div>
      </div>
    </div>
  )
})

export default GalleryThumbnail
export type { GalleryThumbnailProps, GalleryProject } from './types'
