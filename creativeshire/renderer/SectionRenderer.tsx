'use client'

/**
 * SectionRenderer - renders sections from schema.
 * Maps widgets to WidgetRenderer and wraps with behaviour.
 * Registers sections with VisibilityDriver for scroll-based effects.
 *
 * Performance: scroll-fade uses GSAP ScrollTrigger driver (bypasses React).
 * Other behaviours use the IntersectionObserver → Zustand → React path.
 */

import { useRef, useEffect, useMemo } from 'react'
import { useStore } from 'zustand'
import Section from '../content/sections'
import { WidgetRenderer } from './WidgetRenderer'
import { BehaviourWrapper } from '../experience/behaviours'
import { useExperience } from '../experience'
import { useDriver } from '../experience/DriverProvider'
import { useScrollFadeBehaviour } from '../experience/hooks'
import type { SectionSchema } from '../schema'

interface SectionRendererProps {
  section: SectionSchema
  index: number
}

/**
 * Renders a section with its widgets.
 * Tracks visibility via IntersectionObserver and passes to behaviour.
 */
export function SectionRenderer({ section, index }: SectionRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const driver = useDriver()
  const { store } = useExperience()

  // Check if section uses a scroll-fade behaviour (in or out)
  const behaviourId = typeof section.behaviour === 'string'
    ? section.behaviour
    : section.behaviour?.id
  const isScrollFadeBehaviour = behaviourId === 'scroll-fade' || behaviourId === 'scroll-fade-out'

  // Use GSAP ScrollTrigger driver for scroll-fade behaviours (bypasses React for 60fps)
  // This hook sets CSS variables directly on the ref element
  useScrollFadeBehaviour(
    isScrollFadeBehaviour ? ref : { current: null },
    (behaviourId as 'scroll-fade' | 'scroll-fade-out') ?? 'scroll-fade'
  )

  // Subscribe to visibility from store ONLY for non-scroll-fade behaviours
  // For scroll-fade behaviours, the hook handles visibility directly via ScrollTrigger
  const sectionVisibility = useStore(
    store,
    (state) => isScrollFadeBehaviour ? 1 : (state.sectionVisibilities[section.id] ?? 0)
  )

  // Register section with driver on mount (for non-scroll-fade behaviours)
  useEffect(() => {
    // Skip driver registration for scroll-fade behaviours - the hook handles it directly
    if (isScrollFadeBehaviour) return

    const el = ref.current
    if (el) {
      driver.observe(el)
      return () => driver.unobserve(el)
    }
  }, [driver, isScrollFadeBehaviour])

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
