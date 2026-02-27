import type { PageSchema } from '../../../schema'
import { createHaubjergProjectSection } from '../../../content/sections/patterns/HaubjergProject'
import { projects } from '../data/project-data'

export const projekt4Page: PageSchema = {
  id: 'projekt-4',
  slug: '/projekt/faellesskabets-billeder',
  head: { title: `Studio Dokumentar — ${projects[3].title}`, description: projects[3].description },
  sections: [createHaubjergProjectSection({ colorMode: 'dark', props: { project: projects[3] } })],
}
