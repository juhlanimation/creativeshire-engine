/**
 * FixedCard overlay props.
 * Renders glassmorphic cards at fixed viewport positions,
 * with clip-path fold animations driven by scroll progress.
 */

import type { WidgetSchema } from '../../../../schema'

/**
 * Configuration for a single card instance.
 */
export interface CardConfig {
  /** Section ID this card belongs to (matches SectionSchema.id) */
  sectionId: string
  /** Card alignment relative to viewport center */
  alignment: 'left' | 'right'
  /** Card width in pixels */
  width: number
  /** Card height in pixels */
  height: number
  /** Card background color (usually rgba with alpha for glassmorphism) */
  backgroundColor: string
  /** Accent color for borders and highlights */
  accentColor: string
  /** Widget schemas for card content (rendered via WidgetRenderer) */
  widgets: WidgetSchema[]
}

/**
 * Props for the FixedCard chrome overlay.
 */
export interface FixedCardProps {
  /** Card configurations — each card is bound to a section */
  cards: CardConfig[]
  /** Gap between viewport center and card edge in pixels (default: 90) */
  centerGap?: number
}
