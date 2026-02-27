/**
 * TeamBio pattern - team member profiles with accent-colored names.
 *
 * Structure:
 * - Grid of member blocks (1 or 2 columns)
 * - Each member: Image + Text (name with accent color) + Text (bio) + social links
 * - Alternating layout via CSS :nth-child
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import { isBindingExpression } from '../utils'
import type { TeamBioProps } from './types'
import { meta } from './meta'

export function createTeamBioSection(rawProps?: TeamBioProps): SectionSchema {
  const p = applyMetaDefaults(meta, rawProps ?? {})

  // Content bindings
  const members = rawProps?.members ?? '{{ content.team.members }}'

  // Settings
  const columns = p.columns as string
  const nameScale = (p.nameScale as string) === 'xl' ? 'h1' : 'h2'

  // Typography
  const bioScale = 'body'

  let memberWidgets: WidgetSchema[]

  if (isBindingExpression(members)) {
    // Binding mode: single repeated block
    memberWidgets = [{
      __repeat: members,
      id: 'member',
      type: 'Stack',
      props: { gap: 24 },
      className: 'section-team-bio__member',
      widgets: [
        {
          id: 'member-image',
          type: 'Image',
          props: { src: '{{ item.imageSrc }}', alt: '{{ item.name }}' },
          className: 'section-team-bio__portrait',
        },
        {
          id: 'member-name',
          type: 'Text',
          props: { content: '{{ item.name }}', as: nameScale },
          className: 'section-team-bio__name',
          style: { color: '{{ item.accentColor }}' } as CSSProperties,
        },
        {
          id: 'member-bio',
          type: 'Text',
          props: { content: '{{ item.bio }}', as: bioScale },
          className: 'section-team-bio__bio',
        },
        {
          id: 'member-links',
          type: 'Flex',
          props: { direction: 'row', gap: 16 },
          className: 'section-team-bio__links',
          widgets: [
            {
              id: 'member-email-link',
              type: 'Link',
              props: { content: 'Email', href: '{{ item.email }}' },
            },
            {
              id: 'member-linkedin-link',
              type: 'Link',
              props: { content: 'LinkedIn', href: '{{ item.linkedinUrl }}' },
            },
          ],
        },
      ],
    }]
  } else {
    // Concrete data mode
    const memberData = members as Array<{
      name: string; bio: string; imageSrc: string;
      accentColor: string; email?: string; linkedinUrl?: string
    }>
    memberWidgets = memberData.map((member, i) => {
      const socialLinks: WidgetSchema[] = []
      if (member.email) {
        socialLinks.push({
          id: `member-${i}-email`,
          type: 'Link',
          props: { content: 'Email', href: `mailto:${member.email}` },
        })
      }
      if (member.linkedinUrl) {
        socialLinks.push({
          id: `member-${i}-linkedin`,
          type: 'Link',
          props: { content: 'LinkedIn', href: member.linkedinUrl },
        })
      }

      return {
        id: `member-${i}`,
        type: 'Stack' as const,
        props: { gap: 24 },
        className: 'section-team-bio__member',
        widgets: [
          {
            id: `member-${i}-image`,
            type: 'Image' as const,
            props: { src: member.imageSrc, alt: member.name },
            className: 'section-team-bio__portrait',
          },
          {
            id: `member-${i}-name`,
            type: 'Text' as const,
            props: { content: member.name, as: nameScale },
            className: 'section-team-bio__name',
            style: { color: member.accentColor } as CSSProperties,
          },
          {
            id: `member-${i}-bio`,
            type: 'Text' as const,
            props: { content: member.bio, as: bioScale },
            className: 'section-team-bio__bio',
          },
          ...(socialLinks.length > 0 ? [{
            id: `member-${i}-links`,
            type: 'Flex' as const,
            props: { direction: 'row' as const, gap: 16 },
            className: 'section-team-bio__links',
            widgets: socialLinks,
          }] : []),
        ],
      }
    })
  }

  const widgets: WidgetSchema[] = [
    {
      id: 'team-grid',
      type: 'Grid',
      props: { columns: Number(columns), gap: 64 },
      className: 'section-team-bio__grid',
      widgets: memberWidgets,
    },
  ]

  return {
    id: p.id ?? 'team-bio',
    patternId: 'TeamBio',
    label: p.label ?? 'Team',
    constrained: p.constrained ?? true,
    colorMode: p.colorMode ?? 'dark',
    sectionTheme: p.sectionTheme,
    layout: { type: 'stack', direction: 'column', align: 'stretch' },
    style: p.style,
    className: p.className,
    paddingTop: p.paddingTop ?? 80,
    paddingBottom: p.paddingBottom ?? 80,
    paddingLeft: p.paddingLeft,
    paddingRight: p.paddingRight,
    sectionHeight: p.sectionHeight ?? 'auto',
    widgets,
  }
}
