import React from 'react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'

const styles = {
  root: {
    background: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: 32,
    minHeight: '100vh',
    lineHeight: 1.6,
  } satisfies React.CSSProperties,

  h2: {
    margin: 0,
    fontSize: 28,
    fontWeight: 600,
    color: '#ffffff',
    letterSpacing: '-0.02em',
  } satisfies React.CSSProperties,

  description: {
    margin: '8px 0 24px',
    fontSize: 15,
    color: '#999',
    maxWidth: 600,
  } satisfies React.CSSProperties,

  section: {
    marginTop: 32,
    padding: 24,
    background: '#111',
    borderRadius: 8,
    border: '1px solid #222',
  } satisfies React.CSSProperties,

  sectionTitle: {
    margin: '0 0 16px',
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#666',
  } satisfies React.CSSProperties,

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  } satisfies React.CSSProperties,

  th: {
    textAlign: 'left',
    padding: '8px 12px',
    borderBottom: '1px solid #333',
    color: '#888',
    fontWeight: 500,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  } satisfies React.CSSProperties,

  td: {
    padding: '8px 12px',
    borderBottom: '1px solid #1a1a1a',
    fontSize: 12,
    color: '#ccc',
  } satisfies React.CSSProperties,

  code: {
    fontFamily: 'monospace',
    color: '#9cdcfe',
    fontSize: 12,
  } satisfies React.CSSProperties,

  diagram: {
    padding: 24,
    background: '#0d0d0d',
    borderRadius: 6,
    border: '1px solid #1a1a1a',
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
    lineHeight: 2,
    whiteSpace: 'pre',
  } satisfies React.CSSProperties,

  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
  } satisfies React.CSSProperties,
} as const

const DRIVERS = [
  {
    name: 'ScrollDriver',
    type: 'Class',
    export: 'ScrollDriver',
    description: 'Primary scroll driver. RAF loop applies CSS variables at 60fps. IntersectionObserver for per-element visibility. Container-aware.',
    behaviours: 'scroll/fade, scroll/fade-out, scroll/progress, scroll/color-shift, scroll/image-cycle, scroll/reveal',
  },
  {
    name: 'MomentumDriver',
    type: 'Class',
    export: 'MomentumDriver',
    description: 'Physics-based driver for infinite carousel. Friction, snapping, wheel/touch interception. Updates Zustand store.',
    behaviours: 'infinite-carousel experience',
  },
  {
    name: 'useScrollFadeDriver',
    type: 'Hook (legacy)',
    export: 'useScrollFadeDriver',
    description: 'GSAP ScrollTrigger driver for scroll-fade. Legacy pattern — new code uses ScrollDriver.',
    behaviours: 'scroll/fade, scroll/fade-out',
  },
  {
    name: 'useSmoothScrollContainer',
    type: 'Hook',
    export: 'useSmoothScrollContainer',
    description: 'GSAP tween-based smooth scrolling for any container element. Device-aware with boundary callbacks.',
    behaviours: '(scroll enhancement, not a behaviour driver)',
  },
  {
    name: 'SmoothScrollProvider',
    type: 'Provider',
    export: 'SmoothScrollProvider',
    description: 'GSAP ScrollSmoother integration for page-level smooth scrolling. Device-aware, disabled in contained mode.',
    behaviours: '(scroll enhancement)',
  },
  {
    name: 'LenisSmoothScrollProvider',
    type: 'Provider',
    export: 'LenisSmoothScrollProvider',
    description: 'Lenis smooth scroll — lighter alternative to ScrollSmoother. Container-aware for iframe/preview.',
    behaviours: '(scroll enhancement)',
  },
  {
    name: 'ScrollLockProvider',
    type: 'Provider',
    export: 'ScrollLockProvider, useScrollLock',
    description: 'Key-based scroll lock service. Any system (intro, modal, transition) can lock(key) / unlock(key). Capture-phase blocking.',
    behaviours: '(scroll control, not a behaviour driver)',
  },
  {
    name: 'getDriver / releaseDriver',
    type: 'Factory',
    export: 'getDriver, releaseDriver',
    description: 'Container-aware driver singleton factory. One driver per container (null = window). Used by BehaviourWrapper.',
    behaviours: '(driver lifecycle)',
  },
]

function DriversDocs() {
  return (
    <div style={styles.root}>
      <h2 style={styles.h2}>Drivers</h2>
      <p style={styles.description}>
        Continuous 60fps infrastructure that bridges L2 behaviours to the DOM.
        Drivers listen to browser events and apply CSS variables via element.style.setProperty().
      </p>

      {/* Architecture Diagram */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Animation Pipeline</h3>
        <div style={styles.diagram}>
{`Browser Event (scroll, resize, mousemove)
       ↓
   Driver (RAF loop @ 60fps)
       ↓
   behaviour.compute(state, options)
       ↓
   CSS Variables (--fade-opacity, --scroll-progress, ...)
       ↓
   element.style.setProperty()
       ↓
   Effect CSS responds ([data-effect] selectors)
       ↓
   Browser Paints`}
        </div>
      </div>

      {/* Driver Inventory */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Driver Inventory</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Driver</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Behaviours Served</th>
            </tr>
          </thead>
          <tbody>
            {DRIVERS.map((d) => (
              <tr key={d.name}>
                <td style={styles.td}>
                  <span style={styles.code}>{d.name}</span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: d.type === 'Class' ? '#1a2a1a' : d.type.startsWith('Hook') ? '#1a1a2e' : '#2e2a1a',
                      color: d.type === 'Class' ? '#4ade80' : d.type.startsWith('Hook') ? '#818cf8' : '#fbbf24',
                      border: `1px solid ${d.type === 'Class' ? '#2a4a2a' : d.type.startsWith('Hook') ? '#2a2a5e' : '#4e3a2a'}`,
                    }}
                  >
                    {d.type}
                  </span>
                </td>
                <td style={styles.td}>{d.description}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.code, color: '#ce9178' }}>{d.behaviours}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Container Awareness */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Container Awareness</h3>
        <p style={{ margin: 0, fontSize: 13, color: '#999', lineHeight: 1.8 }}>
          All drivers support two modes: <strong style={{ color: '#e0e0e0' }}>fullpage</strong> (window scroll)
          and <strong style={{ color: '#e0e0e0' }}>contained</strong> (iframe/preview scroll).
          The <span style={styles.code}>getDriver(container)</span> factory returns one driver per container.
          Pass <span style={styles.code}>null</span> for window, or a container element for contained mode.
        </p>
      </div>
    </div>
  )
}

export default {
  title: 'Drivers',
  parameters: { layout: 'fullscreen' },
  decorators: [EngineDecorator],
}

export const Default = {
  render: () => <DriversDocs />,
}
