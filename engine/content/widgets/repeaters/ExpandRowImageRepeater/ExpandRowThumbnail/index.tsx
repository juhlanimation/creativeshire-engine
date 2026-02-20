'use client'

/**
 * ExpandRowThumbnail — internal component of ExpandRowImageRepeater.
 * Single expandable thumbnail with media (poster + video) and project labels.
 *
 * NOT a standalone widget. Coordination props (isExpanded, onExpand, onLock)
 * are managed entirely by the parent ExpandRowImageRepeater.
 */

import { useRef, useEffect, useCallback, memo, type CSSProperties } from 'react'
import type { ExpandRowThumbnailProps } from './types'

const ExpandRowThumbnail = memo(function ExpandRowThumbnail({
  thumbnailSrc,
  thumbnailAlt = '',
  videoSrc,
  videoUrl,
  title = '',
  client = '',
  studio = '',
  year = '',
  role = '',
  isExpanded = false,
  wasJustLocked = false,
  expandedWidth = '32rem',
  transitionDuration = 400,
  onExpand,
  onLock,
  onClick,
  className,
}: ExpandRowThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Control video playback based on expanded state
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    if (isExpanded) {
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isExpanded, videoSrc])

  // Wait for flex transition to complete before capturing rect
  useEffect(() => {
    const container = containerRef.current
    if (!container || !wasJustLocked) return

    let captured = false
    const captureAndProceed = () => {
      if (captured) return
      captured = true
      const rect = (mediaRef.current ?? container).getBoundingClientRect()
      onClick?.({ videoUrl: videoUrl!, poster: thumbnailSrc, rect })
    }

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== container) return
      if (e.propertyName !== 'flex' && e.propertyName !== 'width') return
      captureAndProceed()
    }

    container.addEventListener('transitionend', handleTransitionEnd)
    const timeoutId = setTimeout(captureAndProceed, transitionDuration + 50)

    return () => {
      container.removeEventListener('transitionend', handleTransitionEnd)
      clearTimeout(timeoutId)
    }
  }, [wasJustLocked, onClick, transitionDuration, videoUrl, thumbnailSrc])

  const style: CSSProperties = {
    '--expanded-width': expandedWidth,
    flex: isExpanded ? `0 0 ${expandedWidth}` : 1,
    width: isExpanded ? expandedWidth : undefined,
    transition: `flex ${transitionDuration}ms ease-out, width ${transitionDuration}ms ease-out`,
    minWidth: 0,
    cursor: videoUrl ? 'pointer' : undefined,
  } as CSSProperties

  const handleClick = useCallback(() => {
    if (!videoUrl || !containerRef.current) return
    const container = containerRef.current

    // Check if already at target size (no transition in progress)
    const currentWidth = container.getBoundingClientRect().width
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const targetWidthPx = parseFloat(expandedWidth) * rootFontSize

    if (isExpanded && Math.abs(currentWidth - targetWidthPx) < 2) {
      const rect = (mediaRef.current ?? container).getBoundingClientRect()
      onClick?.({ videoUrl, poster: thumbnailSrc, rect })
      return
    }

    onLock?.()
  }, [videoUrl, onClick, onLock, isExpanded, expandedWidth, thumbnailSrc])

  const classes = ['expand-row-thumbnail', className].filter(Boolean).join(' ')

  return (
    <div
      ref={containerRef}
      className={classes}
      style={style}
      onMouseEnter={onExpand}
      onClick={handleClick}
      data-cursor-label-target={videoUrl ? true : undefined}
    >
      {/* Media: poster + video */}
      <div ref={mediaRef} className="expand-row-thumbnail__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          className={`expand-row-thumbnail__poster ${isExpanded && videoSrc ? 'expand-row-thumbnail__poster--hidden' : ''}`}
        />
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            preload="metadata"
            className={`expand-row-thumbnail__video ${isExpanded ? 'expand-row-thumbnail__video--visible' : ''}`}
          />
        )}
      </div>

      {/* Labels */}
      <div
        className={`expand-row-thumbnail__labels ${isExpanded ? 'expand-row-thumbnail__labels--visible' : ''}`}
        style={{ transition: `opacity ${transitionDuration * 0.75}ms ease-out` }}
      >
        <div className="expand-row-thumbnail__labels-left">
          <span className="expand-row-thumbnail__year">{year}</span>
          <span className="expand-row-thumbnail__role">{role}</span>
        </div>
        <div className="expand-row-thumbnail__labels-right">
          <span className="expand-row-thumbnail__title">{title}</span>
          <span className="expand-row-thumbnail__client">Client <span className="uppercase">{client}</span></span>
          <span className="expand-row-thumbnail__studio">Studio <span className="uppercase">{studio}</span></span>
        </div>
      </div>
    </div>
  )
})

export default ExpandRowThumbnail
export type { ExpandRowThumbnailProps, ExpandRowItem, ExpandRowClickPayload } from './types'
