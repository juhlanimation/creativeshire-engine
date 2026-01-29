'use client'

/**
 * CursorLabel overlay - shows "ENTER" text near cursor when hovering links.
 * Content Layer (L1) but uses client-side events for interactivity.
 *
 * Reference: bojuhl.com cursor-label.tsx
 * - 10px font, uppercase, tracking-wide
 * - mix-blend-mode: difference for visibility on any background
 * - Offset: x+24, y+8 from cursor
 */

import { useEffect, useState, useCallback, memo } from 'react'
import { createPortal } from 'react-dom'
import './styles.css'

interface CursorLabelProps {
  /** Label text to display (default: "ENTER") */
  label?: string
  /** Selector for target links (default: ".text-widget a") */
  targetSelector?: string
  /** X offset from cursor (default: 24) */
  offsetX?: number
  /** Y offset from cursor (default: 8) */
  offsetY?: number
}

/**
 * CursorLabel overlay component.
 * Uses event delegation to detect hover on links matching targetSelector.
 */
const CursorLabel = memo(function CursorLabel({
  label = 'ENTER',
  targetSelector = '.text-widget a',
  offsetX = 24,
  offsetY = 8
}: CursorLabelProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check for touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Track mouse position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

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

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [mounted, isTouchDevice, handleMouseMove, handleMouseOver, handleMouseOut])

  // Don't render on server or touch devices
  if (!mounted || isTouchDevice) {
    return null
  }

  return createPortal(
    <div
      className="cursor-label"
      style={{
        transform: `translate(${mousePos.x + offsetX}px, ${mousePos.y + offsetY}px)`,
        opacity: isVisible ? 1 : 0
      }}
      data-effect="cursor-label"
    >
      {label}
    </div>,
    document.body
  )
})

export default CursorLabel
