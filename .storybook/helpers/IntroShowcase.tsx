import React, { useMemo } from 'react'
import type { IntroMeta, IntroConfig, SequenceStepConfig } from '../../engine/intro/types'

interface IntroShowcaseProps {
  meta: IntroMeta
  config: IntroConfig
}

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const colors = {
  bg: '#0a0a0a',
  surface: '#141414',
  border: '#262626',
  text: '#e0e0e0',
  textMuted: '#888',
  textDim: '#666',
  amber: '#f59e0b',
  amberDim: '#78350f',
  blue: '#3b82f6',
  blueDim: '#1e3a5f',
  green: '#22c55e',
  greenDim: '#14532d',
  purple: '#a78bfa',
  cyan: '#22d3ee',
  pink: '#f472b6',
  orange: '#fb923c',
  mono: "'SF Mono', 'Cascadia Code', 'Fira Code', monospace",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const

const stepColors = [
  '#3b82f6',
  '#a78bfa',
  '#f472b6',
  '#22d3ee',
  '#fb923c',
  '#22c55e',
  '#f87171',
  '#facc15',
]

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function formatMs(ms: number): string {
  if (ms >= 1000) {
    const s = ms / 1000
    return Number.isInteger(s) ? `${s}s` : `${s.toFixed(1)}s`
  }
  return `${ms}ms`
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return `"${value}"`
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function getTotalDuration(config: IntroConfig): number | null {
  const { pattern, settings } = config
  if (pattern === 'timed' && settings?.duration != null) {
    return Number(settings.duration)
  }
  if (pattern === 'video-gate' && settings?.targetTime != null) {
    return Number(settings.targetTime) * 1000 // targetTime is in seconds
  }
  if (pattern === 'sequence-timed' && Array.isArray(settings?.steps)) {
    const steps = settings.steps as SequenceStepConfig[]
    if (steps.length === 0) return null
    return Math.max(...steps.map((s) => s.at + s.duration))
  }
  return null
}

function getCategoryLabel(category?: string): string {
  switch (category) {
    case 'gate':
      return 'Gate'
    case 'reveal':
      return 'Reveal'
    case 'sequence':
      return 'Sequence'
    default:
      return 'Uncategorized'
  }
}

function getCategoryColor(category?: string): string {
  switch (category) {
    case 'gate':
      return colors.amber
    case 'reveal':
      return colors.blue
    case 'sequence':
      return colors.purple
    default:
      return colors.textMuted
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: colors.mono,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        margin: '0 0 12px 0',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: colors.sans,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: colors.textMuted,
      }}
    >
      {children}
    </h3>
  )
}

