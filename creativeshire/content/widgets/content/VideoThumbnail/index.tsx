'use client'

/**
 * VideoThumbnail widget - clickable video preview with WATCH overlay.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import type { VideoThumbnailProps } from './types'
import './styles.css'

/**
 * VideoThumbnail component renders a video preview image with overlay.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const VideoThumbnail = memo(forwardRef<HTMLButtonElement, VideoThumbnailProps>(function VideoThumbnail(
  {
    src,
    alt,
    aspectRatio = '16/9',
    showWatchButton = true,
    watchLabel = 'WATCH',
    onClick,
    className,
    'data-behaviour': dataBehaviour
  },
  ref
) {
  const classNames = ['video-thumbnail-widget', className].filter(Boolean).join(' ')

  const style: CSSProperties = {
    aspectRatio
  }

  return (
    <button
      ref={ref}
      type="button"
      className={classNames}
      style={style}
      onClick={onClick}
      data-behaviour={dataBehaviour}
      aria-label={`Watch ${alt} video`}
    >
      <img
        className="video-thumbnail-widget__image"
        src={src}
        alt={alt}
      />
      {showWatchButton ? (
        <div className="video-thumbnail-widget__overlay">
          <span className="video-thumbnail-widget__label">{watchLabel}</span>
        </div>
      ) : null}
    </button>
  )
}))

export default VideoThumbnail
