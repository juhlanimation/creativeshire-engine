/**
 * SlideIndicators overlay stories.
 * Navigation dots/lines/numbers for slideshow experience.
 */

import React, { useContext, useEffect, useMemo } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SlideIndicators } from './index'
import { meta } from './meta'
import { createNavigableStore } from '../../../../../.storybook/mocks/context'
import { OverlayContext } from '../../../../../.storybook/helpers/OverlayContext'
import { StoryGlobalsDecorator, StoryGlobalsContext } from '../../../../../.storybook/helpers/story-globals'
import { extractDefaults } from '../../../../schema/settings'
import { settingsToArgTypes } from '../../../../../.storybook/helpers/controls-adapter'
import type { SettingConfig } from '../../../../schema/settings'

const settings = (meta.settings ?? {}) as Record<string, SettingConfig>

/**
 * Wrapper that bridges Storybook args to navigable store.
 */
function SlideIndicatorsStory(args: Record<string, unknown>) {
  const globals = useContext(StoryGlobalsContext)
  const store = useMemo(
    () => createNavigableStore({ totalSections: 5 }),
    [],
  )

  // Bridge activeSection and totalSections controls to store
  useEffect(() => {
    store.setState({
      activeSection: (args.activeSection as number) ?? 0,
      totalSections: (args.totalSections as number) ?? 5,
    })
  }, [store, args.activeSection, args.totalSections])

  return (
    <OverlayContext store={store} globals={globals}>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <div style={{ padding: 24, opacity: 0.5 }}>
          <p>Click an indicator to change active section. Use controls to adjust.</p>
        </div>
        <SlideIndicators
          position={args.position as 'left' | 'right' | 'bottom'}
          style={args.style as 'dots' | 'lines' | 'numbers'}
        />
      </div>
    </OverlayContext>
  )
}

export default {
  title: 'Overlays/Slide Indicators',
  component: SlideIndicatorsStory,
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
    activeSection: {
      control: { type: 'number', min: 0, max: 9 },
      description: 'Currently active section index',
    },
    totalSections: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Total number of sections',
    },
  },
  decorators: [StoryGlobalsDecorator],
} satisfies Meta

export const Default: StoryObj = {
  args: {
    ...extractDefaults(settings),
    activeSection: 0,
    totalSections: 5,
  },
}