function PhaseTimeline({ totalMs }: { totalMs: number }) {
  // Approximate phase distribution: locked takes bulk, short reveal, instant ready
  const lockedPct = 70
  const revealPct = 25
  const readyPct = 5

  const segments = [
    { label: 'Locked', pct: lockedPct, color: colors.amber, dimColor: colors.amberDim },
    { label: 'Revealing', pct: revealPct, color: colors.blue, dimColor: colors.blueDim },
    { label: 'Ready', pct: readyPct, color: colors.green, dimColor: colors.greenDim },
  ]

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <SectionTitle>Phase Timeline</SectionTitle>
        <span
          style={{
            fontSize: 12,
            fontFamily: colors.mono,
            color: colors.textMuted,
          }}
        >
          Total: {formatMs(totalMs)}
        </span>
      </div>

      {/* Bar */}
      <div
        style={{
          display: 'flex',
          height: 28,
          borderRadius: 6,
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
        }}
      >
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{
              flex: `${seg.pct} 0 0%`,
              background: `linear-gradient(135deg, ${seg.dimColor}, ${seg.color}30)`,
              borderRight: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                fontFamily: colors.mono,
                color: seg.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {seg.label}
            </span>
          </div>
        ))}
      </div>

      {/* Labels below */}
      <div style={{ display: 'flex', marginTop: 4 }}>
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{
              flex: `${seg.pct} 0 0%`,
              textAlign: 'center',
              fontSize: 10,
              fontFamily: colors.mono,
              color: colors.textDim,
            }}
          >
            {seg.label.toLowerCase()}
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTable({ settings }: { settings: Record<string, unknown> }) {
  const entries = Object.entries(settings).filter(([key]) => key !== 'steps')

  if (entries.length === 0) return null

  return (
    <div>
      <SectionTitle>Settings</SectionTitle>
      <div
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        {entries.map(([key, value], i) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderBottom: i < entries.length - 1 ? `1px solid ${colors.border}` : undefined,
              background: i % 2 === 0 ? colors.surface : 'transparent',
            }}
          >
            <span
              style={{
                flex: '0 0 160px',
                fontSize: 12,
                fontFamily: colors.mono,
                color: colors.cyan,
              }}
            >
              {key}
            </span>
            <span
              style={{
                fontSize: 12,
                fontFamily: colors.mono,
                color:
                  typeof value === 'boolean'
                    ? value
                      ? colors.green
                      : colors.amber
                    : typeof value === 'number'
                      ? colors.orange
                      : colors.text,
              }}
            >
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function OverlayInfo({ overlay }: { overlay: NonNullable<IntroConfig['overlay']> }) {
  const propEntries = overlay.props ? Object.entries(overlay.props) : []

  return (
    <div>
      <SectionTitle>Overlay</SectionTitle>
      <div
        style={{
          padding: 12,
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          background: colors.surface,
        }}
      >
        <div style={{ marginBottom: propEntries.length > 0 ? 8 : 0 }}>
          <span
            style={{
              fontSize: 11,
              fontFamily: colors.mono,
              color: colors.textMuted,
              marginRight: 8,
            }}
          >
            component
          </span>
          <span
            style={{
              fontSize: 13,
              fontFamily: colors.mono,
              fontWeight: 600,
              color: colors.purple,
            }}
          >
            {overlay.component}
          </span>
        </div>

        {propEntries.length > 0 && (
          <div
            style={{
              paddingTop: 8,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            {propEntries.map(([key, value]) => (
              <div key={key} style={{ padding: '2px 0' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: colors.mono,
                    color: colors.cyan,
                    marginRight: 8,
                  }}
                >
                  {key}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: colors.mono,
                    color: colors.text,
                  }}
                >
                  {formatValue(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StepsTimeline({ steps }: { steps: SequenceStepConfig[] }) {
  if (steps.length === 0) return null

  const totalDuration = Math.max(...steps.map((s) => s.at + s.duration))

  return (
    <div>
      <SectionTitle>Steps</SectionTitle>

      {/* Visual timeline */}
      <div
        style={{
          position: 'relative',
          border: `1px solid ${colors.border}`,
          borderRadius: 6,
          background: colors.surface,
          padding: 16,
        }}
      >
        {/* Time axis */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 12,
            fontSize: 10,
            fontFamily: colors.mono,
            color: colors.textDim,
          }}
        >
          <span>0ms</span>
          <span>{formatMs(totalDuration)}</span>
        </div>

        {/* Track background */}
        <div
          style={{
            position: 'relative',
            background: '#1a1a1a',
            borderRadius: 4,
            height: steps.length * 36 + 4,
            border: `1px solid ${colors.border}`,
          }}
        >
          {steps.map((step, i) => {
            const leftPct = (step.at / totalDuration) * 100
            const widthPct = (step.duration / totalDuration) * 100
            const color = stepColors[i % stepColors.length]

            return (
              <div
                key={step.id}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  top: i * 36 + 4,
                  height: 28,
                  background: `${color}30`,
                  border: `1px solid ${color}60`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: colors.mono,
                    fontWeight: 600,
                    color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.id}
                </span>
              </div>
            )
          })}
        </div>

        {/* Step details list */}
        <div style={{ marginTop: 16 }}>
          {steps.map((step, i) => {
            const color = stepColors[i % stepColors.length]
            const hasActions =
              step.actions &&
              (step.actions.setChromeVisible !== undefined ||
                step.actions.setScrollLocked !== undefined)

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '6px 0',
                  borderBottom:
                    i < steps.length - 1 ? `1px solid ${colors.border}` : undefined,
                }}
              >
                {/* Color indicator */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                />

                {/* Step info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: hasActions ? 4 : 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: colors.mono,
                        fontWeight: 600,
                        color,
                      }}
                    >
                      {step.id}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: colors.mono,
                        color: colors.textDim,
                      }}
                    >
                      at {formatMs(step.at)}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: colors.mono,
                        color: colors.textDim,
                      }}
                    >
                      duration {formatMs(step.duration)}
                    </span>
                  </div>

                  {hasActions && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      {step.actions!.setChromeVisible !== undefined && (
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: colors.mono,
                            padding: '1px 6px',
                            borderRadius: 3,
                            background: step.actions!.setChromeVisible
                              ? `${colors.green}20`
                              : `${colors.amber}20`,
                            color: step.actions!.setChromeVisible
                              ? colors.green
                              : colors.amber,
                          }}
                        >
                          chrome: {step.actions!.setChromeVisible ? 'visible' : 'hidden'}
                        </span>
                      )}
                      {step.actions!.setScrollLocked !== undefined && (
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: colors.mono,
                            padding: '1px 6px',
                            borderRadius: 3,
                            background: step.actions!.setScrollLocked
                              ? `${colors.amber}20`
                              : `${colors.green}20`,
                            color: step.actions!.setScrollLocked
                              ? colors.amber
                              : colors.green,
                          }}
                        >
                          scroll: {step.actions!.setScrollLocked ? 'locked' : 'unlocked'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Documentation-style showcase component for Intro stories in Storybook.
 * Renders metadata, phase timeline, settings, overlay info, and step details
 * for a given intro sequence configuration.
 */
export function IntroShowcase({ meta, config }: IntroShowcaseProps) {
  const totalDuration = useMemo(() => getTotalDuration(config), [config])
  const steps = useMemo(() => {
    if (config.pattern === 'sequence-timed' && Array.isArray(config.settings?.steps)) {
      return config.settings.steps as SequenceStepConfig[]
    }
    return null
  }, [config])

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        fontFamily: colors.sans,
        padding: 32,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}
        >
          {meta.icon && (
            <span style={{ fontSize: 24 }}>{meta.icon}</span>
          )}
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              fontFamily: colors.sans,
              color: colors.text,
            }}
          >
            {meta.name}
          </h2>
        </div>

        <p
          style={{
            margin: '8px 0 12px 0',
            fontSize: 14,
            lineHeight: 1.6,
            color: colors.textMuted,
            maxWidth: 600,
          }}
        >
          {meta.description}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <Badge label={getCategoryLabel(meta.category)} color={getCategoryColor(meta.category)} />
          <Badge label={config.pattern} color={colors.blue} />
        </div>
      </div>

      {/* Phase Timeline */}
      {totalDuration != null && (
        <div style={{ marginBottom: 32 }}>
          <PhaseTimeline totalMs={totalDuration} />
        </div>
      )}

      {/* Settings Table */}
      {config.settings && Object.keys(config.settings).filter((k) => k !== 'steps').length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SettingsTable settings={config.settings} />
        </div>
      )}

      {/* Overlay Info */}
      {config.overlay && (
        <div style={{ marginBottom: 32 }}>
          <OverlayInfo overlay={config.overlay} />
        </div>
      )}

      {/* Steps (sequence-timed only) */}
      {steps && steps.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <StepsTimeline steps={steps} />
        </div>
      )}
    </div>
  )
}
