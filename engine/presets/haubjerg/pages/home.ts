import type { PageSchema } from '../../../schema'
import { createHaubjergHomeSection } from '../../../content/sections/patterns/HaubjergHome'

export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  head: { title: 'Studio Dokumentar', description: 'Kerneprodukter — Projekter' },
  sections: [createHaubjergHomeSection({ colorMode: 'dark' })],
}
