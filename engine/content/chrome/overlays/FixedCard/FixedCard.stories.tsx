/**
 * FixedCard overlay stories.
 * Glassmorphic cards with clip-path fold animation driven by scroll progress.
 */

import React, { useContext, useEffect, useMemo } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FixedCard } from './index'
import { meta } from './meta'
import { createCarouselStore } from '../../../../../.storybook/mocks/context'
import { OverlayContext } from '../../../../../.storybook/helpers/OverlayContext'
import { StoryGlobalsDecorator, StoryGlobalsContext } from '../../../../../.storybook/helpers/story-globals'
import { extractDefaults } from '../../../../schema/settings'
import { settingsToArgTypes } from '../../../../../.storybook/helpers/controls-adapter'
import type { SettingConfig } from '../../../../schema/settings'
import type { CardConfig } from './types'

const settings = (meta.settings ?? {}) as Record<string, SettingConfig>

/** Sample cards: one left-aligned, one right-aligned */
const sampleCards: CardConfig[] = [
  {
    sectionId: 'intro',
    alignment: 'left',
    width: 280,
    height: 360,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    accentColor: '#4488ff',
    widgets: [
      {
        type: 'Text',
        props: { content: 'Left Card', tag: 'h3' },
      },
      {
        type: 'Text',
        props: { content: 'This card belongs to the intro section.' },
      },
    ],
  },
  {
    sectionId: 'intro',
    alignment: 'right',
    width: 280,
    height: 360,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    accentColor: '#ff4488',
    widgets: [
      {
        type: 'Text',
        props: { content: 'Right Card', tag: 'h3' },
      },
      {
        type: 'Text',
        props: { content: 'This card also belongs to the intro section.' },
      },
    ],
  },
]

/**
 * Wrapper that bridges Storybook args to carousel store.
 */
function FixedCardStory(args: Record<string, unknown>) {
  const globals = useContext(StoryGlobalsContext)
  const store = useMemo(() => createCarouselStore(), [])

  // Bridge scroll/clip progress controls to store
  useEffect(() => {
    store.setState({
      scrollProgress: (args.scrollProgress as number) ?? 0,
      clipProgress: (args.clipProgress as number) ?? 0,
    })
  }, [store, args.scrollProgress, args.clipProgress])

  return (
    <OverlayContext store={store} globals={globals}>
      <div style={{ minHeight: '100vh' }}>
        <div style={{ padding: 24, opacity: 0.5 }}>
          <p>Drag scrollProgress and clipProgress sliders to see the fold animation.</p>
        </div>
        <FixedCard
          cards={sampleCards}
          centerGap={(args.centerGap as number) ?? 90}
        />
      </div>
    </OverlayContext>
  )
}

export default {
  title: 'Overlays/Fixed Card',
  component: FixedCardStory,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: meta.description } },
    saveDefaults: {
      id: meta.id,
      settingKeys: Object.keys(settings),
      defaults: extractDefaults(settings),
    },
  },
  argTypes: {
    ...settingsToArgTypes(settings),
    scrollProgress: {
      control: { type: 'range', min: 0, max: 3, step: 0.01 },
      description: 'Scroll progress across all sections',
    },
    clipProgress: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Clip/transition progress within current section',
    },
  },
  decorators: [StoryGlobalsDecorator],
} satisfies Meta

export const Default: StoryObj = {
  args: {
    ...extractDefaults(settings),
    scrollProgress: 0,
    clipProgress: 0,
  },
}
