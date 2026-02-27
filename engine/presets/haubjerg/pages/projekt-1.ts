import type { PageSchema } from '../../../schema'
import { createHaubjergProjectSection } from '../../../content/sections/patterns/HaubjergProject'
import { projects } from '../data/project-data'

export const projekt1Page: PageSchema = {
  id: 'projekt-1',
  slug: '/projekt/skjulte-landskaber',
  head: { title: `Studio Dokumentar — ${projects[0].title}`, description: projects[0].description },
  sections: [createHaubjergProjectSection({ colorMode: 'dark', props: { project: projects[0] } })],
}
