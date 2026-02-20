/**
 * Auto-story helpers.
 * Generates Storybook argTypes and args from engine ComponentMeta.
 *
 * Usage in story files:
 *   import { widgetStoryConfig } from '../../../../../.storybook/helpers/auto-story'
 *   import { meta } from './meta'
 *   export default { title: 'Widgets/Primitives/Text', ...widgetStoryConfig('Text', meta) }
 *   export const Default = { args: widgetStoryArgs('Text', meta) }
 */

import type { ComponentType } from 'react'
import type { ComponentMeta, SectionMeta, RegionMeta, ChromePatternMeta } from '../../engine/schema/meta'
import type { SettingConfig } from '../../engine/schema/settings'
import type { SectionSchema, WidgetSchema, SerializableValue, RegionSchema } from '../../engine/schema'
import type { PresetRegionConfig } from '../../engine/presets/types'
import type { Behaviour } from '../../engine/experience/behaviours/types'
import { extractDefaults } from '../../engine/schema/settings'
import { getSectionContainerSettings } from '../../engine/schema/section-meta'
import { settingsToArgTypes, settingToArgType, type ArgType } from './controls-adapter'
import { stateArgTypes, stateDefaults } from './state-controls'
import { PREVIEW_DEFAULTS } from './preview-defaults'
import { EngineDecorator } from './EngineDecorator'
import { StoryGlobalsDecorator } from './story-globals'
import { SectionStoryRenderer } from './SectionStoryRenderer'
import { ChromeStoryRenderer } from './ChromeStoryRenderer'
import { getWidget } from '../../engine/content/widgets/registry'
import { getWidgetMeta } from '../../engine/content/widgets/meta-registry'
import { WidgetRenderer } from '../../engine/renderer/WidgetRenderer'

/**
 * Returns Storybook `parameters.design` for embedding a Figma frame.
 * When no URL is provided, returns empty (no Design tab shown).
 */
function designParams(figmaUrl?: string) {
  if (!figmaUrl) return {}
  return { design: { type: 'figma' as const, url: figmaUrl } }
}

// Category label map for Storybook sidebar
const CATEGORY_LABELS: Record<string, string> = {
  primitive: 'Primitives',
  layout: 'Layout',
  interactive: 'Interactive',
  pattern: 'Compositions',
}

/**
 * Generate the Storybook meta config object for a widget.
 * Spread this into the default export object in the story file.
 */
export function widgetStoryConfig(widgetType: string, meta: ComponentMeta, figmaUrl?: string) {
  const categoryLabel = CATEGORY_LABELS[meta.category] ?? meta.category
  const component = getWidget(widgetType)
  const settings = (meta.settings ?? {}) as Record<string, SettingConfig>

  return {
    title: `${categoryLabel}/${meta.name}`,
    component: component ?? undefined,
    parameters: {
      docs: { description: { component: meta.description } },
      ...designParams(figmaUrl),
      saveDefaults: {
        id: meta.id ?? widgetType,
        settingKeys: Object.keys(settings),
        defaults: extractDefaults(settings),
      },
    },
    argTypes: settingsToArgTypes(settings),
    decorators: [EngineDecorator],
  }
}

/**
 * Generate the default args for a widget story.
 * Merges meta defaults with preview defaults.
 */
export function widgetStoryArgs(widgetType: string, meta: ComponentMeta) {
  const settings = (meta.settings ?? {}) as Record<string, SettingConfig>
  const metaDefaults = extractDefaults(settings)
  const previewDefaults = PREVIEW_DEFAULTS[widgetType] ?? {}
  return { ...metaDefaults, ...previewDefaults }
}

/** Section-level container keys — separated from pattern args and layout widget args */
const SECTION_CONTAINER_KEYS = new Set([
  'constrained',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'sectionHeight',
  'layout.type',
  'layout.direction',
  'layout.align',
  'layout.justify',
  'layout.gap',
  'layout.gapScale',
  'layout.padding',
  'layout.paddingScale',
])

/** Layout widget prefix for auto-derived arg keys */
const LW_PREFIX = '__lw:'

/** Widget types that are considered layout widgets for auto-scanning */
const LAYOUT_TYPES = new Set(['Flex', 'Stack', 'Grid', 'Box', 'Container', 'Split', 'Marquee'])

