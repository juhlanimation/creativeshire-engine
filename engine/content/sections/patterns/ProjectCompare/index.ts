/**
 * ProjectCompare section pattern.
 * Before/after video comparison with draggable divider.
 *
 * Backgrounds: set via `style.backgroundColor` from the preset.
 * Text colors: resolved from theme CSS variables in styles.css.
 */

import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { ProjectCompareProps } from './types'
import { meta } from './meta'
import './components/VideoCompare'  // scoped widget registration

export function createProjectCompareSection(rawProps: ProjectCompareProps): SectionSchema {
  const props = applyMetaDefaults(meta, rawProps)
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
    type: 'ProjectCompare__VideoCompare',
    className: 'project-compare__video',
    props: {
      beforeSrc: props.beforeVideo,
      afterSrc: props.afterVideo,
      beforeLabel: props.beforeLabel,
      afterLabel: props.afterLabel,
      aspectRatio: '16/9',
      initialPosition: 50
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
        ...(props.descriptionHtml !== false ? { html: true } : {}),
        as: props.descriptionScale
      }
    })
  }

  return {
    id: sectionId,
    patternId: 'ProjectCompare',
    label: props.label ?? 'Project Compare',
    constrained: props.constrained,
    colorMode: props.colorMode,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between'
    },
    style: {
      ...props.style,
    },
    className: ['section-project-compare', props.className].filter(Boolean).join(' '),
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'viewport',
    widgets
  }
}
