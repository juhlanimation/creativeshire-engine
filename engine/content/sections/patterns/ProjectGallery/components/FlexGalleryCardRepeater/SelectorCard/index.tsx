'use client'

/**
 * SelectorCard — internal component of FlexGalleryCardRepeater.
 * Single thumbnail card with info overlay, playing indicator, and progress bar.
 *
 * NOT a standalone widget. Coordination props (isActive, showInfo)
 * are managed entirely by the parent FlexGalleryCardRepeater.
 */

import { memo, useState } from 'react'
import type { SelectorCardProps } from './types'

const VIDEO_EXTENSIONS = /\.(webm|mp4|ogg|mov)$/i

/** Detect if a URL points to a video file */
function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.test(src)
}

const SelectorCard = memo(function SelectorCard({
  thumbnailSrc,
  thumbnailAlt,
  title,
  year,
  studio,
  role,
  videoSrc,
  posterTime,
  progress = 0,
  isActive = false,
  showInfo: showInfoProp,
  accentColor,
  showPlayingIndicator = true,
  showPlayIcon = true,
  showOverlay = true,
  thumbnailBorderRadius,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
}: SelectorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnter?.()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onMouseLeave?.()
  }

  const classNames = [
    'selector-card',
    isActive ? 'selector-card--active' : '',
    isHovered ? 'selector-card--hovered' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classNames}
      role="option"
      aria-selected={isActive}
      data-accent={accentColor}
      data-radius={thumbnailBorderRadius}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div className="selector-card__thumbnail">
        {thumbnailSrc ? (
          isVideoSrc(thumbnailSrc) ? (
            <video
              src={thumbnailSrc}
              muted
              playsInline
              preload="auto"
              className="selector-card__media"
              aria-label={thumbnailAlt ?? title}
              onLoadedData={(e) => {
                const v = e.currentTarget
                const t = posterTime ?? 0.001
                if (v.currentTime === 0) v.currentTime = t
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailSrc}
              alt={thumbnailAlt ?? title ?? ''}
              className="selector-card__media"
            />
          )
        ) : (
          /* Loading spinner when no thumbnail yet */
          <div className="selector-card__loading">
            <div className="selector-card__spinner" data-effect="spin" />
          </div>
        )}

        {/* Dark overlay on active/hover */}
        {showOverlay && (isActive || isHovered) && (
          <div className={`selector-card__overlay ${isActive ? 'selector-card__overlay--active' : ''}`} />
        )}

        {/* Info overlay — centered inside the card */}
        {showInfoProp && (
          <div
            className="selector-card__info"
            style={{ opacity: showInfoProp ? 1 : 0 }}
          >
            {role && (
              <span className="selector-card__role">{role}</span>
            )}
            {title && (
              <span className="selector-card__title">{title}</span>
            )}
            {(year || studio) && (
              <div className="selector-card__meta">
                {year && <span>{year}</span>}
                {year && studio && <span className="selector-card__meta-sep" />}
                {studio && <span>{studio}</span>}
              </div>
            )}
          </div>
        )}

        {/* Playing indicator — top-left corner of active card */}
        {showPlayingIndicator && isActive && (
          <div className="selector-card__playing">
            <span className="selector-card__playing-dot" data-effect="pulse" />
            <span className="selector-card__playing-label">Playing</span>
          </div>
        )}

        {/* Play icon — top-left corner on hover (inactive only) */}
        {showPlayIcon && isHovered && !isActive && (
          <div className="selector-card__play-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Progress bar — bottom edge, width driven by progress prop */}
        {isActive && (
          <div
            className="selector-card__progress"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        )}
      </div>
    </div>
  )
})

export default SelectorCard
export type { SelectorCardProps, SelectorCardClickPayload } from './types'