/** Layout preset choices for gap/padding spacing settings */
const LAYOUT_PRESET_CHOICES = [
  { value: 'none', label: 'None' },
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'loose', label: 'Loose' },
]

interface LayoutWidgetInfo {
  id: string
  type: string
  meta: ComponentMeta
  currentProps: Record<string, unknown>
}

// =============================================================================
// Layout widget scanning and auto-derived controls
// =============================================================================

/**
 * Walk a widget tree and collect layout widget info.
 * Each layout widget (Flex, Stack, Grid, etc.) is captured with its
 * id, type, meta, and current prop values from the factory output.
 */
function scanLayoutWidgetsFromTree(widgets: WidgetSchema[], maxDepth = -1): LayoutWidgetInfo[] {
  // maxDepth = -1 means disabled (no scanning), 0 = top-level only, 1 = one level deep, etc.
  if (maxDepth < 0) return []

  const results: LayoutWidgetInfo[] = []
  const counters: Record<string, number> = {}

  function walk(items: WidgetSchema[], depth: number) {
    if (depth > maxDepth) return
    for (const widget of items) {
      if (LAYOUT_TYPES.has(widget.type)) {
        const meta = getWidgetMeta(widget.type)
        if (meta) {
          // Use widget.id if set, otherwise generate from type + counter
          const id = widget.id ?? (() => {
            const count = counters[widget.type] ?? 0
            counters[widget.type] = count + 1
            return `${widget.type}-${count}`
          })()
          results.push({
            id,
            type: widget.type,
            meta,
            currentProps: (widget.props ?? {}) as Record<string, unknown>,
          })
        }
      }
      // Don't recurse into scoped widget children — they're structural data
      // (e.g. TeamShowcase__StackVideoShowcase's Box children hold member data)
      if (widget.widgets && !widget.type.includes('__')) walk(widget.widgets, depth + 1)
    }
  }

  walk(widgets, 0)
  return results
}

/** Walk a section's widget tree — thin wrapper over scanLayoutWidgetsFromTree. */
function scanLayoutWidgets(section: SectionSchema, maxDepth = -1): LayoutWidgetInfo[] {
  return scanLayoutWidgetsFromTree(section.widgets, maxDepth)
}

/**
 * Derive Storybook argTypes from scanned layout widgets.
 * Only includes settings that the factory actually set in the widget's props —
 * so controls mirror exactly what the factory configured, nothing more.
 *
 * Gap/padding settings with type 'spacing' are overridden to show layout preset
 * choices (none/tight/normal/loose) instead of raw text input.
 */
function deriveLayoutArgTypes(
  widgets: LayoutWidgetInfo[]
): { argTypes: Record<string, ArgType>; argMap: Map<string, { id: string; key: string }> } {
  const argTypes: Record<string, ArgType> = {}
  const argMap = new Map<string, { id: string; key: string }>()

  for (const lw of widgets) {
    // Skip layout widgets with no explicit props (e.g., Box with props: {})
    const propKeys = Object.keys(lw.currentProps)
    if (propKeys.length === 0) continue

    const settings = (lw.meta.settings ?? {}) as Record<string, SettingConfig>
    const category = `${lw.type} (${lw.id})`

    for (const [settingKey, setting] of Object.entries(settings)) {
      // Only show controls for props the factory actually set
      if (!(settingKey in lw.currentProps)) continue

      // Skip hidden/structural settings (same filter as settingToArgType)
      if (setting.hidden || setting.editorHint === 'structural') continue

      const argKey = `${LW_PREFIX}${lw.id}:${settingKey}`

      // Override spacing type settings (gap, padding) to use layout preset select
      if (setting.type === 'spacing' && (settingKey === 'gap' || settingKey === 'padding')) {
        argTypes[argKey] = {
          control: { type: 'select' },
          description: setting.description,
          options: LAYOUT_PRESET_CHOICES.map(c => c.value),
          table: { category },
        }
      } else {
        const base = settingToArgType(setting)
        if (!base) continue
        argTypes[argKey] = {
          ...base,
          table: { ...base.table, category },
        }
      }

      argMap.set(argKey, { id: lw.id, key: settingKey })
    }
  }

  return { argTypes, argMap }
}

/**
 * Walk a widget tree and patch props for widgets matching overrides by id.
 * Mutates widgets in place.
 */
