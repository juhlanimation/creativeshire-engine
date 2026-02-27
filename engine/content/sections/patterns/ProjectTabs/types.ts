/**
 * ProjectTabs section props.
 * Tabbed project interface (Projects I Like style).
 */

import type { BaseSectionProps } from '../base'

export interface TabVideo {
  /** Video source URL */
  src: string
  /** Video title */
  title: string
}

export interface ProjectTabInfo {
  /** Project title */
  title: string
  /** Client name */
  client: string
  /** Studio name */
  studio: string
  /** Role in project */
  role: string
}

export interface ProjectTab {
  /** Unique tab identifier */
  id: string
  /** Tab label */
  label: string
  /** Layout type */
  layout: 'standard' | 'compact'
  /** Project info (for standard layout) */
  info?: ProjectTabInfo
  /** Videos for this tab */
  videos: TabVideo[]
}

export interface ExternalLink {
  /** Link URL */
  href: string
  /** Icon name (e.g., 'instagram') */
  icon: string
}

export interface ProjectTabsProps extends BaseSectionProps {
  /** Tabs configuration — supports binding expressions for dynamic tabs */
  tabs: ProjectTab[] | string
  /** Default active tab ID */
  defaultTab?: string
  /** Tab alignment */
  tabAlign?: 'start' | 'center' | 'end'
  /** External link in tab bar (optional) — supports binding expressions */
  externalLink?: ExternalLink | { url: string; label: string }

}
