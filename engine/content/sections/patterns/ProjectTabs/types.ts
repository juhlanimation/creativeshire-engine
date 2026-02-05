/**
 * ProjectTabs section props.
 * Tabbed project interface (Projects I Like style).
 */

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

export interface ProjectTabsProps {
  /** Section ID */
  id?: string
  /** Tabs configuration */
  tabs: ProjectTab[]
  /** Default active tab ID */
  defaultTab?: string
  /** External link in tab bar (optional) */
  externalLink?: ExternalLink
  /** Background color */
  backgroundColor?: string
  /** Contact email */
  email: string
}
