'use client'

/**
 * CursorLabel overlay - shows "ENTER" text near cursor when hovering links.
 * Content Layer (L1) - renders based on store values.
 *
 * Cursor position comes from useCursorPosition trigger (L2).
 * Hover detection uses event delegation for link matching.
 *
 * Reference: bojuhl.com cursor-label.tsx
 * - 10px font, uppercase, tracking-wide
 * - mix-blend-mode: difference for visibility on any background
 * - Offset: x+24, y+8 from cursor
 */

import { useEffect, useState, useCallback, memo, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { useExperience } from '../../../../experience'
import { useContainer } from '../../../../interface/ContainerContext'
import { useSiteContainer } from '../../../../renderer/SiteContainerContext'
import type { CursorLabelProps } from './types'
import './styles.css'

/**
 * CursorLabel overlay component.
 * Reads cursor position from experience store (set by useCursorPosition trigger).
 * Uses event delegation to detect hover on links matching targetSelector.
 */
// Subscription for client-side mounting detection (SSR-safe)
const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

// Detect touch device (only on client)
const getIsTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

const CursorLabel = memo(function CursorLabel({
  label = 'ENTER',
  targetSelector = '.text-widget a',
  offsetX = 24,
  offsetY = 8
}: CursorLabelProps) {
  const [isVisible, setIsVisible] = useState(false)

  // SSR-safe mounting detection using useSyncExternalStore
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)

  // Touch device detection (stable after mount)
  const isTouchDevice = mounted && getIsTouchDevice()

  // Get container context for portal target and event scoping
  const { mode, containerRef, portalTarget } = useContainer()
  const { siteContainer } = useSiteContainer()

  // Read cursor position from experience store (set by useCursorPosition trigger)
  // Single subscription with shallow comparison to avoid double re-renders
  const { store } = useExperience()
  const { cursorX, cursorY } = useStore(
    store,
    useShallow((state) => ({ cursorX: state.cursorX, cursorY: state.cursorY }))
  )

  // Handle hover state via event delegation
  // Use closest() to match target OR any ancestor (for nested elements like img inside container)
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest(targetSelector)) {
      setIsVisible(true)
    }
  }, [targetSelector])

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const relatedTarget = e.relatedTarget as HTMLElement | null
    // Only hide if we're leaving the target entirely (not moving to a child)
    if (target.closest(targetSelector) && !relatedTarget?.closest(targetSelector)) {
      setIsVisible(false)
    }
  }, [targetSelector])

  useEffect(() => {
    if (!mounted || isTouchDevice) return

    // Hover detection via event delegation
    // Note: mousemove is handled by useCursorPosition trigger in L2
    // In contained mode, scope to container element
    const eventTarget = mode === 'contained' && containerRef?.current
      ? containerRef.current
      : document

    eventTarget.addEventListener('mouseover', handleMouseOver as EventListener)
    eventTarget.addEventListener('mouseout', handleMouseOut as EventListener)

    return () => {
      eventTarget.removeEventListener('mouseover', handleMouseOver as EventListener)
      eventTarget.removeEventListener('mouseout', handleMouseOut as EventListener)
    }
  }, [mounted, isTouchDevice, handleMouseOver, handleMouseOut, mode, containerRef])

  // Resolve portal target: contained mode uses containerRef, fullpage uses siteContainer
  // Never use document.body - breaks iframe support
  const resolvedPortalTarget = portalTarget || siteContainer

  // Don't render on server, touch devices, or if no portal target
  if (!mounted || isTouchDevice || !resolvedPortalTarget) {
    return null
  }

  return createPortal(
    <div
      className="cursor-label"
      style={{
        transform: `translate(${cursorX + offsetX}px, ${cursorY + offsetY}px)`,
        opacity: isVisible ? 1 : 0
      }}
      data-effect="label-fade"
    >
      {label}
    </div>,
    resolvedPortalTarget
  )
})

export default CursorLabel
