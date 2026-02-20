import React from 'react'
import type { Experience, BehaviourAssignment } from '../../engine/experience/experiences/types'

interface ExperienceShowcaseProps {
  experience: Experience
}

// =============================================================================
// Styles
// =============================================================================

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
    margin: '8px 0 16px',
    fontSize: 15,
    color: '#999',
    maxWidth: 600,
  } satisfies React.CSSProperties,

  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  } satisfies React.CSSProperties,

  categoryBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  } satisfies React.CSSProperties,

  tagBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
    background: '#1a1a2e',
    color: '#7b8cde',
    border: '1px solid #2a2a4e',
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
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#ccc',
  } satisfies React.CSSProperties,

  emptyRow: {
    padding: '12px',
    color: '#555',
    fontStyle: 'italic',
    fontSize: 13,
  } satisfies React.CSSProperties,

  pill: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
    background: '#0d2818',
    color: '#4ade80',
    border: '1px solid #1a3d28',
  } satisfies React.CSSProperties,

  kvRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #1a1a1a',
    fontSize: 13,
  } satisfies React.CSSProperties,

  kvKey: {
    color: '#888',
  } satisfies React.CSSProperties,

  kvValue: {
    color: '#e0e0e0',
    fontFamily: 'monospace',
    fontSize: 12,
  } satisfies React.CSSProperties,

  // Diagram styles
  diagramContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: 24,
    background: '#0d0d0d',
    borderRadius: 6,
    border: '1px solid #1a1a1a',
  } satisfies React.CSSProperties,

  diagramLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#666',
    marginBottom: 4,
  } satisfies React.CSSProperties,

  chromeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 12px',
    background: '#0d0d0d',
    borderRadius: 6,
    border: '1px solid #1a1a1a',
    fontSize: 13,
  } satisfies React.CSSProperties,

  chromeType: {
    fontFamily: 'monospace',
    color: '#9cdcfe',
    fontSize: 12,
  } satisfies React.CSSProperties,

  chromePosition: {
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: '#1a1a2e',
    color: '#7b8cde',
  } satisfies React.CSSProperties,
} as const

// =============================================================================
// Category color map
// =============================================================================

const CATEGORY_COLORS: Record<string, { bg: string; fg: string; border: string }> = {
  simple: { bg: '#1a2a1a', fg: '#4ade80', border: '#2a4a2a' },
  'scroll-driven': { bg: '#1a1a2e', fg: '#818cf8', border: '#2a2a5e' },
  presentation: { bg: '#2e1a1a', fg: '#f87171', border: '#4e2a2a' },
  physics: { bg: '#2e2a1a', fg: '#fbbf24', border: '#4e3a2a' },
}

// =============================================================================
// Presentation Diagram Component
// =============================================================================

