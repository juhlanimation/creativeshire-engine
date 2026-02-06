/**
 * MemberGallery section pattern - factory function for member/portfolio showcase.
 * Fullscreen video layer with list of selectable members.
 *
 * Structure:
 * - Video layer (fullscreen, multiple videos that crossfade)
 * - Names overlay (positioned list of member names)
 *
 * Selection modes:
 * - hover: Desktop - hovering a name switches the video
 * - scroll: Mobile - viewport-center detection switches the video
 * - auto: Responsive - uses hover on desktop, scroll on mobile
 *
 * Styling is configurable via props.styles, with sensible defaults.
 * Presets define site-specific styles; content comes from site data.
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import type { MemberGalleryProps, MemberItem } from './types'
import { DEFAULT_MEMBER_GALLERY_STYLES } from './types'
import { isBindingExpression } from '../utils'

/**
 * Merge two style objects.
 */
function mergeStyles(base?: CSSProperties, override?: CSSProperties): CSSProperties {
  if (!override) return base ?? {}
  if (!base) return override
  return { ...base, ...override }
}

/**
 * Build member name widgets.
 */
function buildMemberNameWidgets(
  members: MemberItem[],
  styles: { name?: CSSProperties; subtitle?: CSSProperties },
  sectionId: string
): WidgetSchema[] {
  return members.map((member, index) => {
    const widgets: WidgetSchema[] = [
      {
        id: `${sectionId}-member-${member.id}-name`,
        type: 'Text',
        props: {
          content: member.name,
          as: 'span'
        },
        style: styles.name
      }
    ]

    if (member.subtitle) {
      widgets.push({
        id: `${sectionId}-member-${member.id}-subtitle`,
        type: 'Text',
        props: {
          content: member.subtitle,
          as: 'span'
        },
        style: styles.subtitle
      })
    }

    const wrapper: WidgetSchema = {
      id: `${sectionId}-member-${member.id}`,
      type: 'Flex',
      props: {
        direction: 'column',
        gap: '0.25rem',
        'data-member-index': index,
        'data-member-id': member.id
      },
      behaviour: 'hover/reveal',
      'data-effect': 'member-select',
      widgets
    }

    // Wrap in Link if href provided
    if (member.href) {
      return {
        id: `${sectionId}-member-${member.id}-link`,
        type: 'Link',
        props: {
          href: member.href
        },
        widgets: [wrapper]
      }
    }

    return wrapper
  })
}

/**
 * Build video layer widgets.
 */
function buildVideoLayerWidgets(
  members: MemberItem[],
  sectionId: string,
  crossfadeDuration: number
): WidgetSchema[] {
  return members.map((member, index) => ({
    id: `${sectionId}-video-${member.id}`,
    type: 'Video',
    props: {
      src: member.videoSrc,
      poster: member.videoPoster,
      autoplay: true,
      loop: true,
      muted: true,
      background: true,
      'data-member-index': index,
      'data-member-id': member.id
    },
    'data-effect': 'media-crossfade',
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: index === 0 ? 1 : 0,
      transition: `opacity ${crossfadeDuration}ms ease`,
      zIndex: index === 0 ? 1 : 0
    }
  }))
}

/**
 * Creates a MemberGallery section schema with fullscreen video backdrop and selectable member list.
 *
 * @param props - Member gallery section configuration (content + optional styles)
 * @returns SectionSchema for the member gallery section
 */
export function createMemberGallerySection(props: MemberGalleryProps): SectionSchema {
  const sectionId = props.id ?? 'member-gallery'
  const crossfadeDuration = props.crossfadeDuration ?? 400

  // Merge provided styles with defaults
  const styles = {
    name: mergeStyles(DEFAULT_MEMBER_GALLERY_STYLES.name, props.styles?.name),
    subtitle: mergeStyles(DEFAULT_MEMBER_GALLERY_STYLES.subtitle, props.styles?.subtitle),
    title: mergeStyles(DEFAULT_MEMBER_GALLERY_STYLES.title, props.styles?.title)
  }

  // Check if using binding expression
  const isBinding = isBindingExpression(props.members)

  // Main widgets array
  const widgets: WidgetSchema[] = []

  // Video layer container
  if (isBinding) {
    // Dynamic binding - use MemberGalleryVideos widget
    widgets.push({
      id: `${sectionId}-videos`,
      type: 'MemberGalleryVideos',
      props: {
        members: props.members as SerializableValue,
        crossfadeDuration,
        initialIndex: props.initialIndex ?? 0
      },
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 0
      }
    })
  } else {
    // Static array - build video widgets
    widgets.push({
      id: `${sectionId}-video-layer`,
      type: 'Box',
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden'
      },
      widgets: buildVideoLayerWidgets(
        props.members as MemberItem[],
        sectionId,
        crossfadeDuration
      )
    })
  }

  // Names overlay container
  const namesContainerStyle: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    padding: 'var(--section-padding, 2rem)'
  }

  // Position-specific styles
  switch (props.namesPosition) {
    case 'left':
      Object.assign(namesContainerStyle, {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: '50%'
      })
      break
    case 'right':
      Object.assign(namesContainerStyle, {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: '50%'
      })
      break
    case 'bottom':
      Object.assign(namesContainerStyle, {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
      })
      break
    case 'overlay':
    default:
      Object.assign(namesContainerStyle, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh'
      })
  }

  // Build names content
  const namesContent: WidgetSchema[] = []

  // Title if provided
  if (props.title) {
    namesContent.push({
      id: `${sectionId}-title`,
      type: 'Text',
      props: {
        content: props.title,
        as: 'h2'
      },
      style: {
        ...styles.title,
        marginBottom: '2rem'
      }
    })
  }

  // Member names list
  if (isBinding) {
    // Dynamic binding - use MemberGalleryNames widget
    namesContent.push({
      id: `${sectionId}-names`,
      type: 'MemberGalleryNames',
      props: {
        members: props.members as SerializableValue,
        direction: props.namesDirection ?? 'column',
        gap: props.namesGap ?? '1rem',
        selectionMode: props.selectionMode ?? 'auto'
      },
      style: styles.name
    })
  } else {
    // Static array - build name widgets
    namesContent.push({
      id: `${sectionId}-names-list`,
      type: 'Flex',
      props: {
        direction: props.namesDirection ?? 'column',
        gap: props.namesGap ?? '1rem'
      },
      widgets: buildMemberNameWidgets(
        props.members as MemberItem[],
        styles,
        sectionId
      )
    })
  }

  widgets.push({
    id: `${sectionId}-names-container`,
    type: 'Box',
    style: namesContainerStyle,
    widgets: namesContent
  })

  return {
    id: sectionId,
    layout: {
      type: 'stack',
      direction: 'column'
    },
    style: {
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: props.backgroundColor ?? 'black',
      overflow: 'hidden'
    },
    className: 'member-gallery',
    widgets
  }
}
