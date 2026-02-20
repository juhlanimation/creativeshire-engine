/**
 * ProjectTabs section pattern.
 * Tabbed project interface (Projects I Like style).
 */

import './components/TabbedContent'  // scoped widget registration

import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import type { SettingConfig } from '../../../../schema/settings'
import { extractDefaults } from '../../../../schema/settings'
import type { TextElement } from '../../../widgets/primitives/Text/types'
import { isBindingExpression } from '../utils'
import type { ProjectTabsProps, ProjectTab } from './types'
import { meta } from './meta'

/** Meta-derived defaults — single source of truth for factory fallbacks. */
const d = extractDefaults(meta.settings as Record<string, SettingConfig>)

/**
 * Creates content widgets for a standard layout tab.
 * Standard layout: Info card on left (2x2), videos grid on right (3 videos).
 */
function createStandardTabContent(
  tab: ProjectTab,
  sectionId: string,
  scales: { title: TextElement; client: TextElement; studio: TextElement; role: TextElement }
): WidgetSchema[] {
  const tabId = `${sectionId}-tab-${tab.id}`

  const infoCard: WidgetSchema = {
    id: `${tabId}-info`,
    type: 'Box',
    className: 'project-tabs__info-card',
    widgets: [
      { type: 'Text', props: { content: tab.info?.title ?? tab.label, as: scales.title }, className: 'project-tabs__title' },
      { type: 'Text', props: { content: `Client: ${tab.info?.client ?? ''}`, as: scales.client }, className: 'project-tabs__client' },
      { type: 'Text', props: { content: `Studio: ${tab.info?.studio ?? ''}`, as: scales.studio }, className: 'project-tabs__studio' },
      { type: 'Text', props: { content: `Role: ${tab.info?.role ?? ''}`, as: scales.role }, className: 'project-tabs__role' }
    ]
  }

  const videoGrid: WidgetSchema = {
    id: `${tabId}-videos`,
    type: 'Grid',
    className: 'project-tabs__video-grid',
    props: { columns: 1 },
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
    props: { columns: 2 },
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
    props: { columns: 4 },
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

  // Resolve text scales
  const tabScales = {
    title: props.titleScale ?? (d.titleScale as TextElement),
    client: props.clientScale ?? (d.clientScale as TextElement),
    studio: props.studioScale ?? (d.studioScale as TextElement),
    role: props.roleScale ?? (d.roleScale as TextElement),
  }

  const tabBarWidgets: WidgetSchema[] = []

  if (isBindingExpression(props.tabs)) {
    // Binding expression mode: use TabbedContent with __repeat
    tabBarWidgets.push({
      id: `${sectionId}-tabs`,
      type: 'ProjectTabs__TabbedContent',
      className: 'project-tabs__container',
      props: {
        defaultTab: props.defaultTab,
        position: 'top',
        align: props.tabAlign ?? 'center',
      },
      widgets: [
        {
          __repeat: props.tabs,
          id: 'tab-panel',
          type: 'Box',
          props: {
            'data-tab-id': '{{ item.id }}',
            'data-tab-label': '{{ item.label }}',
          },
          className: 'tabbed-content__panel',
          widgets: [
            {
              __repeat: '{{ item.videos }}',
              id: 'tab-video',
              type: 'Video',
              props: {
                src: '{{ item.src }}',
                alt: '{{ item.title }}',
                hoverPlay: true,
              },
            },
          ],
        },
      ],
    })
  } else {
    // Concrete array mode: build tabs at definition time
    const tabbedContent: WidgetSchema = {
      id: `${sectionId}-tabs`,
      type: 'ProjectTabs__TabbedContent',
      className: 'project-tabs__tabbed-content',
      props: {
        tabs: (props.tabs as ProjectTab[]).map(tab => ({
          id: tab.id,
          label: tab.label,
          content: tab.layout === 'compact'
            ? createCompactTabContent(tab, sectionId)
            : createStandardTabContent(tab, sectionId, tabScales)
        })) as unknown as SerializableValue,
        defaultTab: props.defaultTab ?? (props.tabs as ProjectTab[])[0]?.id,
        position: 'top',
        align: props.tabAlign ?? 'center'
      }
    }
    tabBarWidgets.push(tabbedContent)
  }

  // Optional external link (e.g., Instagram)
  if (props.externalLink) {
    const link = props.externalLink
    if ('icon' in link) {
      // ExternalLink interface
      tabBarWidgets.push({
        id: `${sectionId}-external-link`,
        type: 'Link',
        className: 'project-tabs__external-link',
        props: {
          href: link.href,
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        widgets: [{
          type: 'Icon',
          props: { name: link.icon }
        }]
      })
    } else {
      // Binding-compatible { url, label } format
      tabBarWidgets.push({
        id: `${sectionId}-external`,
        type: 'Link',
        className: 'project-tabs__external-link',
        props: {
          href: link.url,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        widgets: [{
          type: 'Text',
          props: { content: link.label },
        }]
      })
    }
  }

  return {
    id: sectionId,
    patternId: 'ProjectTabs',
    label: props.label ?? 'Project Tabs',
    constrained: props.constrained,
    colorMode: props.colorMode,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between',
      padding: props.padding ?? 'normal',
    },
    style: {
      ...props.style,
    },
    className: ['section-project-tabs', props.className].filter(Boolean).join(' '),
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'viewport',
    widgets: tabBarWidgets
  }
}
