/**
 * Creativeshire Token Sync — Figma Plugin
 *
 * Phase A: Creates Variable Collections from engine ThemeDefinition data.
 * Phase B: Creates component library pages + components with variable bindings.
 * Theme Showcase: Visual reference of all design tokens with variable bindings.
 *
 * Commands:
 *   Run All            — A + B + Theme Showcase
 *   Phase A: Variables  — Variable collections only
 *   Phase B: Components — Widget/chrome component library
 *   Theme Showcase      — Token reference page
 *
 * Run via: Plugins → Development → Import plugin from manifest
 *
 * Idempotent — safe to re-run. Existing items are skipped, never overwritten.
 */

// ─── Theme Data (from engine/themes/definitions/) ────────────────────────

const THEMES = [
  {
    name: 'Contrast',
    dark: {
      background: '#0a0a0a', text: '#ffffff', textPrimary: '#ffffff',
      textSecondary: '#999999', accent: '#9933FF', interaction: '#9933FF',
      colorPrimary: '#9933FF', colorPrimaryContrast: '#ffffff',
      colorSecondary: '#1a1a1a', colorSecondaryContrast: '#ffffff',
      colorLink: '#9933FF', colorFocus: '#9933FF',
      scrollbarThumb: '#ffffff', scrollbarTrack: '#0a0a0a',
      statusSuccess: '#4ade80', statusError: '#f87171',
    },
    light: {
      background: '#ffffff', text: '#1a1a1a', textPrimary: '#1a1a1a',
      textSecondary: '#666666', accent: '#6600CC', interaction: '#6600CC',
      colorPrimary: '#6600CC', colorPrimaryContrast: '#ffffff',
      colorSecondary: '#e0e0e0', colorSecondaryContrast: '#333333',
      colorLink: '#6600CC', colorFocus: '#6600CC',
      scrollbarThumb: '#cccccc', scrollbarTrack: '#f5f5f5',
      statusSuccess: '#22c55e', statusError: '#ef4444',
    },
    typography: {
      title: 'Inter', paragraph: 'Plus Jakarta Sans', ui: 'Inter',
      scale: {
        display: 'clamp(3rem, 6cqw, 6rem)', h1: '2.25rem', h2: '1.5rem',
        h3: '1.125rem', body: '1rem', small: '0.75rem',
      },
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '2rem', xl: '4rem', '2xl': '6rem',
      sectionX: 'clamp(2rem, 6cqw, 6rem)', sectionY: 'clamp(3rem, 6cqw, 6rem)' },
    radius: { none: '0', sm: '2px', md: '4px', lg: '4px', full: '9999px' },
    shadows: { none: 'none', sm: 'none', md: 'none', lg: '0 2px 8px rgba(0,0,0,0.3)' },
    borders: { width: '1px', style: 'solid', color: 'currentColor', dividerOpacity: '0.15' },
    motion: {
      durationFast: '120ms', durationNormal: '250ms', durationSlow: '400ms',
      easeDefault: 'cubic-bezier(0.16, 1, 0.3, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)',
      easeOut: 'cubic-bezier(0, 0.55, 0.45, 1)',
    },
    textDecoration: { style: 'solid', thickness: '1px', offset: '4px' },
    interaction: { hoverOpacity: '0.8', activeScale: '0.98', focusRingWidth: '2px', focusRingOffset: '2px' },
  },
  {
    name: 'Muted',
    dark: {
      background: '#27272A', text: '#d8d8d5', textPrimary: '#d8d8d5',
      textSecondary: '#a1a1aa', accent: '#d8d8d5', interaction: '#d8d8d5',
      colorPrimary: '#d8d8d5', colorPrimaryContrast: '#27272A',
      colorSecondary: '#3f3f46', colorSecondaryContrast: '#d8d8d5',
      colorLink: '#d8d8d5', colorFocus: '#d8d8d5',
      scrollbarThumb: '#d8d8d5', scrollbarTrack: '#27272A',
      statusSuccess: '#4ade80', statusError: '#f87171',
    },
    light: {
      background: '#d8d8d5', text: '#27272A', textPrimary: '#27272A',
      textSecondary: '#71717A', accent: '#27272A', interaction: '#27272A',
      colorPrimary: '#27272A', colorPrimaryContrast: '#ffffff',
      colorSecondary: '#c8c8c5', colorSecondaryContrast: '#27272A',
      colorLink: '#27272A', colorFocus: '#27272A',
      scrollbarThumb: '#27272A', scrollbarTrack: '#d8d8d5',
      statusSuccess: '#16a34a', statusError: '#dc2626',
    },
    typography: {
      title: 'BBH Sans Hegarty', paragraph: 'Plus Jakarta Sans', ui: 'Plus Jakarta Sans',
      scale: {
        display: 'clamp(2.5rem, 5cqw, 4.5rem)', h1: '2.25rem', h2: '1.5rem',
        h3: '1rem', body: '0.875rem', small: '0.625rem',
      },
    },
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '2rem', xl: '4rem', '2xl': '8rem',
      sectionX: 'clamp(1.5rem, 8cqw, 8rem)', sectionY: 'clamp(4rem, 8cqw, 8rem)' },
    radius: { none: '0', sm: '0', md: '0', lg: '0', full: '9999px' },
    shadows: { none: 'none', sm: 'none', md: 'none', lg: 'none' },
    borders: { width: '2px', style: 'dashed', color: 'currentColor', dividerOpacity: '0.2' },
    motion: {
      durationFast: '200ms', durationNormal: '400ms', durationSlow: '600ms',
      easeDefault: 'cubic-bezier(0.4, 0, 0.2, 1)', easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    },
    textDecoration: { style: 'dashed', thickness: '1px', offset: '6px' },
    interaction: { hoverOpacity: '1', activeScale: '1', focusRingWidth: '2px', focusRingOffset: '3px' },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────

/** Hex → Figma RGB (0–1). */
function hexToRGB(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  }
}

/** CSS value string → number (rem→px at 16px base). */
function toNumber(value) {
  const num = parseFloat(value)
  if (value.endsWith('rem')) return num * 16
  return num // px, ms, unitless
}

/** Resolve clamp() to upper bound px, or parse directly. */
function resolveNumber(value) {
  const match = value.match(/clamp\([^,]+,\s*[^,]+,\s*([^)]+)\)/)
  if (match) return toNumber(match[1].trim())
  return toNumber(value)
}

// ─── Color Variables ─────────────────────────────────────────────────────

const COLOR_FIELDS = [
  { key: 'background',            name: 'colors/background' },
  { key: 'text',                  name: 'colors/text' },
  { key: 'textPrimary',           name: 'colors/text-primary' },
  { key: 'textSecondary',         name: 'colors/text-secondary' },
  { key: 'accent',                name: 'colors/accent' },
  { key: 'interaction',           name: 'colors/interaction' },
  { key: 'colorPrimary',          name: 'colors/primary' },
  { key: 'colorPrimaryContrast',  name: 'colors/primary-contrast' },
  { key: 'colorSecondary',        name: 'colors/secondary' },
  { key: 'colorSecondaryContrast',name: 'colors/secondary-contrast' },
  { key: 'colorLink',             name: 'colors/link' },
  { key: 'colorFocus',            name: 'colors/focus' },
  { key: 'scrollbarThumb',        name: 'colors/scrollbar-thumb' },
  { key: 'scrollbarTrack',        name: 'colors/scrollbar-track' },
  { key: 'statusSuccess',         name: 'colors/status-success' },
  { key: 'statusError',           name: 'colors/status-error' },
]

// ═══════════════════════════════════════════════════════════════════════════
// Phase A — Variable Collections (idempotent)
// ═══════════════════════════════════════════════════════════════════════════

