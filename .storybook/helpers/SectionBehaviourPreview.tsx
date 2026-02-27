import React, { useMemo } from 'react'
import type { Behaviour } from '../../engine/experience/behaviours/types'
import type { BehaviourState, CSSVariables } from '../../engine/schema/experience'
import type { SectionSchema } from '../../engine/schema'
import { SectionStoryRenderer } from './SectionStoryRenderer'

interface SectionBehaviourPreviewProps {
  behaviour: Behaviour
  args: Record<string, unknown>
  section: SectionSchema
}

/**
 * Storybook wrapper that combines behaviour CSS variable computation
 * with production-realistic section rendering.
 *
 * Separates args into state (from behaviour.requires) and options,
 * calls behaviour.compute() to get CSS variables, injects cssTemplate
 * scoped to [data-behaviour-preview], and wraps SectionStoryRenderer
 * so CSS variables cascade into the section via CSS inheritance.
 *
 * A debug panel below shows computed CSS variable names/values.
 */
export function SectionBehaviourPreview({ behaviour, args, section }: SectionBehaviourPreviewProps) {
  const requiresSet = useMemo(
    () => new Set(behaviour.requires ?? []),
    [behaviour.requires]
  )

  const { state, options } = useMemo(() => {
    const s: Record<string, unknown> = {}
    const o: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(args)) {
      if (requiresSet.has(key)) {
        s[key] = value
      } else {
        o[key] = value
      }
    }
    return { state: s as BehaviourState, options: o }
  }, [args, requiresSet])

  const cssVars = useMemo(
    () => behaviour.compute(state, options),
    [behaviour, state, options]
  )

  const wrappedCss = useMemo(() => {
    if (!behaviour.cssTemplate) return null
    return `[data-behaviour-preview] { ${behaviour.cssTemplate} }`
  }, [behaviour.cssTemplate])

  const entries = Object.entries(cssVars) as [string, string | number][]

  return (
    <div>
      {wrappedCss && <style>{wrappedCss}</style>}
      <div
        data-behaviour-preview=""
        style={cssVars as React.CSSProperties}
      >
        <SectionStoryRenderer section={section} />
      </div>
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
