'use client'

import React, { memo, forwardRef, useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import type { VideoCompareProps } from './types'

const VideoCompare = memo(forwardRef<HTMLDivElement, VideoCompareProps>(function VideoCompare(
  {
    beforeSrc,
    afterSrc,
    beforeLabel,
    afterLabel,
    initialPosition = 0,
    aspectRatio = '16/9',
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeVideoRef = useRef<HTMLVideoElement>(null)
  const afterVideoRef = useRef<HTMLVideoElement>(null)
  const positionRef = useRef(initialPosition)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const isHoveringRef = useRef(false)
  const dividerRef = useRef<HTMLDivElement>(null)
  const clipWrapperRef = useRef<HTMLDivElement>(null)
  const labelClipRef = useRef<HTMLDivElement>(null)

  // Apply position to DOM (no React re-render needed for 60fps)
  // The clip wrapper has inset: -0.75% (101.5% of container width).
  // clip-path percentages are relative to the wrapper, not the container,
  // so we convert container-relative pos to wrapper-relative clipPos.
  const applyPosition = useCallback((pos: number) => {
    positionRef.current = pos
    if (dividerRef.current) {
      dividerRef.current.style.left = `${pos}%`
      dividerRef.current.style.opacity = pos > 1 ? '1' : '0'
    }
    // Corrected percentage for the oversized clip wrapper
    const clipPos = (pos + 0.75) / 1.015
    if (clipWrapperRef.current) {
      clipWrapperRef.current.style.clipPath = `inset(0 0 0 ${clipPos}%)`
    }
    // Label clip uses inset: 0 — pos% is correct directly
    if (labelClipRef.current) {
      labelClipRef.current.style.clipPath = `inset(0 0 0 ${pos}%)`
    }
  }, [])

  // Sync videos via timeupdate + drift check
  useEffect(() => {
    const before = beforeVideoRef.current
    const after = afterVideoRef.current
    if (!before || !after) return

    const syncVideos = () => {
      if (Math.abs(before.currentTime - after.currentTime) > 0.1) {
        after.currentTime = before.currentTime
      }
    }

    before.addEventListener('timeupdate', syncVideos)
    return () => before.removeEventListener('timeupdate', syncVideos)
  }, [])

  // Set initial position on mount
  useEffect(() => {
    applyPosition(initialPosition)
  }, [initialPosition, applyPosition])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100

    // Cancel any snap-back animation
    if (animationRef.current) {
      animationRef.current.kill()
      animationRef.current = null
    }

    applyPosition(percentage)
    isHoveringRef.current = true
  }, [applyPosition])

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true
    if (animationRef.current) {
      animationRef.current.kill()
      animationRef.current = null
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false

    // Animate back to 0% (fully showing "before" video)
    animationRef.current = gsap.to(
      { value: positionRef.current },
      {
        value: 0,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: function () {
          if (!isHoveringRef.current) {
            applyPosition(this.targets()[0].value)
          }
        },
        onComplete: () => {
          animationRef.current = null
        },
      }
    )
  }, [applyPosition])

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      applyPosition(Math.max(0, positionRef.current - 5))
    } else if (e.key === 'ArrowRight') {
      applyPosition(Math.min(100, positionRef.current + 5))
    }
  }, [applyPosition])

  const classNames = ['video-compare', className].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
      style={{ aspectRatio }}
    >
      <div
        ref={containerRef}
        className="video-compare__container"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* After video (base layer — revealed as top layer clips away) */}
        <video
          ref={afterVideoRef}
          className="video-compare__video video-compare__video--after"
          src={afterSrc}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* After label: sits in base layer, only visible when top clips away */}
        {afterLabel && (
          <span className="video-compare__label video-compare__label--after">
            {afterLabel}
          </span>
        )}

        {/* Before video (clipped from left, on top) — anti-flicker wrapper */}
        <div
          ref={clipWrapperRef}
          className="video-compare__clip-wrapper"
          style={{ clipPath: `inset(0 0 0 ${(initialPosition + 0.75) / 1.015}%)` }}
        >
          <video
            ref={beforeVideoRef}
            className="video-compare__video video-compare__video--before"
            src={beforeSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* Before label: own clip layer (inset: 0, not oversized) so padding matches after label */}
        {beforeLabel && (
          <div
            ref={labelClipRef}
            className="video-compare__label-clip"
            style={{ clipPath: `inset(0 0 0 ${initialPosition}%)` }}
          >
            <span className="video-compare__label video-compare__label--before">
              {beforeLabel}
            </span>
          </div>
        )}

        {/* Divider line */}
        <div
          ref={dividerRef}
          className="video-compare__divider"
          style={{
            left: `${initialPosition}%`,
            opacity: initialPosition > 1 ? 1 : 0,
          }}
          role="slider"
          aria-label="Video comparison divider"
          aria-valuenow={Math.round(initialPosition)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}))

export default VideoCompare

import { registerScopedWidget } from '../../../../../widgets/registry'
registerScopedWidget('ProjectCompare__VideoCompare', VideoCompare)
