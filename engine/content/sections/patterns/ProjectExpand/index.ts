/**
 * ProjectExpand section pattern.
 * Expandable video gallery (Riot Games style).
 *
 * Layout:
 * - Header: Project/client logo (centered or left-aligned)
 * - Gallery: ExpandableGalleryRow with coordinated hover
 * - Footer: ContactBar with email
 *
 * Reference: Riot Games section from bishoy-gendi-portfolio
 */

import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import type { GalleryProject } from '../../../widgets/interactive/GalleryThumbnail'
import { createContactBar } from '../../../widgets/patterns'
import type { ProjectExpandProps, ExpandableVideoItem } from './types'
import { isBindingExpression } from '../utils'

/**
 * Convert ExpandableVideoItem to GalleryProject format.
 * Fills in optional fields with defaults for ExpandableGalleryRow compatibility.
 */
function toGalleryProject(item: ExpandableVideoItem): GalleryProject {
  return {
    id: item.id,
    thumbnailSrc: item.thumbnailSrc,
    thumbnailAlt: item.thumbnailAlt,
    videoSrc: item.videoSrc,
    videoUrl: item.videoUrl,
    title: item.title,
    client: item.client ?? '',
    studio: item.studio ?? '',
    year: item.year ?? '',
    role: item.role ?? '',
  }
}

/**
 * Creates a ProjectExpand section schema with expandable video gallery.
 * Dark background, full-height layout with logo header and contact footer.
 *
 * @param props - Project expand section configuration
 * @returns SectionSchema for the project expand section
 */
export function createProjectExpandSection(props: ProjectExpandProps): SectionSchema {
  const sectionId = props.id ?? 'project-expand'
  const widgets: WidgetSchema[] = []

  // Header: Logo (centered)
  widgets.push({
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-expand__header',
    props: {
      direction: 'row',
      align: 'center',
      justify: 'center',
    },
    widgets: [{
      id: `${sectionId}-logo`,
      type: 'Image',
      props: {
        src: props.logo.src,
        alt: props.logo.alt,
        decorative: false,
      },
      style: {
        width: props.logo.width ?? 120,
        height: 'auto',
        filter: props.logo.invert ? 'invert(1)' : undefined,
      },
    }],
  })

  // Gallery: ExpandableGalleryRow with videos
  // Handle binding expressions: if videos is a binding, always render (platform will resolve)
  const hasVideos = isBindingExpression(props.videos) || props.videos.length > 0

  if (hasVideos) {
    // Convert to GalleryProject array if not a binding expression
    const projects = isBindingExpression(props.videos)
      ? props.videos
      : props.videos.map(toGalleryProject)

    widgets.push({
      id: `${sectionId}-gallery`,
      type: 'ExpandableGalleryRow',
      className: 'project-expand__gallery',
      props: {
        projects: projects as unknown as SerializableValue,
        height: '32rem',
        gap: '4px',
        expandedWidth: '32rem',
        transitionDuration: 400,
        cursorLabel: 'WATCH',
      },
      style: {
        backgroundColor: props.videoBackgroundColor ?? '#1F1F1F',
      },
      // Wire click to open-video-modal action for thumbnail clicks
      on: { click: 'open-video-modal' },
    })
  }

  // Footer: ContactBar
  const contactBar = createContactBar({
    id: `${sectionId}-contact`,
    email: props.email,
    prompt: props.contactPrompt,
    textColor: 'light',
    align: 'end',
  })
  widgets.push(contactBar)

  return {
    id: sectionId,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between',
      align: 'stretch',
    },
    style: {
      backgroundColor: props.backgroundColor ?? '#0B0A0A',
      color: '#ffffff',
      minHeight: '100dvh',
      padding: '2rem',
    },
    className: 'project-expand',
    widgets,
  }
}

export type { ProjectExpandProps, ExpandableVideoItem, LogoConfig } from './types'
