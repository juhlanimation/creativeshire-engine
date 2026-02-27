import React, { useMemo, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CSSVarDef {
  name: string // e.g. "--fade-opacity"
  initial: string // e.g. "0"
  final: string // e.g. "1"
  description?: string
}

interface EffectCSSPreviewProps {
  effectName: string // data-effect value, e.g. "fade-reveal"
  cssVariables: CSSVarDef[] // Variable definitions with initial/final states
  children?: React.ReactNode // Optional custom sample content (default: a styled card)
}

// ---------------------------------------------------------------------------
// Default sample content (similar to ScrollSample)
// ---------------------------------------------------------------------------

const colors = {
  bg: '#1e1e2e',
  text: '#e0e0e0',
  textMuted: '#999',
}

function DefaultSample() {
  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: colors.bg,
        color: colors.text,
        borderRadius: 8,
        maxWidth: 400,
        width: '100%',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
        Effect Preview
      </h2>
      <p style={{ margin: 0, lineHeight: 1.6, color: colors.textMuted }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <div
        style={{
          width: '100%',
          height: 120,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #6c63ff 0%, #e040fb 100%)',
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// EffectCSSPreview
// ---------------------------------------------------------------------------

/**
 * Storybook helper for showcasing Effect CSS files.
 *
 * Renders a sample element with a `data-effect` attribute, provides a toggle
 * button to switch between initial and final CSS variable values, and shows
 * a debug panel with current variable state.
 *
 * The CSS transitions defined in the effect files animate live when toggled.
 */
export function EffectCSSPreview({
  effectName,
  cssVariables,
  children,
}: EffectCSSPreviewProps) {
  const [active, setActive] = useState(false)

  const cssVarStyle = useMemo(() => {
    const style: Record<string, string> = {}
    for (const v of cssVariables) {
      style[v.name] = active ? v.final : v.initial
    }
    return style
  }, [cssVariables, active])

  const entries = useMemo(
    () =>
      cssVariables.map((v) => ({
        name: v.name,
        value: active ? v.final : v.initial,
        description: v.description,
      })),
    [cssVariables, active]
  )

  return (
    <div>
      {/* Toggle button */}
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setActive((prev) => !prev)}
          style={{
            padding: '8px 20px',
            fontSize: 13,
            fontFamily: 'monospace',
            fontWeight: 600,
            color: active ? '#111' : '#e0e0e0',
            background: active ? '#6c63ff' : '#333',
            border: '1px solid #555',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'background 200ms ease, color 200ms ease',
          }}
        >
          {active ? 'Active (Final)' : 'Inactive (Initial)'} — Toggle Effect
        </button>
      </div>

      {/* Preview area with data-effect and CSS variable inline styles */}
      <div
        data-effect={effectName}
        style={
          {
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...cssVarStyle,
          } as React.CSSProperties
        }
      >
        {children ?? <DefaultSample />}
      </div>

      {/* Debug panel — matching BehaviourPreview style */}
      {entries.length > 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#111',
            color: '#ccc',
            fontFamily: 'monospace',
            fontSize: 12,
            borderRadius: 4,
            lineHeight: 1.8,
          }}
        >
          <div
            style={{
              marginBottom: 8,
              fontSize: 11,
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            data-effect=&quot;{effectName}&quot;
            {' — '}
            {active ? 'final' : 'initial'}
          </div>
          {entries.map((entry) => (
            <div key={entry.name}>
              <span style={{ color: '#9cdcfe' }}>{entry.name}</span>
              <span style={{ color: '#666' }}>: </span>
              <span style={{ color: '#ce9178' }}>{entry.value}</span>
              {entry.description && (
                <span style={{ color: '#555', marginLeft: 12 }}>
                  // {entry.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { CSSVarDef, EffectCSSPreviewProps }
