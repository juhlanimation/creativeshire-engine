/**
 * PreviewShell — shared wrapper for component previews in the registry browser.
 * Provides minimal rendering context: theme vars, container query, error boundary,
 * and ExperienceProvider so layout widgets can use WidgetRenderer internally.
 */

'use client'

import { useState, type ReactNode } from 'react'
import { ExperienceProvider, simpleExperience, createExperienceStore } from '../../../../engine/experience'
import { PreviewErrorBoundary } from './PreviewErrorBoundary'

interface PreviewShellProps {
  children: ReactNode
  label?: string
}

// Stable store reference — created once at module level
const previewStore = createExperienceStore(simpleExperience)

const PREVIEW_STYLE: React.CSSProperties = {
  '--font-title': 'system-ui, sans-serif',
  '--font-paragraph': 'system-ui, sans-serif',
  '--font-ui': 'system-ui, sans-serif',
  '--site-max-width': '1200px',
  containerType: 'inline-size',
  position: 'relative',
  background: '#111',
  minHeight: '120px',
  padding: '24px',
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
} as React.CSSProperties

/** Heading styles so h1-h6 render visibly different from <p> in preview */
const HEADING_STYLES = `
  [data-engine-container] h1 { font-size: 2em; font-weight: 700; line-height: 1.2; margin: 0; }
  [data-engine-container] h2 { font-size: 1.5em; font-weight: 700; line-height: 1.25; margin: 0; }
  [data-engine-container] h3 { font-size: 1.25em; font-weight: 600; line-height: 1.3; margin: 0; }
  [data-engine-container] h4 { font-size: 1.1em; font-weight: 600; line-height: 1.35; margin: 0; }
  [data-engine-container] h5 { font-size: 1em; font-weight: 600; line-height: 1.4; margin: 0; }
  [data-engine-container] h6 { font-size: 0.9em; font-weight: 600; line-height: 1.4; margin: 0; }
  [data-engine-container] p { font-size: 1em; font-weight: 400; line-height: 1.5; margin: 0; }
  [data-engine-container] span { font-size: 1em; font-weight: 400; line-height: 1.5; }
`

export function PreviewShell({ children, label = 'Preview' }: PreviewShellProps) {
  const [visible, setVisible] = useState(true)

  return (
    <div className="cd-preview-shell">
      <button
        className="cd-preview-shell__toggle"
        onClick={() => setVisible((v) => !v)}
      >
        <span className="cd-preview-shell__label">{label}</span>
        <span className="cd-preview-shell__arrow">{visible ? '\u25BC' : '\u25B6'}</span>
      </button>
      {visible && (
        <div className="cd-preview-shell__viewport">
          <div className="cd-preview-shell__chrome">
            <span className="cd-preview-shell__dot" />
            <span className="cd-preview-shell__dot" />
            <span className="cd-preview-shell__dot" />
          </div>
          <div style={PREVIEW_STYLE} data-engine-container>
            <style dangerouslySetInnerHTML={{ __html: HEADING_STYLES }} />
            <ExperienceProvider experience={simpleExperience} store={previewStore}>
              <PreviewErrorBoundary>
                {children}
              </PreviewErrorBoundary>
            </ExperienceProvider>
          </div>
        </div>
      )}
    </div>
  )
}