function patchWidgetTree(
  widgets: WidgetSchema[],
  overrides: Map<string, Record<string, unknown>>,
): void {
  if (overrides.size === 0) return

  function walk(items: WidgetSchema[]) {
    for (const widget of items) {
      if (widget.id && overrides.has(widget.id)) {
        widget.props = { ...(widget.props ?? {}), ...overrides.get(widget.id)! } as Record<string, SerializableValue>
      }
      if (widget.widgets) walk(widget.widgets)
    }
  }

  walk(widgets)
}

/** Patch widgets inside a section — thin wrapper over patchWidgetTree. */
function patchWidgetProps(
  section: SectionSchema,
  overrides: Map<string, Record<string, unknown>>,
): void {
  patchWidgetTree(section.widgets, overrides)
}

/**
 * Creates a wrapper React component that calls a section factory function
 * and renders the result through SiteRenderer (via SectionStoryRenderer).
 *
 * Args are split into three buckets:
 * - Pattern args → passed to factory
 * - Layout widget overrides (__lw:*) → patched onto widgets by id after factory runs
 * - Section container args → applied to SectionSchema (constrained, padding, sectionHeight)
 */
function createSectionComponent(
  factory: (config: Record<string, unknown>) => SectionSchema,
  argMap: Map<string, { id: string; key: string }>,
) {
  return function SectionStory(args: Record<string, unknown>) {
    const widgetOverrides = new Map<string, Record<string, unknown>>()
    const sectionContainerArgs: Record<string, unknown> = {}
    const patternArgs: Record<string, unknown> = {}

    for (const [argKey, value] of Object.entries(args)) {
      const mapping = argMap.get(argKey)
      if (mapping) {
        if (!widgetOverrides.has(mapping.id)) widgetOverrides.set(mapping.id, {})
        widgetOverrides.get(mapping.id)![mapping.key] = value
      } else if (SECTION_CONTAINER_KEYS.has(argKey)) {
        sectionContainerArgs[argKey] = value
      } else {
        patternArgs[argKey] = value
      }
    }

    const section = factory(patternArgs)

    // Patch layout widget props from __lw:* controls
    patchWidgetProps(section, widgetOverrides)

    // Apply section-level container overrides
    const enriched: SectionSchema = {
      ...section,
      ...(sectionContainerArgs.constrained !== undefined && { constrained: !!sectionContainerArgs.constrained }),
      ...(sectionContainerArgs.paddingTop !== undefined && { paddingTop: sectionContainerArgs.paddingTop as number }),
      ...(sectionContainerArgs.paddingBottom !== undefined && { paddingBottom: sectionContainerArgs.paddingBottom as number }),
      ...(sectionContainerArgs.paddingLeft !== undefined && { paddingLeft: sectionContainerArgs.paddingLeft as number }),
      ...(sectionContainerArgs.paddingRight !== undefined && { paddingRight: sectionContainerArgs.paddingRight as number }),
      ...(sectionContainerArgs.sectionHeight !== undefined && { sectionHeight: sectionContainerArgs.sectionHeight as string }),
    }

    // Apply layout.* overrides
    const layoutOverrides: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(sectionContainerArgs)) {
      if (key.startsWith('layout.')) {
        layoutOverrides[key.slice('layout.'.length)] = value
      }
    }
    if (Object.keys(layoutOverrides).length > 0) {
      enriched.layout = { ...enriched.layout, ...layoutOverrides } as SectionSchema['layout']
    }

    return SectionStoryRenderer({ section: enriched })
  }
}

/**
 * Extract defaults from a factory's output.
 * Reads section-level fields (constrained) and layout widget prop values
 * as __lw:* keyed defaults, so Storybook controls initialize to what
 * the factory actually produces.
 */
