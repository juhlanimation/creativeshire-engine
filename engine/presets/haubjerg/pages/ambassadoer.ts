import type { PageSchema } from '../../../schema'
import { createHaubjergPeopleSection } from '../../../content/sections/patterns/HaubjergPeople'

export const ambassadoerPage: PageSchema = {
  id: 'ambassadoer',
  slug: '/ambassadoer',
  head: { title: 'Studio Dokumentar — Ambassadører', description: 'Vores ambassadører' },
  sections: [createHaubjergPeopleSection({ colorMode: 'dark' })],
}
