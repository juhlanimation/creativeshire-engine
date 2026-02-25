/**
 * TeamShowcase section pattern - factory function for member/portfolio showcase.
 * Fullscreen video layer with stacked selectable member names.
 *
 * Uses StackVideoShowcase widget internally. Members are provided as child
 * widgets via __repeat — each appears as an individual entry in the CMS hierarchy.
 *
 * Desktop: Hover on a name to crossfade to that member's video.
 * Mobile: Scroll-based viewport-center detection auto-selects the closest name.
 */

import './components/StackVideoShowcase'  // scoped widget registration
import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import type { TeamShowcaseProps, MemberItem } from './types'
import { isBindingExpression } from '../utils'

/**
 * Creates a TeamShowcase section schema with fullscreen video backdrop and selectable member list.
 *
 * @param props - Team showcase section configuration
 * @returns SectionSchema for the team showcase section
 */
export function createTeamShowcaseSection(props: TeamShowcaseProps): SectionSchema {
  const sectionId = props.id ?? 'team-showcase'

  const showcaseProps: Record<string, SerializableValue> = {}
  if (props.actionPrefix) showcaseProps.actionPrefix = props.actionPrefix
  if (props.labelText != null) showcaseProps.labelText = props.labelText
  if (props.inactiveOpacity != null) showcaseProps.inactiveOpacity = props.inactiveOpacity

  // Build child widgets: binding expression uses __repeat, raw array expands at definition time
  let childWidgets: WidgetSchema[]

  if (isBindingExpression(props.members)) {
    childWidgets = [{
      __repeat: props.members,
      __key: 'name',
      id: `${sectionId}-member`,
      type: 'Box',
      props: {
        name: '{{ item.name }}' as SerializableValue,
        videoSrc: '{{ item.videoSrc }}' as SerializableValue,
        videoPoster: '{{ item.videoPoster }}' as SerializableValue,
        href: '{{ item.portfolioUrl }}' as SerializableValue,
      },
    }]
  } else {
    // Raw array: generate one Box per member (Storybook preview, static presets)
    childWidgets = (props.members as MemberItem[]).map((member) => ({
      id: `${sectionId}-member-${member.id}`,
      type: 'Box' as const,
      props: {
        name: member.name,
        videoSrc: member.videoSrc ?? '',
        videoPoster: member.videoPoster ?? '',
        href: member.href ?? '',
      },
    }))
  }

  return {
    id: sectionId,
    patternId: 'TeamShowcase',
    label: props.label ?? 'Team Showcase',
    constrained: props.constrained,
    colorMode: props.colorMode,
    sectionTheme: props.sectionTheme,
    layout: { type: 'stack', direction: 'column', padding: props.padding ?? 'none' },
    style: {
      backgroundColor: props.backgroundColor,
      overflow: 'hidden',
      ...props.style,
    },
    className: props.className ?? 'team-showcase',
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'auto',
    widgets: [{
      id: `${sectionId}-showcase`,
      type: 'TeamShowcase__StackVideoShowcase',
      props: showcaseProps,
      widgets: childWidgets,
    }],
  }
}
