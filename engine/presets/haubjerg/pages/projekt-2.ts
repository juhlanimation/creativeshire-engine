import type { PageSchema } from '../../../schema'
import { createHaubjergProjectSection } from '../../../content/sections/patterns/HaubjergProject'
import { projects } from '../data/project-data'

export const projekt2Page: PageSchema = {
  id: 'projekt-2',
  slug: '/projekt/stemmerne-fra-graensen',
  head: { title: `Studio Dokumentar — ${projects[1].title}`, description: projects[1].description },
  sections: [createHaubjergProjectSection({ colorMode: 'dark', props: { project: projects[1] } })],
}
