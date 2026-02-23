/**
 * ProjectGallery section pattern.
 * Main video with selectable thumbnails (Azuki style).
 */

import type { SectionSchema, SerializableValue, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { isBindingExpression } from '../utils'
import type { ProjectGalleryProps } from './types'
import { meta } from './meta'
import './components/FlexGalleryCardRepeater'  // scoped widget registration

/**
 * Creates a ProjectGallery section schema.
 * Layout: header with logo, main video, thumbnail selector, footer.
 *
 * Note: Video switching requires client-side state coordination.
 * The FlexGalleryCardRepeater widget handles thumbnail UI and selection callbacks.
 * Actual video source switching would be handled by a parent component
 * or behaviour that responds to selection changes.
 *
 * @param props - Project gallery section configuration
 * @returns SectionSchema for the project gallery section
 */
export function createProjectGallerySection(rawProps: ProjectGalleryProps): SectionSchema {
  const props = applyMetaDefaults(meta, rawProps)
  const sectionId = props.id ?? 'project-gallery'
  const defaultIndex = props.defaultActiveIndex as number

  // Header with logo
  const header: WidgetSchema = {
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-gallery__header',
    props: {
      direction: 'row',
      align: 'center',
    },
    widgets: [
      {
        id: `${sectionId}-logo`,
        type: 'Image',
        props: {
          src: props.logo.src,
          alt: props.logo.alt,
          decorative: false,
          ...(props.logoFilter ? { filter: props.logoFilter } : {}),
        },
        style: {
          width: props.logo.width ?? 300,
          filter: props.logo.invert ? 'invert(1)' : undefined,
        },
      },
    ],
  }

  // Build video area with selector overlay
  let mainVideo: WidgetSchema
  let selector: WidgetSchema

  // Build selector props with optional customizations
  const selectorProps: Record<string, SerializableValue> = {
    activeIndex: defaultIndex,
    orientation: 'horizontal',
    showInfo: true,
    showPlayingIndicator: props.showPlayingIndicator ?? true,
    showPlayIcon: props.showPlayIcon ?? true,
    showOverlay: props.showOverlay ?? true,
  }
  if (props.thumbnailWidth != null) selectorProps.thumbnailWidth = props.thumbnailWidth
  if (props.activeThumbnailWidth != null) selectorProps.activeThumbnailWidth = props.activeThumbnailWidth
  if (props.accentColor != null) selectorProps.accentColor = props.accentColor
  if (props.thumbnailBorder != null) selectorProps.thumbnailBorder = props.thumbnailBorder
  if (props.thumbnailBorderRadius != null) selectorProps.thumbnailBorderRadius = props.thumbnailBorderRadius

  if (isBindingExpression(props.projects)) {
    // Binding expression: use template for platform expansion
    mainVideo = {
      id: `${sectionId}-main-video`,
      type: 'Video',
      className: 'project-gallery__video',
      props: {
        src: '{{ projects[activeIndex].video }}',
        aspectRatio: '16/9',
      },
    }

    selector = {
      id: `${sectionId}-selector`,
      type: 'ProjectGallery__FlexGalleryCardRepeater',
      className: 'project-gallery__selector',
      props: selectorProps,
      widgets: [{
        __repeat: props.projects,
        id: `${sectionId}-selector-item`,
        type: 'Box',
        props: {
          thumbnail: '{{ item.thumbnail }}',
          title: '{{ item.title }}',
          videoSrc: '{{ item.video }}',
          year: '{{ item.year }}',
          studio: '{{ item.studio }}',
          role: '{{ item.role }}',
          posterTime: '{{ item.posterTime }}',
        },
      }],
    }
  } else {
    // Concrete array: resolve default project
    const defaultProject = props.projects[defaultIndex]

    mainVideo = {
      id: `${sectionId}-main-video`,
      type: 'Video',
      className: 'project-gallery__video',
      props: {
        src: defaultProject?.video ?? '',
        aspectRatio: '16/9',
      },
    }

    selector = {
      id: `${sectionId}-selector`,
      type: 'ProjectGallery__FlexGalleryCardRepeater',
      className: 'project-gallery__selector',
      props: selectorProps,
      widgets: props.projects.map((p) => ({
        id: `${sectionId}-selector-item-${p.id}`,
        type: 'Box',
        props: {
          thumbnail: p.thumbnail,
          title: p.title,
          videoSrc: p.video,
          year: p.year,
          studio: p.studio,
          url: p.url,
        },
      })),
    }
  }

  // Video area wraps video + selector
  const videoArea: WidgetSchema = {
    id: `${sectionId}-video-area`,
    type: 'Box',
    className: 'project-gallery__video-area',
    widgets: [mainVideo, selector],
  }

  const widgets: WidgetSchema[] = [header, videoArea]

  return {
    id: sectionId,
    patternId: 'ProjectGallery',
    label: props.label ?? 'Project Gallery',
    constrained: props.constrained,
    colorMode: props.colorMode,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between',
    },
    style: {
      ...(props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}),
      ...props.style,
    },
    className: props.className ?? 'section-project-gallery',
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'viewport',
    widgets,
  }
}
