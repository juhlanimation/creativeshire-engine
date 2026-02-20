/**
 * IntroTimeline — NLE-style visual timeline editor for intro sequences.
 * Converts any IntroConfig pattern into draggable/resizable timeline blocks.
 * Works for all patterns: timed, video-gate, sequence-timed, scroll-reveal.
 *
 * Blocks share a single track and can overlap (concurrent effects).
 * An interval-graph lane assignment keeps overlapping blocks visible.
 * Action triggers (setChromeVisible, setScrollLocked) render as diamond
 * markers on a dedicated lane above the blocks. Labels show on hover.
 * "Add Effect" picker offers predefined effect templates.
 */

'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import type { IntroConfig, SequenceStepConfig, EffectKeyframe } from '../../../engine/intro/types'
import type { SettingsConfig } from '../../../engine/schema/settings'
import { SettingsEditor } from '../../../engine/renderer/dev/DevToolsPanel/SettingsEditor'
import './IntroTimeline.css'

// =============================================================================
// Types
// =============================================================================

type BlockType = 'step' | 'gate' | 'reveal'

interface TimelineBlock {
  id: string
  label: string
  type: BlockType
  /** Start time in ms */
  at: number
  /** Duration in ms */
  duration: number
  /** Whether this block can be dragged/resized */
  editable: boolean
  /** Original step index for sequence-timed steps */
  stepIndex?: number
  /** Actions on this block (for display) */
  actions?: SequenceStepConfig['actions']
  /** Per-effect settings */
  settings?: Record<string, unknown>
  /** Timed setting changes within this effect */
  keyframes?: EffectKeyframe[]
}

/** A diamond marker for an action trigger */
interface DiamondMarker {
  at: number
  kind: 'chrome' | 'scroll'
  label: string
  blockId: string
}

interface IntroTimelineProps {
  config: IntroConfig
  onSettingChange: (key: string, value: unknown) => void
  onStepsChange: (steps: SequenceStepConfig[]) => void
}

// =============================================================================
// Helpers
// =============================================================================

const MIN_DURATION_MS = 100
const SNAP_GRID_MS = 100
const MIN_TOTAL_MS = 1000

// =============================================================================
// Effect Templates — predefined effects available in "Add Effect" picker
// =============================================================================

interface EffectTemplate {
  id: string
  label: string
  duration: number
  description: string
  /** Whether this is an action-trigger type (shows green dot in picker) */
  trigger?: boolean
  actions?: SequenceStepConfig['actions']
  /** Settings schema displayed when this effect is selected */
  settingsSchema?: SettingsConfig<Record<string, unknown>>
  /** Default settings values for new instances */
  defaultSettings?: Record<string, unknown>
}

// =============================================================================
// Shared Setting Definitions
// =============================================================================

const EASING_CHOICES = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.16,1,0.3,1)', label: 'Smooth Out' },
] as const

const TARGET_CHOICES = [
  { value: 'background', label: 'Background' },
  { value: 'content', label: 'Content' },
  { value: 'mask', label: 'Mask' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'chrome', label: 'Chrome' },
] as const

const EASING_SETTING = {
  type: 'select' as const,
  label: 'Easing',
  description: 'Animation timing function',
  default: 'ease-out',
  choices: [...EASING_CHOICES],
}

const TARGET_SETTING = {
  type: 'select' as const,
  label: 'Target',
  description: 'Element or layer this effect applies to',
  default: 'content',
  choices: [...TARGET_CHOICES],
}

// =============================================================================
// Per-Effect Settings Schemas
// =============================================================================

const MASK_SCHEMA: SettingsConfig<Record<string, unknown>> = {
  opacity: {
    type: 'range',
    label: 'Opacity',
    description: 'Mask opacity (use keyframes to animate)',
    default: 1,
    min: 0,
    max: 1,
    step: 0.1,
  },
  maskType: {
    type: 'select',
    label: 'Mask Type',
    description: 'Type of mask element — text string or SVG path',
    default: 'text',
    choices: [
      { value: 'text', label: 'Text' },
      { value: 'svg', label: 'SVG' },
    ],
  },
  maskText: {
    type: 'text',
    label: 'Mask Text',
    description: 'Text content for the mask (when type is Text)',
    default: '',
    bindable: true,
  },
  maskSvg: {
    type: 'textarea',
    label: 'Mask SVG',
    description: 'SVG markup for the mask (when type is SVG)',
    default: '',
  },
  letterSpacing: {
    type: 'text',
    label: 'Letter Spacing',
    description: 'CSS letter-spacing value for the mask text',
    default: '-0.02em',
  },
  easing: EASING_SETTING,
}

const FADE_SCHEMA: SettingsConfig<Record<string, unknown>> = {
  direction: {
    type: 'select',
    label: 'Direction',
    description: 'Fade direction — in or out',
    default: 'in',
    choices: [
      { value: 'in', label: 'In' },
      { value: 'out', label: 'Out' },
    ],
  },
  target: TARGET_SETTING,
  easing: EASING_SETTING,
}

const WIPE_SCHEMA: SettingsConfig<Record<string, unknown>> = {
  direction: {
    type: 'select',
    label: 'Direction',
    description: 'Wipe direction',
    default: 'left',
    choices: [
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
      { value: 'up', label: 'Up' },
      { value: 'down', label: 'Down' },
    ],
  },
  easing: EASING_SETTING,
}

