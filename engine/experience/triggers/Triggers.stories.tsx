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

  storeField: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    background: '#0d2818',
    color: '#4ade80',
    border: '1px solid #1a3d28',
    marginRight: 4,
    marginBottom: 4,
  } satisfies React.CSSProperties,
} as const

const TRIGGERS = [
  {
    name: 'useScrollProgress',
    hook: 'useScrollProgress()',
    storeFields: ['scrollProgress', 'isScrolling'],
    description: 'Tracks scroll position (0-1) and scrolling state. Container-aware.',
    browserEvent: 'scroll',
  },
  {
    name: 'useIntersection',
    hook: 'useIntersection()',
    storeFields: ['sectionVisibilities'],
    description: 'Tracks section visibility via IntersectionObserver. Auto-discovers [data-section-id] elements. MutationObserver for dynamic sections.',
    browserEvent: 'IntersectionObserver',
  },
  {
    name: 'usePrefersReducedMotion',
    hook: 'usePrefersReducedMotion()',
    storeFields: ['prefersReducedMotion'],
    description: 'Tracks prefers-reduced-motion media query. Supports dynamic changes.',
    browserEvent: 'matchMedia change',
  },
  {
    name: 'useViewport',
    hook: 'useViewport()',
    storeFields: ['viewportHeight'],
    description: 'Tracks viewport dimensions with debounced resize. Container-aware.',
    browserEvent: 'resize',
  },
  {
    name: 'useCursorPosition',
    hook: 'useCursorPosition()',
    storeFields: ['cursorX', 'cursorY'],
    description: 'Tracks cursor position in pixels. Throttled at 60fps. Container-relative in contained mode.',
    browserEvent: 'mousemove',
  },
]

function TriggersDocs() {
  return (
    <div style={styles.root}>
      <h2 style={styles.h2}>Triggers</h2>
      <p style={styles.description}>
        Browser event observers that write state to the experience store.
        They are the input side of the L2 animation pipeline — behaviours consume what triggers produce.
      </p>

      {/* Data Flow Diagram */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Trigger Data Flow</h3>
        <div style={styles.diagram}>
{`Browser Event (scroll, resize, mousemove, IntersectionObserver)
       ↓
   Trigger Hook (useScrollProgress, useIntersection, ...)
       ↓
   Zustand Experience Store
       ↓
   BehaviourWrapper reads store state
       ↓
   behaviour.compute(state) → CSS Variables`}
        </div>
      </div>

      {/* Trigger Inventory */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Trigger Inventory</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Trigger</th>
              <th style={styles.th}>Browser Event</th>
              <th style={styles.th}>Store Fields</th>
              <th style={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody>
            {TRIGGERS.map((t) => (
              <tr key={t.name}>
                <td style={styles.td}>
                  <span style={styles.code}>{t.hook}</span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.code, color: '#ce9178' }}>{t.browserEvent}</span>
                </td>
                <td style={styles.td}>
                  {t.storeFields.map((f) => (
                    <span key={f} style={styles.storeField}>{f}</span>
                  ))}
                </td>
                <td style={styles.td}>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TriggerInitializer */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>TriggerInitializer</h3>
        <p style={{ margin: 0, fontSize: 13, color: '#999', lineHeight: 1.8 }}>
          The <span style={styles.code}>TriggerInitializer</span> component orchestrates all triggers.
          It mounts after <span style={styles.code}>ExperienceProvider</span> in the component hierarchy
          and initializes every trigger hook, ensuring browser events flow into the store.
          Container-aware — triggers observe the container element in contained mode instead of window/document.
        </p>
      </div>

      {/* Relationship to Behaviours */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Trigger → Behaviour Mapping</h3>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#999' }}>
          Triggers write state. Behaviours consume state. The mapping is implicit via store field names:
        </p>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Store Field</th>
              <th style={styles.th}>Written by</th>
              <th style={styles.th}>Consumed by</th>
            </tr>
          </thead>
          <tbody>
            {[
              { field: 'scrollProgress', writer: 'useScrollProgress', consumers: 'scroll/fade, scroll/fade-out, scroll/progress, scroll/collapse' },
              { field: 'sectionVisibilities', writer: 'useIntersection', consumers: 'visibility/fade-in, visibility/center' },
              { field: 'prefersReducedMotion', writer: 'usePrefersReducedMotion', consumers: 'All behaviours (fallback path)' },
              { field: 'viewportHeight', writer: 'useViewport', consumers: 'scroll/cover-progress, experiences' },
              { field: 'cursorX, cursorY', writer: 'useCursorPosition', consumers: 'CursorLabel overlay' },
            ].map((row) => (
              <tr key={row.field}>
                <td style={styles.td}><span style={styles.storeField}>{row.field}</span></td>
                <td style={styles.td}><span style={styles.code}>{row.writer}</span></td>
                <td style={styles.td}><span style={{ ...styles.code, color: '#ce9178' }}>{row.consumers}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default {
  title: 'Triggers',
  parameters: { layout: 'fullscreen' },
  decorators: [EngineDecorator],
}

export const Default = {
  render: () => <TriggersDocs />,
}
