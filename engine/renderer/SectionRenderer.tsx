'use client'

/**
 * SectionRenderer - renders sections from schema.
 * Maps widgets to WidgetRenderer and wraps with behaviour.
 *
 * Visibility tracking is handled by useIntersection trigger (auto-discovers data-section-id).
 * Behaviour handling is delegated entirely to BehaviourWrapper, which:
 * - Resolves behaviours via resolveBehaviour()
 * - Registers scroll-based behaviours with ScrollDriver for 60fps updates
 * - Computes CSS variables for interaction-based behaviours
 */

import { useRef } from 'react'
import { useStore } from 'zustand'
import Section from '../content/sections'
import { WidgetRenderer } from './WidgetRenderer'
import { BehaviourWrapper } from '../experience/behaviours'
import { useExperience } from '../experience'
import type { SectionSchema } from '../schema'

interface SectionRendererProps {
  section: SectionSchema
  index: number
}

/**
 * Renders a section with its widgets.
 * Visibility tracking is automatic via useIntersection trigger.
 * Behaviour application is handled by BehaviourWrapper (resolveBehaviour pattern).
 */
export function SectionRenderer({ section, index }: SectionRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { store } = useExperience()

  // Extract behaviour ID from schema (can be string or object with id)
  const behaviourId = typeof section.behaviour === 'string'
    ? section.behaviour
    : section.behaviour?.id

  // Extract behaviour options if provided as object
  const behaviourOptions = typeof section.behaviour === 'object'
    ? section.behaviour.options
    : undefined

  // Subscribe to visibility from store
  // useIntersection trigger auto-discovers elements with data-section-id attribute
  const sectionVisibility = useStore(
    store,
    (state) => state.sectionVisibilities[section.id] ?? 0
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

  // Pass section className to wrapper for responsive visibility (e.g., display:none)
  const wrapperClassName = section.className

  // All behaviours go through BehaviourWrapper which:
  // - Calls resolveBehaviour() to get the behaviour definition
  // - Registers scroll-based behaviours with ScrollDriver for 60fps
  // - Computes CSS variables for non-scroll behaviours
  return (
    <div ref={ref} data-section-id={section.id} style={wrapperStyle} className={wrapperClassName}>
      <BehaviourWrapper
        behaviourId={behaviourId}
        options={{ ...behaviourOptions, sectionIndex: index }}
        initialState={{ sectionVisibility, sectionIndex: index }}
      >
        {content}
      </BehaviourWrapper>
    </div>
  )
}

export default SectionRenderer
