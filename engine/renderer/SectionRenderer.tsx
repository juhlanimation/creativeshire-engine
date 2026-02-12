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
 *
 * Pinned sections (via sectionInjections):
 * For cover-scroll experience, CSS position:sticky pins sections at the viewport top.
 * The experience layer injects pinned/behaviour via sectionInjections.
 */

import { useRef, useMemo, useCallback, type ReactNode } from 'react'
import { useStore } from 'zustand'
import Section from '../content/sections'
import { WidgetRenderer } from './WidgetRenderer'
import { BehaviourWrapper } from '../experience/behaviours'
import { SectionLifecycleProvider } from '../experience/lifecycle'
import { useExperience, useSmoothScrollContainer } from '../experience'
// PinnedBackdrop infrastructure preserved for potential future use
// import { usePinnedBackdrop } from './PinnedBackdropContext'
import { useDevSectionBehaviourAssignments, useDevSectionPinned } from './dev/devSettingsStore'
import { capitalize } from './utils'
import type { SectionSchema } from '../schema'
import { normalizeBehaviours, type BehaviourAssignment } from '../experience/experiences/types'
import type { NavigableExperienceState } from '../experience/experiences/types'

interface SectionRendererProps {
  section: SectionSchema
  index: number
  /** Total number of sections on the page (for z-index assignment) */
  totalSections: number
}

/**
 * Renders a section with its widgets.
 * Visibility tracking is automatic via useIntersection trigger.
 * Behaviour application is handled by BehaviourWrapper (resolveBehaviour pattern).
 */
export function SectionRenderer({ section, index, totalSections }: SectionRendererProps) {
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

  const devAssignments = useDevSectionBehaviourAssignments(section.id)
  const devPinned = useDevSectionPinned(section.id)

  // Resolve injection: exact ID → capitalized ID → '*' fallback
  const injection = experience.sectionInjections[section.id]
    ?? experience.sectionInjections[capitalize(section.id)]
    ?? experience.sectionInjections['*']
    ?? {}

  const isPinned = experience.bareMode ? false
    : (devPinned ?? injection.pinned ?? false)

  // Resolve behaviour assignments: bareMode → dev override → injection → empty
  const assignments: BehaviourAssignment[] = useMemo(() => {
    if (experience.bareMode) return []
    if (devAssignments && devAssignments.length > 0) return devAssignments
    return normalizeBehaviours(injection)
  }, [experience.bareMode, devAssignments, injection])

  // Read visibility once (no subscription) - ScrollDriver reads via visibilityGetter at 60fps
  // useStore subscription here caused ~21 wasted React re-renders per section during scroll
  const initialVisibility = useRef(
    store.getState().sectionVisibilities[section.id] ?? 0
  ).current

  // Create a stable visibility getter for ScrollDriver
  // This reads directly from store, avoiding duplicate IntersectionObserver tracking
  // ScrollDriver calls this at 60fps instead of using its own observer
  const visibilityGetter = useCallback(() => {
    return store.getState().sectionVisibilities[section.id] ?? 0
  }, [store, section.id])

  const widgets = section.widgets.map((widget, i) => (
    <WidgetRenderer key={widget.id ?? `widget-${i}`} widget={widget} index={i} />
  ))

  const content = (
    <Section
      id={section.id}
      layout={section.layout}
      style={section.style}
      className={section.className}
      constrained={section.constrained}
      widgets={section.widgets}
    >
      {widgets}
    </Section>
  )

  // ── Pinned section handling ──────────────────────────────────────
  // Cover-scroll: CSS position:sticky handles pinning (rendered inline below).
  // All other experiences: pinned: true is ignored — sections render normally.
  // The portal-to-backdrop approach (PinnedSection) is no longer used.
  const isCoverScroll = experience.presentation?.model === 'cover-scroll'

  // ── Normal section rendering ───────────────────────────────────────

  // Inherit background from section to prevent white flash during fade.
  // For cover-scroll, assign ascending z-indexes so later sections stack on top.
  const wrapperStyle: React.CSSProperties | undefined = isCoverScroll
    ? {
        ...(section.style?.backgroundColor ? { backgroundColor: section.style.backgroundColor } : undefined),
        '--section-z': index + 1,
      } as React.CSSProperties
    : section.style?.backgroundColor
      ? { backgroundColor: section.style.backgroundColor }
      : undefined

  // Pass section className to wrapper for responsive visibility (e.g., display:none)
  const wrapperClassName = section.className

  // All behaviours go through BehaviourWrapper which:
  // - Calls resolveBehaviour() to get the behaviour definition
  // - Registers scroll-based behaviours with ScrollDriver for 60fps
  // - Computes CSS variables for non-scroll behaviours

  // Multi-behaviour: nest wrappers via reduceRight.
  // First assignment is outermost (gets visibilityGetter), last is innermost.
  const behaviourContent = assignments.length === 0
    ? content
    : assignments.reduceRight<ReactNode>(
        (children, assignment, i) => (
          <BehaviourWrapper
            behaviourId={assignment.behaviour}
            options={{ ...assignment.options, sectionIndex: index }}
            initialState={{ sectionVisibility: initialVisibility, sectionIndex: index }}
            visibilityGetter={i === 0 ? visibilityGetter : undefined}
          >
            {children}
          </BehaviourWrapper>
        ),
        content,
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
      data-section-pinned={isPinned || undefined}
      style={wrapperStyle}
      className={wrapperClassName}
    >
      {wrappedContent}
    </div>
  )
}

export default SectionRenderer
