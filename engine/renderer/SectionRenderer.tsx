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
import { SectionLifecycleProvider } from '../experience/lifecycle'
import { useExperience, useSmoothScrollContainer } from '../experience'
import type { SectionSchema } from '../schema'
import type { Experience } from '../experience'
import type { NavigableExperienceState } from '../experience/experiences/types'

interface SectionRendererProps {
  section: SectionSchema
  index: number
}

/**
 * Capitalize first letter of a string.
 * Used to match section IDs to pattern names (e.g., 'about' → 'About').
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Resolves behaviour for a section.
 * Priority: explicit schema → experience defaults by section ID → experience section fallback.
 */
function resolveSectionBehaviour(
  section: SectionSchema,
  experience: Experience
): string | null {
  // Explicit behaviour in schema takes priority
  if (section.behaviour) {
    return typeof section.behaviour === 'string'
      ? section.behaviour
      : section.behaviour.id ?? null
  }

  // Check experience defaults by section ID (try both exact and capitalized)
  // e.g., 'about' or 'About' for section id='about'
  const byExactId = experience.behaviourDefaults[section.id]
  if (byExactId) return byExactId

  const capitalizedId = capitalize(section.id)
  const byCapitalizedId = experience.behaviourDefaults[capitalizedId]
  if (byCapitalizedId) return byCapitalizedId

  // Fall back to generic section default
  return experience.behaviourDefaults.section ?? null
}

/**
 * Renders a section with its widgets.
 * Visibility tracking is automatic via useIntersection trigger.
 * Behaviour application is handled by BehaviourWrapper (resolveBehaviour pattern).
 */
export function SectionRenderer({ section, index }: SectionRendererProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { experience, store } = useExperience()

  // Check if experience has navigation (slideshow, etc.)
  // Subscribe to active section if navigable experience
  const hasNavigation = 'activeSection' in store.getState()
  const activeSection = useStore(
    store,
    (state) =>
      'activeSection' in state ? (state as NavigableExperienceState).activeSection : -1
  )
  const isActive = hasNavigation ? activeSection === index : true

  // Apply smooth scrolling to active section in slideshow mode
  // Only enabled when section is active (avoids multiple wheel listeners)
  const isSlideshow = experience.presentation?.model === 'slideshow'
  const smoothScrollEnabled = isSlideshow && isActive

  useSmoothScrollContainer(ref, {
    enabled: smoothScrollEnabled,
  })

  // Resolve behaviour from explicit schema or experience defaults
  const behaviourId = resolveSectionBehaviour(section, experience)

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

  // Conditionally wrap with lifecycle provider for navigable experiences
  const behaviourContent = (
    <BehaviourWrapper
      behaviourId={behaviourId}
      options={{ ...behaviourOptions, sectionIndex: index }}
      initialState={{ sectionVisibility, sectionIndex: index }}
    >
      {content}
    </BehaviourWrapper>
  )

  const wrappedContent = hasNavigation ? (
    <SectionLifecycleProvider
      isActive={isActive}
      sectionIndex={index}
      activeSection={activeSection}
    >
      {behaviourContent}
    </SectionLifecycleProvider>
  ) : (
    behaviourContent
  )

  return (
    <div
      ref={ref}
      data-section-id={section.id}
      data-section-index={index}
      data-active={isActive}
      data-slideshow={isSlideshow}
      style={wrapperStyle}
      className={wrapperClassName}
    >
      {wrappedContent}
    </div>
  )
}

export default SectionRenderer