function extractFactoryDefaults(
  factory: (config: Record<string, unknown>) => SectionSchema,
  patternDefaults: Record<string, unknown>,
  maxLayoutDepth = -1,
): Record<string, unknown> {
  try {
    const section = factory(patternDefaults)
    const defaults: Record<string, unknown> = {}

    // Section-level fields
    if (section.constrained != null) defaults.constrained = section.constrained
    if (section.paddingTop != null) defaults.paddingTop = section.paddingTop
    if (section.paddingBottom != null) defaults.paddingBottom = section.paddingBottom
    if (section.paddingLeft != null) defaults.paddingLeft = section.paddingLeft
    if (section.paddingRight != null) defaults.paddingRight = section.paddingRight
    if (section.sectionHeight) defaults.sectionHeight = section.sectionHeight

    // Section layout fields
    const layout = section.layout
    if (layout.type) defaults['layout.type'] = layout.type
    if (layout.direction) defaults['layout.direction'] = layout.direction
    if (layout.align) defaults['layout.align'] = layout.align
    if (layout.justify) defaults['layout.justify'] = layout.justify
    if (layout.gap !== undefined) defaults['layout.gap'] = layout.gap
    if (layout.gapScale != null) defaults['layout.gapScale'] = layout.gapScale
    if (layout.padding) defaults['layout.padding'] = layout.padding
    if (layout.paddingScale != null) defaults['layout.paddingScale'] = layout.paddingScale

    // Extract layout widget prop values as __lw:* keyed defaults
    const layoutWidgets = scanLayoutWidgets(section, maxLayoutDepth)
    for (const lw of layoutWidgets) {
      for (const [key, value] of Object.entries(lw.currentProps)) {
        defaults[`${LW_PREFIX}${lw.id}:${key}`] = value
      }
    }

    return defaults
  } catch {
    return {}
  }
}

/**
 * Generate the Storybook meta config object for a section.
 * Auto-derives layout widget controls from the factory's widget tree.
 * Spread this into the default export object in the story file.
 */
export interface SectionStoryOptions {
  /** Max depth for auto-derived layout widget scanning. -1 = disabled (default), 0 = top-level only, etc. */
  maxLayoutDepth?: number
}

export function sectionStoryConfig(
  sectionMeta: SectionMeta,
  factory: (config: Record<string, unknown>) => SectionSchema,
  previewProps?: Record<string, unknown>,
  figmaUrl?: string,
  options?: SectionStoryOptions,
) {
  const maxLayoutDepth = options?.maxLayoutDepth ?? -1
  const settings = (sectionMeta.settings ?? {}) as Record<string, SettingConfig>
  const containerSettings = getSectionContainerSettings()

  // Call factory to inspect the widget tree for auto-derived layout controls
  const metaDefaults = extractDefaults(settings)
  const section = (() => {
    try { return factory({ ...metaDefaults, ...(previewProps ?? {}) }) }
    catch { return null }
  })()

  let layoutArgTypes: Record<string, ArgType> = {}
  let argMap = new Map<string, { id: string; key: string }>()

  if (section) {
    const layoutWidgets = scanLayoutWidgets(section, maxLayoutDepth)
    const derived = deriveLayoutArgTypes(layoutWidgets)
    layoutArgTypes = derived.argTypes
    argMap = derived.argMap
  }

  // Build layout widget key → widget meta mapping for save-defaults
  const layoutWidgetKeys: Record<string, { metaId: string; settingKey: string }> = {}
  if (section) {
    const lws = scanLayoutWidgets(section, maxLayoutDepth)
    for (const lw of lws) {
      const lwSettings = (lw.meta.settings ?? {}) as Record<string, SettingConfig>
      for (const settingKey of Object.keys(lwSettings)) {
        if (!(settingKey in lw.currentProps)) continue
        const argKey = `${LW_PREFIX}${lw.id}:${settingKey}`
        layoutWidgetKeys[argKey] = { metaId: lw.meta.id ?? lw.type, settingKey }
      }
    }
  }

  // Build combined argTypes, then add conditional hiding for padding controls
  const combined: Record<string, ArgType> = {
    ...settingsToArgTypes(settings),
    ...layoutArgTypes,
    ...settingsToArgTypes(containerSettings),
  }
  // Conditional visibility for section layout controls
  if (combined['layout.gapScale']) {
    combined['layout.gapScale'] = { ...combined['layout.gapScale'], if: { arg: 'layout.gap', neq: 'none' } }
  }
  for (const key of ['layout.padding', 'layout.paddingScale']) {
    if (combined[key]) combined[key] = { ...combined[key], if: { arg: 'sectionHeight', neq: 'viewport-fixed' } }
  }

  return {
    title: sectionMeta.name,
    component: createSectionComponent(factory, argMap),
    parameters: {
      layout: 'fullscreen',
      docs: { description: { component: sectionMeta.description } },
      ...designParams(figmaUrl),
      saveDefaults: {
        id: sectionMeta.id,
        settingKeys: Object.keys(settings),
        defaults: extractDefaults(settings),
        layoutWidgetKeys,
      },
    },
    argTypes: combined,
    decorators: [StoryGlobalsDecorator],
  }
}

