import React, { useCallback, useRef, useState } from 'react'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'
import { fadePageTransition } from './index'

const PAGE_STYLES: React.CSSProperties = {
  width: '100%',
  minHeight: 200,
  padding: 32,
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  color: '#fff',
  fontFamily: 'sans-serif',
}

function TransitionPreview({ exitDuration, entryDuration }: { exitDuration: number; entryDuration: number }) {
  const pageARef = useRef<HTMLDivElement>(null)
  const pageBRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering' | 'done'>('idle')

  const handleTransition = useCallback(async () => {
    const pageA = pageARef.current
    const pageB = pageBRef.current
    if (!pageA || !pageB || phase !== 'idle') return

    // Exit: fade page A out
    setPhase('exiting')
    pageA.style.transition = `opacity ${exitDuration}ms ease-out`
    pageA.style.opacity = '0'

    await new Promise((r) => setTimeout(r, exitDuration))

    // Entry: fade page B in
    setPhase('entering')
    pageB.style.opacity = '0'
    pageB.style.display = 'flex'
    // Force reflow
    void pageB.offsetHeight
    pageB.style.transition = `opacity ${entryDuration}ms ease-in`
    pageB.style.opacity = '1'

    await new Promise((r) => setTimeout(r, entryDuration))
    setPhase('done')
  }, [exitDuration, entryDuration, phase])

  const handleReset = useCallback(() => {
    const pageA = pageARef.current
    const pageB = pageBRef.current
    if (!pageA || !pageB) return
    pageA.style.transition = 'none'
    pageA.style.opacity = '1'
    pageB.style.transition = 'none'
    pageB.style.opacity = '0'
    pageB.style.display = 'none'
    setPhase('idle')
  }, [])

  return (
    <div>
      {/* Pages */}
      <div style={{ position: 'relative' }}>
        <div ref={pageARef} style={{ ...PAGE_STYLES, background: 'linear-gradient(135deg, #6c63ff, #e040fb)' }}>
          <strong style={{ fontSize: 18 }}>Page A</strong>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Current page (exit animation)</span>
        </div>
        <div
          ref={pageBRef}
          style={{ ...PAGE_STYLES, background: 'linear-gradient(135deg, #059669, #34d399)', display: 'none', marginTop: 12 }}
        >
          <strong style={{ fontSize: 18 }}>Page B</strong>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Next page (entry animation)</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={handleTransition}
          disabled={phase !== 'idle'}
          style={{
            padding: '6px 16px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 600,
            background: phase === 'idle' ? '#6c63ff' : '#555',
            color: '#fff',
            opacity: phase === 'idle' ? 1 : 0.5,
          }}
        >
          {phase === 'idle' ? 'Transition' : phase === 'exiting' ? 'Exiting...' : phase === 'entering' ? 'Entering...' : 'Done'}
        </button>
        <button
          onClick={handleReset}
          disabled={phase === 'idle'}
          style={{
            padding: '6px 16px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: 13,
            fontWeight: 600,
            background: '#333',
            color: '#ccc',
            opacity: phase === 'idle' ? 0.5 : 1,
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
        <div>
          <span style={{ color: '#9cdcfe' }}>id</span>
          <span style={{ color: '#666' }}>: </span>
          <span style={{ color: '#ce9178' }}>{fadePageTransition.id}</span>
        </div>
        <div>
          <span style={{ color: '#9cdcfe' }}>name</span>
          <span style={{ color: '#666' }}>: </span>
          <span style={{ color: '#ce9178' }}>{fadePageTransition.name}</span>
        </div>
        <div>
          <span style={{ color: '#9cdcfe' }}>exitDuration</span>
          <span style={{ color: '#666' }}>: </span>
          <span style={{ color: '#ce9178' }}>{exitDuration}ms</span>
        </div>
        <div>
          <span style={{ color: '#9cdcfe' }}>entryDuration</span>
          <span style={{ color: '#666' }}>: </span>
          <span style={{ color: '#ce9178' }}>{entryDuration}ms</span>
        </div>
        <div>
          <span style={{ color: '#9cdcfe' }}>exitClass</span>
          <span style={{ color: '#666' }}>: </span>
          <span style={{ color: '#ce9178' }}>{fadePageTransition.exitClass}</span>
        </div>
        <div>
          <span style={{ color: '#9cdcfe' }}>entryClass</span>
          <span style={{ color: '#666' }}>: </span>
          <span style={{ color: '#ce9178' }}>{fadePageTransition.entryClass}</span>
        </div>
        <div>
          <span style={{ color: '#9cdcfe' }}>phase</span>
          <span style={{ color: '#666' }}>: </span>
          <span style={{ color: '#4ade80' }}>{phase}</span>
        </div>
      </div>
    </div>
  )
}

export default {
  title: 'Fade to Black',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
  argTypes: {
    exitDuration: { control: { type: 'range', min: 100, max: 2000, step: 50 } },
    entryDuration: { control: { type: 'range', min: 100, max: 2000, step: 50 } },
  },
  args: {
    exitDuration: 400,
    entryDuration: 400,
  },
}

export const Default = {
  render: (args: { exitDuration: number; entryDuration: number }) => (
    <TransitionPreview exitDuration={args.exitDuration} entryDuration={args.entryDuration} />
  ),
}
