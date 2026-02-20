'use client'

/**
 * CursorLabel overlay - shows label text near cursor when activated.
 * Content Layer (L1) - renders based on store values and action activation.
 *
 * Cursor position comes from useCursorPosition trigger (L2).
 *
 * Three activation modes (can coexist):
 * 1. Action system (overlayKey): Widget `on` events dispatch show/hide
 * 2. CSS selector (targetSelector): Event delegation for native DOM elements
 *    (e.g. <a> tags in rich text that can't use widget `on` maps)
 * 3. Direct control (active prop): For inline usage in interactive widgets
 *
 * - 10px font, uppercase, tracking-wide
 * - mix-blend-mode: difference for visibility on any background
 * - Offset: x+24, y+8 from cursor
 */

import { useEffect, useCallback, useState, memo, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import { useExperience } from '../../../../experience'
import { useContainer } from '../../../../interface/ContainerContext'
import { useSiteContainer } from '../../../../renderer/SiteContainerContext'
import { registerAction, unregisterAction } from '../../../actions'
import type { BaseActionPayload } from '../../../actions'
import type { CursorLabelProps } from './types'

/**
 * CursorLabel overlay component.
 * Reads cursor position from experience store (set by useCursorPosition trigger).
 * Activation is controlled by the action system via overlayKey.
 */
// Subscription for client-side mounting detection (SSR-safe)
const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

// Detect touch-only device (only on client).
// Uses pointer media query to distinguish touch-only (phone/tablet) from hybrid
// (laptop with touchscreen). The old ontouchstart/maxTouchPoints check was too
// aggressive — it hid CursorLabel on laptops with touchscreens.
const getIsTouchDevice = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(any-pointer: fine)').matches

const CursorLabel = memo(function CursorLabel({
  label = 'ENTER',
  offsetX = 24,
  offsetY = 8,
  overlayKey,
  targetSelector,
  active,
}: CursorLabelProps) {
  const [actionActive, setActionActive] = useState(false)
  const [selectorActive, setSelectorActive] = useState(false)
  const [activeLabel, setActiveLabel] = useState<string | undefined>(undefined)
  // Direct `active` prop > action system > selector delegation
  const isActive = active !== undefined ? active : (actionActive || selectorActive)

  // SSR-safe mounting detection using useSyncExternalStore
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)

  // Touch device detection (stable after mount)
  const isTouchDevice = mounted && getIsTouchDevice()

  // Get container context for portal target
  const { portalTarget } = useContainer()
  const { siteContainer } = useSiteContainer()

  // Read cursor position from experience store (set by useCursorPosition trigger)
  // Single subscription with shallow comparison to avoid double re-renders
  const { store } = useExperience()
  const { cursorX, cursorY } = useStore(
    store,
    useShallow((state) => ({ cursorX: state.cursorX, cursorY: state.cursorY }))
  )

  // Resolve portal target: contained mode uses containerRef, fullpage uses siteContainer
  // Never use document.body - breaks iframe support
  const resolvedPortalTarget = portalTarget || siteContainer

  // Register action handlers for show/hide
  useEffect(() => {
    if (!mounted || isTouchDevice || !overlayKey) return

    const showId = `${overlayKey}.show`
    const hideId = `${overlayKey}.hide`

    const handleShow = (payload: BaseActionPayload) => {
      const payloadLabel = (payload as Record<string, unknown>).label as string | undefined
      if (payloadLabel) setActiveLabel(payloadLabel)
      setActionActive(true)
    }

    const handleHide = (_payload: BaseActionPayload) => {
      setActionActive(false)
      // Don't clear activeLabel — prevents flash during hide transition
    }

    registerAction(showId, handleShow)
    registerAction(hideId, handleHide)

    return () => {
      unregisterAction(showId)
      unregisterAction(hideId)
    }
  }, [mounted, isTouchDevice, overlayKey])

  // CSS selector delegation for native DOM elements (e.g. <a> tags in rich text)
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (targetSelector && target.closest(targetSelector)) {
      setSelectorActive(true)
    }
  }, [targetSelector])

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (targetSelector && target.closest(targetSelector)) {
      setSelectorActive(false)
    }
  }, [targetSelector])

  useEffect(() => {
    if (!mounted || isTouchDevice || !targetSelector || !resolvedPortalTarget) return

    // Delegate from the site container (not document — iframe-safe)
    const root = resolvedPortalTarget
    root.addEventListener('mouseover', handleMouseOver as EventListener)
    root.addEventListener('mouseout', handleMouseOut as EventListener)

    return () => {
      root.removeEventListener('mouseover', handleMouseOver as EventListener)
      root.removeEventListener('mouseout', handleMouseOut as EventListener)
    }
  }, [mounted, isTouchDevice, targetSelector, resolvedPortalTarget, handleMouseOver, handleMouseOut])

  // Don't render on server, touch devices, or if no portal target
  if (!mounted || isTouchDevice || !resolvedPortalTarget) {
    return null
  }

  return createPortal(
    <div
      className="cursor-label"
      style={{
        transform: `translate(${cursorX + offsetX}px, ${cursorY + offsetY}px)`,
        opacity: isActive ? 1 : 0
      }}
      data-effect="label-fade"
    >
      {activeLabel || label}
    </div>,
    resolvedPortalTarget
  )
})

export default CursorLabel
