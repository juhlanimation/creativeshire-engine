/**
 * ChromePreview — renders a chrome component in isolation for the registry browser.
 * Looks up the component from the chrome registry and renders with default props.
 */

'use client'

import { getChromeComponent } from '../../../../engine/content/chrome/registry'
import { PreviewShell } from './PreviewShell'

interface ChromePreviewProps {
  chromeId: string
  props: Record<string, unknown>
}

export function ChromePreview({ chromeId, props }: ChromePreviewProps) {
  const Component = getChromeComponent(chromeId)

  if (!Component) {
    return (
      <PreviewShell>
        <div className="cd-detail__error">No component registered for: {chromeId}</div>
      </PreviewShell>
    )
  }

  return (
    <PreviewShell>
      {/* eslint-disable react-hooks/static-components -- component from registry */}
      <Component {...props} />
      {/* eslint-enable react-hooks/static-components */}
    </PreviewShell>
  )
}
