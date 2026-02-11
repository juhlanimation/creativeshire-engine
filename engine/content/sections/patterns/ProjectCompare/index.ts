/**
 * ProjectCompare section pattern.
 * Before/after video comparison (The 21 style).
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { createContactBar } from '../../../widgets/patterns'
import type { ProjectCompareProps } from './types'

export function createProjectCompareSection(props: ProjectCompareProps): SectionSchema {
  const sectionId = props.id ?? 'project-compare'

  // Header with logo
  const header: WidgetSchema = {
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-compare__header',
    props: { direction: 'row', align: 'center' },
    widgets: [{
      id: `${sectionId}-logo`,
      type: 'Image',
      props: {
        src: props.logo.src,
        alt: props.logo.alt,
        decorative: false
      },
      style: { width: props.logo.width ?? 120 }
    }]
  }

  // VideoCompare widget
  const videoCompare: WidgetSchema = {
    id: `${sectionId}-compare`,
    type: 'VideoCompare',
    className: 'project-compare__video',
    props: {
      beforeSrc: props.beforeVideo,
      afterSrc: props.afterVideo,
      beforeLabel: props.beforeLabel,
      afterLabel: props.afterLabel,
      aspectRatio: '16/9',
      initialPosition: 50
    },
    style: {
      backgroundColor: props.videoBackgroundColor ?? '#3B3D2E'
    }
  }

  // Optional description
  const widgets: WidgetSchema[] = [header, videoCompare]

  if (props.description) {
    widgets.push({
      id: `${sectionId}-description`,
      type: 'Text',
      className: 'project-compare__description',
      props: {
        content: props.description,
        as: 'p'
      },
      style: {
        color: props.descriptionColor ?? props.backgroundColor ?? '#FDF9F0'
      }
    })
  }

  // ContactBar
  widgets.push(createContactBar({
    id: `${sectionId}-contact`,
    email: props.email,
    textColor: 'dark'
  }))

  return {
    id: sectionId,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between'
    },
    style: {
      backgroundColor: props.backgroundColor ?? '#FDF9F0',
      minHeight: '100dvh',
      padding: '2rem'
    },
    className: 'project-compare',
    widgets
  }
}
