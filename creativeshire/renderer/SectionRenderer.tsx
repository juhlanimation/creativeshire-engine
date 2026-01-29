'use client'

/**
 * SectionRenderer - renders sections from schema.
 * Maps widgets to WidgetRenderer and wraps with behaviour.
 *
 * Visibility tracking is handled by useIntersection trigger (auto-discovers data-section-id).
 * Performance: scroll-fade uses GSAP ScrollTrigger driver (bypasses React).
 * Other behaviours use the IntersectionObserver → Zustand → React path.
 */

import { useRef } from 'react'
import { useStore } from 'zustand'
import Section from '../content/sections'
import { WidgetRenderer } from './WidgetRenderer'
import { BehaviourWrapper } from '../experience/behaviours'
import { useExperience } from '../experience'
import { useScrollFadeDriver } from '../experience/drivers'
import type { SectionSchema } from '../schema'

interface SectionRendererProps {
  section: SectionSchema
  index: number
}

/**
 * Renders a section with its widgets.
 * Visibility tracking is automatic via useIntersection trigger.
 */
export function SectionRenderer({ section, index }: SectionRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { store } = useExperience()

  // Check if section uses a scroll-fade behaviour (in or out)
  const behaviourId = typeof section.behaviour === 'string'
    ? section.behaviour
    : section.behaviour?.id
  const isScrollFadeBehaviour = behaviourId === 'scroll/fade' || behaviourId === 'scroll/fade-out'

  // Use GSAP ScrollTrigger driver for scroll-fade behaviours (bypasses React for 60fps)
  // This driver sets CSS variables directly on the ref element
  useScrollFadeDriver(
    isScrollFadeBehaviour ? ref : { current: null },
    (behaviourId === 'scroll/fade-out' ? 'scroll/fade-out' : 'scroll/fade')
  )

  // Subscribe to visibility from store
  // useIntersection trigger auto-discovers elements with data-section-id attribute
  const sectionVisibility = useStore(
    store,
    (state) => isScrollFadeBehaviour ? 1 : (state.sectionVisibilities[section.id] ?? 0)
  )

  const widgets = section.widgets.map((widget, i) => (
    <WidgetRenderer key={widget.id ?? `widget-${i}`} widget={widget} index={i} />
  ))

  const content = (
    <Section
      id={section.id}
      layout={section.layout}
      style={section.style}
      className={section.className}
      widgets={section.widgets}
    >
      {widgets}
    </Section>
  )

  // Inherit background from section to prevent white flash during fade
  const wrapperStyle = section.style?.backgroundColor
    ? { backgroundColor: section.style.backgroundColor }
    : undefined

  // For scroll-fade behaviours: skip BehaviourWrapper (hook sets CSS vars directly on ref)
  // For other behaviours: wrap with BehaviourWrapper as usual
  if (isScrollFadeBehaviour) {
    return (
      <div ref={ref} data-section-id={section.id} data-behaviour={behaviourId} style={wrapperStyle}>
        {content}
      </div>
    )
  }

  return (
    <div ref={ref} data-section-id={section.id} style={wrapperStyle}>
      <BehaviourWrapper
        behaviourId={behaviourId}
        initialState={{ sectionVisibility, sectionIndex: index }}
      >
        {content}
      </BehaviourWrapper>
    </div>
  )
}

export default SectionRenderer
