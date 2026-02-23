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
 * Pinned sections (via sectionBehaviours):
 * For cover-scroll experience, CSS position:sticky pins sections at the viewport top.
 * The experience layer assigns pinned/behaviour via sectionBehaviours.
 */

import { useRef, useMemo, useCallback, type ReactNode } from 'react'
import { useStore } from 'zustand'
import Section from '../content/sections'
import { WidgetRenderer } from './WidgetRenderer'
import { BehaviourWrapper } from '../experience/behaviours'
import { SectionLifecycleProvider } from '../experience/lifecycle'
import { useExperience, useSmoothScrollContainer } from '../experience'
import { useDevSectionBehaviourAssignments, useDevSectionPinned } from './dev/devSettingsStore'
import { useSectionChrome } from './SectionChromeContext'
import { useThemeContext } from './ThemeProvider'
import { getTheme, paletteToCSS } from '../themes'
import { capitalize } from './utils'
import type { SectionSchema } from '../schema'
import type { BehaviourAssignment } from '../experience/experiences/types'
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

  // Resolve section behaviours: exact ID → capitalized ID → '*' fallback
  const sectionAssignments = experience.sectionBehaviours[section.id]
    ?? experience.sectionBehaviours[capitalize(section.id)]
    ?? experience.sectionBehaviours['*']
    ?? []

  const isPinned = experience.bareMode ? false
    : (devPinned ?? sectionAssignments.some(a => a.pinned) ?? false)

  // Resolve behaviour assignments: bareMode → dev override → sectionBehaviours → empty
  const assignments: BehaviourAssignment[] = useMemo(() => {
    if (experience.bareMode) return []
    if (devAssignments && devAssignments.length > 0) return devAssignments
    return sectionAssignments
  }, [experience.bareMode, devAssignments, sectionAssignments])

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

  // Inject section chrome widgets (e.g., section footers from chrome config)
  const chromeWidgets = useSectionChrome(section.id)
  const chromeRendered = chromeWidgets.map((widget, i) => (
    <WidgetRenderer
      key={`${section.id}-chrome-${widget.id ?? i}`}
      widget={{ ...widget, id: `${section.id}-${widget.id ?? `chrome-${i}`}` }}
      index={section.widgets.length + i}
    />
  ))

  const content = (
    <Section
      id={section.id}
      layout={section.layout}
      style={section.style}
      className={section.className}
      constrained={section.constrained}
      paddingTop={section.paddingTop}
      paddingBottom={section.paddingBottom}
      paddingLeft={section.paddingLeft}
      paddingRight={section.paddingRight}
      sectionHeight={section.sectionHeight}
      widgets={section.widgets}
    >
      {widgets}
      {chromeRendered}
    </Section>
  )

  // ── Pinned section handling ──────────────────────────────────────
  // Cover-scroll: CSS position:sticky handles pinning.
  const isCoverScroll = experience.presentation?.model === 'cover-scroll'

  // ── Normal section rendering ───────────────────────────────────────

  // Per-section color palette: resolve from colorMode + active theme
  const { colorTheme } = useThemeContext()
  const sectionPaletteVars = useMemo(() => {
    if (!section.colorMode || !colorTheme) return undefined
    const themeDef = getTheme(colorTheme)
    if (!themeDef) return undefined
    const palette = themeDef[section.colorMode]
    return {
      ...paletteToCSS(palette),
      // Paint section background directly from palette.
      // paletteToCSS sets --site-outer-bg (variable) but not backgroundColor (property).
      // Without this, the section wrapper stays transparent and the site-level
      // background shows through — wrong color for sections with different colorMode.
      ...(palette.background && { backgroundColor: palette.background }),
    }
  }, [section.colorMode, colorTheme])

  // Inherit background from section to prevent white flash during fade.
  // For cover-scroll, assign ascending z-indexes so later sections stack on top.
  const bgStyle = section.style?.backgroundColor
    ? { backgroundColor: section.style.backgroundColor }
    : undefined

  const wrapperStyle: React.CSSProperties | undefined = isCoverScroll
    ? {
        ...sectionPaletteVars,
        ...bgStyle,
        '--section-z': index + 1,
      } as React.CSSProperties
    : (sectionPaletteVars || bgStyle)
      ? { ...sectionPaletteVars, ...bgStyle }
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
