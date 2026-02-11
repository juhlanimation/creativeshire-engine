'use client'

/**
 * PinnedSection - Renders a pinned section via portal.
 *
 * Pinned sections (e.g., cover-scroll hero) portal visual content to a
 * fixed backdrop layer OUTSIDE ScrollSmoother's transform context.
 * This achieves true position:fixed behavior.
 *
 * The spacer stays in the scroll flow so IntersectionObserver tracks it
 * and BehaviourWrapper can measure scroll progress (e.g., cover-progress
 * propagates --hero-cover-progress to document root).
 */

import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { BehaviourWrapper } from '../experience/behaviours'

interface PinnedSectionProps {
  sectionId: string
  index: number
  isActive: boolean
  sectionHeight: string
  behaviourId: string | null
  behaviourOptions: Record<string, unknown>
  initialVisibility: number
  visibilityGetter: () => number
  backdropTarget: HTMLElement
  content: ReactNode
  sectionRef: RefObject<HTMLDivElement | null>
}

export function PinnedSection({
  sectionId,
  index,
  isActive,
  sectionHeight,
  behaviourId,
  behaviourOptions,
  initialVisibility,
  visibilityGetter,
  backdropTarget,
  content,
  sectionRef,
}: PinnedSectionProps): ReactNode {
  return (
    <>
      {/* Transparent spacer in scroll flow — tracked by IntersectionObserver */}
      <div
        ref={sectionRef}
        data-section-id={sectionId}
        data-section-index={index}
        data-active={isActive}
        data-section-pinned
      >
        {/* BehaviourWrapper in scroll flow — ScrollDriver measures this element.
            Placeholder div matches section height for correct scroll calculations. */}
        <BehaviourWrapper
          behaviourId={behaviourId}
          options={behaviourOptions}
          initialState={{ sectionVisibility: initialVisibility, sectionIndex: index }}
          visibilityGetter={visibilityGetter}
        >
          <div style={{ height: sectionHeight }} aria-hidden="true" />
        </BehaviourWrapper>
      </div>

      {/* Visual content portalled to fixed backdrop (outside ScrollSmoother) */}
      {createPortal(
        <div
          data-section-pinned-content={sectionId}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
        >
          {content}
        </div>,
        backdropTarget
      )}
    </>
  )
}