/**
 * Generate the default args for a section story.
 * Merges meta defaults → container defaults → factory defaults (including __lw:* widget props) → preview overrides.
 * When a factory is provided, its output is inspected so controls show what's actually rendered.
 */
export function sectionStoryArgs(
  sectionMeta: SectionMeta,
  previewProps?: Record<string, unknown>,
  factory?: (config: Record<string, unknown>) => SectionSchema,
  options?: SectionStoryOptions,
) {
  const maxLayoutDepth = options?.maxLayoutDepth ?? -1
  const settings = (sectionMeta.settings ?? {}) as Record<string, SettingConfig>
  const containerSettings = getSectionContainerSettings()
  const metaDefaults = extractDefaults(settings)
  const containerDefaults = extractDefaults(containerSettings)
  const factoryDefaults = factory
    ? extractFactoryDefaults(factory, { ...metaDefaults, ...(previewProps ?? {}) }, maxLayoutDepth)
    : {}
  return { ...metaDefaults, ...containerDefaults, ...factoryDefaults, ...(previewProps ?? {}) }
}

// =============================================================================
// Pattern widgets (factory functions → WidgetSchema)
// =============================================================================

/**
 * Creates a wrapper React component that calls a factory function
 * and renders the result through WidgetRenderer.
 */
function createPatternComponent(
  factory: (config: Record<string, unknown>) => WidgetSchema
) {
  return function PatternStory(args: Record<string, unknown>) {
    const schema = factory(args)
    return WidgetRenderer({ widget: schema })
  }
}

/**
 * Generate Storybook meta config for a pattern (factory function) widget.
 */
export function patternStoryConfig(
  meta: ComponentMeta,
  factory: (config: Record<string, unknown>) => WidgetSchema,
  figmaUrl?: string,
) {
  const categoryLabel = CATEGORY_LABELS[meta.category] ?? meta.category
  const settings = (meta.settings ?? {}) as Record<string, SettingConfig>

  return {
    title: `${categoryLabel}/${meta.name}`,
    component: createPatternComponent(factory),
    parameters: {
      docs: { description: { component: meta.description } },
      ...designParams(figmaUrl),
      saveDefaults: {
        id: meta.id ?? '',
        settingKeys: Object.keys(settings),
        defaults: extractDefaults(settings),
      },
    },
    argTypes: settingsToArgTypes(settings),
    decorators: [EngineDecorator],
  }
}

/**
 * Generate default args for a pattern widget story.
 */
export function patternStoryArgs(widgetType: string, meta: ComponentMeta) {
  const settings = (meta.settings ?? {}) as Record<string, SettingConfig>
  const metaDefaults = extractDefaults(settings)
  const previewDefaults = PREVIEW_DEFAULTS[widgetType] ?? {}
  return { ...metaDefaults, ...previewDefaults }
}

// =============================================================================
// Chrome regions (Header, Footer — React components)
// =============================================================================

const REGION_TYPE_LABELS: Record<string, string> = {
  header: 'Headers',
  footer: 'Footers',
}

/**
 * Generate Storybook meta config for a chrome region component.
 */
export function chromeStoryConfig(
  regionMeta: RegionMeta,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>,
  figmaUrl?: string,
) {
  const slotLabel = REGION_TYPE_LABELS[regionMeta.regionType] ?? regionMeta.regionType
  const settings = (regionMeta.settings ?? {}) as Record<string, SettingConfig>

  return {
    title: `${slotLabel}/${regionMeta.name}`,
    component,
    parameters: {
      docs: { description: { component: regionMeta.description } },
      ...designParams(figmaUrl),
    },
    argTypes: settingsToArgTypes(settings),
    decorators: [EngineDecorator],
  }
}

/**
 * Generate default args for a chrome region story.
 */
export function chromeStoryArgs(chromeId: string, regionMeta: RegionMeta) {
  const settings = (regionMeta.settings ?? {}) as Record<string, SettingConfig>
  const metaDefaults = extractDefaults(settings)
  const previewDefaults = PREVIEW_DEFAULTS[chromeId] ?? {}
  return { ...metaDefaults, ...previewDefaults }
}

// =============================================================================
// Chrome patterns (factory functions → PresetRegionConfig)
// =============================================================================

