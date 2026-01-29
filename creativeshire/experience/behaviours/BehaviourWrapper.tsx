'use client'

/**
 * BehaviourWrapper - applies behaviour CSS variables to children.
 *
 * Architecture:
 * 1. Resolves behaviour from registry by ID
 * 2. Tracks local interaction state (hover, press)
 * 3. For scroll behaviours: registers with ScrollDriver for 60fps updates
 * 4. For non-scroll behaviours: calls behaviour.compute(state, options) directly
 * 5. Applies variables via inline style or driver setProperty
 *
 * This enables reusable behaviours across any widget.
 * The widget stays pure (L1), BehaviourWrapper handles experience (L2).
 */

import {
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useId,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { resolveBehaviour } from './resolve'
import { ScrollDriver } from '../drivers/ScrollDriver'
import type { BehaviourState, CSSVariables } from '../../schema/experience'
import type { Behaviour } from './types'

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
 * State dependencies that require ScrollDriver.
 * If a behaviour requires any of these, it will be registered with the driver.
 */
const SCROLL_DEPENDENCIES = new Set([
  'scrollProgress',
  'scrollVelocity',
  'sectionProgress',
])

/**
 * Lazy singleton ScrollDriver instance.
 * Created on first use, shared across all BehaviourWrappers.
 * Destroyed when no more wrappers are registered.
 */
let sharedDriver: ScrollDriver | null = null
let driverRefCount = 0

function getDriver(): ScrollDriver {
  if (!sharedDriver) {
    sharedDriver = new ScrollDriver()
  }
  driverRefCount++
  return sharedDriver
}

function releaseDriver(): void {
  driverRefCount--
  if (driverRefCount <= 0 && sharedDriver) {
    sharedDriver.destroy()
    sharedDriver = null
    driverRefCount = 0
  }
}

/**
 * Check if behaviour requires scroll driver.
 * Returns true if any of the behaviour's requires array contains scroll-related state.
 */
function needsScrollDriver(behaviour: Behaviour): boolean {
  if (!behaviour.requires || behaviour.requires.length === 0) {
    return false
  }
  return behaviour.requires.some((req) => SCROLL_DEPENDENCIES.has(req))
}

/**
 * BehaviourWrapper component.
 * Wraps children and applies behaviour-computed CSS variables.
 *
 * For scroll-based behaviours, registers with ScrollDriver for 60fps updates.
 * For interaction-based behaviours, computes CSS variables on state change.
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
  const id = useId()

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

  // Determine if this behaviour needs scroll driver
  const usesScrollDriver = useMemo(() => {
    return behaviour ? needsScrollDriver(behaviour) : false
  }, [behaviour])

  // Register with ScrollDriver for scroll-based behaviours
  useEffect(() => {
    if (!behaviour || !usesScrollDriver || !ref.current) {
      return
    }

    const element = ref.current
    const driver = getDriver()

    // Register element with driver
    driver.register(id, element, behaviour, options ?? {})

    // Cleanup: unregister from driver and release reference
    return () => {
      driver.unregister(id)
      releaseDriver()
    }
  }, [behaviour, usesScrollDriver, id, options])

  // Event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setIsPressed(false)
  }, [])
  const handleMouseDown = useCallback(() => setIsPressed(true), [])
  const handleMouseUp = useCallback(() => setIsPressed(false), [])

  // Compute CSS variables from state (for non-scroll behaviours)
  const computedStyle = useMemo((): CSSProperties => {
    if (!behaviour) return style || {}

    // For scroll-driven behaviours, driver applies CSS vars directly
    // We only add cssTemplate styles here
    if (usesScrollDriver) {
      return style || {}
    }

    // Build state object for non-scroll behaviours
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
  }, [behaviour, usesScrollDriver, isHovered, isPressed, prefersReducedMotion, initialState, options, style])

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
