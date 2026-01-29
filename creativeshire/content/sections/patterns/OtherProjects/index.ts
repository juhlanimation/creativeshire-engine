/**
 * OtherProjectsSection pattern - factory function for expandable thumbnail gallery.
 * Horizontal gallery with expand-on-hover behavior (hidden on mobile).
 *
 * Layout:
 * - Header: Title + year range (small caps, left-aligned)
 * - Gallery: ExpandableGalleryRow with coordinated hover
 *
 * Reference: bojuhl.com "Other Selected Projects" section
 */

import type { SectionSchema, WidgetSchema } from '@/creativeshire/schema'
import type { OtherProjectsProps } from './types'

/**
 * Creates an OtherProjectsSection schema with expandable gallery.
 * White background, hidden on mobile, visible as horizontal gallery on tablet+.
 *
 * @param props - Other projects section configuration
 * @returns SectionSchema for the other projects section
 */
export function createOtherProjectsSection(props: OtherProjectsProps): SectionSchema {
  const widgets: WidgetSchema[] = []

  // Header: Title + year range (stacked, text-right aligned)
  // Reference: flex flex-col (default stretch) with text-right on children
  if (props.heading || props.yearRange) {
    widgets.push({
      id: 'other-projects-header',
      type: 'Flex',
      className: 'other-projects-header',
      props: {
        direction: 'column',
        align: 'stretch',
        gap: 0,
      },
      widgets: [
        ...(props.heading ? [{
          id: 'other-projects-heading',
          type: 'Text' as const,
          props: { content: props.heading, as: 'h2' as const },
          className: 'other-projects-heading',
        }] : []),
        ...(props.yearRange ? [{
          id: 'other-projects-year-range',
          type: 'Text' as const,
          props: { content: props.yearRange, as: 'span' as const },
          className: 'other-projects-year-range',
        }] : []),
      ],
    })
  }

  // Gallery: ExpandableGalleryRow with projects
  if (props.projects.length > 0) {
    widgets.push({
      id: 'other-projects-gallery',
      type: 'ExpandableGalleryRow',
      props: {
        projects: props.projects,
        height: '32rem',
        gap: '4px',
        expandedWidth: '32rem',
        transitionDuration: 400,
        cursorLabel: 'WATCH',
      },
    })
  }

  return {
    id: props.id ?? 'other-projects',
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'stretch',
      gap: 0, // Margins handle spacing - header has mb-8, gallery has mt-9
    },
    style: {
      backgroundColor: '#ffffff',
      color: '#000000',
    },
    className: 'other-projects-section',
    widgets,
  }
}
