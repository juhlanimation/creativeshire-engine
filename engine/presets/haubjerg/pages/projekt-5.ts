import type { PageSchema } from '../../../schema'
import { createHaubjergProjectSection } from '../../../content/sections/patterns/HaubjergProject'
import { projects } from '../data/project-data'

export const projekt5Page: PageSchema = {
  id: 'projekt-5',
  slug: '/projekt/byens-puls',
  head: { title: `Studio Dokumentar — ${projects[4].title}`, description: projects[4].description },
  sections: [createHaubjergProjectSection({ colorMode: 'dark', props: { project: projects[4] } })],
}
