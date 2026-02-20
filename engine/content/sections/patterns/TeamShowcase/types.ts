/**
 * TeamShowcase section props.
 * Fullscreen video showcase with stacked selectable names.
 * Uses StackVideoShowcase widget internally — members are provided as child widgets
 * via __repeat for CMS hierarchy support.
 */

import type { BaseSectionProps } from '../base'

/**
 * Individual member item (used in storybook previews and preset sample content).
 */
export interface MemberItem {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Optional subtitle (role, title, etc.) */
  subtitle?: string
  /** Video source URL */
  videoSrc: string
  /** Video poster/thumbnail */
  videoPoster?: string
  /** Optional link URL */
  href?: string
}

/**
 * Props for the createTeamShowcaseSection factory.
 */
export interface TeamShowcaseProps extends BaseSectionProps {
  /** Array of member items or binding expression */
  members: MemberItem[] | string
  /** Label text displayed above names (binding-aware) */
  labelText?: string
  /** Inactive member opacity (default: 0.2) */
  inactiveOpacity?: number
  /** Section background color */
  backgroundColor?: string
}
