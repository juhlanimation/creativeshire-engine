'use client'

/**
 * ComposedBehaviourWrapper - applies multiple behaviours to a single element.
 *
 * Without this, multiple behaviours produce nested wrapper divs:
 *   <BehaviourWrapper id="scroll/fade">
 *     <BehaviourWrapper id="hover/reveal">
 *       {content}
 *     </BehaviourWrapper>
 *   </BehaviourWrapper>
 *
 * ComposedBehaviourWrapper computes all CSS variables in one pass and
 * produces a single wrapper div, reducing DOM nodes and hook overhead.
 *
 * Architecture:
 * 1. Resolves all behaviours from registry
 * 2. Separates scroll-based from interaction-based behaviours
 * 3. Registers scroll behaviours with ScrollDriver (one registration per behaviour)
 * 4. Computes interaction behaviours directly in React
 * 5. Merges all CSS variables onto one wrapper element
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
import { useDevBehaviourOptions } from '../../renderer/dev/devSettingsStore'
import { getDriver, releaseDriver } from '../drivers/getDriver'
import { useContainer } from '../../interface/ContainerContext'
import { useIntro } from '../../intro'
import type { BehaviourState, CSSVariables } from '../../schema/experience'
import type { Behaviour } from './types'
import type { VisibilityGetter } from '../drivers/ScrollDriver'

/**
 * A single behaviour assignment for composition.
 */
export interface ComposedBehaviourEntry {
  /** Behaviour ID (e.g., 'scroll/fade', 'hover/reveal') */
  behaviourId: string
  /** Options to pass to behaviour compute */
  options?: Record<string, unknown>
}

/**
 * Props for ComposedBehaviourWrapper component.
 */
export interface ComposedBehaviourWrapperProps {
  /** Array of behaviour assignments to compose */
  behaviours: ComposedBehaviourEntry[]
  /** Initial state values (e.g., from global store) */
  initialState?: Partial<BehaviourState>
  /** Visibility getter for sections tracked by useIntersection */
  visibilityGetter?: VisibilityGetter
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
 */
const SCROLL_DEPENDENCIES = new Set([
  'scrollProgress',
  'scrollVelocity',
  'sectionProgress',
  'sectionVisibility',
])

function needsScrollDriver(behaviour: Behaviour): boolean {
  if (!behaviour.requires || behaviour.requires.length === 0) return false
  return behaviour.requires.some((req) => SCROLL_DEPENDENCIES.has(req))
}

/**
 * ComposedBehaviourWrapper component.
 * Applies multiple behaviours to a single wrapper element.
 *
 * Scroll-based behaviours register with ScrollDriver individually.
 * Interaction-based behaviours are computed in React and merged.
 */
export function ComposedBehaviourWrapper({
  behaviours,
  initialState,
  visibilityGetter,
  children,
  className,
  style,
}: ComposedBehaviourWrapperProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  const baseId = useId()

  // Get container context for contained mode support
  const { mode, containerRef } = useContainer()

  // Get intro context (may be null if no intro)
  const introContext = useIntro()

  // Local interaction state
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Check reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Resolve all behaviours and partition into scroll vs interaction
  const { scrollBehaviours, interactionBehaviours } = useMemo(() => {
    const scroll: Array<{ behaviour: Behaviour; options?: Record<string, unknown>; index: number }> = []
    const interaction: Array<{ behaviour: Behaviour; options?: Record<string, unknown> }> = []

    for (let i = 0; i < behaviours.length; i++) {
      const entry = behaviours[i]
      if (!entry.behaviourId || entry.behaviourId === 'none') continue
      const resolved = resolveBehaviour(entry.behaviourId)
      if (!resolved) continue

      if (needsScrollDriver(resolved)) {
        scroll.push({ behaviour: resolved, options: entry.options, index: i })
      } else {
        interaction.push({ behaviour: resolved, options: entry.options })
      }
    }

    return { scrollBehaviours: scroll, interactionBehaviours: interaction }
  }, [behaviours])

  // Dev-only: collect overrides for all behaviours
  // Use the first behaviour ID for dev overrides (simplified)
  const firstBehaviourId = behaviours[0]?.behaviourId ?? null
  const devBehaviourOverrides = useDevBehaviourOptions(firstBehaviourId)

  // Register scroll behaviours with ScrollDriver
  useEffect(() => {
    if (scrollBehaviours.length === 0 || !ref.current) return

    const element = ref.current
    const container = mode === 'contained' ? containerRef?.current ?? null : null
    const driver = getDriver(container)

    // Register each scroll behaviour with a unique ID
    const registrationIds: string[] = []
    for (const { behaviour, options, index } of scrollBehaviours) {
      const regId = `${baseId}-${index}`
      const mergedOptions = devBehaviourOverrides
        ? { ...options, ...devBehaviourOverrides }
        : options ?? {}
      driver.register(regId, element, behaviour, mergedOptions, visibilityGetter)
      registrationIds.push(regId)
    }

    return () => {
      for (const regId of registrationIds) {
        driver.unregister(regId)
      }
      releaseDriver(container)
    }
  }, [scrollBehaviours, baseId, mode, containerRef, visibilityGetter, devBehaviourOverrides])

  // Event handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setIsPressed(false)
  }, [])
  const handleMouseDown = useCallback(() => setIsPressed(true), [])
  const handleMouseUp = useCallback(() => setIsPressed(false), [])

  // Compute CSS variables from all interaction behaviours (merged)
  const computedStyle = useMemo((): CSSProperties => {
    if (interactionBehaviours.length === 0) return style || {}

    // Build shared state
    const state: BehaviourState = {
      ...DEFAULT_STATE,
      ...initialState,
      isHovered,
      isPressed,
      prefersReducedMotion,
      ...(introContext && {
        introPhase: introContext.store.getState().phase,
        introProgress: introContext.store.getState().revealProgress,
        isIntroLocked: introContext.store.getState().isScrollLocked,
      }),
    }

    // Compute all interaction behaviours and merge CSS variables
    const mergedVars: CSSProperties = {}
    for (const { behaviour, options } of interactionBehaviours) {
      const mergedOptions = devBehaviourOverrides
        ? { ...options, ...devBehaviourOverrides }
        : options
      const cssVars = behaviour.compute(state, mergedOptions) as CSSVariables
      Object.entries(cssVars).forEach(([key, value]) => {
        // @ts-expect-error - CSS variables are valid but not in CSSProperties type
        mergedVars[key] = value
      })
    }

    return { ...style, ...mergedVars }
  }, [interactionBehaviours, isHovered, isPressed, prefersReducedMotion, initialState, style, introContext, devBehaviourOverrides])

  // No behaviours resolved — just render children
  const totalBehaviours = scrollBehaviours.length + interactionBehaviours.length
  if (totalBehaviours === 0) {
    return <>{children}</>
  }

  // Build data-behaviour attribute with all behaviour IDs
  const behaviourIds = behaviours
    .map((b) => b.behaviourId)
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={ref}
      className={className}
      style={computedStyle}
      data-behaviour={behaviourIds}
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
