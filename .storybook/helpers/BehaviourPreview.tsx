import React, { useMemo } from 'react'
import type { Behaviour } from '../../engine/experience/behaviours/types'
import type { BehaviourState, CSSVariables } from '../../engine/schema/experience'

interface BehaviourPreviewProps {
  behaviour: Behaviour
  args: Record<string, unknown>
  children: React.ReactNode
}

/**
 * Storybook wrapper for behaviour stories.
 * Calls behaviour.compute() with separated state/options from args,
 * applies resulting CSS variables as inline styles, injects cssTemplate,
 * and renders a debug panel showing computed variable values.
 */
export function BehaviourPreview({ behaviour, args, children }: BehaviourPreviewProps) {
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
        style={{ minHeight: 300, ...cssVars } as React.CSSProperties}
      >
        {children}
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
