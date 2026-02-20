#!/usr/bin/env npx tsx
/**
 * Figma Token Sync
 *
 * Creates Figma Variable Collections from engine ThemeDefinition objects.
 * Colors get dark/light modes per theme. All other tokens get one mode per theme.
 *
 * Usage:
 *   FIGMA_TOKEN=xxx npx tsx scripts/figma-sync.ts
 *   FIGMA_TOKEN=xxx npx tsx scripts/figma-sync.ts --dry-run
 *
 * Environment:
 *   FIGMA_TOKEN       Figma Personal Access Token (required)
 *                     Scopes: file_variables:read, file_variables:write
 *   FIGMA_FILE_KEY    Figma file key (defaults to Creativeshire-Engine file)
 */

import { getAllThemes } from '../engine/themes'
import type { ThemeDefinition, ColorPalette } from '../engine/themes/types'

// ─── Config ──────────────────────────────────────────────────────────────

const FIGMA_TOKEN = process.env.FIGMA_TOKEN
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || 'fazacEtDqG7MMlNRrHBlgN'
const DRY_RUN = process.argv.includes('--dry-run')
const API_BASE = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`

if (!FIGMA_TOKEN) {
  console.error('Missing FIGMA_TOKEN environment variable')
  console.error('Generate at: Figma → Settings → Personal Access Tokens')
  console.error('Scopes needed: file_variables:read, file_variables:write')
  process.exit(1)
}

// ─── Helpers ─────────────────────────────────────────────────────────────

type FigmaRGBA = { r: number; g: number; b: number; a: number }

/** Convert hex color (#rrggbb) to Figma RGBA (0–1 range). */
function hexToRGBA(hex: string): FigmaRGBA {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  }
}

/** Convert rem/px/ms/unitless string to a number (rem → px at 16px base). */
function toNumber(value: string): number {
  const num = parseFloat(value)
  if (value.endsWith('rem')) return num * 16
  return num // px, ms, or unitless
}

/**
 * Extract usable px number from a CSS value.
 * For clamp() expressions, uses the max (upper bound) as the design reference.
 */
function resolveToNumber(value: string): number {
  const clamp = value.match(/clamp\([^,]+,\s*[^,]+,\s*([^)]+)\)/)
  if (clamp) return toNumber(clamp[1].trim())
  return toNumber(value)
}

let counter = 0
function tempId(prefix: string): string {
  return `temp_${prefix}_${++counter}`
}

// ─── Payload Builder ─────────────────────────────────────────────────────

interface Payload {
  variableCollections: Record<string, unknown>[]
  variableModes: Record<string, unknown>[]
  variables: Record<string, unknown>[]
  variableModeValues: Record<string, unknown>[]
}

const payload: Payload = {
  variableCollections: [],
  variableModes: [],
  variables: [],
  variableModeValues: [],
}

/**
 * Create a variable collection with named modes.
 * Returns mode ID lookup by mode name.
 */
function createCollection(
  name: string,
  modeNames: string[],
): { collectionId: string; modes: Record<string, string> } {
  const collectionId = tempId('coll')
  const firstModeId = tempId('mode')

  payload.variableCollections.push({
    action: 'CREATE',
    id: collectionId,
    name,
    initialModeId: firstModeId,
  })

  const modes: Record<string, string> = {}

  // First mode: rename the auto-created one
  modes[modeNames[0]] = firstModeId
  payload.variableModes.push({
    action: 'UPDATE',
    id: firstModeId,
    name: modeNames[0],
  })

  // Additional modes
  for (let i = 1; i < modeNames.length; i++) {
    const modeId = tempId('mode')
    modes[modeNames[i]] = modeId
    payload.variableModes.push({
      action: 'CREATE',
      id: modeId,
      name: modeNames[i],
      variableCollectionId: collectionId,
    })
  }

  return { collectionId, modes }
}

/** Add a variable with per-mode values. */
function addVar(
  collectionId: string,
  name: string,
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING',
  values: { modeId: string; value: FigmaRGBA | number | string }[],
  description?: string,
) {
  const id = tempId('var')

  const def: Record<string, unknown> = {
    action: 'CREATE',
    id,
    name,
    resolvedType,
    variableCollectionId: collectionId,
  }
  if (description) def.description = description

  payload.variables.push(def)

  for (const { modeId, value } of values) {
    payload.variableModeValues.push({ variableId: id, modeId, value })
  }
}

// ─── Build from Themes ───────────────────────────────────────────────────

function build(themes: ThemeDefinition[]) {
  const themeNames = themes.map((t) => t.name)

  // ── Colors (4 modes: {Theme} Dark, {Theme} Light) ──────────────────

  const colorModeNames = themes.flatMap((t) => [`${t.name} Dark`, `${t.name} Light`])
  const { collectionId: colorsId, modes: colorModes } = createCollection('Colors', colorModeNames)

  const COLOR_FIELDS: { field: keyof ColorPalette; name: string }[] = [
    { field: 'background', name: 'colors/background' },
    { field: 'text', name: 'colors/text' },
    { field: 'textPrimary', name: 'colors/text-primary' },
    { field: 'textSecondary', name: 'colors/text-secondary' },
    { field: 'accent', name: 'colors/accent' },
    { field: 'interaction', name: 'colors/interaction' },
    { field: 'colorPrimary', name: 'colors/primary' },
    { field: 'colorPrimaryContrast', name: 'colors/primary-contrast' },
    { field: 'colorSecondary', name: 'colors/secondary' },
    { field: 'colorSecondaryContrast', name: 'colors/secondary-contrast' },
    { field: 'colorLink', name: 'colors/link' },
    { field: 'colorFocus', name: 'colors/focus' },
    { field: 'scrollbarThumb', name: 'colors/scrollbar-thumb' },
    { field: 'scrollbarTrack', name: 'colors/scrollbar-track' },
    { field: 'statusSuccess', name: 'colors/status-success' },
    { field: 'statusError', name: 'colors/status-error' },
  ]

  for (const { field, name } of COLOR_FIELDS) {
    addVar(colorsId, name, 'COLOR', themes.flatMap((t) => [
      { modeId: colorModes[`${t.name} Dark`], value: hexToRGBA(t.dark[field]) },
      { modeId: colorModes[`${t.name} Light`], value: hexToRGBA(t.light[field]) },
    ]))
  }

  // ── Typography (STRING — font stacks and scale expressions) ────────

  const { collectionId: typoId, modes: typoModes } = createCollection('Typography', themeNames)

  const TYPO_VARS: { name: string; get: (t: ThemeDefinition) => string }[] = [
    { name: 'type/font-title', get: (t) => t.typography.title },
    { name: 'type/font-paragraph', get: (t) => t.typography.paragraph },
    { name: 'type/font-ui', get: (t) => t.typography.ui },
    { name: 'type/scale-display', get: (t) => t.typography.scale.display },
    { name: 'type/scale-h1', get: (t) => t.typography.scale.h1 },
    { name: 'type/scale-h2', get: (t) => t.typography.scale.h2 },
    { name: 'type/scale-h3', get: (t) => t.typography.scale.h3 },
    { name: 'type/scale-body', get: (t) => t.typography.scale.body },
    { name: 'type/scale-small', get: (t) => t.typography.scale.small },
  ]

  for (const v of TYPO_VARS) {
    addVar(typoId, v.name, 'STRING',
      themes.map((t) => ({ modeId: typoModes[t.name], value: v.get(t) })),
    )
  }

  // ── Spacing (FLOAT — px values, clamp resolved to upper bound) ─────

  const { collectionId: spacingId, modes: spacingModes } = createCollection('Spacing', themeNames)

  type SpacingKey = keyof ThemeDefinition['spacing']
  const SPACING_VARS: { name: string; key: SpacingKey; desc?: string }[] = [
    { name: 'spacing/xs', key: 'xs' },
    { name: 'spacing/sm', key: 'sm' },
    { name: 'spacing/md', key: 'md' },
    { name: 'spacing/lg', key: 'lg' },
    { name: 'spacing/xl', key: 'xl' },
    { name: 'spacing/2xl', key: '2xl' },
    { name: 'spacing/section-x', key: 'sectionX', desc: 'Responsive horizontal padding (clamp upper bound)' },
    { name: 'spacing/section-y', key: 'sectionY', desc: 'Responsive vertical padding (clamp upper bound)' },
  ]

  for (const v of SPACING_VARS) {
    addVar(spacingId, v.name, 'FLOAT',
      themes.map((t) => ({ modeId: spacingModes[t.name], value: resolveToNumber(t.spacing[v.key]) })),
      v.desc,
    )
  }

  // ── Radius (FLOAT — px) ────────────────────────────────────────────

  const { collectionId: radiusId, modes: radiusModes } = createCollection('Radius', themeNames)

  for (const key of ['none', 'sm', 'md', 'lg', 'full'] as const) {
    addVar(radiusId, `radius/${key}`, 'FLOAT',
      themes.map((t) => ({ modeId: radiusModes[t.name], value: toNumber(t.radius[key]) })),
    )
  }

  // ── Shadows (STRING — CSS shadow syntax) ───────────────────────────

  const { collectionId: shadowsId, modes: shadowModes } = createCollection('Shadows', themeNames)

  for (const key of ['none', 'sm', 'md', 'lg'] as const) {
    addVar(shadowsId, `shadow/${key}`, 'STRING',
      themes.map((t) => ({ modeId: shadowModes[t.name], value: t.shadows[key] })),
    )
  }

  // ── Borders (FLOAT for width/opacity, STRING for style/color) ──────

  const { collectionId: bordersId, modes: borderModes } = createCollection('Borders', themeNames)

  addVar(bordersId, 'border/width', 'FLOAT',
    themes.map((t) => ({ modeId: borderModes[t.name], value: toNumber(t.borders.width) })))
  addVar(bordersId, 'border/style', 'STRING',
    themes.map((t) => ({ modeId: borderModes[t.name], value: t.borders.style })))
  addVar(bordersId, 'border/color', 'STRING',
    themes.map((t) => ({ modeId: borderModes[t.name], value: t.borders.color })),
    'CSS color value (may be currentColor)',
  )
  addVar(bordersId, 'border/divider-opacity', 'FLOAT',
    themes.map((t) => ({ modeId: borderModes[t.name], value: parseFloat(t.borders.dividerOpacity) })))

  // ── Motion (FLOAT for durations, STRING for easing) ────────────────

  const { collectionId: motionId, modes: motionModes } = createCollection('Motion', themeNames)

  addVar(motionId, 'motion/duration-fast', 'FLOAT',
    themes.map((t) => ({ modeId: motionModes[t.name], value: toNumber(t.motion.durationFast) })),
    'Micro interactions (ms)',
  )
  addVar(motionId, 'motion/duration-normal', 'FLOAT',
    themes.map((t) => ({ modeId: motionModes[t.name], value: toNumber(t.motion.durationNormal) })),
    'Default transitions (ms)',
  )
  addVar(motionId, 'motion/duration-slow', 'FLOAT',
    themes.map((t) => ({ modeId: motionModes[t.name], value: toNumber(t.motion.durationSlow) })),
    'Page-level transitions (ms)',
  )
  addVar(motionId, 'motion/ease-default', 'STRING',
    themes.map((t) => ({ modeId: motionModes[t.name], value: t.motion.easeDefault })))
  addVar(motionId, 'motion/ease-in', 'STRING',
    themes.map((t) => ({ modeId: motionModes[t.name], value: t.motion.easeIn })))
  addVar(motionId, 'motion/ease-out', 'STRING',
    themes.map((t) => ({ modeId: motionModes[t.name], value: t.motion.easeOut })))

  // ── Text Decoration (STRING) ───────────────────────────────────────

  const { collectionId: textDecId, modes: textDecModes } = createCollection('Text Decoration', themeNames)

  addVar(textDecId, 'text-decoration/style', 'STRING',
    themes.map((t) => ({ modeId: textDecModes[t.name], value: t.textDecoration.style })))
  addVar(textDecId, 'text-decoration/thickness', 'STRING',
    themes.map((t) => ({ modeId: textDecModes[t.name], value: t.textDecoration.thickness })))
  addVar(textDecId, 'text-decoration/offset', 'STRING',
    themes.map((t) => ({ modeId: textDecModes[t.name], value: t.textDecoration.offset })))

  // ── Interaction (FLOAT) ────────────────────────────────────────────

  const { collectionId: interactionId, modes: interactionModes } = createCollection('Interaction', themeNames)

  addVar(interactionId, 'interaction/hover-opacity', 'FLOAT',
    themes.map((t) => ({ modeId: interactionModes[t.name], value: parseFloat(t.interaction.hoverOpacity) })))
  addVar(interactionId, 'interaction/active-scale', 'FLOAT',
    themes.map((t) => ({ modeId: interactionModes[t.name], value: parseFloat(t.interaction.activeScale) })))
  addVar(interactionId, 'interaction/focus-ring-width', 'FLOAT',
    themes.map((t) => ({ modeId: interactionModes[t.name], value: toNumber(t.interaction.focusRingWidth) })))
  addVar(interactionId, 'interaction/focus-ring-offset', 'FLOAT',
    themes.map((t) => ({ modeId: interactionModes[t.name], value: toNumber(t.interaction.focusRingOffset) })))
}

// ─── Check Existing Variables ────────────────────────────────────────────

async function checkExisting(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/variables/local`, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN! },
  })

  if (!res.ok) {
    // 403 means scope issue — we handle it in main
    if (res.status === 403) {
      const body = await res.json() as { message?: string }
      console.error(`Token missing required scope: ${body.message || 'file_variables:read'}`)
      process.exit(1)
    }
    return false
  }

  const data = await res.json() as {
    meta?: { variableCollections?: Record<string, unknown> }
  }
  const collections = data.meta?.variableCollections
  return collections ? Object.keys(collections).length > 0 : false
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log('Loading themes...')
  const themes = getAllThemes()

  if (themes.length === 0) {
    console.error('No themes registered. Check engine/themes/index.ts')
    process.exit(1)
  }

  console.log(`Found ${themes.length} themes: ${themes.map((t) => t.name).join(', ')}`)

  // Check for existing variables (skip in dry-run)
  if (!DRY_RUN) {
    const hasExisting = await checkExisting()
    if (hasExisting) {
      console.error('Figma file already has variables.')
      console.error('Delete existing variables in Figma first, then re-run.')
      process.exit(1)
    }
  }

  build(themes)

  console.log(`\nPayload:`)
  console.log(`  Collections: ${payload.variableCollections.length}`)
  console.log(`  Modes:       ${payload.variableModes.length}`)
  console.log(`  Variables:   ${payload.variables.length}`)
  console.log(`  Values:      ${payload.variableModeValues.length}`)

  if (DRY_RUN) {
    console.log(`\nDry run — writing payload to scripts/figma-sync-payload.json`)
    const fs = await import('fs/promises')
    await fs.writeFile(
      new URL('./figma-sync-payload.json', import.meta.url),
      JSON.stringify(payload, null, 2),
    )
    return
  }

  console.log(`\nPushing to Figma...`)

  const res = await fetch(`${API_BASE}/variables`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': FIGMA_TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`Figma API error (${res.status}):`)
    console.error(body)
    process.exit(1)
  }

  const result = await res.json() as { status?: number; error?: boolean; meta?: { tempIdToRealId?: Record<string, string> } }

  if (result.status === 200 || result.meta) {
    const mappings = result.meta?.tempIdToRealId ?? {}
    const collCount = Object.keys(mappings).filter((k) => k.startsWith('temp_coll_')).length
    const varCount = Object.keys(mappings).filter((k) => k.startsWith('temp_var_')).length
    console.log(`Done! Created ${collCount} collections with ${varCount} variables.`)
  } else {
    console.log('Done! Response:', JSON.stringify(result, null, 2))
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
