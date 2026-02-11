'use client'

/**
 * useChromeVisibility - Derives whether the intro is hiding chrome.
 * Subscribes reactively to the intro store's chromeVisible state.
 */

import { useSyncExternalStore } from 'react'
import { useIntro } from '../../intro'

/**
 * Returns whether the intro is currently hiding chrome elements.
 * Subscribes to the intro store so re-renders happen when
 * setChromeVisible(true) is called during intro completion.
 */
export function useChromeVisibility(): { introHidesChrome: boolean } {
  const intro = useIntro()

  const subscribeNoop = () => () => {}
  const chromeVisible = useSyncExternalStore(
    intro?.store.subscribe ?? subscribeNoop,
    () => intro?.store.getState().chromeVisible ?? true,
    () => intro?.store.getState().chromeVisible ?? true,
  )

  const introHidesChrome = !!(intro?.pattern?.hideChrome && !chromeVisible)

  return { introHidesChrome }
}
