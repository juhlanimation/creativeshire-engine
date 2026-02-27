import React, { useCallback, useRef, useState } from 'react'
import { resolveEffect } from '../../engine/experience/timeline/primitives/registry'
import { createEffectTrack } from '../../engine/experience/timeline/effect-track'
import type { EffectPrimitive, EffectOptions } from '../../engine/experience/timeline/primitives/types'
// Side-effect import ensures all primitives are registered
import '../../engine/experience/timeline/primitives'

interface EffectPrimitivePreviewProps {
  effectId: string
  duration?: number
  ease?: string
}

const TARGET_STYLES: React.CSSProperties = {
  width: 300,
  minHeight: 200,
  padding: 24,
  borderRadius: 8,
  background: 'linear-gradient(135deg, #6c63ff, #e040fb)',
  color: '#fff',
  fontFamily: 'sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
}

const BUTTON_STYLES: React.CSSProperties = {
  padding: '6px 16px',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontFamily: 'monospace',
  fontSize: 13,
  fontWeight: 600,
}

function applyInlineStyles(el: HTMLElement, styles: React.CSSProperties) {
  el.removeAttribute('style')
  for (const [key, value] of Object.entries(styles)) {
    const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    el.style.setProperty(cssKey, typeof value === 'number' ? `${value}px` : String(value))
  }
}

function realizationLabel(effect: EffectPrimitive): string {
  if (effect.gsap && effect.css) return 'gsap + css'
  if (effect.gsap) return 'gsap'
  if (effect.css) return 'css'
  return 'none'
}

/**
 * Storybook helper for showcasing effect primitives.
 * Renders a target card, provides Play/Reset controls, and shows
 * a debug panel with effect metadata.
 */
export function EffectPrimitivePreview({
  effectId,
  duration,
  ease,
}: EffectPrimitivePreviewProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const effect = resolveEffect(effectId)

  const handlePlay = useCallback(async () => {
    const target = targetRef.current
    if (!target || isPlaying) return

    // Reset to initial styles before playing
    applyInlineStyles(target, TARGET_STYLES)

    const context = {
      target,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    }

    const trackOptions: Partial<EffectOptions> = {}
    if (duration !== undefined) trackOptions.duration = duration
    if (ease !== undefined) trackOptions.ease = ease

    const track = createEffectTrack(effectId, context, trackOptions)

    setIsPlaying(true)
    try {
      await track()
    } catch (err) {
      console.error(`[EffectPrimitivePreview] Error playing "${effectId}":`, err)
    } finally {
      setIsPlaying(false)
    }
  }, [effectId, duration, ease, isPlaying])

  const handleReset = useCallback(() => {
    const target = targetRef.current
    if (!target) return
    applyInlineStyles(target, TARGET_STYLES)
  }, [])

  const resolvedDuration = duration ?? effect?.defaults.duration ?? '?'
  const resolvedEase = ease ?? effect?.defaults.ease ?? '?'

  return (
    <div>
      {/* Target element */}
      <div ref={targetRef} style={TARGET_STYLES}>
        <strong style={{ fontSize: 16 }}>Effect Preview</strong>
        <span style={{ fontSize: 13, opacity: 0.8 }}>{effectId}</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={handlePlay}
          disabled={isPlaying || !effect}
          style={{
            ...BUTTON_STYLES,
            background: isPlaying ? '#555' : '#6c63ff',
            color: '#fff',
            opacity: isPlaying || !effect ? 0.5 : 1,
          }}
        >
          {isPlaying ? 'Playing...' : 'Play'}
        </button>
        <button
          onClick={handleReset}
          disabled={isPlaying}
          style={{
            ...BUTTON_STYLES,
            background: '#333',
            color: '#ccc',
            opacity: isPlaying ? 0.5 : 1,
          }}
        >
          Reset
        </button>
      </div>

      {/* Debug panel */}
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
        {effect ? (
          <>
            <div>
              <span style={{ color: '#9cdcfe' }}>id</span>
              <span style={{ color: '#666' }}>: </span>
              <span style={{ color: '#ce9178' }}>{effect.id}</span>
            </div>
            <div>
              <span style={{ color: '#9cdcfe' }}>name</span>
              <span style={{ color: '#666' }}>: </span>
              <span style={{ color: '#ce9178' }}>{effect.name}</span>
            </div>
            <div>
              <span style={{ color: '#9cdcfe' }}>duration</span>
              <span style={{ color: '#666' }}>: </span>
              <span style={{ color: '#ce9178' }}>{String(resolvedDuration)}s</span>
            </div>
            <div>
              <span style={{ color: '#9cdcfe' }}>ease</span>
              <span style={{ color: '#666' }}>: </span>
              <span style={{ color: '#ce9178' }}>{String(resolvedEase)}</span>
            </div>
            <div>
              <span style={{ color: '#9cdcfe' }}>realizations</span>
              <span style={{ color: '#666' }}>: </span>
              <span style={{ color: '#ce9178' }}>{realizationLabel(effect)}</span>
            </div>
          </>
        ) : (
          <div style={{ color: '#f44' }}>
            Effect &quot;{effectId}&quot; not found in registry
          </div>
        )}
      </div>
    </div>
  )
}
