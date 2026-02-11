/**
 * ProjectTabs section pattern.
 * Tabbed project interface (Projects I Like style).
 */

import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import { createContactBar } from '../../../widgets/patterns'
import type { ProjectTabsProps, ProjectTab } from './types'

/**
 * Creates content widgets for a standard layout tab.
 * Standard layout: Info card on left (2x2), videos grid on right (3 videos).
 */
function createStandardTabContent(tab: ProjectTab, sectionId: string): WidgetSchema[] {
  const tabId = `${sectionId}-tab-${tab.id}`

  const infoCard: WidgetSchema = {
    id: `${tabId}-info`,
    type: 'Box',
    className: 'project-tabs__info-card',
    widgets: [
      { type: 'Text', props: { content: tab.info?.title ?? tab.label, as: 'h3' }, className: 'project-tabs__title' },
      { type: 'Text', props: { content: `Client: ${tab.info?.client ?? ''}`, as: 'p' }, className: 'project-tabs__client' },
      { type: 'Text', props: { content: `Studio: ${tab.info?.studio ?? ''}`, as: 'p' }, className: 'project-tabs__studio' },
      { type: 'Text', props: { content: `Role: ${tab.info?.role ?? ''}`, as: 'p' }, className: 'project-tabs__role' }
    ]
  }

  const videoGrid: WidgetSchema = {
    id: `${tabId}-videos`,
    type: 'Grid',
    className: 'project-tabs__video-grid',
    props: { columns: 1, gap: '0.5rem' },
    widgets: tab.videos.slice(0, 3).map((video, i) => ({
      id: `${tabId}-video-${i}`,
      type: 'Video',
      props: {
        src: video.src,
        hoverPlay: true,
        aspectRatio: '16/9',
        alt: video.title
      }
    }))
  }

  return [{
    id: `${tabId}-content`,
    type: 'Grid',
    className: 'project-tabs__standard-layout',
    props: { columns: 2, gap: '1rem' },
    widgets: [infoCard, videoGrid]
  }]
}

/**
 * Creates content widgets for a compact layout tab.
 * Compact layout: Scrollable 2-row grid with many videos.
 */
function createCompactTabContent(tab: ProjectTab, sectionId: string): WidgetSchema[] {
  const tabId = `${sectionId}-tab-${tab.id}`

  return [{
    id: `${tabId}-content`,
    type: 'Grid',
    className: 'project-tabs__compact-layout',
    props: { columns: 4, gap: '0.5rem' },
    style: { overflowX: 'auto' },
    widgets: tab.videos.map((video, i) => ({
      id: `${tabId}-video-${i}`,
      type: 'Video',
      props: {
        src: video.src,
        hoverPlay: true,
        aspectRatio: '16/9',
        alt: video.title
      }
    }))
  }]
}

export function createProjectTabsSection(props: ProjectTabsProps): SectionSchema {
  const sectionId = props.id ?? 'project-tabs'

  // Build TabbedContent tabs
  // Type assertion needed: TabItem[] contains WidgetSchema[] which TS can't verify as serializable
  const tabbedContent: WidgetSchema = {
    id: `${sectionId}-tabs`,
    type: 'TabbedContent',
    className: 'project-tabs__tabbed-content',
    props: {
      tabs: props.tabs.map(tab => ({
        id: tab.id,
        label: tab.label,
        content: tab.layout === 'compact'
          ? createCompactTabContent(tab, sectionId)
          : createStandardTabContent(tab, sectionId)
      })) as unknown as SerializableValue,
      defaultTab: props.defaultTab ?? props.tabs[0]?.id,
      position: 'top',
      align: 'start'
    }
  }

  // Optional external link (e.g., Instagram)
  const tabBarWidgets: WidgetSchema[] = [tabbedContent]

  if (props.externalLink) {
    tabBarWidgets.push({
      id: `${sectionId}-external-link`,
      type: 'Link',
      className: 'project-tabs__external-link',
      props: {
        href: props.externalLink.href,
        target: '_blank',
        rel: 'noopener noreferrer'
      },
      widgets: [{
        type: 'Icon',
        props: { name: props.externalLink.icon }
      }]
    })
  }

  // ContactBar
  const contactBar = createContactBar({
    id: `${sectionId}-contact`,
    email: props.email,
    textColor: 'light'
  })

  return {
    id: sectionId,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between'
    },
    style: {
      backgroundColor: props.backgroundColor ?? '#000000',
      color: '#fff',
      minHeight: '100dvh',
      padding: '2rem'
    },
    className: 'project-tabs',
    widgets: [...tabBarWidgets, contactBar]
  }
}
