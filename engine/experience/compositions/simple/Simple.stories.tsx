import React from 'react'
import { ExperienceShowcase } from '../../../../.storybook/helpers/ExperienceShowcase'
import { simpleExperience } from './index'

export default {
  title: 'Simple',
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => <ExperienceShowcase experience={simpleExperience} />,
}
