import React, { useMemo } from 'react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'
import { SectionStoryRenderer } from '../../../.storybook/helpers/SectionStoryRenderer'
import { stateArgTypes, stateDefaults } from '../../../.storybook/helpers/state-controls'
import { content } from '../../content/sections/patterns/ProjectShowcase/content'
import { createProjectShowcaseSection } from '../../content/sections/patterns/ProjectShowcase'
import type { ProjectShowcaseProps } from '../../content/sections/patterns/ProjectShowcase/types'
import { getBehaviour } from './registry'
import type { BehaviourState } from '../../schema/experience'

// Ensure behaviours are registered
import './index'

const section = createProjectShowcaseSection(content.sampleContent as ProjectShowcaseProps)

/**
 * Preview that computes CSS variables from multiple behaviours and merges them.
 * Simulates what ComposedBehaviourWrapper does at runtime.
 */
function ComposedPreview({
  behaviourIds,
  args,
}: {
  behaviourIds: string[]
  args: Record<string, unknown>
}) {
  const behaviours = useMemo(
    () => behaviourIds.map((id) => getBehaviour(id)).filter(Boolean),
    [behaviourIds]
  )

  // Collect all unique requires
  const allRequires = useMemo(() => {
    const set = new Set<string>()
    for (const b of behaviours) {
      for (const r of b!.requires ?? []) set.add(r)
    }
    return set
  }, [behaviours])

  // Split args into state vs options
  const { state, options } = useMemo(() => {
    const s: Record<string, unknown> = {}
    const o: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(args)) {
      if (allRequires.has(key)) {
        s[key] = value
      } else {
        o[key] = value
      }
    }
    return { state: s as BehaviourState, options: o }
  }, [args, allRequires])

  // Compute all and merge
  const mergedVars = useMemo(() => {
    const merged: Record<string, string | number> = {}
    for (const b of behaviours) {
      const vars = b!.compute(state, options)
      Object.assign(merged, vars)
    }
    return merged
  }, [behaviours, state, options])

  const entries = Object.entries(mergedVars) as [string, string | number][]

  return (
    <div>
      <div style={mergedVars as React.CSSProperties}>
        <SectionStoryRenderer section={section} />
      </div>

      {/* Debug panel showing which behaviour produced which variables */}
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
            Composed: {behaviourIds.join(' + ')}
          </div>
          {entries.map(([name, value]) => (
            <div key={name}>
              <span style={{ color: '#9cdcfe' }}>{name}</span>
              <span style={{ color: '#666' }}>: </span>
              <span style={{ color: '#ce9178' }}>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Union of all requires from both behaviours
const SCROLL_FADE_REQUIRES = ['scrollProgress', 'sectionVisibility']
const HOVER_REVEAL_REQUIRES = ['isHovered']
const ALL_REQUIRES = [...SCROLL_FADE_REQUIRES, ...HOVER_REVEAL_REQUIRES]

export default {
  title: 'Composed/ComposedBehaviourWrapper',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
  argTypes: {
    ...stateArgTypes(ALL_REQUIRES),
  },
  args: {
    ...stateDefaults(ALL_REQUIRES),
  },
}

export const ScrollFadeAndHoverReveal = {
  render: (args: Record<string, unknown>) => (
    <ComposedPreview
      behaviourIds={['scroll/fade', 'hover/reveal']}
      args={args}
    />
  ),
}

export const ScrollFadeAndVisibilityFadeIn = {
  argTypes: {
    ...stateArgTypes(['scrollProgress', 'sectionVisibility', 'isVisible']),
  },
  args: {
    ...stateDefaults(['scrollProgress', 'sectionVisibility', 'isVisible']),
  },
  render: (args: Record<string, unknown>) => (
    <ComposedPreview
      behaviourIds={['scroll/fade', 'visibility/fade-in']}
      args={args}
    />
  ),
}
