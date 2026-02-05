/**
 * ContactBar pattern factory.
 * Creates a widget schema for footer bar with contact and social links.
 *
 * Architecture: Pattern (factory function returning WidgetSchema)
 * Composes: Flex, Link, Icon, ContactPrompt
 */

import type { WidgetSchema } from '../../../../schema'
import type { ContactBarConfig } from './types'

export type { ContactBarConfig }

/**
 * Creates a contact bar widget schema.
 *
 * Layout:
 * - Flex container with row direction
 * - Optional social link icons on the left
 * - ContactPrompt on the right (or aligned per config)
 *
 * Modes:
 * - With prompt: Shows prompt text that flips to email on hover
 * - Email-only: Just shows email with copy icon on hover
 */
export function createContactBar(config: ContactBarConfig): WidgetSchema {
  const barId = config.id ?? 'contact-bar'

  // Build social link widgets if provided
  const socialWidgets: WidgetSchema[] = (config.socialLinks ?? []).map(
    (link, i) => ({
      id: `${barId}-social-${i}`,
      type: 'Link',
      props: {
        href: link.href,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      widgets: [
        {
          type: 'Icon',
          props: { name: link.icon ?? link.platform },
        },
      ],
      className: 'contact-bar__social-link',
    })
  )

  // ContactPrompt - showPrompt based on whether prompt text is provided
  const contactWidget: WidgetSchema = {
    id: `${barId}-email`,
    type: 'ContactPrompt',
    props: {
      email: config.email,
      promptText: config.prompt,
      showPrompt: !!config.prompt,
    },
    className: 'contact-bar__email',
  }

  // Combine: socials first, then contact prompt
  const children = [...socialWidgets, contactWidget]

  return {
    id: barId,
    type: 'Flex',
    className: `contact-bar ${config.textColor === 'dark' ? 'contact-bar--dark' : 'contact-bar--light'}`,
    props: {
      direction: 'row',
      align: 'center',
      justify: config.align ?? 'end',
    },
    widgets: children,
  }
}
