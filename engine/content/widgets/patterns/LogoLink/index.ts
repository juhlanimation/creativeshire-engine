/**
 * LogoLink composite factory.
 * Creates a widget schema for logo with navigation link.
 *
 * Architecture: Composite (factory function returning WidgetSchema)
 * Composes: Link with optional Image child
 *
 * Effects applied:
 * - color-shift: Color and blend-mode transitions
 * - scale-hover: Press feedback scale
 *
 * The Link widget handles the anchor element rendering.
 * Styles are applied via className for CSS targeting.
 */

import type { WidgetSchema } from '../../../../schema'
import type { LogoLinkConfig } from './types'

export type { LogoLinkConfig }

/**
 * Creates a logo link widget schema.
 *
 * Renders either:
 * - Image logo: Link containing Image widget
 * - Text logo: Link with text content
 *
 * @param config - Logo link configuration
 * @returns WidgetSchema for the logo link
 */
export function createLogoLink(config: LogoLinkConfig): WidgetSchema {
  const id = config.id ?? 'logo-link'

  // Build class name with logo-link base
  const className = ['logo-link', config.className].filter(Boolean).join(' ')

  // Base link schema
  const linkSchema: WidgetSchema = {
    id,
    type: 'Link',
    className,
    style: config.style,
    props: {
      href: config.href ?? '/',
      'data-effect': 'color-shift scale-hover',
    },
  }

  // Add child widget based on whether image or text is provided
  if (config.imageSrc) {
    linkSchema.widgets = [
      {
        type: 'Image',
        className: 'logo-link__image',
        props: {
          src: config.imageSrc,
          alt: config.imageAlt ?? 'Logo',
          decorative: false,
        },
      },
    ]
  } else if (config.text) {
    // For text-only logo, use Text widget
    linkSchema.widgets = [
      {
        type: 'Text',
        props: {
          content: config.text,
          as: 'span',
        },
      },
    ]
  }

  return linkSchema
}
