import type { PageSchema } from '../../../schema'
import { createHaubjergContactSection } from '../../../content/sections/patterns/HaubjergContact'

export const kontaktPage: PageSchema = {
  id: 'kontakt',
  slug: '/kontakt',
  head: { title: 'Studio Dokumentar — Kontakt', description: 'Kontakt os' },
  sections: [createHaubjergContactSection({ colorMode: 'dark' })],
}
