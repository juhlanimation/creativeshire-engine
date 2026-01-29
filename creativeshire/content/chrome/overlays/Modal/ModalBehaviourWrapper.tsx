'use client'

/**
 * ModalBehaviourWrapper - Bridges modal store to BehaviourWrapper.
 *
 * Converts modal transitionPhase into BehaviourState that behaviours can read.
 * This enables modal transitions to use the standard behaviour + effect pattern.
 *
 * Architecture:
 * - Reads transitionPhase from modal store
 * - Passes { modalOpen, modalPhase } to BehaviourWrapper initialState
 * - Behaviours compute CSS variables based on these values
 *
 * Key timing:
 * - On mount, renders with "closed" values first (modalOpen: false)
 * - After first paint, updates to trigger the open transition
 * - This ensures CSS transitions actually occur
 */

import { useMemo, useState, useEffect, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { BehaviourWrapper } from '@/creativeshire/experience/behaviours'
import { useModalStore } from './store'
import { getModalBehaviourId } from '@/creativeshire/experience/behaviours/modal'
import type { TransitionType, TransitionConfig } from './types'

/**
 * Props for ModalBehaviourWrapper.
 */
export interface ModalBehaviourWrapperProps {
  /** Transition type (determines which behaviour to use) */
  transition: TransitionType
  /** Transition configuration (passed as behaviour options) */
  transitionConfig?: TransitionConfig
  /** Child elements to wrap */
  children: ReactNode
  /** Additional className for the wrapper */
  className?: string
}

/**
 * ModalBehaviourWrapper component.
 * Connects modal store state to the behaviour system.
 */
export function ModalBehaviourWrapper({
  transition,
  transitionConfig,
  children,
  className,
}: ModalBehaviourWrapperProps) {
  const transitionPhase = useStore(useModalStore, (s) => s.transitionPhase)

  // Resolve behaviour ID from transition type
  const behaviourId = getModalBehaviourId(transition)

  // Track if we've completed the initial render
  // This ensures we render with "closed" values first, then trigger transition
  const [hasRendered, setHasRendered] = useState(false)

  useEffect(() => {
    // After first paint, enable the open state to trigger transition
    if (transitionPhase === 'opening' && !hasRendered) {
      // Use requestAnimationFrame to ensure DOM has painted with closed values
      const frameId = requestAnimationFrame(() => {
        setHasRendered(true)
      })
      return () => cancelAnimationFrame(frameId)
    }

    // Reset when modal closes completely
    if (transitionPhase === 'closed') {
      setHasRendered(false)
    }
  }, [transitionPhase, hasRendered])

  // Convert phase to state for behaviour
  // On initial render during 'opening', use closed state to start transition
  const initialState = useMemo(() => {
    const isOpening = transitionPhase === 'opening'
    const isOpen = transitionPhase === 'open'

    // During opening: only show "open" values after first render (triggers open transition)
    // During open: stay open
    // During closing: set to closed (triggers close transition)
    const modalOpen = isOpening ? hasRendered : isOpen

    return {
      modalOpen,
      modalPhase: transitionPhase,
    }
  }, [transitionPhase, hasRendered])

  // No behaviour for 'none' transition
  if (behaviourId === 'none') {
    return <>{children}</>
  }

  return (
    <BehaviourWrapper
      behaviourId={behaviourId}
      options={transitionConfig as Record<string, unknown>}
      initialState={initialState}
      className={className}
    >
      {children}
    </BehaviourWrapper>
  )
}

export default ModalBehaviourWrapper
