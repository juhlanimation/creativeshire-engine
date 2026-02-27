import React from 'react'
import { ExperienceShowcase } from '../../../../.storybook/helpers/ExperienceShowcase'
import { slideshowComposition } from './index'

export default {
  title: 'Slideshow',
  parameters: { layout: 'fullscreen', a11y: { test: 'todo' } },
}

export const Default = {
  render: () => <ExperienceShowcase experience={slideshowComposition} />,
}
