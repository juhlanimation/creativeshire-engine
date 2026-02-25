'use client'

import React, { memo, forwardRef, useMemo, useRef, useEffect, useCallback, useState } from 'react'
import type { FlexButtonRepeaterProps } from './types'
import type { IndexNavItem } from './IndexNav/types'
import type { WidgetSchema } from '../../../../../../schema'
import IndexNav from './IndexNav'

/** Animation frame rate for frame counter display */
const FPS = 24

/**
 * Extract IndexNavItem[] from widget children.
 * Children should be Button widgets with label, value, or data-frame props.
 */
function extractItemsFromWidgets(widgets: WidgetSchema[]): IndexNavItem[] {
  return widgets.map((widget) => {
    const props = widget.props ?? {}
    const label = (props.label ?? props['data-frame'] ?? props.frame ?? '') as string
    const value = props.value ?? props['data-frame'] ?? props.frame
    const videoSrc = props['data-video-src'] as string | undefined
    return {
      label: String(label),
      ...(value != null ? { value: value as string | number } : {}),
      ...(videoSrc ? { videoSrc } : {}),
    }
  })
}

const FlexButtonRepeater = memo(forwardRef<HTMLDivElement, FlexButtonRepeaterProps>(function FlexButtonRepeater(
  {
    widgets,
    activeIndex: activeIndexProp,
    onSelect,
    prefix,
    direction,
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const items = useMemo(() => {
    if (widgets && widgets.length > 0) {
      return extractItemsFromWidgets(widgets)
    }
    return []
  }, [widgets])

  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoElRef = useRef<HTMLVideoElement | null>(null)
  const frameCounterRef = useRef<HTMLSpanElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(activeIndexProp ?? 0)
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex

  // Find sibling <video>, disable loop, create frame counter in video container
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const videoContainer = el.closest('.project-showcase__video-container')
    if (!videoContainer) return
    const video = videoContainer.querySelector('video')
    if (video) {
      videoElRef.current = video
      video.loop = false // Disable loop so 'ended' fires for auto-advance
    }

    // Create frame counter element in the video container (bottom-right)
    const counter = document.createElement('span')
    counter.className = 'shot-indicator__frame-counter'
    counter.textContent = '0f / 0f'
    videoContainer.appendChild(counter)
    frameCounterRef.current = counter

    return () => { counter.remove() }
  }, [])

  // Frame counter — direct DOM updates via RAF (no React re-renders)
  useEffect(() => {
    let rafId: number
    const update = () => {
      const video = videoElRef.current
      const el = frameCounterRef.current
      if (video && el && video.duration > 0) {
        const currentFrame = Math.floor(video.currentTime * FPS)
        const totalFrames = Math.floor(video.duration * FPS)
        el.textContent = `${currentFrame}f / ${totalFrames}f`
      }
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Switch video source + update active state on shot click
  const handleSelect = useCallback((index: number, item: IndexNavItem) => {
    setActiveIndex(index)
    if (item.videoSrc && videoElRef.current) {
      const video = videoElRef.current
      video.src = item.videoSrc
      video.load()
      video.play().catch(() => { /* autoplay may be blocked */ })
    }
    onSelect?.(index, item)
  }, [onSelect])

  // Auto-advance to next shot when video ends
  useEffect(() => {
    const video = videoElRef.current
    if (!video || items.length === 0) return

    const handleEnded = () => {
      const nextIndex = (activeIndexRef.current + 1) % items.length
      handleSelect(nextIndex, items[nextIndex])
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [items, handleSelect])

  return (
    <IndexNav
      ref={(node) => {
        wrapperRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }}
      items={items}
      activeIndex={activeIndex}
      onSelect={handleSelect}
      prefix={prefix}
      direction={direction}
      className={className}
      style={style}
      data-behaviour={dataBehaviour}
    />
  )
}))

export default FlexButtonRepeater

import { registerScopedWidget } from '../../../../../widgets/registry'
registerScopedWidget('ProjectShowcase__FlexButtonRepeater', FlexButtonRepeater)
