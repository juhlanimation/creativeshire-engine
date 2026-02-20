import React from 'react'
import { IntroShowcase } from '../../../.storybook/helpers/IntroShowcase'
import { meta, config } from './wait'

export default {
  title: 'Wait',
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  render: () => <IntroShowcase meta={meta} config={config} />,
}
