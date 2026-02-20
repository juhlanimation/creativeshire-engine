'use client'

/**
 * ExpandRowImageRepeater - horizontal row of expandable thumbnails.
 * Manages coordinated expansion state and renders ExpandRowThumbnail items.
 *
 * Supports two patterns:
 * 1. Children via __repeat (preferred): Receives widgets array, visible in hierarchy
 * 2. Legacy projects prop: Receives items array directly (hidden in hierarchy)
 *
 * Click handler is received from WidgetRenderer (via schema.on) and passed to items.
 */

import React, { useState, useCallback, useRef, memo, forwardRef } from 'react'
import ExpandRowThumbnail from './ExpandRowThumbnail'
import CursorLabel from '../../../chrome/overlays/CursorLabel'
import type { WidgetSchema } from '../../../../schema'
import type { ExpandRowImageRepeaterProps } from './types'
import type { ExpandRowItem, ExpandRowClickPayload } from './ExpandRowThumbnail/types'

/**
 * Extract ExpandRowItem data from a widget schema's props.
 * Used when receiving children via __repeat pattern.
 */
function extractItemFromWidget(widget: WidgetSchema, index: number): ExpandRowItem {
  const props = widget.props || {}
  return {
    id: widget.id || `project-${index}`,
    thumbnailSrc: String(props.thumbnailSrc || props.poster || props.src || ''),
    thumbnailAlt: String(props.thumbnailAlt || props.alt || ''),
    videoSrc: props.videoSrc ? String(props.videoSrc) : undefined,
    videoUrl: props.videoUrl ? String(props.videoUrl) : undefined,
    title: String(props.title || ''),
    client: String(props.client || ''),
    studio: String(props.studio || ''),
    year: String(props.year || ''),
    role: String(props.role || ''),
  }
}

const ExpandRowImageRepeater = memo(forwardRef<HTMLElement, ExpandRowImageRepeaterProps>(function ExpandRowImageRepeater({
  projects,
  widgets,
  height = '32rem',
  gap = '4px',
  expandedWidth = '32rem',
  transitionDuration = 400,
  cursorLabel = 'WATCH',
  modalAnimationType = 'expand',
  className,
  style,
  onClick,
}, ref) {
  // ALL HOOKS FIRST (before any early returns)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [lockedId, setLockedId] = useState<string | null>(null)
  const [justLockedId, setJustLockedId] = useState<string | null>(null)
  const hoveredIdRef = useRef<string | null>(null)

  const handleMouseEnter = useCallback((id: string) => {
    hoveredIdRef.current = id
    setExpandedId(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    hoveredIdRef.current = null
    if (!lockedId) setExpandedId(null)
  }, [lockedId])

  const handleLock = useCallback((itemId: string) => {
    setLockedId(itemId)
    setJustLockedId(itemId)
  }, [])

  const handleItemClick = useCallback((item: ExpandRowItem, payload: ExpandRowClickPayload) => {
    if (!item.videoUrl || !onClick) return
    setJustLockedId(null)
    setLockedId(item.id)

    onClick({
      ...payload,
      animationType: modalAnimationType,
      onComplete: () => {
        setLockedId(null)
        setExpandedId(hoveredIdRef.current)
      },
    })
  }, [onClick, modalAnimationType])

  // END OF HOOKS — safe to do early returns

  // Prefer widgets (children via __repeat) over projects prop
  const resolvedItems: ExpandRowItem[] = (() => {
    if (widgets && widgets.length > 0) {
      return widgets.map((widget, index) => extractItemFromWidget(widget, index))
    }
    if (typeof projects === 'string') return []
    if (Array.isArray(projects)) return projects
    return []
  })()

  if (resolvedItems.length === 0) return null

  const activeExpandedId = lockedId ?? expandedId
  const containerClasses = ['expand-row-image-repeater', className].filter(Boolean).join(' ')

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={containerClasses}
      style={{ ...style, height, gap }}
      onMouseLeave={handleMouseLeave}
    >
      {resolvedItems.map((item) => (
        <ExpandRowThumbnail
          key={item.id}
          thumbnailSrc={item.thumbnailSrc}
          thumbnailAlt={item.thumbnailAlt}
          videoSrc={item.videoSrc}
          videoUrl={item.videoUrl}
          title={item.title}
          client={item.client}
          studio={item.studio}
          year={item.year}
          role={item.role}
          isExpanded={activeExpandedId === item.id}
          wasJustLocked={justLockedId === item.id}
          expandedWidth={expandedWidth}
          transitionDuration={transitionDuration}
          onExpand={() => handleMouseEnter(item.id)}
          onLock={() => handleLock(item.id)}
          onClick={(payload) => handleItemClick(item, payload)}
        />
      ))}
      {/* Cursor label overlay - uses event delegation */}
      <CursorLabel label={cursorLabel} targetSelector="[data-cursor-label-target]" />
    </div>
  )
}))

export default ExpandRowImageRepeater
export type { ExpandRowImageRepeaterProps, ExpandRowItem, ExpandRowClickPayload } from './types'
