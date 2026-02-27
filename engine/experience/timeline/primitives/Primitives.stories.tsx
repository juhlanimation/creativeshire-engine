import React from 'react'
import { EffectPrimitivePreview } from '../../../../.storybook/helpers/EffectPrimitivePreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Primitives',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const WipeLeft = {
  args: { duration: 0.8, ease: 'power3.inOut' },
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
    ease: { control: 'text' },
  },
  render: (args: { duration: number; ease: string }) => (
    <EffectPrimitivePreview effectId="wipe-left" duration={args.duration} ease={args.ease} />
  ),
}

export const WipeRight = {
  args: { duration: 0.8, ease: 'power3.inOut' },
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
    ease: { control: 'text' },
  },
  render: (args: { duration: number; ease: string }) => (
    <EffectPrimitivePreview effectId="wipe-right" duration={args.duration} ease={args.ease} />
  ),
}

export const Expand = {
  args: { duration: 0.6, ease: 'power3.inOut' },
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
    ease: { control: 'text' },
  },
  render: (args: { duration: number; ease: string }) => (
    <EffectPrimitivePreview effectId="expand" duration={args.duration} ease={args.ease} />
  ),
}

export const Fade = {
  args: { duration: 0.4, ease: 'power2.out' },
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
    ease: { control: 'text' },
  },
  render: (args: { duration: number; ease: string }) => (
    <EffectPrimitivePreview effectId="fade" duration={args.duration} ease={args.ease} />
  ),
}

export const OverlayFade = {
  args: { duration: 0.3, ease: 'power2.out' },
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
    ease: { control: 'text' },
  },
  render: (args: { duration: number; ease: string }) => (
    <EffectPrimitivePreview effectId="overlay-fade" duration={args.duration} ease={args.ease} />
  ),
}
