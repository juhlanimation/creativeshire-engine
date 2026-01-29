/**
 * Section component types.
 * Re-exports schema types and defines component-specific interfaces.
 */

import type { ReactNode, CSSProperties } from 'react'
import type { SectionSchema, LayoutConfig } from '../../schema/section'
import type { WidgetSchema } from '../../schema/widget'

/**
 * Props for the Section component.
 * Extends SectionSchema and adds children for rendered widgets.
 */
export interface SectionProps extends SectionSchema {
  /** Rendered widget children from SectionRenderer */
  children?: ReactNode
}

/**
 * Layout style mappings for CSS class generation.
 */
export interface LayoutStyles {
  display: 'flex' | 'grid'
  flexDirection?: 'row' | 'column'
  alignItems?: string
  justifyContent?: string
  gap?: string
  gridTemplateColumns?: string
  gridTemplateRows?: string
}

/**
 * Maps layout align values to CSS align-items values.
 */
export const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const

/**
 * Maps layout justify values to CSS justify-content values.
 */
export const JUSTIFY_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
} as const

// Re-export schema types for convenience
export type { SectionSchema, LayoutConfig, WidgetSchema, CSSProperties }