function PresentationDiagram({ model }: { model: string }) {
  const blockBase: React.CSSProperties = {
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: '#666',
    letterSpacing: '0.04em',
  }

  const colors = ['#1a2a3a', '#1a3a2a', '#2a2a3a']

  if (model === 'slideshow') {
    return (
      <div style={styles.diagramContainer}>
        <div style={styles.diagramLabel}>{model}</div>
        <div style={{ position: 'relative', width: 200 }}>
          <div
            style={{
              ...blockBase,
              width: 200,
              height: 120,
              background: colors[0],
              border: '1px solid #2a4a5a',
            }}
          >
            ACTIVE
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              marginTop: 10,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i === 0 ? '#818cf8' : '#333',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (model === 'infinite-carousel') {
    return (
      <div style={styles.diagramContainer}>
        <div style={styles.diagramLabel}>{model}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div
            style={{
              ...blockBase,
              width: 120,
              height: 80,
              background: colors[0],
              border: '1px solid #2a4a5a',
            }}
          >
            S1
          </div>
          <div
            style={{
              ...blockBase,
              width: 120,
              height: 80,
              background: colors[1],
              border: '1px solid #2a5a3a',
            }}
          >
            S2
          </div>
        </div>
        <div style={{ fontSize: 18, color: '#555', marginTop: 4 }}>&#x21BB;</div>
      </div>
    )
  }

  if (model === 'cover-scroll') {
    return (
      <div style={styles.diagramContainer}>
        <div style={styles.diagramLabel}>{model}</div>
        <div style={{ position: 'relative', width: 200 }}>
          <div
            style={{
              ...blockBase,
              width: 200,
              height: 60,
              background: colors[0],
              border: '1px solid #2a4a5a',
              opacity: 0.5,
            }}
          >
            PINNED
          </div>
          <div
            style={{
              ...blockBase,
              width: 200,
              height: 50,
              background: colors[1],
              border: '1px solid #2a5a3a',
              marginTop: -10,
              position: 'relative',
              zIndex: 1,
            }}
          >
            SCROLL
          </div>
          <div
            style={{
              ...blockBase,
              width: 200,
              height: 50,
              background: colors[2],
              border: '1px solid #3a3a5a',
              marginTop: 2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            SCROLL
          </div>
        </div>
      </div>
    )
  }

  // Default / stacking / simple
  return (
    <div style={styles.diagramContainer}>
      <div style={styles.diagramLabel}>{model || 'stacking'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 200 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              ...blockBase,
              width: 200,
              height: 50,
              background: colors[i],
              border: `1px solid ${
                i === 0 ? '#2a4a5a' : i === 1 ? '#2a5a3a' : '#3a3a5a'
              }`,
            }}
          >
            S{i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// Behaviour Table Component
// =============================================================================

function BehaviourTable({
  title,
  assignments,
}: {
  title: string
  assignments: Record<string, BehaviourAssignment[]>
}) {
  const entries = Object.entries(assignments)

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {entries.length === 0 ? (
        <div style={styles.emptyRow}>No behaviour assignments</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Section ID</th>
              <th style={styles.th}>Behaviour ID</th>
              <th style={styles.th}>Options</th>
              <th style={styles.th}>Pinned</th>
            </tr>
          </thead>
          <tbody>
            {entries.flatMap(([sectionId, behaviours]) =>
              behaviours.map((b, i) => (
                <tr key={`${sectionId}-${i}`}>
                  <td style={styles.td}>
                    <span style={{ color: '#9cdcfe' }}>{sectionId}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: '#ce9178' }}>{b.behaviour}</span>
                  </td>
                  <td style={styles.td}>
                    {b.options && Object.keys(b.options).length > 0
                      ? JSON.stringify(b.options)
                      : <span style={{ color: '#555' }}>&mdash;</span>}
                  </td>
                  <td style={styles.td}>
                    {b.pinned ? (
                      <span style={{ color: '#4ade80' }}>yes</span>
                    ) : (
                      <span style={{ color: '#555' }}>&mdash;</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

// =============================================================================
// ExperienceShowcase Component
// =============================================================================

/**
 * Documentation-style showcase for Experience stories.
 * Renders metadata, presentation diagrams, behaviour tables,
 * navigation config, constraints, and experience chrome info.
 */
export function ExperienceShowcase({ experience }: ExperienceShowcaseProps) {
  const {
    name,
    description,
    category,
    tags,
    sectionBehaviours,
    chromeBehaviours,
    presentation,
    navigation,
    constraints,
    experienceChrome,
    icon,
    hideChrome,
    hideSections,
    bareMode,
  } = experience

  const catColors = CATEGORY_COLORS[category ?? ''] ?? CATEGORY_COLORS.simple

  return (
    <div style={styles.root}>
      {/* Header */}
      <div>
        <h2 style={styles.h2}>
          {icon ? `${icon} ` : ''}
          {name}
        </h2>
        <p style={styles.description}>{description}</p>
        <div style={styles.badgeRow}>
          {category && (
            <span
              style={{
                ...styles.categoryBadge,
                background: catColors.bg,
                color: catColors.fg,
                border: `1px solid ${catColors.border}`,
              }}
            >
              {category}
            </span>
          )}
          {tags?.map((tag) => (
            <span key={tag} style={styles.tagBadge}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Presentation Model Diagram */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Presentation Model</h3>
        <PresentationDiagram model={presentation?.model ?? 'stacking'} />
        {presentation && (
          <div style={{ marginTop: 16 }}>
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Visibility</span>
              <span style={styles.kvValue}>
                max {presentation.visibility.maxVisible} visible, {presentation.visibility.overlap} overlap,{' '}
                {presentation.visibility.stackDirection} stacking
              </span>
            </div>
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Transition</span>
              <span style={styles.kvValue}>
                {presentation.transition.behaviourId} ({presentation.transition.duration}ms{' '}
                {presentation.transition.easing})
                {presentation.transition.interruptible ? ' interruptible' : ''}
              </span>
            </div>
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Layout</span>
              <span style={styles.kvValue}>
                {presentation.layout.direction}, gap: {presentation.layout.gap}, overflow:{' '}
                {presentation.layout.overflow}
                {presentation.layout.fullViewport ? ', full viewport' : ''}
              </span>
            </div>
            {presentation.ownsPageScroll && (
              <div style={styles.kvRow}>
                <span style={styles.kvKey}>Owns Page Scroll</span>
                <span style={styles.kvValue}>yes</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section Behaviours */}
      <BehaviourTable title="Section Behaviours" assignments={sectionBehaviours} />

      {/* Chrome Behaviours */}
      {chromeBehaviours && Object.keys(chromeBehaviours).length > 0 && (
        <BehaviourTable title="Chrome Behaviours" assignments={chromeBehaviours} />
      )}

      {/* Navigation Config */}
      {navigation && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Navigation</h3>

          <div style={{ marginBottom: 16 }}>
            <div style={{ ...styles.sectionTitle, fontSize: 11, marginBottom: 8 }}>
              Enabled Inputs
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {navigation.inputs
                .filter((input) => input.enabled)
                .map((input) => (
                  <span key={input.type} style={styles.pill}>
                    {input.type}
                  </span>
                ))}
              {navigation.inputs.filter((input) => input.enabled).length === 0 && (
                <span style={styles.emptyRow}>No inputs enabled</span>
              )}
            </div>
          </div>

          <div style={styles.kvRow}>
            <span style={styles.kvKey}>Loop</span>
            <span style={styles.kvValue}>{String(navigation.behavior.loop)}</span>
          </div>
          <div style={styles.kvRow}>
            <span style={styles.kvKey}>Allow Skip</span>
            <span style={styles.kvValue}>{String(navigation.behavior.allowSkip)}</span>
          </div>
          <div style={styles.kvRow}>
            <span style={styles.kvKey}>Lock During Transition</span>
            <span style={styles.kvValue}>{String(navigation.behavior.lockDuringTransition)}</span>
          </div>
          <div style={styles.kvRow}>
            <span style={styles.kvKey}>Debounce</span>
            <span style={styles.kvValue}>{navigation.behavior.debounce}ms</span>
          </div>
          <div style={styles.kvRow}>
            <span style={styles.kvKey}>Active Section Strategy</span>
            <span style={styles.kvValue}>{navigation.activeSection.strategy}</span>
          </div>
          <div style={styles.kvRow}>
            <span style={styles.kvKey}>History</span>
            <span style={styles.kvValue}>
              {[
                navigation.history.updateHash && 'updateHash',
                navigation.history.restoreFromHash && 'restoreFromHash',
                navigation.history.pushState && 'pushState',
              ]
                .filter(Boolean)
                .join(', ') || 'none'}
            </span>
          </div>
        </div>
      )}

      {/* Constraints */}
      {constraints && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Constraints</h3>
          {constraints.fullViewportSections !== undefined && (
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Full Viewport Sections</span>
              <span style={styles.kvValue}>{String(constraints.fullViewportSections)}</span>
            </div>
          )}
          {constraints.maxVisibleSections !== undefined && (
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Max Visible Sections</span>
              <span style={styles.kvValue}>{constraints.maxVisibleSections}</span>
            </div>
          )}
          {constraints.sectionOverflow !== undefined && (
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Section Overflow</span>
              <span style={styles.kvValue}>{constraints.sectionOverflow}</span>
            </div>
          )}
        </div>
      )}

      {/* Experience Chrome */}
      {experienceChrome && experienceChrome.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Experience Chrome</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {experienceChrome.map((chrome, i) => (
              <div key={i} style={styles.chromeItem}>
                <span style={styles.chromeType}>{chrome.type}</span>
                <span style={styles.chromePosition}>{chrome.position}</span>
                {chrome.props && Object.keys(chrome.props).length > 0 && (
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: '#777',
                      marginLeft: 'auto',
                    }}
                  >
                    {JSON.stringify(chrome.props)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visibility Overrides */}
      {((hideChrome && hideChrome.length > 0) ||
        (hideSections && hideSections.length > 0) ||
        bareMode) && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Visibility Overrides</h3>
          {hideChrome && hideChrome.length > 0 && (
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Hidden Chrome</span>
              <span style={styles.kvValue}>{hideChrome.join(', ')}</span>
            </div>
          )}
          {hideSections && hideSections.length > 0 && (
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Hidden Sections</span>
              <span style={styles.kvValue}>{hideSections.join(', ')}</span>
            </div>
          )}
          {bareMode && (
            <div style={styles.kvRow}>
              <span style={styles.kvKey}>Bare Mode</span>
              <span style={{ ...styles.kvValue, color: '#fbbf24' }}>enabled</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