const SCALE_REVEAL_SCHEMA: SettingsConfig<Record<string, unknown>> = {
  startScale: {
    type: 'range',
    label: 'Start Scale',
    description: 'Initial scale value before reveal',
    default: 0.8,
    min: 0,
    max: 2,
    step: 0.1,
  },
  origin: {
    type: 'select',
    label: 'Transform Origin',
    description: 'Scale origin point',
    default: 'center',
    choices: [
      { value: 'center', label: 'Center' },
      { value: 'top', label: 'Top' },
      { value: 'bottom', label: 'Bottom' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
    ],
  },
  easing: EASING_SETTING,
}

/** Generic fallback for effects that don't match any known template */
const GENERIC_EFFECT_SCHEMA: SettingsConfig<Record<string, unknown>> = {
  target: TARGET_SETTING,
  easing: EASING_SETTING,
}

/** Settings for video-gate blocks */
const VIDEO_GATE_SCHEMA: SettingsConfig<Record<string, unknown>> = {
  source: {
    type: 'text',
    label: 'Video Element',
    description: 'CSS selector for the video element to monitor',
    default: '#hero-video video',
  },
  contentVisible: {
    type: 'toggle',
    label: 'Content Visible',
    description: 'Keep content visible during gate (video IS the intro)',
    default: true,
  },
}

// =============================================================================
// Effect Templates
// =============================================================================

const EFFECT_TEMPLATES: EffectTemplate[] = [
  { id: 'hold', label: 'Hold', duration: 1500, description: 'Static delay' },
  {
    id: 'mask',
    label: 'Mask',
    duration: 4000,
    description: 'Text/SVG mask — holds then fades',
    settingsSchema: MASK_SCHEMA,
    defaultSettings: { opacity: 1, maskType: 'text', maskText: '', letterSpacing: '-0.02em', easing: 'ease-out' },
  },
  {
    id: 'fade',
    label: 'Fade',
    duration: 2000,
    description: 'Fade element in or out',
    settingsSchema: FADE_SCHEMA,
    defaultSettings: { direction: 'in', target: 'content', easing: 'ease-out' },
  },
  {
    id: 'wipe',
    label: 'Wipe',
    duration: 2000,
    description: 'Wipe transition',
    settingsSchema: WIPE_SCHEMA,
    defaultSettings: { direction: 'left', easing: 'ease-in-out' },
  },
  {
    id: 'scale-reveal',
    label: 'Scale Reveal',
    duration: 1500,
    description: 'Zoom reveal',
    settingsSchema: SCALE_REVEAL_SCHEMA,
    defaultSettings: { startScale: 0.8, origin: 'center', easing: 'ease-out' },
  },
  { id: 'chrome-reveal', label: 'Chrome Reveal', duration: 2500, description: 'Show chrome', trigger: true, actions: { setChromeVisible: true, setScrollLocked: false } },
  { id: 'unlock-scroll', label: 'Unlock Scroll', duration: 500, description: 'Enable scroll', trigger: true, actions: { setScrollLocked: false } },
  { id: 'custom', label: 'Custom', duration: 1000, description: 'Empty effect' },
]

/**
 * Look up the settings schema for an effect by its ID.
 * 1. Exact template match — use that template's schema (may be undefined for hold/triggers)
 * 2. Prefix match (e.g., 'fade-in-2' → 'fade-in') — use that template's schema
 * 3. No match + has actions (trigger) — no settings (triggers configure via action checkboxes)
 * 4. No match + no actions — generic fallback (target + easing)
 */
function getEffectSchema(stepId: string, hasActions: boolean): SettingsConfig<Record<string, unknown>> | undefined {
  // Exact template match
  const exact = EFFECT_TEMPLATES.find((t) => t.id === stepId)
  if (exact) return exact.settingsSchema

  // Prefix match for deduped IDs (e.g., 'fade-in-2' → 'fade-in')
  const prefix = EFFECT_TEMPLATES.find((t) => stepId.startsWith(t.id + '-'))
  if (prefix) return prefix.settingsSchema

  // Unmatched trigger effects — no visual settings
  if (hasActions) return undefined

  // Generic fallback for any other effect
  return GENERIC_EFFECT_SCHEMA
}

/**
 * Derive default settings for a step from its ID + matching template.
 * Infers discriminant values from the ID suffix:
 *   fade-out-* → { direction: 'out' }, fade-in-* → { direction: 'in' }
 */
function getEffectDefaults(stepId: string): Record<string, unknown> | undefined {
  // Exact template match
  const exact = EFFECT_TEMPLATES.find((t) => t.id === stepId)
  if (exact?.defaultSettings) return { ...exact.defaultSettings }

  // Prefix match
  for (const t of EFFECT_TEMPLATES) {
    if (!t.defaultSettings || !stepId.startsWith(t.id + '-')) continue
    const defaults = { ...t.defaultSettings }
    const suffix = stepId.slice(t.id.length + 1).split('-')[0]

    // Infer fade direction from suffix
    if (t.id === 'fade' && (suffix === 'in' || suffix === 'out')) {
      defaults.direction = suffix
    }
    return defaults
  }

  return undefined
}

function snap(ms: number): number {
  return Math.round(ms / SNAP_GRID_MS) * SNAP_GRID_MS
}

function formatMs(ms: number): string {
  const s = ms / 1000
  return s % 1 === 0 ? `${s}s` : `${s.toFixed(1)}s`
}

/**
 * Convert any IntroConfig into renderable timeline blocks.
 */
function patternToBlocks(config: IntroConfig): TimelineBlock[] {
  const settings = config.settings ?? {}

  switch (config.pattern) {
    case 'timed': {
      const duration = (settings.duration as number) ?? 2000
      const revealDuration = (settings.revealDuration as number) ?? 50
      return [
        { id: 'gate', label: 'Wait', type: 'gate', at: 0, duration, editable: true },
        { id: 'reveal', label: 'Reveal', type: 'reveal', at: duration, duration: revealDuration, editable: true },
      ]
    }

    case 'video-gate': {
      const targetTime = (settings.targetTime as number) ?? 3.2
      const gateDuration = targetTime * 1000
      const revealDuration = (settings.revealDuration as number) ?? 50
      return [
        {
          id: 'gate', label: 'Video Gate', type: 'gate', at: 0, duration: gateDuration, editable: true,
          settings: { source: settings.source ?? '#hero-video video', contentVisible: settings.contentVisible ?? true },
        },
        { id: 'reveal', label: 'Reveal', type: 'reveal', at: gateDuration, duration: revealDuration, editable: true },
      ]
    }

    case 'sequence-timed': {
      const steps = (settings.steps as SequenceStepConfig[]) ?? []
      const revealDuration = (settings.revealDuration as number) ?? 800
      const blocks: TimelineBlock[] = steps.map((step, i) => ({
        id: step.id,
        label: step.id,
        type: 'step' as BlockType,
        at: step.at,
        duration: step.duration,
        editable: true,
        stepIndex: i,
        actions: step.actions,
        settings: step.settings ?? getEffectDefaults(step.id),
        keyframes: step.keyframes,
      }))

      const lastEnd = steps.length > 0
        ? Math.max(...steps.map((s) => s.at + s.duration))
        : 0
      blocks.push({
        id: 'reveal',
        label: 'Reveal',
        type: 'reveal',
        at: lastEnd,
        duration: revealDuration,
        editable: true,
      })

      return blocks
    }

    case 'scroll-reveal': {
      return [
        { id: 'reveal', label: 'Scroll Reveal', type: 'reveal', at: 0, duration: 1000, editable: false },
      ]
    }

    default:
      return []
  }
}

/**
 * Compute total timeline duration from blocks.
 */
function totalFromBlocks(blocks: TimelineBlock[]): number {
  if (blocks.length === 0) return MIN_TOTAL_MS
  const end = Math.max(...blocks.map((b) => b.at + b.duration))
  return Math.max(end, MIN_TOTAL_MS)
}

/**
 * Interval-graph lane assignment — pack overlapping blocks into
 * the minimum number of horizontal lanes so everything stays visible.
 * Returns a Map<blockId, laneIndex> plus the total lane count.
 */
function assignLanes(blocks: TimelineBlock[]): { lanes: Map<string, number>; count: number } {
  const sorted = [...blocks].sort((a, b) => a.at - b.at || a.duration - b.duration)
  const laneEnds: number[] = [] // tracks the end-time of each lane
  const lanes = new Map<string, number>()

  for (const block of sorted) {
    let placed = false
    for (let i = 0; i < laneEnds.length; i++) {
      if (block.at >= laneEnds[i]) {
        laneEnds[i] = block.at + block.duration
        lanes.set(block.id, i)
        placed = true
        break
      }
    }
    if (!placed) {
      lanes.set(block.id, laneEnds.length)
      laneEnds.push(block.at + block.duration)
    }
  }

  return { lanes, count: Math.max(laneEnds.length, 1) }
}

/**
 * Extract diamond markers from blocks that have actions.
 */
function extractDiamonds(blocks: TimelineBlock[]): DiamondMarker[] {
  const markers: DiamondMarker[] = []
  for (const block of blocks) {
    if (!block.actions) continue
    if (block.actions.setChromeVisible !== undefined) {
      markers.push({
        at: block.at,
        kind: 'chrome',
        label: block.actions.setChromeVisible ? 'Chrome on' : 'Chrome off',
        blockId: block.id,
      })
    }
    if (block.actions.setScrollLocked !== undefined) {
      markers.push({
        at: block.at,
        kind: 'scroll',
        label: block.actions.setScrollLocked ? 'Scroll lock' : 'Scroll unlock',
        blockId: block.id,
      })
    }
  }
  return markers
}

// =============================================================================
// TimeRuler
// =============================================================================

function TimeRuler({ totalMs }: { totalMs: number }) {
  const ticks: { position: number; label?: string; major: boolean }[] = []
  const stepMs = totalMs <= 3000 ? 500 : 1000
  for (let ms = 0; ms <= totalMs; ms += stepMs) {
    const isMajor = ms % 1000 === 0
    ticks.push({
      position: (ms / totalMs) * 100,
      label: isMajor ? formatMs(ms) : undefined,
      major: isMajor,
    })
  }

  return (
    <div className="da-timeline__ruler">
      {ticks.map((tick, i) => (
        <div key={i}>
          <div
            className={`da-timeline__ruler-tick${tick.major ? ' da-timeline__ruler-tick--major' : ''}`}
            style={{ left: `${tick.position}%` }}
          />
          {tick.label && (
            <span
              className="da-timeline__ruler-label"
              style={{ left: `${tick.position}%` }}
            >
              {tick.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// DiamondLane — renders action trigger diamonds above blocks
// =============================================================================

function DiamondLane({ diamonds, totalMs }: { diamonds: DiamondMarker[]; totalMs: number }) {
  if (diamonds.length === 0) return null

  // Offset diamonds at the same position vertically so they don't overlap
  const offsets = new Map<number, number>()
  const getOffset = (at: number) => {
    const count = offsets.get(at) ?? 0
    offsets.set(at, count + 1)
    return count * 10 // 10px horizontal offset per stacked diamond
  }

  return (
    <div className="da-timeline__diamonds">
      {diamonds.map((d, i) => {
        const leftPct = (d.at / totalMs) * 100
        const offsetPx = getOffset(d.at)
        return (
          <div
            key={`${d.blockId}-${d.kind}-${i}`}
            className="da-timeline__diamond-group"
            style={{ left: `calc(${leftPct}% + ${offsetPx}px)` }}
            title={d.label}
          >
            <div className={`da-timeline__diamond da-timeline__diamond--${d.kind}`} />
            <span className="da-timeline__diamond-label">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================
// TimelineBlock component
// =============================================================================

interface TimelineBlockProps {
  block: TimelineBlock
  totalMs: number
  selected: boolean
  dragging: boolean
  selectedKeyframeIdx: number | null
  onSelect: () => void
  onSelectKeyframe: (idx: number) => void
  onDragStart: (blockId: string, mode: 'move' | 'resize', startX: number) => void
}

function TimelineBlockEl({ block, totalMs, selected, dragging, selectedKeyframeIdx, onSelect, onSelectKeyframe, onDragStart }: TimelineBlockProps) {
  const leftPct = (block.at / totalMs) * 100
  const widthPct = (block.duration / totalMs) * 100

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      onSelect()
      if (!block.editable) return
      onDragStart(block.id, 'move', e.clientX)
    },
    [block.id, block.editable, onSelect, onDragStart],
  )

  const handleResizeDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      onSelect()
      if (!block.editable) return
      onDragStart(block.id, 'resize', e.clientX)
    },
    [block.id, block.editable, onSelect, onDragStart],
  )

  return (
    <div
      className={
        `da-timeline__block da-timeline__block--${block.type}` +
        (selected ? ' da-timeline__block--selected' : '') +
        (dragging ? ' da-timeline__block--dragging' : '') +
        (!block.editable ? ' da-timeline__block--static' : '')
      }
      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      onPointerDown={handlePointerDown}
    >
      <span className="da-timeline__block-label">{block.label}</span>
      <span className="da-timeline__block-duration">{formatMs(block.duration)}</span>

      {/* Keyframe diamonds inside the block */}
      {block.keyframes?.map((kf, i) => {
        const kfPct = (kf.at / block.duration) * 100
        return (
          <div
            key={i}
            className={
              'da-timeline__keyframe' +
              (selected && selectedKeyframeIdx === i ? ' da-timeline__keyframe--selected' : '')
            }
            style={{ left: `${kfPct}%` }}
            title={`Keyframe at ${formatMs(kf.at)}${kf.duration ? ` over ${formatMs(kf.duration)}` : ''}`}
            onPointerDown={(e) => {
              e.stopPropagation()
              onSelectKeyframe(i)
            }}
          />
        )
      })}

      {block.editable && (
        <div
          className="da-timeline__block-handle"
          onPointerDown={handleResizeDown}
        />
      )}
    </div>
  )
}

// =============================================================================
// Selected Block Details
// =============================================================================

interface BlockDetailsProps {
  block: TimelineBlock
  pattern: IntroConfig['pattern']
  selectedKeyframeIdx: number | null
  onRemove: () => void
  onIdChange: (id: string) => void
  onActionToggle: (action: 'setChromeVisible' | 'setScrollLocked', value: boolean | undefined) => void
  onSettingChange: (key: string, value: unknown) => void
  onAddKeyframe: () => void
  onRemoveKeyframe: (idx: number) => void
  onKeyframeTimeChange: (idx: number, at: number) => void
  onKeyframeDurationChange: (idx: number, duration: number | undefined) => void
  onKeyframeSettingChange: (idx: number, key: string, value: unknown) => void
  onSelectKeyframe: (idx: number | null) => void
}

/**
 * Resolve the settings schema for a block based on pattern + block type.
 * Sequence-timed steps use the effect template schema.
 * Gate blocks for video-gate use VIDEO_GATE_SCHEMA.
 * Other blocks (timed gate, reveal) have no extra settings — duration is the block.
 */
function getBlockSchema(block: TimelineBlock, pattern: IntroConfig['pattern']): SettingsConfig<Record<string, unknown>> | undefined {
  if (block.type === 'step' && pattern === 'sequence-timed') {
    return getEffectSchema(block.id, !!block.actions)
  }
  if (block.type === 'gate' && pattern === 'video-gate') {
    return VIDEO_GATE_SCHEMA
  }
  return undefined
}

function BlockDetails({
  block, pattern, selectedKeyframeIdx,
  onRemove, onIdChange, onActionToggle, onSettingChange,
  onAddKeyframe, onRemoveKeyframe, onKeyframeTimeChange, onKeyframeDurationChange, onKeyframeSettingChange, onSelectKeyframe,
}: BlockDetailsProps) {
  const isSequenceEffect = block.type === 'step' && pattern === 'sequence-timed'
  const schema = getBlockSchema(block, pattern)
  const selectedKf = selectedKeyframeIdx !== null ? block.keyframes?.[selectedKeyframeIdx] : null

  return (
    <div className="da-timeline__details">
      {/* Block header — name + timing */}
      <div className="da-timeline__details-row">
        <span className="da-timeline__details-label">{isSequenceEffect ? 'Effect' : 'Block'}</span>
        {isSequenceEffect ? (
          <input
            className="da-timeline__details-input"
            value={block.label}
            onChange={(e) => onIdChange(e.target.value)}
          />
        ) : (
          <span className="da-timeline__details-value">{block.label}</span>
        )}
      </div>
      <div className="da-timeline__details-row">
        <span className="da-timeline__details-label">Start</span>
        <span className="da-timeline__details-value">{formatMs(block.at)}</span>
        <span className="da-timeline__details-label" style={{ width: 'auto', marginLeft: 12 }}>Duration</span>
        <span className="da-timeline__details-value">{formatMs(block.duration)}</span>
      </div>

      {/* Action triggers (sequence-timed effects only) */}
      {isSequenceEffect && (
        <div className="da-timeline__details-row">
          <span className="da-timeline__details-label">Triggers</span>
          <div className="da-timeline__details-check">
            <label>
              <input
                type="checkbox"
                checked={block.actions?.setChromeVisible ?? false}
                onChange={(e) =>
                  onActionToggle('setChromeVisible', e.target.checked || undefined)
                }
              />{' '}
              Show Chrome
            </label>
            <label>
              <input
                type="checkbox"
                checked={block.actions?.setScrollLocked === false}
                onChange={(e) =>
                  onActionToggle('setScrollLocked', e.target.checked ? false : undefined)
                }
              />{' '}
              Unlock Scroll
            </label>
          </div>
        </div>
      )}

      {/* Block settings */}
      {schema && (
        <div className="da-timeline__details-settings">
          <SettingsEditor
            settings={schema}
            values={block.settings ?? {}}
            onChange={onSettingChange}
            header="Settings"
          />
        </div>
      )}

      {/* Keyframes (sequence-timed effects only) */}
      {isSequenceEffect && (
        <div className="da-timeline__keyframes-section">
          <div className="da-timeline__keyframes-header">
            <span className="da-timeline__keyframes-title">Keyframes</span>
            <button className="da-timeline__keyframes-add" onClick={onAddKeyframe}>
              + Add
            </button>
          </div>
          {block.keyframes && block.keyframes.length > 0 && (
            <div className="da-timeline__keyframes-list">
              {block.keyframes.map((kf, i) => (
                <div
                  key={i}
                  className={
                    'da-timeline__keyframes-item' +
                    (selectedKeyframeIdx === i ? ' da-timeline__keyframes-item--selected' : '')
                  }
                  onClick={() => onSelectKeyframe(selectedKeyframeIdx === i ? null : i)}
                >
                  <span className="da-timeline__keyframes-item-time">
                    @{formatMs(kf.at)}
                  </span>
                  <span className="da-timeline__keyframes-item-desc">
                    {Object.entries(kf.settings).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </span>
                  {kf.duration && (
                    <span className="da-timeline__keyframes-item-dur">
                      {formatMs(kf.duration)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Selected keyframe editor */}
          {selectedKf && selectedKeyframeIdx !== null && (
            <div className="da-timeline__keyframe-editor">
              <div className="da-timeline__details-row">
                <span className="da-timeline__details-label">At</span>
                <input
                  className="da-timeline__details-input"
                  type="number"
                  value={selectedKf.at}
                  min={0}
                  max={block.duration}
                  step={100}
                  onChange={(e) => onKeyframeTimeChange(selectedKeyframeIdx, snap(Number(e.target.value)))}
                />
                <span className="da-timeline__details-unit">ms</span>
              </div>
              <div className="da-timeline__details-row">
                <span className="da-timeline__details-label">Transition</span>
                <input
                  className="da-timeline__details-input"
                  type="number"
                  value={selectedKf.duration ?? 0}
                  min={0}
                  step={100}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    onKeyframeDurationChange(selectedKeyframeIdx, v > 0 ? snap(v) : undefined)
                  }}
                />
                <span className="da-timeline__details-unit">ms</span>
              </div>
              {schema && (
                <div className="da-timeline__details-settings">
                  <SettingsEditor
                    settings={schema}
                    values={selectedKf.settings}
                    onChange={(key, value) => onKeyframeSettingChange(selectedKeyframeIdx, key, value)}
                    header="Keyframe Settings"
                  />
                </div>
              )}
              <div className="da-timeline__details-row">
                <button
                  className="da-timeline__remove-btn"
                  onClick={() => onRemoveKeyframe(selectedKeyframeIdx)}
                >
                  Remove Keyframe
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remove button (sequence-timed effects only) */}
      {isSequenceEffect && (
        <div className="da-timeline__details-row">
          <button className="da-timeline__remove-btn" onClick={onRemove}>
            Remove Effect
          </button>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// IntroTimeline (main export)
// =============================================================================

export function IntroTimeline({ config, onSettingChange, onStepsChange }: IntroTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [selectedKeyframeIdx, setSelectedKeyframeIdx] = useState<number | null>(null)

  // ── Drag state stored entirely in refs to avoid stale closures ──
  const dragRef = useRef<{
    blockId: string
    mode: 'move' | 'resize'
    startX: number
    startAt: number
    startDuration: number
    totalMs: number
    trackWidth: number
  } | null>(null)
  const dragBlocksRef = useRef<TimelineBlock[] | null>(null)
  const [dragBlockId, setDragBlockId] = useState<string | null>(null)
  // Counter to force re-renders during drag
  const [, setDragTick] = useState(0)

  const baseBlocks = useMemo(() => patternToBlocks(config), [config])
  const blocks = dragBlocksRef.current ?? baseBlocks
  const totalMs = totalFromBlocks(blocks)

  // For timed/video-gate: keep reveal pinned after gate
  const adjustedBlocks = useMemo(() => {
    if (config.pattern === 'timed' || config.pattern === 'video-gate') {
      const gate = blocks.find((b) => b.type === 'gate')
      const reveal = blocks.find((b) => b.id === 'reveal')
      if (gate && reveal) {
        return blocks.map((b) =>
          b.id === 'reveal' ? { ...b, at: gate.at + gate.duration } : b,
        )
      }
    }
    return blocks
  }, [blocks, config.pattern])

  const displayTotal = totalFromBlocks(adjustedBlocks)

  // Lane assignment for overlapping blocks
  const { lanes, count: laneCount } = useMemo(() => assignLanes(adjustedBlocks), [adjustedBlocks])

  // Diamond markers for action triggers
  const diamonds = useMemo(() => extractDiamonds(adjustedBlocks), [adjustedBlocks])

  // ── Apply changes back to config ──

  const applyBlockChanges = useCallback(
    (updatedBlocks: TimelineBlock[]) => {
      switch (config.pattern) {
        case 'timed': {
          const gate = updatedBlocks.find((b) => b.id === 'gate')
          const reveal = updatedBlocks.find((b) => b.id === 'reveal')
          if (gate) onSettingChange('duration', gate.duration)
          if (reveal) onSettingChange('revealDuration', reveal.duration)
          break
        }

        case 'video-gate': {
          const gate = updatedBlocks.find((b) => b.id === 'gate')
          const reveal = updatedBlocks.find((b) => b.id === 'reveal')
          if (gate) {
            onSettingChange('targetTime', gate.duration / 1000)
            // Persist gate block settings (source, contentVisible)
            if (gate.settings) {
              for (const [k, v] of Object.entries(gate.settings)) {
                onSettingChange(k, v)
              }
            }
          }
          if (reveal) onSettingChange('revealDuration', reveal.duration)
          break
        }

        case 'sequence-timed': {
          const stepBlocks = updatedBlocks.filter((b) => b.type === 'step')
          const reveal = updatedBlocks.find((b) => b.id === 'reveal')
          const steps: SequenceStepConfig[] = stepBlocks.map((b) => ({
            id: b.label,
            at: b.at,
            duration: b.duration,
            ...(b.actions && Object.keys(b.actions).length > 0 ? { actions: b.actions } : {}),
            ...(b.settings && Object.keys(b.settings).length > 0 ? { settings: b.settings } : {}),
            ...(b.keyframes && b.keyframes.length > 0 ? { keyframes: b.keyframes } : {}),
          }))
          onStepsChange(steps)
          if (reveal) onSettingChange('revealDuration', reveal.duration)
          break
        }
      }
    },
    [config.pattern, onSettingChange, onStepsChange],
  )

  // ── Drag handlers (use refs only — no stale closures) ──

  const onPointerMove = useCallback((e: PointerEvent) => {
    const drag = dragRef.current
    if (!drag || !dragBlocksRef.current) return

    const deltaPx = e.clientX - drag.startX
    const deltaMs = snap((deltaPx / drag.trackWidth) * drag.totalMs)

    dragBlocksRef.current = dragBlocksRef.current.map((b) => {
      if (b.id !== drag.blockId) return b
      if (drag.mode === 'move') {
        const newAt = Math.max(0, snap(drag.startAt + deltaMs))
        return { ...b, at: newAt }
      } else {
        const newDuration = Math.max(MIN_DURATION_MS, snap(drag.startDuration + deltaMs))
        return { ...b, duration: newDuration }
      }
    })

    // Trigger re-render
    setDragTick((n) => n + 1)
  }, [])

  const onPointerUp = useCallback(() => {
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)

    const finalBlocks = dragBlocksRef.current
    if (finalBlocks) {
      applyBlockChanges(finalBlocks)
    }

    dragRef.current = null
    dragBlocksRef.current = null
    setDragBlockId(null)
    setDragTick((n) => n + 1)
  }, [applyBlockChanges, onPointerMove])

  const handleDragStart = useCallback(
    (blockId: string, mode: 'move' | 'resize', startX: number) => {
      const block = blocks.find((b) => b.id === blockId)
      if (!block || !trackRef.current) return

      const trackWidth = trackRef.current.getBoundingClientRect().width

      dragRef.current = {
        blockId,
        mode,
        startX,
        startAt: block.at,
        startDuration: block.duration,
        totalMs,
        trackWidth,
      }
      dragBlocksRef.current = [...blocks]
      setDragBlockId(blockId)

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    },
    [blocks, totalMs, onPointerMove, onPointerUp],
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }, [onPointerMove, onPointerUp])

  // ── Effect picker state ──
  const [showEffectPicker, setShowEffectPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close picker on click outside
  useEffect(() => {
    if (!showEffectPicker) return
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEffectPicker(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [showEffectPicker])

  // ── Effect mutations (sequence-timed) ──

  const handleAddEffect = useCallback((template: EffectTemplate) => {
    if (config.pattern !== 'sequence-timed') return
    const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
    const lastEnd = steps.length > 0
      ? Math.max(...steps.map((s) => s.at + s.duration))
      : 0
    // Deduplicate ID if the same template is used multiple times
    const existingIds = new Set(steps.map((s) => s.id))
    let id = template.id
    if (existingIds.has(id)) {
      let n = 2
      while (existingIds.has(`${template.id}-${n}`)) n++
      id = `${template.id}-${n}`
    }
    const newStep: SequenceStepConfig = {
      id,
      at: lastEnd,
      duration: template.duration,
      ...(template.actions ? { actions: { ...template.actions } } : {}),
      ...(template.defaultSettings ? { settings: { ...template.defaultSettings } } : {}),
    }
    onStepsChange([...steps, newStep])
    setShowEffectPicker(false)
  }, [config, onStepsChange])

  const handleRemoveEffect = useCallback(
    (blockId: string) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      onStepsChange(steps.filter((_, i) => i !== block.stepIndex))
      setSelectedBlockId(null)
    },
    [config, blocks, onStepsChange],
  )

  const handleEffectIdChange = useCallback(
    (blockId: string, newId: string) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      const updated = steps.map((s, i) => (i === block.stepIndex ? { ...s, id: newId } : s))
      onStepsChange(updated)
    },
    [config, blocks, onStepsChange],
  )

  const handleActionToggle = useCallback(
    (blockId: string, action: 'setChromeVisible' | 'setScrollLocked', value: boolean | undefined) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      const step = steps[block.stepIndex]
      const actions = { ...step.actions }
      if (value === undefined) {
        delete actions[action]
      } else {
        actions[action] = value
      }
      const updated = steps.map((s, i) =>
        i === block.stepIndex
          ? { ...s, actions: Object.keys(actions).length > 0 ? actions : undefined }
          : s,
      )
      onStepsChange(updated)
    },
    [config, blocks, onStepsChange],
  )

  const handleBlockSettingChange = useCallback(
    (blockId: string, key: string, value: unknown) => {
      const block = blocks.find((b) => b.id === blockId)
      if (!block) return

      // Sequence-timed steps: update per-step settings
      if (config.pattern === 'sequence-timed' && block.stepIndex !== undefined) {
        const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
        const updated = steps.map((s, i) =>
          i === block.stepIndex
            ? { ...s, settings: { ...s.settings, [key]: value } }
            : s,
        )
        onStepsChange(updated)
        return
      }

      // Gate/reveal blocks: settings go directly to config.settings
      onSettingChange(key, value)
    },
    [config, blocks, onStepsChange, onSettingChange],
  )

  // ── Keyframe mutations ──

  const handleAddKeyframe = useCallback(
    (blockId: string) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      const step = steps[block.stepIndex]
      const existing = step.keyframes ?? []
      // Place new keyframe at 50% of block duration (or after last keyframe)
      const lastAt = existing.length > 0 ? Math.max(...existing.map((k) => k.at)) : 0
      const newAt = snap(Math.min(lastAt + 1000, block.duration * 0.75))
      const newKf: EffectKeyframe = { at: newAt, settings: {} }
      const updated = steps.map((s, i) =>
        i === block.stepIndex ? { ...s, keyframes: [...existing, newKf] } : s,
      )
      onStepsChange(updated)
      setSelectedKeyframeIdx(existing.length) // select the new keyframe
    },
    [config, blocks, onStepsChange],
  )

  const handleRemoveKeyframe = useCallback(
    (blockId: string, kfIdx: number) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      const step = steps[block.stepIndex]
      const keyframes = (step.keyframes ?? []).filter((_, i) => i !== kfIdx)
      const updated = steps.map((s, i) =>
        i === block.stepIndex
          ? { ...s, keyframes: keyframes.length > 0 ? keyframes : undefined }
          : s,
      )
      onStepsChange(updated)
      setSelectedKeyframeIdx(null)
    },
    [config, blocks, onStepsChange],
  )

  const handleKeyframeTimeChange = useCallback(
    (blockId: string, kfIdx: number, at: number) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      const step = steps[block.stepIndex]
      const keyframes = (step.keyframes ?? []).map((kf, i) =>
        i === kfIdx ? { ...kf, at: Math.max(0, Math.min(at, block.duration)) } : kf,
      )
      const updated = steps.map((s, i) =>
        i === block.stepIndex ? { ...s, keyframes } : s,
      )
      onStepsChange(updated)
    },
    [config, blocks, onStepsChange],
  )

  const handleKeyframeDurationChange = useCallback(
    (blockId: string, kfIdx: number, duration: number | undefined) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      const step = steps[block.stepIndex]
      const keyframes = (step.keyframes ?? []).map((kf, i) =>
        i === kfIdx ? { ...kf, duration } : kf,
      )
      const updated = steps.map((s, i) =>
        i === block.stepIndex ? { ...s, keyframes } : s,
      )
      onStepsChange(updated)
    },
    [config, blocks, onStepsChange],
  )

  const handleKeyframeSettingChange = useCallback(
    (blockId: string, kfIdx: number, key: string, value: unknown) => {
      if (config.pattern !== 'sequence-timed') return
      const steps = ((config.settings?.steps as SequenceStepConfig[]) ?? [])
      const block = blocks.find((b) => b.id === blockId)
      if (!block || block.stepIndex === undefined) return
      const step = steps[block.stepIndex]
      const keyframes = (step.keyframes ?? []).map((kf, i) =>
        i === kfIdx ? { ...kf, settings: { ...kf.settings, [key]: value } } : kf,
      )
      const updated = steps.map((s, i) =>
        i === block.stepIndex ? { ...s, keyframes } : s,
      )
      onStepsChange(updated)
    },
    [config, blocks, onStepsChange],
  )

  // ── Render ──

  const selectedBlock = adjustedBlocks.find((b) => b.id === selectedBlockId)

  // Build lane arrays
  const laneArrays: TimelineBlock[][] = Array.from({ length: laneCount }, () => [])
  for (const block of adjustedBlocks) {
    const lane = lanes.get(block.id) ?? 0
    laneArrays[lane].push(block)
  }

  return (
    <div className="da-timeline">
      <div className="da-timeline__header">
        <span className="da-timeline__title">Timeline</span>
        <span className="da-timeline__total">Total: {formatMs(displayTotal)}</span>
      </div>

      <TimeRuler totalMs={displayTotal} />

      <DiamondLane diamonds={diamonds} totalMs={displayTotal} />

      <div className="da-timeline__track" ref={trackRef}>
        {laneArrays.map((laneBlocks, laneIdx) => (
          <div className="da-timeline__lane" key={laneIdx}>
            {laneBlocks.map((block) => (
              <TimelineBlockEl
                key={block.id}
                block={block}
                totalMs={displayTotal}
                selected={selectedBlockId === block.id}
                dragging={dragBlockId === block.id}
                selectedKeyframeIdx={selectedBlockId === block.id ? selectedKeyframeIdx : null}
                onSelect={() => {
                  if (selectedBlockId !== block.id) setSelectedKeyframeIdx(null)
                  setSelectedBlockId(block.id)
                }}
                onSelectKeyframe={(idx) => {
                  setSelectedBlockId(block.id)
                  setSelectedKeyframeIdx(idx)
                }}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="da-timeline__footer">
        {config.pattern === 'sequence-timed' && (
          <div className="da-timeline__picker" ref={pickerRef}>
            <button
              className="da-timeline__add-btn"
              onClick={() => setShowEffectPicker((v) => !v)}
            >
              + Add Effect
            </button>
            {showEffectPicker && (
              <div className="da-timeline__picker-menu">
                {EFFECT_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className="da-timeline__picker-item"
                    onClick={() => handleAddEffect(t)}
                  >
                    <span className={`da-timeline__picker-dot${t.trigger ? ' da-timeline__picker-dot--trigger' : ''}`} />
                    <span>{t.label}</span>
                    <span className="da-timeline__picker-desc">{t.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {config.pattern !== 'sequence-timed' && <span />}
      </div>

      {selectedBlock && (
        <BlockDetails
          block={selectedBlock}
          pattern={config.pattern}
          selectedKeyframeIdx={selectedKeyframeIdx}
          onRemove={() => handleRemoveEffect(selectedBlock.id)}
          onIdChange={(newId) => handleEffectIdChange(selectedBlock.id, newId)}
          onActionToggle={(action, value) => handleActionToggle(selectedBlock.id, action, value)}
          onSettingChange={(key, value) => handleBlockSettingChange(selectedBlock.id, key, value)}
          onAddKeyframe={() => handleAddKeyframe(selectedBlock.id)}
          onRemoveKeyframe={(idx) => handleRemoveKeyframe(selectedBlock.id, idx)}
          onKeyframeTimeChange={(idx, at) => handleKeyframeTimeChange(selectedBlock.id, idx, at)}
          onKeyframeDurationChange={(idx, dur) => handleKeyframeDurationChange(selectedBlock.id, idx, dur)}
          onKeyframeSettingChange={(idx, key, value) => handleKeyframeSettingChange(selectedBlock.id, idx, key, value)}
          onSelectKeyframe={setSelectedKeyframeIdx}
        />
      )}
    </div>
  )
}