async function phaseA() {
  const log = []

  // Build lookup of existing collections
  const existingCollections = figma.variables.getLocalVariableCollections()
  const collByName = {}
  for (const c of existingCollections) collByName[c.name] = c

  // Skip entire Phase A if all collections exist
  const requiredColls = ['Colors', 'Typography', 'Spacing', 'Radius', 'Shadows', 'Borders', 'Motion', 'Text Decoration', 'Interaction']
  const allExist = requiredColls.every(name => collByName[name])
  if (allExist) {
    log.push('Phase A: All variable collections already exist — skipped')
    return log
  }

  // ── Colors (4 modes: {Theme} Dark, {Theme} Light) ──────────────────

  if (!collByName['Colors']) {
    const colorsColl = figma.variables.createVariableCollection('Colors')
    colorsColl.renameMode(colorsColl.modes[0].modeId, `${THEMES[0].name} Dark`)
    const colorModeIds = {}
    colorModeIds[`${THEMES[0].name} Dark`] = colorsColl.modes[0].modeId
    colorModeIds[`${THEMES[0].name} Light`] = colorsColl.addMode(`${THEMES[0].name} Light`)
    for (let i = 1; i < THEMES.length; i++) {
      colorModeIds[`${THEMES[i].name} Dark`] = colorsColl.addMode(`${THEMES[i].name} Dark`)
      colorModeIds[`${THEMES[i].name} Light`] = colorsColl.addMode(`${THEMES[i].name} Light`)
    }

    for (const { key, name } of COLOR_FIELDS) {
      const v = figma.variables.createVariable(name, colorsColl, 'COLOR')
      for (const theme of THEMES) {
        v.setValueForMode(colorModeIds[`${theme.name} Dark`], hexToRGB(theme.dark[key]))
        v.setValueForMode(colorModeIds[`${theme.name} Light`], hexToRGB(theme.light[key]))
      }
    }
    log.push(`Colors: ${COLOR_FIELDS.length} variables, ${Object.keys(colorModeIds).length} modes`)
  } else {
    log.push('Colors: already exists — skipped')
  }

  // ── Helper: create a token collection with 1 mode per theme ────────

  function createTokenCollection(name) {
    if (collByName[name]) return null
    const coll = figma.variables.createVariableCollection(name)
    coll.renameMode(coll.modes[0].modeId, THEMES[0].name)
    const modeIds = {}
    modeIds[THEMES[0].name] = coll.modes[0].modeId
    for (let i = 1; i < THEMES.length; i++) {
      modeIds[THEMES[i].name] = coll.addMode(THEMES[i].name)
    }
    return { coll, modeIds }
  }

  // ── Typography (STRING) ────────────────────────────────────────────

  const typoResult = createTokenCollection('Typography')
  if (typoResult) {
    const { coll: typoColl, modeIds: typoModes } = typoResult
    const TYPO_VARS = [
      { name: 'type/font-title',     get: (t) => t.typography.title },
      { name: 'type/font-paragraph',  get: (t) => t.typography.paragraph },
      { name: 'type/font-ui',         get: (t) => t.typography.ui },
      { name: 'type/scale-display',   get: (t) => t.typography.scale.display },
      { name: 'type/scale-h1',        get: (t) => t.typography.scale.h1 },
      { name: 'type/scale-h2',        get: (t) => t.typography.scale.h2 },
      { name: 'type/scale-h3',        get: (t) => t.typography.scale.h3 },
      { name: 'type/scale-body',      get: (t) => t.typography.scale.body },
      { name: 'type/scale-small',     get: (t) => t.typography.scale.small },
    ]
    for (const tv of TYPO_VARS) {
      const v = figma.variables.createVariable(tv.name, typoColl, 'STRING')
      for (const theme of THEMES) {
        v.setValueForMode(typoModes[theme.name], tv.get(theme))
      }
    }
    log.push(`Typography: ${TYPO_VARS.length} variables`)
  } else {
    log.push('Typography: already exists — skipped')
  }

  // ── Spacing (FLOAT — px) ──────────────────────────────────────────

  const spacingResult = createTokenCollection('Spacing')
  if (spacingResult) {
    const { coll: spacingColl, modeIds: spacingModes } = spacingResult
    const SPACING_VARS = [
      { name: 'spacing/xs',        key: 'xs' },
      { name: 'spacing/sm',        key: 'sm' },
      { name: 'spacing/md',        key: 'md' },
      { name: 'spacing/lg',        key: 'lg' },
      { name: 'spacing/xl',        key: 'xl' },
      { name: 'spacing/2xl',       key: '2xl' },
      { name: 'spacing/section-x', key: 'sectionX' },
      { name: 'spacing/section-y', key: 'sectionY' },
    ]
    for (const sv of SPACING_VARS) {
      const v = figma.variables.createVariable(sv.name, spacingColl, 'FLOAT')
      for (const theme of THEMES) {
        v.setValueForMode(spacingModes[theme.name], resolveNumber(theme.spacing[sv.key]))
      }
      if (sv.key === 'sectionX' || sv.key === 'sectionY') {
        v.description = `Responsive (clamp upper bound shown). CSS: ${THEMES[0].spacing[sv.key]}`
      }
    }
    log.push(`Spacing: ${SPACING_VARS.length} variables`)
  } else {
    log.push('Spacing: already exists — skipped')
  }

  // ── Radius (FLOAT — px) ───────────────────────────────────────────

  const radiusResult = createTokenCollection('Radius')
  if (radiusResult) {
    const { coll: radiusColl, modeIds: radiusModes } = radiusResult
    for (const key of ['none', 'sm', 'md', 'lg', 'full']) {
      const v = figma.variables.createVariable(`radius/${key}`, radiusColl, 'FLOAT')
      for (const theme of THEMES) {
        v.setValueForMode(radiusModes[theme.name], toNumber(theme.radius[key]))
      }
    }
    log.push('Radius: 5 variables')
  } else {
    log.push('Radius: already exists — skipped')
  }

  // ── Shadows (STRING) ──────────────────────────────────────────────

  const shadowsResult = createTokenCollection('Shadows')
  if (shadowsResult) {
    const { coll: shadowsColl, modeIds: shadowModes } = shadowsResult
    for (const key of ['none', 'sm', 'md', 'lg']) {
      const v = figma.variables.createVariable(`shadow/${key}`, shadowsColl, 'STRING')
      for (const theme of THEMES) {
        v.setValueForMode(shadowModes[theme.name], theme.shadows[key])
      }
    }
    log.push('Shadows: 4 variables')
  } else {
    log.push('Shadows: already exists — skipped')
  }

  // ── Borders (mixed FLOAT + STRING) ────────────────────────────────

  const bordersResult = createTokenCollection('Borders')
  if (bordersResult) {
    const { coll: bordersColl, modeIds: borderModes } = bordersResult

    const bWidth = figma.variables.createVariable('border/width', bordersColl, 'FLOAT')
    for (const theme of THEMES) bWidth.setValueForMode(borderModes[theme.name], toNumber(theme.borders.width))

    const bStyle = figma.variables.createVariable('border/style', bordersColl, 'STRING')
    for (const theme of THEMES) bStyle.setValueForMode(borderModes[theme.name], theme.borders.style)

    const bColor = figma.variables.createVariable('border/color', bordersColl, 'STRING')
    bColor.description = 'CSS color value (may be currentColor)'
    for (const theme of THEMES) bColor.setValueForMode(borderModes[theme.name], theme.borders.color)

    const bOpacity = figma.variables.createVariable('border/divider-opacity', bordersColl, 'FLOAT')
    for (const theme of THEMES) bOpacity.setValueForMode(borderModes[theme.name], parseFloat(theme.borders.dividerOpacity))

    log.push('Borders: 4 variables')
  } else {
    log.push('Borders: already exists — skipped')
  }

  // ── Motion (FLOAT for durations, STRING for easing) ───────────────

  const motionResult = createTokenCollection('Motion')
  if (motionResult) {
    const { coll: motionColl, modeIds: motionModes } = motionResult
    const MOTION_VARS = [
      { name: 'motion/duration-fast',   type: 'FLOAT',  get: (t) => toNumber(t.motion.durationFast) },
      { name: 'motion/duration-normal', type: 'FLOAT',  get: (t) => toNumber(t.motion.durationNormal) },
      { name: 'motion/duration-slow',   type: 'FLOAT',  get: (t) => toNumber(t.motion.durationSlow) },
      { name: 'motion/ease-default',    type: 'STRING', get: (t) => t.motion.easeDefault },
      { name: 'motion/ease-in',         type: 'STRING', get: (t) => t.motion.easeIn },
      { name: 'motion/ease-out',        type: 'STRING', get: (t) => t.motion.easeOut },
    ]
    for (const mv of MOTION_VARS) {
      const v = figma.variables.createVariable(mv.name, motionColl, mv.type)
      for (const theme of THEMES) {
        v.setValueForMode(motionModes[theme.name], mv.get(theme))
      }
    }
    log.push('Motion: 6 variables')
  } else {
    log.push('Motion: already exists — skipped')
  }

  // ── Text Decoration (STRING) ──────────────────────────────────────

  const textDecResult = createTokenCollection('Text Decoration')
  if (textDecResult) {
    const { coll: textDecColl, modeIds: textDecModes } = textDecResult
    for (const key of ['style', 'thickness', 'offset']) {
      const v = figma.variables.createVariable(`text-decoration/${key}`, textDecColl, 'STRING')
      for (const theme of THEMES) {
        v.setValueForMode(textDecModes[theme.name], theme.textDecoration[key])
      }
    }
    log.push('Text Decoration: 3 variables')
  } else {
    log.push('Text Decoration: already exists — skipped')
  }

  // ── Interaction (FLOAT) ───────────────────────────────────────────

  const interactionResult = createTokenCollection('Interaction')
  if (interactionResult) {
    const { coll: interactionColl, modeIds: interactionModes } = interactionResult
    const INTERACTION_VARS = [
      { name: 'interaction/hover-opacity',    key: 'hoverOpacity' },
      { name: 'interaction/active-scale',     key: 'activeScale' },
      { name: 'interaction/focus-ring-width', key: 'focusRingWidth' },
      { name: 'interaction/focus-ring-offset',key: 'focusRingOffset' },
    ]
    for (const iv of INTERACTION_VARS) {
      const v = figma.variables.createVariable(iv.name, interactionColl, 'FLOAT')
      for (const theme of THEMES) {
        v.setValueForMode(interactionModes[theme.name], toNumber(theme.interaction[iv.key]))
      }
    }
    log.push('Interaction: 4 variables')
  } else {
    log.push('Interaction: already exists — skipped')
  }

  return log
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase B — Component Library (idempotent)
// ═══════════════════════════════════════════════════════════════════════════

async function phaseB() {
  const log = []

  // ── Build variable lookup ─────────────────────────────────────────

  const allVars = figma.variables.getLocalVariables()
  const varByName = {}
  for (const v of allVars) varByName[v.name] = v

  // Diagnostic: log available variables
  const varNames = Object.keys(varByName)
  console.log(`Phase B: Found ${varNames.length} variables:`, varNames.join(', '))
  log.push(`Variables found: ${varNames.length}`)

  // ── Font loading ──────────────────────────────────────────────────

  const fontsToLoad = [
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Bold' },
    { family: 'Inter', style: 'Semi Bold' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Plus Jakarta Sans', style: 'Regular' },
    { family: 'Plus Jakarta Sans', style: 'Medium' },
  ]

  let fontFamily = 'Inter'
  let fontLoaded = false

  for (const font of fontsToLoad) {
    try {
      await figma.loadFontAsync(font)
      fontLoaded = true
    } catch (_) {
      // Font not available — will use fallback
    }
  }

  if (!fontLoaded) {
    // Fallback to a system font guaranteed to exist
    try {
      await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
      fontFamily = 'Roboto'
    } catch (_) {
      try {
        await figma.loadFontAsync({ family: 'Arial', style: 'Regular' })
        fontFamily = 'Arial'
      } catch (_2) {
        log.push('Warning: Could not load any fonts')
      }
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────

  function findOrCreatePage(name) {
    const existing = figma.root.children.find(p => p.name === name)
    if (existing) return existing
    const page = figma.createPage()
    page.name = name
    return page
  }

  function findComponent(page, name) {
    return page.findOne(n => n.type === 'COMPONENT' && n.name === name)
      || page.findOne(n => n.type === 'COMPONENT_SET' && n.name === name)
  }

  /** Bind a color variable to a node's fill. */
  function bindFill(node, varName) {
    const v = varByName[varName]
    if (!v) return
    const paint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }
    node.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', v)]
  }

  // Fallback values (px) if variable isn't found
  const FALLBACKS = {
    'spacing/xs': 4, 'spacing/sm': 8, 'spacing/md': 16, 'spacing/lg': 32,
    'spacing/xl': 64, 'spacing/2xl': 96, 'spacing/section-x': 96, 'spacing/section-y': 96,
    'radius/none': 0, 'radius/sm': 2, 'radius/md': 4, 'radius/lg': 4, 'radius/full': 9999,
  }

  /** Bind a float variable to a node property. Falls back to px value if variable missing. */
  function bindFloat(node, prop, varName) {
    const v = varByName[varName]
    if (!v) {
      console.warn(`Variable not found: "${varName}" — using fallback`)
      if (FALLBACKS[varName] !== undefined) node[prop] = FALLBACKS[varName]
      return
    }
    node.setBoundVariable(prop, v)
  }

  /** Create a text node with specified properties. */
  function createText(chars, opts = {}) {
    const text = figma.createText()
    text.fontName = { family: opts.fontFamily || fontFamily, style: opts.fontStyle || 'Regular' }
    text.characters = chars
    if (opts.fontSize) text.fontSize = opts.fontSize
    if (opts.fillVar) bindFill(text, opts.fillVar)
    if (opts.name) text.name = opts.name
    return text
  }

  /** Set up auto-layout on a frame. */
  function autoLayout(frame, opts = {}) {
    frame.layoutMode = opts.direction || 'VERTICAL'
    frame.primaryAxisSizingMode = opts.primarySizing || 'AUTO'
    frame.counterAxisSizingMode = opts.counterSizing || 'AUTO'
    if (opts.gap !== undefined) frame.itemSpacing = opts.gap
    if (opts.paddingH !== undefined) {
      frame.paddingLeft = opts.paddingH
      frame.paddingRight = opts.paddingH
    }
    if (opts.paddingV !== undefined) {
      frame.paddingTop = opts.paddingV
      frame.paddingBottom = opts.paddingV
    }
    if (opts.padding !== undefined) {
      frame.paddingTop = opts.padding
      frame.paddingBottom = opts.padding
      frame.paddingLeft = opts.padding
      frame.paddingRight = opts.padding
    }
    if (opts.primaryAlign) frame.primaryAxisAlignItems = opts.primaryAlign
    if (opts.counterAlign) frame.counterAxisAlignItems = opts.counterAlign
    return frame
  }

  // ── Create Pages ──────────────────────────────────────────────────

  const primitivesPage = findOrCreatePage('Primitives')
  const layoutPage = findOrCreatePage('Layout')
  const interactivePage = findOrCreatePage('Interactive')
  const chromePage = findOrCreatePage('Chrome')
  log.push('Pages: ready')

  // ══════════════════════════════════════════════════════════════════
  // PRIMITIVES
  // ══════════════════════════════════════════════════════════════════

  await figma.setCurrentPageAsync(primitivesPage)

  // ── Text (variant set: display, h1, h2, h3, body, small) ─────────

  if (!findComponent(primitivesPage, 'Primitives/Text')) {
    const TEXT_VARIANTS = [
      { variant: 'Display', fontSize: 96, fontStyle: 'Bold' },
      { variant: 'H1',      fontSize: 36, fontStyle: 'Bold' },
      { variant: 'H2',      fontSize: 24, fontStyle: 'Semi Bold' },
      { variant: 'H3',      fontSize: 18, fontStyle: 'Medium' },
      { variant: 'Body',    fontSize: 16, fontStyle: 'Regular' },
      { variant: 'Small',   fontSize: 12, fontStyle: 'Regular' },
    ]

    const textComponents = []
    for (const tv of TEXT_VARIANTS) {
      const comp = figma.createComponent()
      comp.name = `Style=${tv.variant}`
      // Size first, then enable auto-layout with FIXED so size sticks
      comp.resize(320, tv.fontSize + 24)
      comp.layoutMode = 'VERTICAL'
      comp.primaryAxisSizingMode = 'FIXED'
      comp.counterAxisSizingMode = 'FIXED'
      comp.paddingTop = 8
      comp.paddingBottom = 8
      comp.paddingLeft = 8
      comp.paddingRight = 8

      let style = tv.fontStyle
      try {
        await figma.loadFontAsync({ family: fontFamily, style })
      } catch (_) {
        style = 'Regular'
      }

      const text = createText(`${tv.variant} Text`, {
        fontSize: tv.fontSize,
        fontStyle: style,
        fillVar: 'colors/text-primary',
        name: 'Text Content',
      })
      text.layoutAlign = 'STRETCH'
      comp.appendChild(text)
      textComponents.push(comp)
    }

    const textSet = figma.combineAsVariants(textComponents, primitivesPage)
    textSet.name = 'Primitives/Text'
    textSet.description = 'engine/content/widgets/primitives/Text'
    // Position on page
    textSet.x = 0
    textSet.y = 0
    log.push('Text: created with 6 variants')
  } else {
    log.push('Text: already exists — skipped')
  }

  // ── Button (variant set: Primary, Secondary, Ghost) ───────────────

  if (!findComponent(primitivesPage, 'Primitives/Button')) {
    const BUTTON_VARIANTS = [
      {
        variant: 'Primary',
        bgVar: 'colors/primary',
        textVar: 'colors/primary-contrast',
      },
      {
        variant: 'Secondary',
        bgVar: 'colors/secondary',
        textVar: 'colors/secondary-contrast',
      },
      {
        variant: 'Ghost',
        bgVar: null,
        textVar: 'colors/text-primary',
      },
    ]

    const buttonComponents = []
    for (const bv of BUTTON_VARIANTS) {
      const comp = figma.createComponent()
      comp.name = `Variant=${bv.variant}`
      // Size first, then auto-layout with FIXED
      comp.resize(140, 44)
      comp.layoutMode = 'HORIZONTAL'
      comp.primaryAxisSizingMode = 'FIXED'
      comp.counterAxisSizingMode = 'FIXED'
      comp.primaryAxisAlignItems = 'CENTER'
      comp.counterAxisAlignItems = 'CENTER'
      // Bind padding
      bindFloat(comp, 'paddingTop', 'spacing/sm')
      bindFloat(comp, 'paddingBottom', 'spacing/sm')
      bindFloat(comp, 'paddingLeft', 'spacing/md')
      bindFloat(comp, 'paddingRight', 'spacing/md')
      // Bind radius
      bindFloat(comp, 'topLeftRadius', 'radius/md')
      bindFloat(comp, 'topRightRadius', 'radius/md')
      bindFloat(comp, 'bottomLeftRadius', 'radius/md')
      bindFloat(comp, 'bottomRightRadius', 'radius/md')

      // Background fill
      if (bv.bgVar) {
        bindFill(comp, bv.bgVar)
      } else {
        comp.fills = []
      }

      // Label
      const label = createText('Button', {
        fontSize: 14,
        fontStyle: 'Medium',
        fillVar: bv.textVar,
        name: 'Label',
      })
      comp.appendChild(label)

      buttonComponents.push(comp)
    }

    const buttonSet = figma.combineAsVariants(buttonComponents, primitivesPage)
    buttonSet.name = 'Primitives/Button'
    buttonSet.description = 'engine/content/widgets/primitives/Button'
    buttonSet.x = 400
    buttonSet.y = 0
    log.push('Button: created with 3 variants')
  } else {
    log.push('Button: already exists — skipped')
  }

  // ── Link (variant set: Default, Underline, Hover Underline) ───────

  if (!findComponent(primitivesPage, 'Primitives/Link')) {
    const LINK_VARIANTS = [
      { variant: 'Default', decoration: 'NONE' },
      { variant: 'Underline', decoration: 'UNDERLINE' },
      { variant: 'Hover Underline', decoration: 'NONE' },
    ]

    const linkComponents = []
    for (const lv of LINK_VARIANTS) {
      const comp = figma.createComponent()
      comp.name = `Variant=${lv.variant}`
      // Size first, then auto-layout with FIXED
      comp.resize(120, 32)
      comp.layoutMode = 'HORIZONTAL'
      comp.primaryAxisSizingMode = 'FIXED'
      comp.counterAxisSizingMode = 'FIXED'
      comp.counterAxisAlignItems = 'CENTER'
      comp.paddingLeft = 4
      comp.paddingRight = 4

      const text = createText('Link Text', {
        fontSize: 16,
        fillVar: 'colors/link',
        name: 'Link Text',
      })
      text.textDecoration = lv.decoration
      comp.appendChild(text)

      linkComponents.push(comp)
    }

    const linkSet = figma.combineAsVariants(linkComponents, primitivesPage)
    linkSet.name = 'Primitives/Link'
    linkSet.description = 'engine/content/widgets/primitives/Link'
    linkSet.x = 600
    linkSet.y = 0
    log.push('Link: created with 3 variants')
  } else {
    log.push('Link: already exists — skipped')
  }

  // ── Icon ──────────────────────────────────────────────────────────

  if (!findComponent(primitivesPage, 'Primitives/Icon')) {
    const comp = figma.createComponent()
    comp.name = 'Primitives/Icon'
    comp.description = 'engine/content/widgets/primitives/Icon'
    comp.resize(24, 24)

    // Placeholder circle
    const circle = figma.createEllipse()
    circle.resize(24, 24)
    circle.name = 'Icon Shape'
    bindFill(circle, 'colors/text-primary')
    comp.appendChild(circle)

    comp.x = 800
    comp.y = 0
    primitivesPage.appendChild(comp)
    log.push('Icon: created')
  } else {
    log.push('Icon: already exists — skipped')
  }

  // ── Image ─────────────────────────────────────────────────────────

  if (!findComponent(primitivesPage, 'Primitives/Image')) {
    const comp = figma.createComponent()
    comp.name = 'Primitives/Image'
    comp.description = 'engine/content/widgets/primitives/Image'
    comp.resize(320, 240)

    // Placeholder rectangle with muted fill
    const rect = figma.createRectangle()
    rect.resize(320, 240)
    rect.name = 'Image Placeholder'
    rect.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }]
    // Bind radius
    bindFloat(rect, 'topLeftRadius', 'radius/md')
    bindFloat(rect, 'topRightRadius', 'radius/md')
    bindFloat(rect, 'bottomLeftRadius', 'radius/md')
    bindFloat(rect, 'bottomRightRadius', 'radius/md')
    comp.appendChild(rect)

    // Placeholder label
    const label = createText('Image', {
      fontSize: 14,
      fillVar: 'colors/text-secondary',
      name: 'Placeholder Label',
    })
    label.x = 136
    label.y = 112
    comp.appendChild(label)

    comp.x = 900
    comp.y = 0
    primitivesPage.appendChild(comp)
    log.push('Image: created')
  } else {
    log.push('Image: already exists — skipped')
  }

  // ══════════════════════════════════════════════════════════════════
  // LAYOUT
  // ══════════════════════════════════════════════════════════════════

  await figma.setCurrentPageAsync(layoutPage)

  /** Create a layout component with standard structure. */
  function createLayoutComponent(page, name, opts) {
    const fullName = `Layout/${name}`
    if (findComponent(page, fullName)) return null

    const comp = figma.createComponent()
    comp.name = fullName
    comp.description = `engine/content/widgets/layout/${name}`

    // Resize BEFORE auto-layout so dimensions stick
    comp.resize(opts.width || 400, opts.height || 200)

    if (opts.layoutMode) {
      comp.layoutMode = opts.layoutMode
      // Use FIXED sizing so resize dimensions are respected
      comp.primaryAxisSizingMode = opts.primarySizing || 'FIXED'
      comp.counterAxisSizingMode = opts.counterSizing || 'FIXED'

      // Bind gap
      if (opts.gapVar) bindFloat(comp, 'itemSpacing', opts.gapVar)
      // Bind padding
      if (opts.paddingVar) {
        bindFloat(comp, 'paddingTop', opts.paddingVar)
        bindFloat(comp, 'paddingBottom', opts.paddingVar)
        bindFloat(comp, 'paddingLeft', opts.paddingVar)
        bindFloat(comp, 'paddingRight', opts.paddingVar)
      }
      if (opts.paddingHVar) {
        bindFloat(comp, 'paddingLeft', opts.paddingHVar)
        bindFloat(comp, 'paddingRight', opts.paddingHVar)
      }

      if (opts.wrap) comp.layoutWrap = 'WRAP'
    }

    // Add placeholder children
    if (opts.children) {
      for (const childOpts of opts.children) {
        const child = figma.createFrame()
        child.name = childOpts.name || 'Item'
        child.resize(childOpts.width || 120, childOpts.height || 80)
        child.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
        if (childOpts.layoutGrow !== undefined) child.layoutGrow = childOpts.layoutGrow
        if (childOpts.layoutAlign) child.layoutAlign = childOpts.layoutAlign
        comp.appendChild(child)
      }
    }

    page.appendChild(comp)
    return comp
  }

  // ── Stack ─────────────────────────────────────────────────────────

  const stackComp = createLayoutComponent(layoutPage, 'Stack', {
    layoutMode: 'VERTICAL',
    gapVar: 'spacing/md',
    paddingVar: 'spacing/md',
    width: 400, height: 280,
    children: [
      { name: 'Item 1', width: 360, height: 80, layoutAlign: 'STRETCH' },
      { name: 'Item 2', width: 360, height: 80, layoutAlign: 'STRETCH' },
      { name: 'Item 3', width: 360, height: 80, layoutAlign: 'STRETCH' },
    ],
  })
  if (stackComp) { stackComp.x = 0; stackComp.y = 0; log.push('Stack: created') }
  else log.push('Stack: already exists — skipped')

  // ── Flex ──────────────────────────────────────────────────────────

  const flexComp = createLayoutComponent(layoutPage, 'Flex', {
    layoutMode: 'HORIZONTAL',
    gapVar: 'spacing/md',
    paddingVar: 'spacing/md',
    width: 600, height: 120,
    children: [
      { name: 'Item 1', width: 120, height: 80 },
      { name: 'Item 2', width: 120, height: 80 },
      { name: 'Item 3', width: 120, height: 80 },
    ],
  })
  if (flexComp) { flexComp.x = 500; flexComp.y = 0; log.push('Flex: created') }
  else log.push('Flex: already exists — skipped')

  // ── Grid ──────────────────────────────────────────────────────────

  const gridComp = createLayoutComponent(layoutPage, 'Grid', {
    layoutMode: 'HORIZONTAL',
    gapVar: 'spacing/md',
    paddingVar: 'spacing/md',
    wrap: true,
    width: 400, height: 250,
    primarySizing: 'FIXED',
    counterSizing: 'AUTO',
    children: [
      { name: 'Cell 1', width: 120, height: 80 },
      { name: 'Cell 2', width: 120, height: 80 },
      { name: 'Cell 3', width: 120, height: 80 },
      { name: 'Cell 4', width: 120, height: 80 },
      { name: 'Cell 5', width: 120, height: 80 },
      { name: 'Cell 6', width: 120, height: 80 },
    ],
  })
  if (gridComp) { gridComp.x = 1200; gridComp.y = 0; log.push('Grid: created') }
  else log.push('Grid: already exists — skipped')

  // ── Split ─────────────────────────────────────────────────────────

  const splitComp = createLayoutComponent(layoutPage, 'Split', {
    layoutMode: 'HORIZONTAL',
    gapVar: 'spacing/lg',
    width: 800, height: 300,
    children: [
      { name: 'Left', width: 380, height: 300, layoutGrow: 1, layoutAlign: 'STRETCH' },
      { name: 'Right', width: 380, height: 300, layoutGrow: 1, layoutAlign: 'STRETCH' },
    ],
  })
  if (splitComp) { splitComp.x = 0; splitComp.y = 350; log.push('Split: created') }
  else log.push('Split: already exists — skipped')

  // ── Container ─────────────────────────────────────────────────────

  const containerFullName = 'Layout/Container'
  if (!findComponent(layoutPage, containerFullName)) {
    const comp = figma.createComponent()
    comp.name = containerFullName
    comp.description = 'engine/content/widgets/layout/Container — max-width wrapper'
    autoLayout(comp, {
      direction: 'VERTICAL',
      primarySizing: 'AUTO',
      counterSizing: 'FIXED',
    })
    comp.resize(1280, 200)
    // Bind horizontal padding
    bindFloat(comp, 'paddingLeft', 'spacing/section-x')
    bindFloat(comp, 'paddingRight', 'spacing/section-x')

    const inner = figma.createFrame()
    inner.name = 'Content'
    inner.resize(1120, 160)
    inner.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }]
    inner.layoutAlign = 'STRETCH'
    inner.layoutGrow = 1
    comp.appendChild(inner)

    comp.x = 900
    comp.y = 350
    layoutPage.appendChild(comp)
    log.push('Container: created')
  } else {
    log.push('Container: already exists — skipped')
  }

  // ── Box ───────────────────────────────────────────────────────────

  const boxFullName = 'Layout/Box'
  if (!findComponent(layoutPage, boxFullName)) {
    const comp = figma.createComponent()
    comp.name = boxFullName
    comp.description = 'engine/content/widgets/layout/Box — simple frame wrapper'
    comp.resize(200, 200)
    comp.fills = []

    comp.x = 1700
    comp.y = 0
    layoutPage.appendChild(comp)
    log.push('Box: created')
  } else {
    log.push('Box: already exists — skipped')
  }

  // ── Marquee ───────────────────────────────────────────────────────

  const marqueeFullName = 'Layout/Marquee'
  if (!findComponent(layoutPage, marqueeFullName)) {
    const comp = figma.createComponent()
    comp.name = marqueeFullName
    comp.description = 'engine/content/widgets/layout/Marquee — horizontal scroll (static representation)'
    autoLayout(comp, { direction: 'HORIZONTAL' })
    bindFloat(comp, 'itemSpacing', 'spacing/md')
    comp.resize(800, 100)
    comp.clipsContent = true

    for (let i = 1; i <= 6; i++) {
      const item = figma.createFrame()
      item.name = `Item ${i}`
      item.resize(120, 80)
      item.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
      comp.appendChild(item)
    }

    comp.x = 1700
    comp.y = 250
    layoutPage.appendChild(comp)
    log.push('Marquee: created')
  } else {
    log.push('Marquee: already exists — skipped')
  }

  // ══════════════════════════════════════════════════════════════════
  // INTERACTIVE
  // ══════════════════════════════════════════════════════════════════

  await figma.setCurrentPageAsync(interactivePage)

  // ── Video ─────────────────────────────────────────────────────────

  const videoFullName = 'Interactive/Video'
  if (!findComponent(interactivePage, videoFullName)) {
    const comp = figma.createComponent()
    comp.name = videoFullName
    comp.description = 'engine/content/widgets/interactive/Video'
    comp.resize(640, 360)

    // Video placeholder
    const placeholder = figma.createRectangle()
    placeholder.name = 'Video Placeholder'
    placeholder.resize(640, 360)
    placeholder.fills = [{ type: 'SOLID', color: { r: 0.12, g: 0.12, b: 0.12 } }]
    bindFloat(placeholder, 'topLeftRadius', 'radius/md')
    bindFloat(placeholder, 'topRightRadius', 'radius/md')
    bindFloat(placeholder, 'bottomLeftRadius', 'radius/md')
    bindFloat(placeholder, 'bottomRightRadius', 'radius/md')
    comp.appendChild(placeholder)

    // Play icon (triangle)
    const playIcon = figma.createPolygon()
    playIcon.name = 'Play Icon'
    playIcon.pointCount = 3
    playIcon.resize(40, 40)
    playIcon.x = 300
    playIcon.y = 160
    playIcon.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.8 }]
    comp.appendChild(playIcon)

    comp.x = 0
    comp.y = 0
    interactivePage.appendChild(comp)
    log.push('Video: created')
  } else {
    log.push('Video: already exists — skipped')
  }

  // ── VideoPlayer ───────────────────────────────────────────────────

  const videoPlayerFullName = 'Interactive/VideoPlayer'
  if (!findComponent(interactivePage, videoPlayerFullName)) {
    const comp = figma.createComponent()
    comp.name = videoPlayerFullName
    comp.description = 'engine/content/widgets/interactive/VideoPlayer'
    autoLayout(comp, { direction: 'VERTICAL' })
    comp.resize(640, 400)

    // Video area
    const videoArea = figma.createFrame()
    videoArea.name = 'Video Area'
    videoArea.resize(640, 360)
    videoArea.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
    videoArea.layoutAlign = 'STRETCH'
    comp.appendChild(videoArea)

    // Controls bar
    const controls = figma.createFrame()
    controls.name = 'Controls'
    controls.layoutMode = 'HORIZONTAL'
    controls.primaryAxisSizingMode = 'FIXED'
    controls.counterAxisSizingMode = 'AUTO'
    controls.resize(640, 40)
    controls.layoutAlign = 'STRETCH'
    bindFill(controls, 'colors/background')
    bindFloat(controls, 'paddingLeft', 'spacing/sm')
    bindFloat(controls, 'paddingRight', 'spacing/sm')
    bindFloat(controls, 'paddingTop', 'spacing/xs')
    bindFloat(controls, 'paddingBottom', 'spacing/xs')
    bindFloat(controls, 'itemSpacing', 'spacing/sm')

    // Progress bar placeholder
    const progress = figma.createRectangle()
    progress.name = 'Progress Bar'
    progress.resize(500, 4)
    progress.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }]
    progress.layoutGrow = 1
    controls.appendChild(progress)

    // Time label
    const time = createText('0:00 / 3:24', {
      fontSize: 12,
      fillVar: 'colors/text-primary',
      name: 'Time',
    })
    controls.appendChild(time)

    comp.appendChild(controls)

    comp.x = 0
    comp.y = 420
    interactivePage.appendChild(comp)
    log.push('VideoPlayer: created')
  } else {
    log.push('VideoPlayer: already exists — skipped')
  }

  // ── EmailCopy ─────────────────────────────────────────────────────

  const emailCopyFullName = 'Interactive/EmailCopy'
  if (!findComponent(interactivePage, emailCopyFullName)) {
    const comp = figma.createComponent()
    comp.name = emailCopyFullName
    comp.description = 'engine/content/widgets/interactive/EmailCopy'
    autoLayout(comp, {
      direction: 'HORIZONTAL',
      counterAlign: 'CENTER',
    })
    bindFloat(comp, 'itemSpacing', 'spacing/sm')
    bindFloat(comp, 'paddingTop', 'spacing/sm')
    bindFloat(comp, 'paddingBottom', 'spacing/sm')
    bindFloat(comp, 'paddingLeft', 'spacing/sm')
    bindFloat(comp, 'paddingRight', 'spacing/sm')

    // Email text
    const emailText = createText('hello@example.com', {
      fontSize: 14,
      fillVar: 'colors/text-primary',
      name: 'Email',
    })
    comp.appendChild(emailText)

    // Copy icon placeholder
    const icon = figma.createRectangle()
    icon.name = 'Copy Icon'
    icon.resize(16, 16)
    bindFill(icon, 'colors/text-secondary')
    comp.appendChild(icon)

    comp.x = 700
    comp.y = 0
    interactivePage.appendChild(comp)
    log.push('EmailCopy: created')
  } else {
    log.push('EmailCopy: already exists — skipped')
  }

  // ══════════════════════════════════════════════════════════════════
  // CHROME
  // ══════════════════════════════════════════════════════════════════

  await figma.setCurrentPageAsync(chromePage)

  // ── MinimalNav ────────────────────────────────────────────────────

  const minimalNavFullName = 'Chrome/MinimalNav'
  if (!findComponent(chromePage, minimalNavFullName)) {
    const comp = figma.createComponent()
    comp.name = minimalNavFullName
    comp.description = 'engine/content/chrome/patterns/MinimalNav — right-aligned header'
    autoLayout(comp, {
      direction: 'HORIZONTAL',
      counterAlign: 'CENTER',
      primaryAlign: 'MAX',
    })
    bindFloat(comp, 'paddingTop', 'spacing/md')
    bindFloat(comp, 'paddingBottom', 'spacing/md')
    bindFloat(comp, 'paddingLeft', 'spacing/lg')
    bindFloat(comp, 'paddingRight', 'spacing/lg')
    bindFloat(comp, 'itemSpacing', 'spacing/lg')
    comp.resize(1280, 60)
    comp.fills = []

    // Nav links
    for (const label of ['Work', 'About', 'Contact']) {
      const link = createText(label, {
        fontSize: 14,
        fillVar: 'colors/text-primary',
        name: label,
      })
      comp.appendChild(link)
    }

    // Divider
    const divider = figma.createRectangle()
    divider.name = 'Divider'
    divider.resize(1, 20)
    bindFill(divider, 'colors/text-secondary')
    comp.appendChild(divider)

    // Email
    const email = createText('hello@studio.com', {
      fontSize: 14,
      fillVar: 'colors/text-secondary',
      name: 'Email',
    })
    comp.appendChild(email)

    comp.x = 0
    comp.y = 0
    chromePage.appendChild(comp)
    log.push('MinimalNav: created')
  } else {
    log.push('MinimalNav: already exists — skipped')
  }

  // ── FixedNav ──────────────────────────────────────────────────────

  const fixedNavFullName = 'Chrome/FixedNav'
  if (!findComponent(chromePage, fixedNavFullName)) {
    const comp = figma.createComponent()
    comp.name = fixedNavFullName
    comp.description = 'engine/content/chrome/patterns/FixedNav — fixed header with logo + nav'
    autoLayout(comp, {
      direction: 'HORIZONTAL',
      counterAlign: 'CENTER',
      primaryAlign: 'SPACE_BETWEEN',
    })
    bindFloat(comp, 'paddingTop', 'spacing/md')
    bindFloat(comp, 'paddingBottom', 'spacing/md')
    bindFloat(comp, 'paddingLeft', 'spacing/lg')
    bindFloat(comp, 'paddingRight', 'spacing/lg')
    bindFloat(comp, 'itemSpacing', 'spacing/lg')
    comp.resize(1280, 60)
    comp.fills = []

    // Logo / site title
    const logo = createText('Studio', {
      fontSize: 16,
      fontStyle: 'Bold',
      fillVar: 'colors/text-primary',
      name: 'Site Title',
    })
    comp.appendChild(logo)

    // Nav links group
    const navGroup = figma.createFrame()
    navGroup.name = 'Nav Links'
    navGroup.layoutMode = 'HORIZONTAL'
    navGroup.primaryAxisSizingMode = 'AUTO'
    navGroup.counterAxisSizingMode = 'AUTO'
    navGroup.counterAxisAlignItems = 'CENTER'
    bindFloat(navGroup, 'itemSpacing', 'spacing/md')
    navGroup.fills = []
    for (const label of ['Work', 'About', 'Contact']) {
      const link = createText(label, {
        fontSize: 14,
        fillVar: 'colors/text-primary',
        name: label,
      })
      navGroup.appendChild(link)
    }
    comp.appendChild(navGroup)

    comp.x = 0
    comp.y = 120
    chromePage.appendChild(comp)
    log.push('FixedNav: created')
  } else {
    log.push('FixedNav: already exists — skipped')
  }

  // ── ContactFooter ─────────────────────────────────────────────────

  const contactFooterFullName = 'Chrome/ContactFooter'
  if (!findComponent(chromePage, contactFooterFullName)) {
    const comp = figma.createComponent()
    comp.name = contactFooterFullName
    comp.description = 'engine/content/chrome/patterns/ContactFooter — footer with heading + email'
    autoLayout(comp, { direction: 'VERTICAL', counterAlign: 'CENTER' })
    bindFloat(comp, 'itemSpacing', 'spacing/md')
    bindFloat(comp, 'paddingTop', 'spacing/xl')
    bindFloat(comp, 'paddingBottom', 'spacing/xl')
    bindFloat(comp, 'paddingLeft', 'spacing/lg')
    bindFloat(comp, 'paddingRight', 'spacing/lg')
    comp.resize(1280, 200)
    bindFill(comp, 'colors/background')

    const heading = createText("Let's work together", {
      fontSize: 24,
      fontStyle: 'Bold',
      fillVar: 'colors/text-primary',
      name: 'Heading',
    })
    comp.appendChild(heading)

    const email = createText('hello@studio.com', {
      fontSize: 16,
      fillVar: 'colors/link',
      name: 'Email',
    })
    comp.appendChild(email)

    comp.x = 0
    comp.y = 240
    chromePage.appendChild(comp)
    log.push('ContactFooter: created')
  } else {
    log.push('ContactFooter: already exists — skipped')
  }

  // ── BrandFooter ───────────────────────────────────────────────────

  const brandFooterFullName = 'Chrome/BrandFooter'
  if (!findComponent(chromePage, brandFooterFullName)) {
    const comp = figma.createComponent()
    comp.name = brandFooterFullName
    comp.description = 'engine/content/chrome/patterns/BrandFooter — footer with brand + nav + contact'
    autoLayout(comp, {
      direction: 'HORIZONTAL',
      primaryAlign: 'SPACE_BETWEEN',
      counterAlign: 'MIN',
    })
    bindFloat(comp, 'itemSpacing', 'spacing/xl')
    bindFloat(comp, 'paddingTop', 'spacing/xl')
    bindFloat(comp, 'paddingBottom', 'spacing/xl')
    bindFloat(comp, 'paddingLeft', 'spacing/lg')
    bindFloat(comp, 'paddingRight', 'spacing/lg')
    comp.resize(1280, 180)
    bindFill(comp, 'colors/background')

    // Brand column
    const brandCol = figma.createFrame()
    brandCol.name = 'Brand'
    brandCol.layoutMode = 'VERTICAL'
    brandCol.primaryAxisSizingMode = 'AUTO'
    brandCol.counterAxisSizingMode = 'AUTO'
    bindFloat(brandCol, 'itemSpacing', 'spacing/sm')
    brandCol.fills = []
    const brandName = createText('Studio Name', {
      fontSize: 18,
      fontStyle: 'Bold',
      fillVar: 'colors/text-primary',
      name: 'Brand Name',
    })
    brandCol.appendChild(brandName)
    const tagline = createText('Creative Studio', {
      fontSize: 14,
      fillVar: 'colors/text-secondary',
      name: 'Tagline',
    })
    brandCol.appendChild(tagline)
    comp.appendChild(brandCol)

    // Nav column
    const navCol = figma.createFrame()
    navCol.name = 'Navigation'
    navCol.layoutMode = 'VERTICAL'
    navCol.primaryAxisSizingMode = 'AUTO'
    navCol.counterAxisSizingMode = 'AUTO'
    bindFloat(navCol, 'itemSpacing', 'spacing/sm')
    navCol.fills = []
    for (const label of ['Work', 'About', 'Contact']) {
      const link = createText(label, {
        fontSize: 14,
        fillVar: 'colors/text-primary',
        name: label,
      })
      navCol.appendChild(link)
    }
    comp.appendChild(navCol)

    // Contact column
    const contactCol = figma.createFrame()
    contactCol.name = 'Contact'
    contactCol.layoutMode = 'VERTICAL'
    contactCol.primaryAxisSizingMode = 'AUTO'
    contactCol.counterAxisSizingMode = 'AUTO'
    bindFloat(contactCol, 'itemSpacing', 'spacing/sm')
    contactCol.fills = []
    const contactEmail = createText('hello@studio.com', {
      fontSize: 14,
      fillVar: 'colors/link',
      name: 'Email',
    })
    contactCol.appendChild(contactEmail)
    const contactSocial = createText('@studio', {
      fontSize: 14,
      fillVar: 'colors/text-secondary',
      name: 'Social',
    })
    contactCol.appendChild(contactSocial)
    comp.appendChild(contactCol)

    comp.x = 0
    comp.y = 500
    chromePage.appendChild(comp)
    log.push('BrandFooter: created')
  } else {
    log.push('BrandFooter: already exists — skipped')
  }

  return log
}

