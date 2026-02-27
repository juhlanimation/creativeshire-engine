import React from 'react'
import { ExperienceShowcase } from '../../../../.storybook/helpers/ExperienceShowcase'
import { slideshowExperience } from './index'

export default {
  title: 'Slideshow',
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => <ExperienceShowcase experience={slideshowExperience} />,
}
