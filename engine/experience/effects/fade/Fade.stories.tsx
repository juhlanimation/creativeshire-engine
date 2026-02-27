import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Fade',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const FadeReveal = {
  render: () => (
    <EffectCSSPreview
      effectName="fade-reveal"
      cssVariables={[
        { name: '--fade-opacity', initial: '0', final: '1', description: 'Opacity value' },
        { name: '--fade-duration', initial: '300ms', final: '300ms', description: 'Transition duration' },
        { name: '--fade-easing', initial: 'ease-out', final: 'ease-out', description: 'Timing function' },
      ]}
    />
  ),
}

export const ModalFade = {
  render: () => (
    <EffectCSSPreview
      effectName="modal-fade"
      cssVariables={[
        { name: '--modal-opacity', initial: '0', final: '1', description: 'Modal opacity' },
        { name: '--modal-duration', initial: '300ms', final: '300ms', description: 'Transition duration' },
        { name: '--modal-easing', initial: 'ease-out', final: 'ease-out', description: 'Timing function' },
      ]}
    />
  ),
}

export const ModalBackdrop = {
  render: () => (
    <EffectCSSPreview
      effectName="modal-backdrop"
      cssVariables={[
        { name: '--modal-backdrop-opacity', initial: '0', final: '0.6', description: 'Backdrop opacity' },
        { name: '--modal-duration', initial: '300ms', final: '300ms', description: 'Transition duration' },
      ]}
    />
  ),
}

export const ButtonHover = {
  render: () => (
    <EffectCSSPreview
      effectName="button-hover"
      cssVariables={[
        { name: '--button-duration', initial: '200ms', final: '200ms', description: 'Transition duration' },
        { name: '--button-easing', initial: 'ease', final: 'ease', description: 'Timing function' },
      ]}
    >
      <button
        style={{
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 600,
          background: '#6c63ff',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Hover Button
      </button>
    </EffectCSSPreview>
  ),
}

export const LabelFade = {
  render: () => (
    <EffectCSSPreview
      effectName="label-fade"
      cssVariables={[
        { name: '--label-duration', initial: '150ms', final: '150ms', description: 'Transition duration' },
        { name: '--label-easing', initial: 'ease-out', final: 'ease-out', description: 'Timing function' },
      ]}
    >
      <span
        style={{
          padding: '6px 16px',
          fontSize: 12,
          fontWeight: 600,
          background: '#222',
          color: '#ccc',
          borderRadius: 999,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        ENTER
      </span>
    </EffectCSSPreview>
  ),
}
