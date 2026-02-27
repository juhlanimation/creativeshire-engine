import type { PageSchema } from '../../../schema'
import { createHaubjergWorkshopsSection } from '../../../content/sections/patterns/HaubjergWorkshops'

export const workshopsPage: PageSchema = {
  id: 'workshops',
  slug: '/workshops',
  head: { title: 'Studio Dokumentar — Workshops', description: 'Workshops og metodik' },
  sections: [createHaubjergWorkshopsSection({ colorMode: 'dark' })],
}
