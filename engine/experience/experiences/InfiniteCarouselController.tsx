'use client'

/**
 * InfiniteCarouselController - initializes MomentumDriver and positions sections.
 *
 * Responsibilities:
 * 1. Create MomentumDriver instance with presentation wrapper as container
 * 2. Subscribe to scroll progress and apply transforms to sections
 * 3. Transition from 'intro' to 'ready' phase after initialization
 */

import { useEffect, useRef } from 'react'
import { useStore } from 'zustand'
import { useExperience } from './ExperienceProvider'
import { MomentumDriver } from '../drivers/MomentumDriver'
import type { InfiniteCarouselState } from './types'
import type { StoreApi } from 'zustand'

/**
 * Section height info for tall section handling.
 * Sections taller than 100vh need internal scrolling before clip transition.
 */
interface SectionHeightInfo {
  /** Section height as ratio to viewport (1.0 = 100vh, 1.5 = 150vh) */
  heightRatio: number
  /** Extra height beyond 100vh as ratio (0 for normal sections) */
  extraRatio: number
  /** Threshold at which clipping begins (0 for normal, higher for tall sections) */
  clipStartThreshold: number
}

/**
 * Calculate section transforms based on scroll progress.
 * Each section is positioned relative to scroll progress.
 * Uses clip-path for wipe reveal effect (matching bishoy-gendi-portfolio).
 *
 * For sections > 100vh:
 * - First phase: translate up to reveal extra content (next section stays at 50vh)
 * - Second phase: clip from bottom 0-100% (next section translates from 50vh to 0vh)
 */
function calculateSectionTransforms(
  scrollProgress: number,
  totalSections: number,
  sectionElements: HTMLElement[],
  sectionHeights: SectionHeightInfo[]
): void {
  if (totalSections === 0) return

  // Get current section info to determine phases
  const currentIndex = Math.floor(scrollProgress)
  const progressInSection = scrollProgress - currentIndex
  const currentHeightInfo = sectionHeights[currentIndex] || { clipStartThreshold: 0, extraRatio: 0 }
  const { clipStartThreshold: currentClipStart, extraRatio: currentExtraRatio } = currentHeightInfo

  // Determine if we're in internal scroll phase or clip phase
  const isInternalScrollPhase = currentExtraRatio > 0 && progressInSection < currentClipStart

  // Calculate clipProgress (0 during internal scroll, 0-1 during clip)
  let clipProgress: number
  if (isInternalScrollPhase) {
    clipProgress = 0
  } else if (currentExtraRatio > 0) {
    clipProgress = (progressInSection - currentClipStart) / (1 - currentClipStart)
  } else {
    clipProgress = progressInSection
  }

  sectionElements.forEach((el, index) => {
    // Calculate offset from current scroll position
    // offset = 0 means section is centered, +1 means one section below, -1 means above
    let offset = index - scrollProgress

    // Handle infinite wrapping - find shortest path
    if (Math.abs(offset) > totalSections / 2) {
      if (offset > 0) {
        offset -= totalSections
      } else {
        offset += totalSections
      }
    }

    // Get height info for this section
    const heightInfo = sectionHeights[index] || { heightRatio: 1, extraRatio: 0, clipStartThreshold: 0 }
    const { extraRatio, clipStartThreshold } = heightInfo

    let translateY: number
    let clipPath = 'none'

    if (offset >= -1 && offset <= 0) {
      // Current/outgoing section
      // Unified logic: everything before last 100vh = translate only, last 100vh = clip
      const absOffset = Math.abs(offset)

      if (absOffset < clipStartThreshold) {
        // Before the last 100vh: translate only (tall sections)
        // Map absOffset [0, clipStartThreshold] to translateY [0, -extraRatio*100]
        const translateProgress = clipStartThreshold > 0 ? absOffset / clipStartThreshold : 0
        translateY = -translateProgress * extraRatio * 100
        clipPath = 'inset(0 0 0 0)'  // No clip yet
      } else {
        // The LAST 100vh: same behavior for ALL sections
        // Translate stays at -extraRatio*100 (0 for normal sections)
        translateY = -extraRatio * 100

        // Map absOffset [clipStartThreshold, 1] to clipProgress [0, 1]
        const clipPhaseLength = 1 - clipStartThreshold
        const clipProgress = clipPhaseLength > 0
          ? (absOffset - clipStartThreshold) / clipPhaseLength
          : absOffset  // Normal sections: threshold=0, so clipProgress = absOffset

        // Clip 0-100vh of viewport (same for all sections)
        const clipVh = Math.min(clipProgress * 100, 100)
        clipPath = `inset(0 0 ${clipVh}vh 0)`
      }
    } else if (offset > 0 && offset <= 1) {
      // Incoming section
      // Only translate when the CURRENT section is in clip phase
      // During internal scroll phase of tall current section, incoming stays at 50vh
      if (isInternalScrollPhase) {
        // Current section is doing internal scroll - next section waits at 50vh
        translateY = 50
      } else {
        // Clip phase: translate from 50vh to 0vh based on clipProgress
        translateY = (1 - clipProgress) * 50
      }
    } else {
      // Far sections: parked at 50vh
      translateY = 50
    }

    el.style.transform = `translateY(${translateY}vh)`
    el.style.clipPath = clipPath

    // Z-index for wipe reveal: outgoing section must be ON TOP
    // - Current/outgoing (offset 0 to -1): highest, they clip to reveal what's below
    // - Incoming (offset 0 to 1): below outgoing, being revealed
    // - Far sections: lowest priority
    let zIndex: number
    if (offset >= -1 && offset <= 0) {
      // Current and outgoing: highest priority (on top, clipping away)
      zIndex = 20
    } else if (offset > 0 && offset <= 1) {
      // Next incoming: below outgoing, being revealed underneath
      zIndex = 10
    } else {
      // Far sections: not visible or barely visible
      zIndex = 5
    }
    el.style.zIndex = String(zIndex)

    // Visibility optimization - only show sections in active transition window
    // Current/outgoing (offset -1 to 0) and incoming (offset 0 to 1) should be visible
    // Sections beyond this range are hidden to prevent wrapped sections from showing
    const isVisible = offset >= -1 && offset <= 1
    el.style.visibility = isVisible ? 'visible' : 'hidden'
  })
}

