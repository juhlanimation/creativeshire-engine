'use client'

import React, { memo, forwardRef, useState, useRef, useCallback, useEffect } from 'react'
import type { VideoCompareProps } from './types'
import { useContainer } from '../../../../../../interface/ContainerContext'

const VideoCompare = memo(forwardRef<HTMLDivElement, VideoCompareProps>(function VideoCompare(
  {
    beforeSrc,
    afterSrc,
    beforeLabel,
    afterLabel,
    initialPosition = 50,
    aspectRatio = '16/9',
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const { mode, containerRef: engineContainerRef } = useContainer()
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeVideoRef = useRef<HTMLVideoElement>(null)
  const afterVideoRef = useRef<HTMLVideoElement>(null)

  // Sync video playback
  useEffect(() => {
    const before = beforeVideoRef.current
    const after = afterVideoRef.current
    if (!before || !after) return

    const syncPlay = () => { after.play().catch(() => {}) }
    const syncPause = () => { after.pause() }
    const syncTime = () => { after.currentTime = before.currentTime }

    before.addEventListener('play', syncPlay)
    before.addEventListener('pause', syncPause)
    before.addEventListener('seeked', syncTime)

    return () => {
      before.removeEventListener('play', syncPlay)
      before.removeEventListener('pause', syncPause)
      before.removeEventListener('seeked', syncTime)
    }
  }, [])

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPosition(percent)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX)
  }, [updatePosition])

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX)
    const handleTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX)
    const handleEnd = () => setIsDragging(false)

    const target = mode === 'contained' && engineContainerRef?.current
      ? engineContainerRef.current
      : document

    target.addEventListener('mousemove', handleMouseMove as EventListener)
    target.addEventListener('mouseup', handleEnd as EventListener)
    target.addEventListener('touchmove', handleTouchMove as EventListener)
    target.addEventListener('touchend', handleEnd as EventListener)

    return () => {
      target.removeEventListener('mousemove', handleMouseMove as EventListener)
      target.removeEventListener('mouseup', handleEnd as EventListener)
      target.removeEventListener('touchmove', handleTouchMove as EventListener)
      target.removeEventListener('touchend', handleEnd as EventListener)
    }
  }, [isDragging, updatePosition, mode, engineContainerRef])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setPosition(p => Math.max(0, p - 5))
    } else if (e.key === 'ArrowRight') {
      setPosition(p => Math.min(100, p + 5))
    }
  }, [])

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
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* After video (full, underneath) */}
        <video
          ref={afterVideoRef}
          className="video-compare__video video-compare__video--after"
          src={afterSrc}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Before video (clipped, on top) */}
        <video
          ref={beforeVideoRef}
          className="video-compare__video video-compare__video--before"
          src={beforeSrc}
          autoPlay
          loop
          muted
          playsInline
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />

        {/* Divider handle */}
        <div
          className="video-compare__divider"
          style={{ left: `${position}%` }}
          role="slider"
          aria-label="Video comparison divider"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="video-compare__handle" />
        </div>

        {/* Labels */}
        {beforeLabel && (
          <span className="video-compare__label video-compare__label--before">
            {beforeLabel}
          </span>
        )}
        {afterLabel && (
          <span className="video-compare__label video-compare__label--after">
            {afterLabel}
          </span>
        )}
      </div>
    </div>
  )
}))

export default VideoCompare

import { registerScopedWidget } from '../../../../../widgets/registry'
registerScopedWidget('ProjectCompare__VideoCompare', VideoCompare)
