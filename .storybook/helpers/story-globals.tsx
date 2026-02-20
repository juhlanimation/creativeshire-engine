/**
 * Shared Storybook globals → React context bridge.
 *
 * Decorators can read Storybook globals; React components cannot.
 * This context bridges the gap so story components (PresetPageStory,
 * SectionStoryRenderer) can access colorTheme/colorMode from the toolbar.
 *
 * Used by both preset stories and section stories.
 */

import React, { createContext } from 'react'
import type { Decorator } from '@storybook/react'

export interface StoryGlobals {
  colorTheme?: string
  colorMode?: string
}

export const StoryGlobalsContext = createContext<StoryGlobals>({})

/**
 * Decorator that reads colorTheme/colorMode from Storybook globals
 * and provides them via React context.
 */
export const StoryGlobalsDecorator: Decorator = (Story, context) => {
  const colorTheme = (context.globals.colorTheme as string) ?? undefined
  const colorMode = (context.globals.colorMode as string) ?? undefined
  return (
    <StoryGlobalsContext.Provider value={{ colorTheme, colorMode }}>
      <Story />
    </StoryGlobalsContext.Provider>
  )
}
