import React from 'react'

// ---------------------------------------------------------------------------
// Sample content components for BehaviourPreview stories.
// Pure presentational — no engine dependencies. All styles inline.
// ---------------------------------------------------------------------------

const colors = {
  bg: 'var(--color-background, #1e1e2e)',
  surface: 'var(--color-surface, #2a2a3c)',
  text: 'var(--color-text, #e0e0e0)',
  textMuted: 'var(--color-text-muted, #999)',
  accent: 'var(--color-accent, #6c63ff)',
}

// ---------------------------------------------------------------------------
// 1. ScrollSample
// ---------------------------------------------------------------------------

export function ScrollSample() {
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
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
        Section Content
      </h2>
      <p style={{ margin: 0, lineHeight: 1.6, color: colors.textMuted }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
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
// 2. HoverSample
// ---------------------------------------------------------------------------

export function HoverSample() {
  return (
    <div
      style={{
        position: 'relative',
        width: 200,
        background: colors.surface,
        borderRadius: 8,
        overflow: 'hidden',
        color: colors.text,
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 200,
          height: 200,
          background: 'linear-gradient(160deg, #4a90d9 0%, #6c63ff 100%)',
        }}
      />

      {/* Hover overlay — controlled via CSS variables */}
      <div
        className="hover-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          opacity: 'var(--hover-reveal-opacity, 0)' as any,
          transform: 'scale(var(--hover-reveal-scale, 0.95))' as any,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
          View Project
        </span>
      </div>

      {/* Title below thumbnail */}
      <div style={{ padding: '0.75rem 1rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Project Title
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 3. VisibilitySample
// ---------------------------------------------------------------------------

export function VisibilitySample() {
  const lines = ['First line', 'Second line', 'Third line']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '2rem',
        background: colors.bg,
        borderRadius: 8,
        color: colors.text,
      }}
    >
      {lines.map((text, i) => (
        <div
          key={i}
          style={{
            fontSize: '1.1rem',
            fontWeight: 500,
            padding: '0.5rem 1rem',
            background: colors.surface,
            borderRadius: 4,
            borderLeft: `3px solid ${colors.accent}`,
          }}
        >
          {text}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 4. AnimationSample
// ---------------------------------------------------------------------------

const marqueeColors = [
  'tomato',
  'orange',
  'gold',
  'lime',
  'cyan',
  'violet',
] as const

export function AnimationSample() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '1.5rem',
        background: colors.bg,
        borderRadius: 8,
      }}
    >
      {marqueeColors.map((color) => (
        <div
          key={color}
          style={{
            width: 40,
            height: 40,
            borderRadius: 4,
            background: color,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 5. InteractionSample
// ---------------------------------------------------------------------------

export function InteractionSample() {
  return (
    <div
      style={{
        padding: '1.5rem',
        background: colors.surface,
        borderRadius: 8,
        color: colors.text,
        width: 260,
      }}
    >
      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
        Toggle Me
      </h3>

      {/* Collapsible panel — controlled via --active CSS variable */}
      <div
        style={{
          marginTop: '0.75rem',
          overflow: 'hidden',
          maxHeight: 'calc(var(--active, 0) * 200px)' as any,
          opacity: 'var(--active, 0)' as any,
          transition: 'max-height 0.35s ease, opacity 0.3s ease',
        }}
      >
        <div
          style={{
            padding: '0.75rem 0',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            color: colors.textMuted,
            borderTop: `1px solid ${colors.bg}`,
          }}
        >
          Expanded content goes here with more details.
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 6. VideoSample
// ---------------------------------------------------------------------------

export function VideoSample() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        background: '#1a1a1a',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.textMuted,
      }}
    >
      {/* Frame counter */}
      <span
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
        }}
      >
        00:00
      </span>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 3,
          background: 'rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            width: '0%',
            height: '100%',
            background: colors.accent,
          }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 7. IntroSample
// ---------------------------------------------------------------------------

export function IntroSample() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: colors.bg,
        borderRadius: 8,
        overflow: 'hidden',
        color: colors.text,
      }}
    >
      {/* Simulated chrome bar */}
      <div
        style={{
          height: 48,
          background: '#111',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          gap: '0.5rem',
          flexShrink: 0,
        }}
      >
        {/* Dot indicators */}
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <div
            key={c}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: c,
            }}
          />
        ))}
      </div>

      {/* Main content area — respects intro CSS variables */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          opacity: 'var(--intro-content-opacity, 1)' as any,
          transform:
            'scale(var(--intro-content-scale, 1))' as any,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Content Area
        </span>
      </div>
    </div>
  )
}
