/**
 * OtherProjectsSection pattern - factory function for expandable thumbnail gallery.
 * Horizontal gallery with expand-on-hover behavior (hidden on mobile).
 *
 * Layout:
 * - Header: Title + year range (small caps, left-aligned)
 * - Gallery: ExpandRowImageRepeater with coordinated hover
 *
 * "Other Selected Projects" expandable gallery section.
 */

import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { ProjectStripProps } from './types'
import { isBindingExpression } from '../utils'
import { meta } from './meta'

/**
 * Creates an OtherProjectsSection schema with expandable gallery.
 * White background, hidden on mobile, visible as horizontal gallery on tablet+.
 *
 * @param props - Other projects section configuration
 * @returns SectionSchema for the other projects section
 */
export function createProjectStripSection(rawProps?: ProjectStripProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings: check rawProps to avoid meta defaults suppressing bindings
  const heading = rawProps?.heading ?? '{{ content.projects.otherHeading }}'
  const yearRange = rawProps?.yearRange ?? '{{ content.projects.yearRange }}'
  const projects = rawProps?.projects ?? '{{ content.projects.other }}'
  const galleryOn = p.galleryOn ?? { click: 'modal.open' }

  // Settings: auto-filled by applyMetaDefaults
  const headingScale = p.headingScale as string
  const yearRangeScale = p.yearRangeScale as string

  const widgets: WidgetSchema[] = []

  // Header: Title + year range (stacked, text-right aligned)
  // Reference: flex flex-col (default stretch) with text-right on children
  if (heading || yearRange) {
    widgets.push({
      id: 'other-projects-header',
      type: 'Flex',
      className: 'other-projects-header',
      props: {
        direction: 'column',
        align: 'stretch',
        gap: 0,
      },
      style: {
        width: 'fit-content',
        marginRight: 'auto',
        marginLeft: 0,
      },
      widgets: [
        ...(heading ? [{
          id: 'other-projects-heading',
          type: 'Text' as const,
          props: { content: heading, as: headingScale },
          className: 'other-projects-heading',
        }] : []),
        ...(yearRange ? [{
          id: 'other-projects-year-range',
          type: 'Text' as const,
          props: { content: yearRange, as: yearRangeScale },
          className: 'other-projects-year-range',
        }] : []),
      ],
    })
  }

  // Gallery: ExpandRowImageRepeater with projects
  // Handle binding expressions: if projects is a binding, always render (platform will resolve)
  const hasProjects = isBindingExpression(projects) || (projects as any[]).length > 0

  if (hasProjects) {
    widgets.push({
      id: 'other-projects-gallery',
      type: 'ExpandRowImageRepeater',
      style: {
        marginTop: 'var(--spacing-lg, 2.25rem)',
      },
      props: {
        // Type assertion needed: OtherProject[] is serializable but TS can't infer it
        // Also handles binding expressions which are strings
        projects: projects as unknown as SerializableValue,
        height: '32rem',
        gap: '4px',
        expandedWidth: '32rem',
        transitionDuration: 400,
        cursorLabel: 'WATCH',
      },
      // Event wiring from preset (e.g., click → modal.open)
      on: galleryOn,
    })
  }

  return {
    id: p.id ?? 'other-projects',
    patternId: 'ProjectStrip',
    label: p.label ?? 'Other Projects',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode,
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'stretch',
      gap: 0, // Margins handle spacing - header has mb-8, gallery has mt-9
      padding: 'var(--spacing-2xl, 4rem) var(--spacing-sm, 0.5rem)',
    },
    style: p.style,
    className: p.className ?? 'other-projects-section',
    paddingTop: p.paddingTop,
    paddingBottom: p.paddingBottom,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight,
    widgets,
  }
}
