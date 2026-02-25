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

  // Header with logo + studio/role (matches ProjectShowcase)
  const headerWidgets: WidgetSchema[] = [
    {
      id: `${sectionId}-logo`,
      type: 'Image',
      props: {
        src: props.logo.src,
        alt: props.logo.alt,
        decorative: false
      },
      style: { width: props.logo.width ?? 120 }
    }
  ]

  // Info column (studio + role) on the right
  if (props.studio || props.role) {
    const infoWidgets: WidgetSchema[] = []
    if (props.studio) {
      infoWidgets.push({
        type: 'Text',
        props: { content: props.studio, as: 'small' },
        className: 'project-compare__studio'
      })
    }
    if (props.role) {
      infoWidgets.push({
        type: 'Text',
        props: { content: props.role, as: 'small' },
        className: 'project-compare__role'
      })
    }
    headerWidgets.push({
      id: `${sectionId}-info`,
      type: 'Flex',
      props: { direction: 'column', align: 'end', gap: 'var(--spacing-xs, 0.25rem)' },
      widgets: infoWidgets
    })
  }

  const header: WidgetSchema = {
    id: `${sectionId}-header`,
    type: 'Flex',
    className: 'project-frame__header project-compare__header',
    props: { direction: 'row', align: 'center', justify: 'between' },
    style: { paddingBottom: 16 },
    widgets: headerWidgets
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
      initialPosition: 0
    }
  }

  // Wrap video in a frame container when videoBackground is set
  const videoWidget: WidgetSchema = props.videoBackground
    ? {
        id: `${sectionId}-video-frame`,
        type: 'Box',
        className: 'project-compare__video-frame',
        style: { backgroundColor: props.videoBackground },
        widgets: [videoCompare],
      }
    : videoCompare

  // Content area: wraps video + optional description
  const contentWidgets: WidgetSchema[] = [videoWidget]

  if (props.description) {
    contentWidgets.push({
      id: `${sectionId}-description`,
      type: 'Text',
      className: 'project-compare__description',
      props: {
        content: props.description,
        ...(props.descriptionHtml !== false ? { html: true } : {}),
        as: props.descriptionScale
      },
      ...(props.descriptionColor && {
        style: { color: props.descriptionColor },
      }),
    })
  }

  const content: WidgetSchema = {
    id: `${sectionId}-content`,
    type: 'Box',
    className: 'project-frame__content project-compare__content',
    ...(props.contentBackground && {
      style: {
        backgroundColor: props.contentBackground,
        paddingLeft: 16,
        paddingRight: 16,
      },
    }),
    widgets: contentWidgets,
  }

  const widgets: WidgetSchema[] = [header, content]

  // Footer social links bar (optional)
  const socialLinks = rawProps.socialLinks
  if (socialLinks && (typeof socialLinks === 'string' || socialLinks.length > 0)) {
    widgets.push({
      id: `${sectionId}-contact-bar`,
      type: 'ContactBar',
      className: 'project-frame__footer',
      props: {
        links: socialLinks,
        textColor: props.textColor,
      },
    })
  }

  return {
    id: sectionId,
    patternId: 'ProjectCompare',
    label: props.label ?? 'Project Compare',
    constrained: props.constrained,
    colorMode: props.colorMode,
    sectionTheme: props.sectionTheme,
    layout: {
      type: 'flex',
      direction: 'column',
      justify: 'between'
    },
    style: {
      ...props.style,
    },
    className: ['project-frame', props.contentBackground && 'project-compare--full-bleed', props.className].filter(Boolean).join(' '),
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight ?? 'viewport',
    widgets
  }
}
