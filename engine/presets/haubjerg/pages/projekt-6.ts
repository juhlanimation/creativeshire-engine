import type { PageSchema } from '../../../schema'
import { createHaubjergProjectSection } from '../../../content/sections/patterns/HaubjergProject'
import { projects } from '../data/project-data'

export const projekt6Page: PageSchema = {
  id: 'projekt-6',
  slug: '/projekt/det-usynlige-baand',
  head: { title: `Studio Dokumentar — ${projects[5].title}`, description: projects[5].description },
  sections: [createHaubjergProjectSection({ colorMode: 'dark', props: { project: projects[5] } })],
}
