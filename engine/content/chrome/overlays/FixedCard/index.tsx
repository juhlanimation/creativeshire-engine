'use client'

/**
 * FixedCard - glassmorphic card overlay with clip-path fold animation.
 * Reads scrollProgress from experience store, renders cards at fixed viewport
 * positions with horizontal fold-in/fold-out transitions between sections.
 *
 * Portaled outside transform context (chrome overlay) so position: fixed works
 * even when sections use CSS transforms.
 *
 * Fold direction is HORIZONTAL, away from center:
 * - Left-aligned cards fold from right edge: inset(0 X% 0 0)
 * - Right-aligned cards fold from left edge: inset(0 0 0 X%)
 */

import { useMemo, useSyncExternalStore } from 'react'
import type { StoreApi } from 'zustand'
import { useExperience } from '../../../../experience'
import type { InfiniteCarouselState } from '../../../../experience/experiences/types'
import { WidgetRenderer } from '../../../../renderer/WidgetRenderer'
import type { FixedCardProps } from './types'
import './styles.css'

/**
 * Calculate fold progress for the CURRENT card (the one whose section is active).
 * Returns 0 = fully open, 1 = fully folded.
 *
 * Timing:
 * 0-25%:   Card stays fully open (breathing room)
 * 25-50%:  Card folds out 0% → 100% folded
 * 50-100%: Fully folded
 */
function currentCardFoldProgress(t: number): number {
  if (t < 0.25) {
    // Breathing room: stay fully open
    return 0
  } else if (t < 0.5) {
    // Folding out: 0 → 1
    return (t - 0.25) / 0.25
  } else {
    // Fully folded
    return 1
  }
}

/**
 * Calculate fold progress for the NEXT card (the one whose section is incoming).
 * Returns 0 = fully open, 1 = fully folded.
 *
 * Timing:
 * 0-75%:   Fully folded
 * 75-100%: Opens from 100% folded → 0% (fully open)
 *
 * This means the card arrives fully open at the start of its own section (t=0).
 */
function nextCardFoldProgress(t: number): number {
  if (t < 0.75) {
    // Fully folded
    return 1
  } else {
    // Opening: 1 → 0
    return 1 - (t - 0.75) / 0.25
  }
}

/**
 * Get fold progress for a card given scroll state.
 * Returns null if card should not be visible at all.
 */
function getCardFoldProgress(
  scrollProgress: number,
  cardSectionIndex: number,
  totalSections: number,
  clipProgress: number,
): number | null {
  if (totalSections === 0) return null

  const currentIndex = Math.floor(scrollProgress)
  const nextIndex = (currentIndex + 1) % totalSections

  if (cardSectionIndex === currentIndex) {
    return currentCardFoldProgress(clipProgress)
  } else if (cardSectionIndex === nextIndex) {
    return nextCardFoldProgress(clipProgress)
  }

  return null
}

export function FixedCard({
  cards,
  centerGap = 90,
}: FixedCardProps) {
  const { store } = useExperience()

  // Cast to infinite carousel store for scrollProgress access
  const carouselStore = store as unknown as StoreApi<InfiniteCarouselState>

  // Subscribe to store state
  const state = useSyncExternalStore(
    carouselStore.subscribe,
    () => carouselStore.getState(),
    () => carouselStore.getState()
  )

  // Check for required state
  const hasCarouselState = 'scrollProgress' in state && 'totalSections' in state
  const scrollProgress = hasCarouselState ? state.scrollProgress : 0
  const totalSections = hasCarouselState ? state.totalSections : 0
  const sectionIds = hasCarouselState && 'sectionIds' in state ? state.sectionIds : []
  const clipProgress = hasCarouselState && 'clipProgress' in state ? state.clipProgress : 0

  // Map card configs to section indices
  const cardWithIndices = useMemo(() => {
    return cards.map(card => ({
      ...card,
      sectionIndex: sectionIds.indexOf(card.sectionId),
    }))
  }, [cards, sectionIds])

  if (!hasCarouselState || totalSections === 0) {
    return null
  }

  return (
    <div className="fixed-card-overlay">
      {cardWithIndices.map((card) => {
        if (card.sectionIndex === -1) return null

        const foldProgress = getCardFoldProgress(
          scrollProgress,
          card.sectionIndex,
          totalSections,
          clipProgress,
        )

        // Not visible at all
        if (foldProgress === null || foldProgress >= 1) return null

        // Horizontal clip-path: fold AWAY from center of viewport
        // Left-aligned cards: fold from right edge → inset(0 X% 0 0)
        // Right-aligned cards: fold from left edge → inset(0 0 0 X%)
        const foldPercent = foldProgress * 100
        const clipPath = card.alignment === 'left'
          ? `inset(0 ${foldPercent}% 0 0)`
          : `inset(0 0 0 ${foldPercent}%)`

        // Opacity fades with fold progress
        const opacity = 1 - foldProgress

        // Position based on alignment
        const positionStyle: React.CSSProperties = card.alignment === 'left'
          ? { right: `calc(50% + ${centerGap}px)` }
          : { left: `calc(50% + ${centerGap}px)` }

        return (
          <div
            key={card.sectionId}
            className="fixed-card"
            data-alignment={card.alignment}
            style={{
              width: card.width,
              height: card.height,
              backgroundColor: card.backgroundColor,
              borderColor: `${card.accentColor}33`,
              borderWidth: 1,
              borderStyle: 'solid',
              clipPath,
              opacity,
              ...positionStyle,
            }}
          >
            <div className="fixed-card__content">
              {card.widgets.map((widget, i) => (
                <WidgetRenderer
                  key={widget.id ?? `fixed-card-widget-${i}`}
                  widget={widget}
                  index={i}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FixedCard
