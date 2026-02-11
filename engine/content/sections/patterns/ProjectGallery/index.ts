/**
 * ProjectGallery section pattern.
 * Main video with selectable thumbnails (Azuki style).
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { createContactBar } from '../../../widgets/patterns'
import { isBindingExpression } from '../utils'
import type { ProjectGalleryProps } from './types'

/**
 * Creates a ProjectGallery section schema.
 * Layout: header with logo, main video, thumbnail selector, contact bar.
 *
 * Note: Video switching requires client-side state coordination.
 * The ProjectSelector widget handles thumbnail UI and selection callbacks.
 * Actual video source switching would be handled by a parent component
 * or behaviour that responds to selection changes.
 *
 * @param props - Project gallery section configuration
 * @returns SectionSchema for the project gallery section
 */
export function createProjectGallerySection(props: ProjectGalleryProps): SectionSchema {
  const sectionId = props.id ?? 'project-gallery'
  const defaultIndex = props.defaultActiveIndex ?? 0

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
        },
        style: {
          width: props.logo.width ?? 300,
          filter: props.logo.invert ? 'invert(1)' : undefined,
        },
      },
    ],
  }

  // Build main content based on binding or concrete array
  let mainVideo: WidgetSchema
  let selector: WidgetSchema

  if (isBindingExpression(props.projects)) {
    // Binding expression: use template for platform expansion
    mainVideo = {
      id: `${sectionId}-main-video`,
      type: 'Video',
      className: 'project-gallery__video',
      props: {
        src: '{{ projects[activeIndex].video }}',
        autoplay: true,
        loop: true,
        muted: true,
        aspectRatio: '16/9',
      },
    }

    selector = {
      id: `${sectionId}-selector`,
      type: 'ProjectSelector',
      className: 'project-gallery__selector',
      props: {
        projects: props.projects, // Pass binding through
        activeIndex: defaultIndex,
        orientation: 'horizontal',
        showInfo: true,
      },
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
        autoplay: true,
        loop: true,
        muted: true,
        aspectRatio: '16/9',
      },
    }

    selector = {
      id: `${sectionId}-selector`,
      type: 'ProjectSelector',
      className: 'project-gallery__selector',
      props: {
        projects: props.projects.map((p) => ({
          id: p.id,
          thumbnail: p.thumbnail,
          title: p.title,
          year: p.year,
          studio: p.studio,
          url: p.url,
        })),
        activeIndex: defaultIndex,
        orientation: 'horizontal',
        showInfo: true,
      },
    }
  }

  // ContactBar
  const contactBar = createContactBar({
    id: `${sectionId}-contact`,
    email: props.email,
    textColor: props.textColor ?? 'light',
  })

  return {
    id: sectionId,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between',
    },
    style: {
      backgroundColor: props.backgroundColor ?? '#C03540',
      color: props.textColor === 'dark' ? '#000' : '#fff',
      minHeight: '100dvh',
      padding: '2rem',
    },
    className: 'project-gallery',
    widgets: [header, mainVideo, selector, contactBar],
  }
}
