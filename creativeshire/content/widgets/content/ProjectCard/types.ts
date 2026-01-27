/**
 * ProjectCard widget props interface.
 * Featured project display with thumbnail, metadata, and description.
 */

import type { FeatureSet } from '../../../../schema/features'

/**
 * Props for the ProjectCard widget.
 */
export interface ProjectCardProps {
  /** Thumbnail image source */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt: string
  /** Video source for playback (optional) */
  videoSrc?: string

  /** Client name (e.g., "RIOT GAMES") */
  client: string
  /** Studio name (e.g., "SUN CREATURE") */
  studio: string

  /** Project title */
  title: string
  /** Project description */
  description: string
  /** Project year */
  year: string
  /** Role in project */
  role: string

  /** WATCH label text (default: "WATCH") */
  watchLabel?: string
  /** Click handler for video modal trigger */
  onWatch?: () => void
  /** Whether to reverse layout (thumbnail right, content left) */
  reversed?: boolean

  /** Static styling features */
  features?: FeatureSet
  /** Additional CSS class names */
  className?: string
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}
