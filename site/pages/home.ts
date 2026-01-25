/**
 * Home page schema.
 * Landing page with hero section.
 */

import type { PageSchema } from '../../creativeshire/schema'

/**
 * Home page configuration.
 * Single hero section with centered text widget.
 */
export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  head: {
    title: 'Creativeshire',
    description: 'Welcome to Creativeshire'
  },
  sections: [
    {
      id: 'hero',
      layout: {
        type: 'flex',
        direction: 'column',
        align: 'center',
        justify: 'center'
      },
      widgets: [
        {
          id: 'hero-title',
          type: 'Text',
          props: {
            content: 'Welcome to Creativeshire',
            as: 'h1'
          }
        }
      ]
    }
  ]
}
