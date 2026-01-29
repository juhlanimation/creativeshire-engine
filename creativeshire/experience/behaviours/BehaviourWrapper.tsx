'use client'

/**
 * BehaviourWrapper - applies behaviour CSS variables to children.
 *
 * Architecture:
 * 1. Resolves behaviour from registry by ID
 * 2. Tracks local interaction state (hover, press)
 * 3. Calls behaviour.compute(state, options) to get CSS variables
 * 4. Applies variables via inline style
 *
 * This enables reusable behaviours across any widget.
 * The widget stays pure (L1), BehaviourWrapper handles experience (L2).
 */

import { useRef, useState, useCallback, useMemo, type ReactNode, type CSSProperties } from 'react'
import { resolveBehaviour } from './resolve'
import type { BehaviourState, CSSVariables } from '../../schema/experience'

/**
 * Props for BehaviourWrapper component.
 */
export interface BehaviourWrapperProps {
  /** Behaviour ID to apply (null or 'none' for no behaviour) */
  behaviourId?: string | null
  /** Behaviour options to pass to compute function */
  options?: Record<string, unknown>
  /** Initial state values (e.g., from global store) */
  initialState?: Partial<BehaviourState>
  /** Child elements to wrap */
  children: ReactNode
  /** Additional className for the wrapper */
  className?: string
  /** Additional inline styles */
  style?: CSSProperties
}

/**
 * Default state values for behaviours.
 */
const DEFAULT_STATE: BehaviourState = {
  scrollProgress: 0,
  scrollVelocity: 0,
  sectionProgress: 0,
  sectionVisibility: 1,
  sectionIndex: 0,
  totalSections: 1,
  isActive: true,
  isHovered: false,
  isPressed: false,
  prefersReducedMotion: false,
}

/**
 * BehaviourWrapper component.
 * Wraps children and applies behaviour-computed CSS variables.
 *
 * @param behaviourId - ID of behaviour to apply
 * @param options - Options to pass to behaviour compute
 * @param initialState - Initial state values
 * @param children - Elements to wrap
 */
export function BehaviourWrapper({
  behaviourId,
  options,
  initialState,
  children,
  className,
  style,
}: BehaviourWrapperProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  // Local interaction state
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Check reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Resolve behaviour from registry
  const behaviour = useMemo(() => {
    if (!behaviourId || behaviourId === 'none') return null
    return resolveBehaviour(behaviourId)
  }, [behaviourId])

  // Event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setIsPressed(false)
  }, [])
  const handleMouseDown = useCallback(() => setIsPressed(true), [])
  const handleMouseUp = useCallback(() => setIsPressed(false), [])

  // Compute CSS variables from state
  const computedStyle = useMemo((): CSSProperties => {
    if (!behaviour) return style || {}

    // Build state object
    const state: BehaviourState = {
      ...DEFAULT_STATE,
      ...initialState,
      isHovered,
      isPressed,
      prefersReducedMotion,
    }

    // Compute CSS variables
    const cssVars = behaviour.compute(state, options) as CSSVariables

    // Convert to CSSProperties
    const varsStyle: CSSProperties = {}
    Object.entries(cssVars).forEach(([key, value]) => {
      // @ts-expect-error - CSS variables are valid but not in CSSProperties type
      varsStyle[key] = value
    })

    return { ...style, ...varsStyle }
  }, [behaviour, isHovered, isPressed, prefersReducedMotion, initialState, options, style])

  // No behaviour - just render children
  if (!behaviour) {
    return <>{children}</>
  }

  return (
    <div
      ref={ref}
      className={className}
      style={computedStyle}
      data-behaviour={behaviourId}
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  )
}

export default BehaviourWrapper
