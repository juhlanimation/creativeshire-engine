/**
 * ProjectScroll pattern - sticky sidebar + scrollable project cards.
 *
 * Structure:
 * - Flex row: sidebar (sticky, left) + cards column (right)
 * - Sidebar: title + intro + project index links
 * - Cards: stack of ProjectScroll__ScrollCard scoped widgets
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { isBindingExpression } from '../utils'
import type { ProjectScrollProps } from './types'
import { meta } from './meta'

// Side-effect import: register scoped widget
import './components/ScrollCard'

const SIDEBAR_WIDTHS = { narrow: '30%', default: '38%', wide: '45%' }

export function createProjectScrollSection(rawProps?: ProjectScrollProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings
  const sectionTitle = rawProps?.sectionTitle ?? '{{ content.projects.sectionTitle }}'
  const introText = rawProps?.introText ?? '{{ content.projects.introText }}'
  const projects = rawProps?.projects ?? '{{ content.projects.projects }}'

  // Settings
  const sidebarWidth = SIDEBAR_WIDTHS[(p.sidebarWidth as keyof typeof SIDEBAR_WIDTHS) ?? 'default']
  const cardBorder = p.cardBorder as boolean
  const fadeOverlay = p.fadeOverlay as boolean

  // Typography
  const titleScale = 'h3'
  const introScale = 'small'

  // Build project index links (sidebar)
  let indexWidgets: WidgetSchema[]
  if (isBindingExpression(projects)) {
    indexWidgets = [{
      __repeat: projects,
      id: 'index-link',
      type: 'Text',
      props: { content: '{{ item.title }}', as: 'small' },
      className: 'section-project-scroll__index-item',
    }]
  } else {
    const projectData = projects as Array<{ title: string }>
    indexWidgets = projectData.map((proj, i) => ({
      id: `index-${i}`,
      type: 'Text' as const,
      props: { content: proj.title, as: 'small' },
      className: 'section-project-scroll__index-item',
    }))
  }

  // Build project cards
  let cardWidgets: WidgetSchema[]
  if (isBindingExpression(projects)) {
    cardWidgets = [{
      __repeat: projects,
      id: 'project-card',
      type: 'ProjectScroll__ScrollCard',
      props: {
        title: '{{ item.title }}',
        client: '{{ item.client }}',
        description: '{{ item.description }}',
        imageSrc: '{{ item.imageSrc }}',
        videoSrc: '{{ item.videoSrc }}',
        cardBorder,
      },
    }]
  } else {
    const projectData = projects as Array<{
      title: string; client: string; description: string;
      imageSrc: string; videoSrc?: string
    }>
    cardWidgets = projectData.map((proj, i) => ({
      id: `card-${i}`,
      type: 'ProjectScroll__ScrollCard' as const,
      props: {
        title: proj.title,
        client: proj.client,
        description: proj.description,
        imageSrc: proj.imageSrc,
        ...(proj.videoSrc && { videoSrc: proj.videoSrc }),
        cardBorder,
      },
    }))
  }

  const widgets: WidgetSchema[] = [
    {
      id: 'project-layout',
      type: 'Flex',
      props: { direction: 'row', gap: 48 },
      className: 'section-project-scroll__layout',
      widgets: [
        // Sidebar
        {
          id: 'project-sidebar',
          type: 'Stack',
          props: { gap: 24 },
          className: 'section-project-scroll__sidebar',
          style: { width: sidebarWidth, flexShrink: 0 } as CSSProperties,
          widgets: [
            {
              id: 'project-title',
              type: 'Text',
              props: { content: sectionTitle, as: titleScale },
              className: 'section-project-scroll__title',
              style: { fontSize: 'clamp(48px, 5cqw, 72px)' } as CSSProperties,
            },
            {
              id: 'project-intro',
              type: 'Text',
              props: { content: introText, as: introScale },
              className: 'section-project-scroll__intro',
            },
            {
              id: 'project-index',
              type: 'Stack',
              props: { gap: 8 },
              className: 'section-project-scroll__index',
              widgets: indexWidgets,
            },
          ],
        },
        // Cards column
        {
          id: 'project-cards',
          type: 'Stack',
          props: { gap: 0 },
          className: fadeOverlay
            ? 'section-project-scroll__cards section-project-scroll__cards--fade'
            : 'section-project-scroll__cards',
          style: { flex: 1 } as CSSProperties,
          widgets: cardWidgets,
        },
      ],
    },
  ]

  return {
    id: p.id ?? 'project-scroll',
    patternId: 'ProjectScroll',
    label: p.label ?? 'Projects',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode ?? 'dark',
    sectionTheme: p.sectionTheme,
    layout: { type: 'stack', direction: 'column', align: 'stretch' },
    style: p.style,
    className: p.className,
    paddingTop: p.paddingTop ?? 80,
    paddingBottom: p.paddingBottom ?? 80,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'auto',
    widgets,
  }
}
