'use client'

/**
 * ProjectScroll__ScrollCard — scoped widget for ProjectScroll section.
 *
 * Project card: cover image with optional video hover overlay,
 * always-visible description, and title-client footer row with divider.
 */

import React, { memo, forwardRef, useState, useRef, useEffect } from 'react'
import { registerScopedWidget } from '../../../../../widgets/registry'
import type { ScrollCardProps } from './types'
import './styles.css'

const ScrollCard = memo(forwardRef<HTMLDivElement, ScrollCardProps>(function ScrollCard(
  {
    title,
    client,
    description,
    imageSrc,
    videoSrc,
    cardBorder = true,
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return
    if (isHovered) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovered])

  return (
    <div
      ref={ref}
      className={[
        'scroll-card',
        cardBorder && 'scroll-card--bordered',
        isHovered && 'scroll-card--hovered',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      data-behaviour={dataBehaviour}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <div className="scroll-card__media">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={title || ''}
            className="scroll-card__image"
            loading="lazy"
          />
        )}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            className="scroll-card__video"
            muted
            loop
            playsInline
            preload="none"
          />
        )}
      </div>

      {/* Description — always visible */}
      {description && (
        <div className="scroll-card__description">
          <p className="scroll-card__description-text">{description}</p>
        </div>
      )}

      {/* Footer: title — divider — client (both caption scale, muted) */}
      <div className="scroll-card__footer">
        <span className="scroll-card__title">{title}</span>
        <span className="scroll-card__divider" />
        <span className="scroll-card__client">{client}</span>
      </div>
    </div>
  )
}))

registerScopedWidget('ProjectScroll__ScrollCard', ScrollCard)
export default ScrollCard
