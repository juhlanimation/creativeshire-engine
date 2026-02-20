/**
 * CursorLabel overlay stories.
 * Uses `active` prop for direct control (bypasses action system).
 */

import React, { useCallback, useContext, useMemo } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import CursorLabel from './index'
import { meta } from './meta'
import { createNoopStore } from '../../../../../.storybook/mocks/context'
import { OverlayContext } from '../../../../../.storybook/helpers/OverlayContext'
import { StoryGlobalsDecorator, StoryGlobalsContext } from '../../../../../.storybook/helpers/story-globals'
import { extractDefaults } from '../../../../schema/settings'
import { settingsToArgTypes } from '../../../../../.storybook/helpers/controls-adapter'
import type { SettingConfig } from '../../../../schema/settings'

const settings = (meta.settings ?? {}) as Record<string, SettingConfig>

/**
 * Wrapper that provides OverlayContext and bridges Storybook args to CursorLabel.
 */
function CursorLabelStory(args: Record<string, unknown>) {
  const globals = useContext(StoryGlobalsContext)
  const store = useMemo(
    () => createNoopStore(),
    [],
  )

  // Update store cursor position for static preview
  useMemo(() => {
    store.setState({ cursorX: 200, cursorY: 150 })
  }, [store])

  return (
    <OverlayContext store={store} globals={globals}>
      <div style={{ minHeight: 300, padding: 24 }}>
        <p style={{ opacity: 0.5 }}>Cursor label appears at a fixed position (active mode).</p>
        <CursorLabel
          label={args.label as string}
          offsetX={args.offsetX as number}
          offsetY={args.offsetY as number}
          active
        />
      </div>
    </OverlayContext>
  )
}

/**
 * Interactive wrapper that tracks mouse position.
 */
function InteractiveCursorLabel(args: Record<string, unknown>) {
  const globals = useContext(StoryGlobalsContext)
  const store = useMemo(() => createNoopStore(), [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect()
      store.setState({
        cursorX: e.clientX - rect.left,
        cursorY: e.clientY - rect.top,
      })
    },
    [store],
  )

  return (
    <OverlayContext store={store} globals={globals}>
      <div
        style={{ minHeight: 400, padding: 24, cursor: 'none' }}
        onMouseMove={handleMouseMove}
      >
        <p style={{ opacity: 0.5 }}>Move your mouse over this area.</p>
        <CursorLabel
          label={args.label as string}
          offsetX={args.offsetX as number}
          offsetY={args.offsetY as number}
          active
        />
      </div>
    </OverlayContext>
  )
}

export default {
  title: 'Overlays/Cursor Label',
  component: CursorLabelStory,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: meta.description } },
    saveDefaults: {
      id: meta.id,
      settingKeys: Object.keys(settings),
      defaults: extractDefaults(settings),
    },
  },
  argTypes: settingsToArgTypes(settings),
  decorators: [StoryGlobalsDecorator],
} satisfies Meta

export const Default: StoryObj = {
  args: extractDefaults(settings),
}

export const Interactive: StoryObj = {
  render: (args) => <InteractiveCursorLabel {...args} />,
  args: extractDefaults(settings),
}