// ═══════════════════════════════════════════════════════════════════════════
// Phase C — Shared helpers (fonts, variables, component utilities)
// ═══════════════════════════════════════════════════════════════════════════

async function initPhaseC() {
  const allVars = figma.variables.getLocalVariables()
  const varByName = {}
  for (const v of allVars) varByName[v.name] = v

  // ── Font loading ────────────────────────────────────────────────

  const fontsToLoad = [
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Bold' },
    { family: 'Inter', style: 'Semi Bold' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Plus Jakarta Sans', style: 'Regular' },
    { family: 'Plus Jakarta Sans', style: 'Medium' },
  ]

  let fontFamily = 'Inter'
  let fontLoaded = false

  for (const font of fontsToLoad) {
    try { await figma.loadFontAsync(font); fontLoaded = true } catch (_) {}
  }

  if (!fontLoaded) {
    try { await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' }); fontFamily = 'Roboto' }
    catch (_) {
      try { await figma.loadFontAsync({ family: 'Arial', style: 'Regular' }); fontFamily = 'Arial' }
      catch (_2) {}
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────

  function findOrCreatePage(name) {
    const existing = figma.root.children.find(p => p.name === name)
    if (existing) return existing
    const page = figma.createPage()
    page.name = name
    return page
  }

  function pageHasFrame(page, name) {
    return page.findOne(n => n.type === 'FRAME' && n.name === name) != null
  }

  function bindFill(node, varName) {
    const v = varByName[varName]
    if (!v) return
    const paint = { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }
    node.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', v)]
  }

  const FALLBACKS = {
    'spacing/xs': 4, 'spacing/sm': 8, 'spacing/md': 16, 'spacing/lg': 32,
    'spacing/xl': 64, 'spacing/2xl': 96, 'spacing/section-x': 96, 'spacing/section-y': 96,
    'radius/none': 0, 'radius/sm': 2, 'radius/md': 4, 'radius/lg': 4, 'radius/full': 9999,
  }

  function bindFloat(node, prop, varName) {
    const v = varByName[varName]
    if (!v) { if (FALLBACKS[varName] !== undefined) node[prop] = FALLBACKS[varName]; return }
    node.setBoundVariable(prop, v)
  }

  function createText(chars, opts = {}) {
    const text = figma.createText()
    text.fontName = { family: opts.fontFamily || fontFamily, style: opts.fontStyle || 'Regular' }
    text.characters = chars
    if (opts.fontSize) text.fontSize = opts.fontSize
    if (opts.fillVar) bindFill(text, opts.fillVar)
    if (opts.name) text.name = opts.name
    return text
  }

  function autoLayout(frame, opts = {}) {
    frame.layoutMode = opts.direction || 'VERTICAL'
    frame.primaryAxisSizingMode = opts.primarySizing || 'AUTO'
    frame.counterAxisSizingMode = opts.counterSizing || 'AUTO'
    if (opts.gap !== undefined) frame.itemSpacing = opts.gap
    if (opts.paddingH !== undefined) { frame.paddingLeft = opts.paddingH; frame.paddingRight = opts.paddingH }
    if (opts.paddingV !== undefined) { frame.paddingTop = opts.paddingV; frame.paddingBottom = opts.paddingV }
    if (opts.padding !== undefined) { frame.paddingTop = opts.padding; frame.paddingBottom = opts.padding; frame.paddingLeft = opts.padding; frame.paddingRight = opts.padding }
    if (opts.primaryAlign) frame.primaryAxisAlignItems = opts.primaryAlign
    if (opts.counterAlign) frame.counterAxisAlignItems = opts.counterAlign
    return frame
  }

  // ── Component map ────────────────────────────────────────────────

  const componentMap = {}
  for (const page of figma.root.children) {
    for (const node of page.findAll(n => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET')) {
      componentMap[node.name] = node
    }
  }

  function inst(name, w, h) {
    const node = componentMap[name]
    if (!node) return makePlaceholder(`[missing] ${name}`, w || 320, h || 200)
    const instance = node.type === 'COMPONENT_SET' ? node.defaultVariant.createInstance() : node.createInstance()
    if (w && h) instance.resize(w, h)
    return instance
  }

  function instVariant(setName, variantName, w, h) {
    const node = componentMap[setName]
    if (!node || node.type !== 'COMPONENT_SET') return inst(setName, w, h)
    const variant = node.findOne(n => n.type === 'COMPONENT' && n.name.includes(variantName))
    if (!variant) return inst(setName, w, h)
    const instance = variant.createInstance()
    if (w && h) instance.resize(w, h)
    return instance
  }

  function makePlaceholder(label, w, h) {
    const frame = figma.createFrame()
    frame.name = label
    frame.resize(w, h)
    frame.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.15, b: 0.15 } }]
    frame.clipsContent = true
    frame.strokes = [{ type: 'SOLID', color: { r: 0.35, g: 0.35, b: 0.35 } }]
    frame.strokeWeight = 1
    frame.dashPattern = [8, 4]
    const text = createText(label, { fontSize: 12, fillVar: 'colors/text-secondary', name: 'Placeholder Label' })
    text.x = 12; text.y = 12
    frame.appendChild(text)
    return frame
  }

  // ── Text override helpers ────────────────────────────────────────

  /** Override text content in a component instance. Finds child text node by name. */
  function setInstanceText(instance, childName, chars) {
    if (!instance || !chars) return
    const textNode = instance.findOne(n => n.type === 'TEXT' && n.name === childName)
    if (!textNode) return
    try { textNode.characters = chars } catch (_) { /* font not loaded */ }
  }

  /** Override Text component instance content (child name = 'Text Content'). */
  function setText(instance, chars) {
    setInstanceText(instance, 'Text Content', chars)
  }

  /** Override Button component instance label (child name = 'Label'). */
  function setButtonLabel(instance, chars) {
    setInstanceText(instance, 'Label', chars)
  }

  /** Clear all children from a page (for rebuild mode). */
  function clearPage(page) {
    const children = [...page.children]
    for (const child of children) child.remove()
  }

  // Return all helpers as a toolkit object
  return {
    varByName, fontFamily, componentMap,
    findOrCreatePage, pageHasFrame, bindFill, bindFloat,
    createText, autoLayout, inst, instVariant, makePlaceholder,
    setText, setButtonLabel, setInstanceText, clearPage,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Theme Showcase — visual reference of all design tokens
// ═══════════════════════════════════════════════════════════════════════════
async function buildThemeShowcase(tk) {
  const log = []
  const { findOrCreatePage, bindFill, bindFloat, createText, autoLayout, instVariant, inst,
          setText, setButtonLabel } = tk

  const themePage = findOrCreatePage('Theme Showcase')
  await figma.setCurrentPageAsync(themePage)

  // Always rebuild — clear old content first
  tk.clearPage(themePage)

  const W = 1440, PAD = 48, GAP = 60
  let curY = 0

  // ── Helper: create a section frame placed on the page ──
  function placeSection(name) {
    const frame = figma.createFrame(); frame.name = name
    autoLayout(frame, { direction: 'VERTICAL', primarySizing: 'AUTO', counterSizing: 'FIXED', gap: 24, padding: PAD })
    frame.resize(W, 10); bindFill(frame, 'colors/background')
    frame.x = 0; frame.y = curY
    themePage.appendChild(frame)
    return frame
  }

  /** Finish a section: measure its height and advance curY. */
  function finishSection(frame) {
    // Force Figma to compute auto-layout height
    const h = Math.max(frame.height, 100)
    curY += h + GAP
    log.push(`${frame.name}: created`)
  }

  // ── Section builder with error isolation ──
  function buildSection(name, builder) {
    let frame
    try {
      frame = placeSection(name)
      builder(frame)
      finishSection(frame)
    } catch (err) {
      const msg = `${name}: FAILED — ${err.message || err}`
      log.push(msg)
      console.error(msg, err)
      // Remove the broken frame if it was created
      if (frame) try { frame.remove() } catch (_) {}
    }
  }

  // ════════════════════════════════════════════════════════════════════
  // 1. COLOR PALETTE
  // ════════════════════════════════════════════════════════════════════

  buildSection('Color Palette', (palette) => {
    palette.appendChild(createText('COLOR PALETTE', { fontSize: 12, fillVar: 'colors/text-secondary', name: 'Title' }))

    const colorGroups = [
      { title: 'Backgrounds', colors: [
        { v: 'colors/background', l: 'background' }, { v: 'colors/secondary', l: 'secondary' },
      ]},
      { title: 'Text', colors: [
        { v: 'colors/text', l: 'text' }, { v: 'colors/text-primary', l: 'text-primary' }, { v: 'colors/text-secondary', l: 'text-secondary' },
      ]},
      { title: 'Brand', colors: [
        { v: 'colors/accent', l: 'accent' }, { v: 'colors/primary', l: 'primary' },
        { v: 'colors/primary-contrast', l: 'primary-contrast' }, { v: 'colors/secondary-contrast', l: 'secondary-contrast' },
      ]},
      { title: 'Interactive', colors: [
        { v: 'colors/interaction', l: 'interaction' }, { v: 'colors/link', l: 'link' }, { v: 'colors/focus', l: 'focus' },
      ]},
      { title: 'Status', colors: [
        { v: 'colors/status-success', l: 'success' }, { v: 'colors/status-error', l: 'error' },
      ]},
    ]

    for (const group of colorGroups) {
      const gf = figma.createFrame(); gf.name = group.title
      autoLayout(gf, { direction: 'VERTICAL', gap: 10 }); gf.fills = []
      gf.appendChild(createText(group.title, { fontSize: 10, fillVar: 'colors/text-secondary', name: 'Label' }))

      const row = figma.createFrame(); row.name = 'Swatches'
      autoLayout(row, { direction: 'HORIZONTAL', gap: 12 }); row.fills = []
      for (const c of group.colors) {
        const sg = figma.createFrame(); sg.name = c.l
        autoLayout(sg, { direction: 'VERTICAL', gap: 4 }); sg.fills = []
        const sw = figma.createRectangle(); sw.name = 'Swatch'; sw.resize(100, 56)
        bindFill(sw, c.v)
        sw.cornerRadius = 4
        sw.strokes = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }]; sw.strokeWeight = 1
        sg.appendChild(sw)
        sg.appendChild(createText(c.l, { fontSize: 9, fillVar: 'colors/text-secondary', name: 'Label' }))
        row.appendChild(sg)
      }
      gf.appendChild(row)
      palette.appendChild(gf)
    }
  })

  // ════════════════════════════════════════════════════════════════════
  // 2. TYPOGRAPHY
  // ════════════════════════════════════════════════════════════════════

  buildSection('Typography', (typo) => {
    typo.appendChild(createText('TYPOGRAPHY', { fontSize: 12, fillVar: 'colors/text-secondary', name: 'Title' }))

    const scales = [
      { v: 'Display', t: 'The quick brown fox' },
      { v: 'H1', t: 'Page Heading — Bold statement' },
      { v: 'H2', t: 'Section Heading' },
      { v: 'H3', t: 'Sub-heading — Card title' },
      { v: 'Body', t: 'Body text for reading. Optimized for comfortable scanning across devices and screen sizes.' },
      { v: 'Small', t: 'SMALL — Labels, captions, metadata' },
    ]
    for (const sc of scales) {
      const row = figma.createFrame(); row.name = sc.v
      autoLayout(row, { direction: 'HORIZONTAL', gap: 24, counterAlign: 'CENTER' }); row.fills = []
      const label = createText(sc.v, { fontSize: 10, fillVar: 'colors/text-secondary', name: 'Label' })
      label.resize(60, 14); row.appendChild(label)
      const sample = instVariant('Primitives/Text', sc.v, W - PAD * 2 - 84, 10)
      sample.name = 'Sample'; sample.layoutGrow = 1
      setText(sample, sc.t)
      row.appendChild(sample)
      typo.appendChild(row)
    }
  })

  // ════════════════════════════════════════════════════════════════════
  // 3. SPACING
  // ════════════════════════════════════════════════════════════════════

  buildSection('Spacing', (spacing) => {
    spacing.appendChild(createText('SPACING', { fontSize: 12, fillVar: 'colors/text-secondary', name: 'Title' }))

    const spacingTokens = [
      { n: 'xs', px: 4 }, { n: 'sm', px: 8 }, { n: 'md', px: 16 },
      { n: 'lg', px: 32 }, { n: 'xl', px: 64 }, { n: '2xl', px: 96 },
    ]
    for (const sp of spacingTokens) {
      const row = figma.createFrame(); row.name = sp.n
      autoLayout(row, { direction: 'HORIZONTAL', gap: 12, counterAlign: 'CENTER' }); row.fills = []
      const label = createText(sp.n, { fontSize: 10, fillVar: 'colors/text-secondary', name: 'Label' })
      label.resize(32, 14); row.appendChild(label)
      const bar = figma.createRectangle(); bar.name = 'Bar'
      bar.resize(Math.max(sp.px, 4), 14); bar.cornerRadius = 2
      bindFill(bar, 'colors/accent')
      row.appendChild(bar)
      row.appendChild(createText(`${sp.px}px`, { fontSize: 9, fillVar: 'colors/text-secondary', name: 'Label' }))
      spacing.appendChild(row)
    }
  })

  // ════════════════════════════════════════════════════════════════════
  // 4. BORDER RADIUS
  // ════════════════════════════════════════════════════════════════════

  buildSection('Border Radius', (radius) => {
    radius.appendChild(createText('BORDER RADIUS', { fontSize: 12, fillVar: 'colors/text-secondary', name: 'Title' }))

    const radiusRow = figma.createFrame(); radiusRow.name = 'Samples'
    autoLayout(radiusRow, { direction: 'HORIZONTAL', gap: 24 }); radiusRow.fills = []

    for (const rt of ['none', 'sm', 'md', 'lg', 'full']) {
      const group = figma.createFrame(); group.name = rt
      autoLayout(group, { direction: 'VERTICAL', gap: 6, counterAlign: 'CENTER' }); group.fills = []
      const rect = figma.createRectangle(); rect.name = 'Sample'; rect.resize(72, 72)
      bindFill(rect, 'colors/secondary')
      rect.strokes = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }]; rect.strokeWeight = 1
      bindFloat(rect, 'topLeftRadius', `radius/${rt}`); bindFloat(rect, 'topRightRadius', `radius/${rt}`)
      bindFloat(rect, 'bottomLeftRadius', `radius/${rt}`); bindFloat(rect, 'bottomRightRadius', `radius/${rt}`)
      group.appendChild(rect)
      group.appendChild(createText(rt, { fontSize: 9, fillVar: 'colors/text-secondary', name: 'Label' }))
      radiusRow.appendChild(group)
    }
    radius.appendChild(radiusRow)
  })

  // ════════════════════════════════════════════════════════════════════
  // 5. BUTTONS
  // ════════════════════════════════════════════════════════════════════

  buildSection('Buttons', (buttons) => {
    buttons.appendChild(createText('BUTTONS', { fontSize: 12, fillVar: 'colors/text-secondary', name: 'Title' }))

    const btnRow = figma.createFrame(); btnRow.name = 'Variants'
    autoLayout(btnRow, { direction: 'HORIZONTAL', gap: 24, counterAlign: 'CENTER' }); btnRow.fills = []
    for (const v of ['Primary', 'Secondary', 'Ghost']) {
      const btn = instVariant('Primitives/Button', v, 160, 44)
      btn.name = v; setButtonLabel(btn, v)
      btnRow.appendChild(btn)
    }
    buttons.appendChild(btnRow)
  })

  // ════════════════════════════════════════════════════════════════════
  // 6. COMPOSED SAMPLES
  // ════════════════════════════════════════════════════════════════════

  buildSection('Composed Samples', (composed) => {
    composed.appendChild(createText('COMPOSED SAMPLES', { fontSize: 12, fillVar: 'colors/text-secondary', name: 'Title' }))

    const samplesRow = figma.createFrame(); samplesRow.name = 'Samples'
    autoLayout(samplesRow, { direction: 'HORIZONTAL', gap: 32 }); samplesRow.fills = []

    // Card
    const card = figma.createFrame(); card.name = 'Card'
    autoLayout(card, { direction: 'VERTICAL', primarySizing: 'AUTO', counterSizing: 'FIXED', gap: 0 })
    card.resize(380, 10); card.cornerRadius = 8; card.clipsContent = true
    bindFill(card, 'colors/secondary')

    const cardImg = inst('Primitives/Image', 380, 200)
    cardImg.name = 'Image'; cardImg.layoutAlign = 'STRETCH'
    card.appendChild(cardImg)

    const cardBody = figma.createFrame(); cardBody.name = 'Body'
    autoLayout(cardBody, { direction: 'VERTICAL', gap: 12, paddingH: 20, paddingV: 16 }); cardBody.fills = []; cardBody.layoutAlign = 'STRETCH'
    const ct = instVariant('Primitives/Text', 'H3', 340, 28)
    ct.name = 'Title'; setText(ct, 'Elements of Time'); cardBody.appendChild(ct)
    const cd = instVariant('Primitives/Text', 'Body', 340, 40)
    cd.name = 'Description'; setText(cd, 'Anime-inspired storytelling meets Swiss watchmaking.'); cardBody.appendChild(cd)
    const cc = instVariant('Primitives/Button', 'Primary', 140, 44)
    cc.name = 'CTA'; setButtonLabel(cc, 'Watch Now'); cardBody.appendChild(cc)
    card.appendChild(cardBody)
    samplesRow.appendChild(card)

    // Hero mini
    const hero = figma.createFrame(); hero.name = 'Hero Mock'
    hero.resize(380, 340); hero.cornerRadius = 8; hero.clipsContent = true
    bindFill(hero, 'colors/background')
    const ht = instVariant('Primitives/Text', 'H1', 300, 48)
    ht.name = 'Title'; ht.x = 32; ht.y = 80; setText(ht, "I'm Alex Morgan"); hero.appendChild(ht)
    const hr = instVariant('Primitives/Text', 'Small', 280, 16)
    hr.name = 'Roles'; hr.x = 32; hr.y = 140; setText(hr, 'EXECUTIVE PRODUCER / EDITOR'); hero.appendChild(hr)
    const hb = instVariant('Primitives/Button', 'Ghost', 120, 44)
    hb.name = 'CTA'; hb.x = 32; hb.y = 180; setButtonLabel(hb, 'Explore'); hero.appendChild(hb)
    const hs = instVariant('Primitives/Text', 'Small', 60, 14)
    hs.name = 'Scroll'; hs.x = 160; hs.y = 310; setText(hs, '(SCROLL)'); hero.appendChild(hs)
    samplesRow.appendChild(hero)

    // Nav mock
    const nav = figma.createFrame(); nav.name = 'Nav Mock'
    autoLayout(nav, { direction: 'VERTICAL', primarySizing: 'AUTO', counterSizing: 'FIXED', gap: 0 })
    nav.resize(380, 10); nav.cornerRadius = 8; nav.clipsContent = true

    const nb = figma.createFrame(); nb.name = 'Nav Bar'
    autoLayout(nb, { direction: 'HORIZONTAL', primarySizing: 'FIXED', counterSizing: 'AUTO', primaryAlign: 'SPACE_BETWEEN', counterAlign: 'CENTER', paddingH: 20, paddingV: 12 })
    nb.resize(380, 10); nb.layoutAlign = 'STRETCH'; bindFill(nb, 'colors/background')
    const nl = instVariant('Primitives/Text', 'H3', 80, 22)
    nl.name = 'Logo'; setText(nl, 'Studio'); nb.appendChild(nl)
    const nlinks = figma.createFrame(); nlinks.name = 'Links'
    autoLayout(nlinks, { direction: 'HORIZONTAL', gap: 12 }); nlinks.fills = []
    for (const t of ['HOME', 'ABOUT', 'WORK']) {
      const li = instVariant('Primitives/Text', 'Small', 48, 12)
      li.name = t; setText(li, t); nlinks.appendChild(li)
    }
    nb.appendChild(nlinks)
    nav.appendChild(nb)

    const nc = figma.createFrame(); nc.name = 'Content'
    autoLayout(nc, { direction: 'VERTICAL', gap: 12, paddingH: 20, paddingV: 20 })
    nc.layoutAlign = 'STRETCH'; nc.resize(380, 10); bindFill(nc, 'colors/secondary')
    const nh = instVariant('Primitives/Text', 'H2', 340, 28)
    nh.name = 'Heading'; setText(nh, 'Featured Work'); nc.appendChild(nh)
    const np = instVariant('Primitives/Text', 'Body', 340, 40)
    np.name = 'Body'; setText(np, 'A curated selection of projects and collaborations.'); nc.appendChild(np)
    const ncta = instVariant('Primitives/Button', 'Primary', 120, 44)
    ncta.name = 'CTA'; setButtonLabel(ncta, 'View All'); nc.appendChild(ncta)
    nav.appendChild(nc)
    samplesRow.appendChild(nav)

    composed.appendChild(samplesRow)
  })

  log.push('Theme Showcase: created')
  return log
}

// ═══════════════════════════════════════════════════════════════════════════
// Command Router
// ═══════════════════════════════════════════════════════════════════════════

/** Run a command and log results. */
async function runCommand(command) {
  const allLogs = []

  if (command === 'run-all' || command === 'phase-a') {
    allLogs.push(...await phaseA())
  }

  if (command === 'run-all' || command === 'phase-b') {
    allLogs.push(...await phaseB())
  }

  if (command === 'run-all' || command === 'phase-c-theme') {
    const tk = await initPhaseC()
    allLogs.push(...await buildThemeShowcase(tk))
  }

  // Summary
  const created = allLogs.filter(l => l.includes('created')).length
  const skipped = allLogs.filter(l => l.includes('skipped')).length
  const summary = `Done! ${created} created, ${skipped} skipped`

  figma.notify(summary, { timeout: 8000 })
  console.log('Token Sync Results:')
  for (const line of allLogs) console.log(`  ${line}`)
  figma.closePlugin()
}

figma.on('run', ({ command }) => {
  runCommand(command || 'run-all').catch((err) => {
    figma.notify(`Error: ${err.message}`, { error: true })
    console.error(err)
    figma.closePlugin()
  })
})
