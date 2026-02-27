import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Transform/Scale',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const ScaleReveal = {
  render: () => (
    <EffectCSSPreview
      effectName="scale-reveal"
      cssVariables={[
        { name: '--scale-transform', initial: 'scale(0.8)', final: 'scale(1)', description: 'Transform value' },
        { name: '--scale-opacity', initial: '0', final: '1', description: 'Opacity' },
        { name: '--scale-duration', initial: '400ms', final: '400ms', description: 'Duration' },
        { name: '--scale-easing', initial: 'cubic-bezier(0.34, 1.56, 0.64, 1)', final: 'cubic-bezier(0.34, 1.56, 0.64, 1)', description: 'Overshoot easing' },
      ]}
    />
  ),
}

export const ScaleHover = {
  render: () => (
    <EffectCSSPreview
      effectName="scale-hover"
      cssVariables={[
        { name: '--scale', initial: '1', final: '1.05', description: 'Scale value' },
        { name: '--scale-duration', initial: '150ms', final: '150ms', description: 'Duration' },
        { name: '--scale-easing', initial: 'ease-out', final: 'ease-out', description: 'Easing' },
      ]}
    />
  ),
}

export const ModalScale = {
  render: () => (
    <EffectCSSPreview
      effectName="modal-scale"
      cssVariables={[
        { name: '--modal-scale', initial: '0.95', final: '1', description: 'Scale value' },
        { name: '--modal-opacity', initial: '0', final: '1', description: 'Opacity' },
        { name: '--modal-duration', initial: '400ms', final: '400ms', description: 'Duration' },
      ]}
    />
  ),
}