const CHROME_SLOT_LABELS: Record<string, string> = {
  header: 'Headers',
  footer: 'Footers',
}

/** Region container keys — separated from pattern args and layout widget args */
const REGION_CONTAINER_KEYS = new Set(['constrained'])

/**
 * Creates a wrapper React component that calls a chrome pattern factory
 * and renders through ChromeStoryRenderer (production path) for slot-based patterns,
 * or through bare WidgetRenderer for overlay-only patterns.
 *
 * Args are split into three buckets (matching section pattern):
 * - Pattern args → passed to factory
 * - __lw:* layout widget overrides → patched onto widgets by id
 * - Region container args → applied to RegionSchema
 */
function createChromePatternComponent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory: (config: any) => PresetRegionConfig,
  argMap: Map<string, { id: string; key: string }>,
  slot: 'header' | 'footer' | null,
) {
  return function ChromePatternStory(args: Record<string, unknown>) {
    const widgetOverrides = new Map<string, Record<string, unknown>>()
    const regionContainerArgs: Record<string, unknown> = {}
    const patternArgs: Record<string, unknown> = {}

    for (const [argKey, value] of Object.entries(args)) {
      const mapping = argMap.get(argKey)
      if (mapping) {
        if (!widgetOverrides.has(mapping.id)) widgetOverrides.set(mapping.id, {})
        widgetOverrides.get(mapping.id)![mapping.key] = value
      } else if (REGION_CONTAINER_KEYS.has(argKey)) {
        regionContainerArgs[argKey] = value
      } else {
        patternArgs[argKey] = value
      }
    }

    const regionConfig = factory(patternArgs)
    const widgets = regionConfig.widgets ?? []

    // Patch layout widget props from __lw:* controls
    patchWidgetTree(widgets, widgetOverrides)

    if (slot) {
      // Build RegionSchema from PresetRegionConfig + container overrides
      const region: RegionSchema = {
        widgets,
        style: regionConfig.style,
        constrained: regionContainerArgs.constrained !== undefined
          ? !!regionContainerArgs.constrained
          : regionConfig.constrained,
        layout: regionConfig.layout,
        overlay: regionConfig.overlay,
        direction: regionConfig.direction,
        collapsible: regionConfig.collapsible,
      }
      return ChromeStoryRenderer({ region, slot })
    }

    // Fallback: overlay-only patterns render through bare WidgetRenderer
    return widgets.map((widget) => WidgetRenderer({ widget }))
  }
}

/**
 * Generate Storybook meta config for a chrome pattern (factory function).
 * Auto-derives layout widget controls from the factory's widget tree.
 */
export interface ChromeStoryOptions {
  /** Max depth for auto-derived layout widget scanning. -1 = disabled (default), 0 = top-level only, etc. */
  maxLayoutDepth?: number
}

export function chromePatternStoryConfig(
  patternMeta: ChromePatternMeta,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory: (config: any) => PresetRegionConfig,
  previewProps?: Record<string, unknown>,
  figmaUrl?: string,
  options?: ChromeStoryOptions,
) {
  const maxLayoutDepth = options?.maxLayoutDepth ?? -1
  const slotLabel = patternMeta.chromeSlot
    ? (CHROME_SLOT_LABELS[patternMeta.chromeSlot] ?? patternMeta.chromeSlot)
    : 'Overlays'
  const settings = (patternMeta.settings ?? {}) as Record<string, SettingConfig>
  const hasSlot = !!patternMeta.chromeSlot

  // Call factory to inspect the widget tree for auto-derived layout controls
  const metaDefaults = extractDefaults(settings)
  const regionConfig = (() => {
    try { return factory({ ...metaDefaults, ...(previewProps ?? {}) }) }
    catch { return null }
  })()

  let layoutArgTypes: Record<string, ArgType> = {}
  let argMap = new Map<string, { id: string; key: string }>()

  if (regionConfig) {
    const layoutWidgets = scanLayoutWidgetsFromTree(regionConfig.widgets ?? [], maxLayoutDepth)
    const derived = deriveLayoutArgTypes(layoutWidgets)
    layoutArgTypes = derived.argTypes
    argMap = derived.argMap
  }

  // Constrained toggle for slot-based patterns
  const constrainedArgType: Record<string, ArgType> = hasSlot
    ? { constrained: { control: { type: 'boolean' }, description: 'Limit region width to --site-max-width', table: { category: 'Container' } } }
    : {}

  return {
    title: `${slotLabel}/${patternMeta.name}`,
    component: createChromePatternComponent(factory, argMap, patternMeta.chromeSlot),
    parameters: {
      layout: 'fullscreen',
      docs: { description: { component: patternMeta.description } },
      ...designParams(figmaUrl),
      saveDefaults: {
        id: patternMeta.id,
        settingKeys: Object.keys(settings),
        defaults: extractDefaults(settings),
      },
    },
    argTypes: {
      ...settingsToArgTypes(settings),
      ...layoutArgTypes,
      ...constrainedArgType,
    },
    decorators: [hasSlot ? StoryGlobalsDecorator : EngineDecorator],
  }
}

