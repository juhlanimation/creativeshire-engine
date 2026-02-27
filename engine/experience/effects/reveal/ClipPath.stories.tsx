import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Reveal/Clip Path',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const ClipReveal = {
  render: () => (
    <EffectCSSPreview
      effectName="clip-reveal"
      cssVariables={[
        { name: '--clip-progress', initial: '0', final: '1', description: 'Progress (0=hidden, 1=visible)' },
        { name: '--clip-duration', initial: '600ms', final: '600ms', description: 'Duration' },
      ]}
    />
  ),
}

export const ClipRevealLeft = {
  render: () => (
    <EffectCSSPreview
      effectName="clip-reveal-left"
      cssVariables={[
        { name: '--clip-progress', initial: '0', final: '1', description: 'Progress (0=hidden, 1=visible)' },
        { name: '--clip-duration', initial: '600ms', final: '600ms', description: 'Duration' },
      ]}
    />
  ),
}

export const ClipRevealRight = {
  render: () => (
    <EffectCSSPreview
      effectName="clip-reveal-right"
      cssVariables={[
        { name: '--clip-progress', initial: '0', final: '1', description: 'Progress (0=hidden, 1=visible)' },
        { name: '--clip-duration', initial: '600ms', final: '600ms', description: 'Duration' },
      ]}
    />
  ),
}

export const ClipRevealTop = {
  render: () => (
    <EffectCSSPreview
      effectName="clip-reveal-top"
      cssVariables={[
        { name: '--clip-progress', initial: '0', final: '1', description: 'Progress (0=hidden, 1=visible)' },
        { name: '--clip-duration', initial: '600ms', final: '600ms', description: 'Duration' },
      ]}
    />
  ),
}

export const ClipRevealBottom = {
  render: () => (
    <EffectCSSPreview
      effectName="clip-reveal-bottom"
      cssVariables={[
        { name: '--clip-progress', initial: '0', final: '1', description: 'Progress (0=hidden, 1=visible)' },
        { name: '--clip-duration', initial: '600ms', final: '600ms', description: 'Duration' },
      ]}
    />
  ),
}

export const LogoReveal = {
  render: () => (
    <EffectCSSPreview
      effectName="logo-reveal"
      cssVariables={[
        { name: '--scroll-progress', initial: '0', final: '1', description: 'Scroll-driven progress' },
        { name: '--logo-reveal-start', initial: '0', final: '0', description: 'Start threshold' },
        { name: '--logo-reveal-end', initial: '0.2', final: '0.2', description: 'End threshold' },
        { name: '--clip-duration', initial: '400ms', final: '400ms', description: 'Duration' },
      ]}
    />
  ),
}
