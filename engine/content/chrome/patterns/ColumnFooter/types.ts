/**
 * ColumnFooter chrome pattern types.
 * Multi-column footer with divider line and staggered reveal.
 */

import type { CSSProperties } from 'react'

export interface FooterColumn {
  heading: string
  items: Array<{ label: string; href?: string; type?: 'link' | 'text' }>
}

export interface ColumnFooterProps {
  // === Content ===
  columns?: FooterColumn[] | string
  copyright?: string

  // === Settings ===
  showDivider?: boolean
  columnCount?: number
  lastColumnAlign?: 'auto' | 'end'

  // === Layout ===
  style?: CSSProperties
}
