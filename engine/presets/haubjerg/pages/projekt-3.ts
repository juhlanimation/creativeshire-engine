import type { PageSchema } from '../../../schema'
import { createHaubjergProjectSection } from '../../../content/sections/patterns/HaubjergProject'
import { projects } from '../data/project-data'

export const projekt3Page: PageSchema = {
  id: 'projekt-3',
  slug: '/projekt/fortaellinger-i-bevaegelse',
  head: { title: `Studio Dokumentar — ${projects[2].title}`, description: projects[2].description },
  sections: [createHaubjergProjectSection({ colorMode: 'dark', props: { project: projects[2] } })],
}