/**
 * Extract defaults from a chrome factory's output.
 * Reads region-level fields and layout widget prop values as __lw:* keyed defaults.
 */
function extractChromeFactoryDefaults(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory: (config: any) => PresetRegionConfig,
  patternDefaults: Record<string, unknown>,
  maxLayoutDepth = -1,
): Record<string, unknown> {
  try {
    const regionConfig = factory(patternDefaults)
    const defaults: Record<string, unknown> = {}

    // Region container fields
    if (regionConfig.constrained != null) defaults.constrained = regionConfig.constrained

    // Extract layout widget prop values as __lw:* keyed defaults
    const layoutWidgets = scanLayoutWidgetsFromTree(regionConfig.widgets ?? [], maxLayoutDepth)
    for (const lw of layoutWidgets) {
      for (const [key, value] of Object.entries(lw.currentProps)) {
        defaults[`${LW_PREFIX}${lw.id}:${key}`] = value
      }
    }

    return defaults
  } catch {
    return {}
  }
}

/**
 * Generate default args for a chrome pattern story.
 * Merges meta defaults → factory defaults (constrained + __lw:* widget props) → preview overrides.
 */
export function chromePatternStoryArgs(
  patternMeta: ChromePatternMeta,
  previewProps?: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory?: (config: any) => PresetRegionConfig,
  options?: ChromeStoryOptions,
) {
  const maxLayoutDepth = options?.maxLayoutDepth ?? -1
  const settings = (patternMeta.settings ?? {}) as Record<string, SettingConfig>
  const metaDefaults = extractDefaults(settings)
  const factoryDefaults = factory
    ? extractChromeFactoryDefaults(factory, { ...metaDefaults, ...(previewProps ?? {}) }, maxLayoutDepth)
    : {}
  return { ...metaDefaults, ...factoryDefaults, ...(previewProps ?? {}) }
}

// =============================================================================
// Behaviours (L2 — compute function → CSS variables)
// =============================================================================

const BEHAVIOUR_CATEGORY_LABELS: Record<string, string> = {
  scroll: 'Scroll',
  hover: 'Hover',
  visibility: 'Visibility',
  animation: 'Animation',
  interaction: 'Interaction',
  video: 'Video',
  intro: 'Intro',
}

/**
 * Generate Storybook meta config for a behaviour story.
 * Merges state controls (from `requires`) with settings controls (from `settings`).
 */
export function behaviourStoryConfig(behaviour: Behaviour, figmaUrl?: string) {
  const categoryLabel = BEHAVIOUR_CATEGORY_LABELS[behaviour.category ?? ''] ?? behaviour.category
  const requires = behaviour.requires ?? []
  const settings = (behaviour.settings ?? {}) as Record<string, SettingConfig>

  return {
    title: `${categoryLabel}/${behaviour.name ?? behaviour.id}`,
    parameters: {
      docs: { description: { component: behaviour.description } },
      layout: 'padded',
      ...designParams(figmaUrl),
      saveDefaults: {
        id: behaviour.id,
        settingKeys: Object.keys(settings),
        defaults: extractDefaults(settings),
      },
    },
    argTypes: {
      ...stateArgTypes(requires),
      ...settingsToArgTypes(settings),
    },
    decorators: [EngineDecorator],
  }
}

/**
 * Generate default args for a behaviour story.
 * Merges state defaults (from `requires`) with settings defaults.
 */
export function behaviourStoryArgs(behaviour: Behaviour) {
  const requires = behaviour.requires ?? []
  const settings = (behaviour.settings ?? {}) as Record<string, SettingConfig>
  return {
    ...stateDefaults(requires),
    ...extractDefaults(settings),
  }
}