export function InfiniteCarouselController(): null {
  const { store } = useExperience()
  const carouselStore = store as StoreApi<InfiniteCarouselState>

  const driverRef = useRef<MomentumDriver | null>(null)
  const sectionsRef = useRef<HTMLElement[]>([])
  const sectionHeightsRef = useRef<SectionHeightInfo[]>([])

  // Get reactive state
  const scrollProgress = useStore(carouselStore, (s) => s.scrollProgress)
  const totalSections = useStore(carouselStore, (s) => s.totalSections)
  const phase = useStore(carouselStore, (s) => s.phase)

  // Initialize driver and find sections
  useEffect(() => {
    // Find the presentation wrapper
    const wrapper = document.querySelector<HTMLElement>(
      '.presentation-wrapper[data-presentation="infinite-carousel"]'
    )
    if (!wrapper) {
      console.warn('[InfiniteCarouselController] Presentation wrapper not found')
      return
    }

    // Find all visible sections (filter out display:none sections on mobile)
    const allSections = wrapper.querySelectorAll<HTMLElement>('[data-section-id]')
    const sections = Array.from(allSections).filter(el => {
      const style = getComputedStyle(el)
      // Skip sections hidden via CSS (display: none)
      return style.display !== 'none'
    })
    sectionsRef.current = sections

    // Extract section IDs for NavTimeline labels
    const sectionIds = Array.from(sections).map(
      el => el.getAttribute('data-section-id') || ''
    )

    // Update total sections count and IDs immediately
    carouselStore.setState({
      totalSections: sections.length,
      sectionIds,
    })

    // Create MomentumDriver
    driverRef.current = new MomentumDriver(wrapper, carouselStore, {})
    driverRef.current.setTotalSections(sections.length)

    // Measure section heights
    const measureHeights = () => {
      const viewportHeight = window.innerHeight
      sectionHeightsRef.current = Array.from(sections).map((el) => {
        // Find the tallest descendant element (wrappers may be constrained to 100vh)
        const allDescendants = el.querySelectorAll('*')
        let maxDescendantHeight = 0
        allDescendants.forEach(desc => {
          const h = desc.getBoundingClientRect().height
          if (h > maxDescendantHeight) maxDescendantHeight = h
        })
        const wrapperHeight = el.getBoundingClientRect().height
        // Use the tallest descendant as the true content height
        const actualHeight = Math.max(wrapperHeight, maxDescendantHeight)
        const heightRatio = actualHeight / viewportHeight
        const extraRatio = Math.max(0, heightRatio - 1)
        // clipStartThreshold: what portion of the transition is used for internal scroll
        // For 150vh section: extra = 0.5, clipStart = 0.5 / 1.5 = 0.33
        // For 200vh section: extra = 1.0, clipStart = 1.0 / 2.0 = 0.5
        const clipStartThreshold = extraRatio > 0 ? extraRatio / heightRatio : 0
        return { heightRatio, extraRatio, clipStartThreshold }
      })

      // Pass section heights to driver for snap control (no snap on tall sections)
      if (driverRef.current) {
        driverRef.current.setSectionHeights(sectionHeightsRef.current)
      }
    }

    // Use ResizeObserver to detect when sections reach their full height
    // Debounce to avoid excessive measurements during layout shifts
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(measureHeights, 100)
    })
    sections.forEach(section => resizeObserver.observe(section))

    // Initial measurement
    measureHeights()

    // Transition to ready phase after short delay
    const readyTimeout = setTimeout(() => {
      carouselStore.setState({ phase: 'ready' })
    }, 100)

    // Cleanup
    return () => {
      resizeObserver.disconnect()
      if (resizeTimeout) clearTimeout(resizeTimeout)
      clearTimeout(readyTimeout)
      if (driverRef.current) {
        driverRef.current.destroy()
        driverRef.current = null
      }
    }
  }, [carouselStore])

  // Update section transforms and clipProgress when scroll progress changes
  useEffect(() => {
    if (phase !== 'ready' || sectionsRef.current.length === 0) return

    calculateSectionTransforms(scrollProgress, totalSections, sectionsRef.current, sectionHeightsRef.current)

    // Calculate clipProgress for NavTimeline
    // This is 0 during internal scroll phase, 0-1 during clip phase
    const currentIndex = Math.floor(scrollProgress)
    const progressInSection = scrollProgress - currentIndex
    const heightInfo = sectionHeightsRef.current[currentIndex] || { clipStartThreshold: 0 }
    const { clipStartThreshold } = heightInfo

    let clipProgress: number
    if (clipStartThreshold > 0 && progressInSection < clipStartThreshold) {
      // Internal scroll phase (tall sections): clipProgress stays at 0
      clipProgress = 0
    } else if (clipStartThreshold > 0) {
      // Clip phase (tall sections): map [clipStartThreshold, 1] to [0, 1]
      clipProgress = (progressInSection - clipStartThreshold) / (1 - clipStartThreshold)
    } else {
      // Normal section: clipProgress = progressInSection
      clipProgress = progressInSection
    }

    carouselStore.setState({ clipProgress })
  }, [scrollProgress, totalSections, phase, carouselStore])

  return null
}

export default InfiniteCarouselController
