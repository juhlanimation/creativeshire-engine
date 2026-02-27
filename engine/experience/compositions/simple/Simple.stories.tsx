import React from 'react'
import { ExperienceShowcase } from '../../../../.storybook/helpers/ExperienceShowcase'
import { simpleComposition } from './index'

export default {
  title: 'Simple',
  parameters: { layout: 'fullscreen', a11y: { test: 'todo' } },
}

export const Default = {
  render: () => <ExperienceShowcase experience={simpleComposition} />,
}
