/**
 * NavTimeline overlay stories.
 * Vertical timeline showing scroll progress between sections.
 */

import React, { useContext, useEffect, useMemo } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { NavTimeline } from './index'
import { meta } from './meta'
import { createCarouselStore, bareExperience } from '../../../../../.storybook/mocks/context'
import { OverlayContext } from '../../../../../.storybook/helpers/OverlayContext'
import { StoryGlobalsDecorator, StoryGlobalsContext } from '../../../../../.storybook/helpers/story-globals'
import { extractDefaults } from '../../../../schema/settings'
import { settingsToArgTypes } from '../../../../../.storybook/helpers/controls-adapter'
import type { SettingConfig } from '../../../../schema/settings'
import type { Experience } from '../../../../experience/experiences/types'

const settings = (meta.settings ?? {}) as Record<string, SettingConfig>

/** Experience mock with loop enabled for arrow visibility */
const carouselExperience: Experience = {
  ...bareExperience,
  id: 'storybook-carousel',
  name: 'Storybook Carousel',
  navigation: {
    inputs: [],
    behavior: { loop: true, allowSkip: false, lockDuringTransition: true, debounce: 0 },
    activeSection: { strategy: 'manual' },
    history: { updateHash: false, restoreFromHash: false, pushState: false },
  },
}

/**
 * Wrapper that bridges Storybook args to carousel store and experience.
 */
function NavTimelineStory(args: Record<string, unknown>) {
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
    <OverlayContext store={store} experience={carouselExperience} globals={globals}>
      <div style={{ minHeight: '100vh' }}>
        <div style={{ padding: 24, opacity: 0.5 }}>
          <p>Drag clipProgress slider to animate the pointer between sections.</p>
        </div>
        <NavTimeline
          show={(args.show as boolean) ?? true}
          position={args.position as 'center' | 'left' | 'right'}
          showArrows={(args.showArrows as boolean) ?? true}
          autohide={(args.autohide as boolean) ?? false}
          autohideDelay={args.autohideDelay as number}
          alignment={args.alignment as 'left' | 'right'}
          currentColor={args.currentColor as string}
          nextColor={args.nextColor as string}
          currentLabel="intro"
          nextLabel="work"
          currentNumber="01"
          nextNumber="02"
        />
      </div>
    </OverlayContext>
  )
}

export default {
  title: 'Overlays/Navigation Timeline',
  component: NavTimelineStory,
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
