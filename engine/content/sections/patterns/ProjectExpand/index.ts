/**
 * ProjectExpand section pattern.
 * Expandable video gallery (Riot Games style).
 *
 * Layout:
 * - Header: Project/client logo (centered or left-aligned)
 * - Gallery: ExpandRowImageRepeater with coordinated hover
 * - Footer: ContactBar with email
 *
 * Reference: Riot Games section from prism preset reference
 */

import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import type { ExpandRowItem } from '../../../widgets/repeaters/ExpandRowImageRepeater/ExpandRowThumbnail/types'
import type { ProjectExpandProps, ExpandableVideoItem } from './types'
import { isBindingExpression } from '../utils'

/**
 * Convert ExpandableVideoItem to ExpandRowItem format.
 * Fills in optional fields with defaults for ExpandRowImageRepeater compatibility.
 */
function toExpandRowItem(item: ExpandableVideoItem): ExpandRowItem {
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
 * Full-height layout with logo header and expandable gallery.
 * Background color and text color come from the preset via `style` prop or theme CSS variables.
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

  // Gallery: ExpandRowImageRepeater with videos
  // Handle binding expressions: if videos is a binding, always render (platform will resolve)
  const hasVideos = isBindingExpression(props.videos) || props.videos.length > 0

  if (hasVideos) {
    // Convert to ExpandRowItem array if not a binding expression
    const projects = isBindingExpression(props.videos)
      ? props.videos
      : props.videos.map(toExpandRowItem)

    widgets.push({
      id: `${sectionId}-gallery`,
      type: 'ExpandRowImageRepeater',
      className: 'project-expand__gallery',
      style: {
        marginTop: 'var(--spacing-lg, 2.25rem)',
      },
      props: {
        projects: projects as unknown as SerializableValue,
        height: props.galleryHeight ?? '32rem',
        gap: 'var(--spacing-xs, 4px)',
        expandedWidth: '32rem',
        transitionDuration: 400,
        cursorLabel: props.cursorLabel ?? 'WATCH',
      },
      // Event wiring from preset (e.g., click → modal.open)
      ...(props.galleryOn ? { on: props.galleryOn } : {}),
    })
  }

  return {
    id: sectionId,
    patternId: 'ProjectExpand',
    label: props.label ?? 'Project Expand',
    constrained: props.constrained,
    colorMode: props.colorMode,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between',
      align: 'stretch',
    },
    style: {
      ...props.style,
    },
    className: props.className ?? 'section-project-expand',
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'viewport',
    widgets,
  }
}

export type { ProjectExpandProps, ExpandableVideoItem, LogoConfig } from './types'
