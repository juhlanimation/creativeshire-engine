import React, { useLayoutEffect } from 'react'
import type { Decorator } from '@storybook/react'
import { chromePatternStoryConfig, chromePatternStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { meta } from './meta'
import { createScrollRevealBrandRegion } from './index'
import { previewProps } from './preview'

/**
 * Decorator that syncs progress/contentEdge args to document.documentElement CSS variables,
 * matching what scroll/cover-progress behaviour does with propagateToRoot.
 */
const ScrollVarDecorator: Decorator = (Story, context) => {
  const progress = context.args.progress as number ?? 100
  const contentEdge = context.args.contentEdge as number ?? 0

  useLayoutEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--hero-cover-progress', String(progress))
    root.style.setProperty('--hero-content-edge', String(contentEdge))
    return () => {
      root.style.removeProperty('--hero-cover-progress')
      root.style.removeProperty('--hero-content-edge')
    }
  }, [progress, contentEdge])

  return <Story />
}

const config = chromePatternStoryConfig(meta, createScrollRevealBrandRegion, previewProps)

export default {
  ...config,
  title: 'Headers/Scroll Reveal Brand',
  decorators: [ScrollVarDecorator, ...(config.decorators ?? [])],
  argTypes: {
    ...config.argTypes,
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Simulates --hero-cover-progress (0 = hidden, 100 = fully revealed)',
      table: { category: 'Scroll Simulation' },
    },
    contentEdge: {
      control: { type: 'range', min: -200, max: 800, step: 10 },
      description: 'Simulates --hero-content-edge in px (vertical offset from header)',
      table: { category: 'Scroll Simulation' },
    },
  },
}

export const Default = {
  args: {
    ...chromePatternStoryArgs(meta, previewProps, createScrollRevealBrandRegion),
    progress: 100,
    contentEdge: 0,
  },
}
