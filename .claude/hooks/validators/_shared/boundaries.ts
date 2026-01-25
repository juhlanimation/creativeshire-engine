/**
 * Sublayer detection and boundary checking utilities for validators.
 *
 * Every file in the Creativeshire architecture belongs to a specific sublayer.
 * Validators use these utilities to:
 * 1. Detect which sublayer a file belongs to
 * 2. Check if an agent is allowed to edit that sublayer
 *
 * @module _shared/boundaries
 */

/**
 * All sublayers in the Creativeshire architecture.
 *
 * Sublayers are the atomic units of the architecture that agents can be
 * scoped to. Each sublayer has specific rules and contracts.
 *
 * Content Layer:
 * - content:widgets:content  - Leaf content widgets (Text, Image, Video)
 * - content:widgets:layout   - Container widgets (Flex, Grid, Stack)
 * - content:widgets:composite - Widget preset factories
 * - content:sections:base    - Base section renderer
 * - content:sections:composite - Section preset factories
 * - content:chrome           - Persistent UI (header, footer, overlays)
 * - content:features         - Static styling decorators
 *
 * Experience Layer:
 * - experience:behaviours     - Shared behaviour definitions (compute CSS vars)
 * - experience:drivers        - DOM animation handlers
 * - experience:triggers       - Event → store connectors
 * - experience:presets:config - Experience configuration (index.ts, store.ts)
 * - experience:presets:behaviours - Preset-specific behaviours
 * - experience:providers      - React context providers
 *
 * Schema Layer:
 * - schema                    - TypeScript type definitions
 *
 * Renderer Layer:
 * - renderer                  - Schema → component bridges
 */
export type Sublayer =
  | 'content:widgets:content'
  | 'content:widgets:layout'
  | 'content:widgets:composite'
  | 'content:sections:base'
  | 'content:sections:composite'
  | 'content:chrome'
  | 'content:features'
  | 'experience:behaviours'
  | 'experience:drivers'
  | 'experience:triggers'
  | 'experience:presets:config'
  | 'experience:presets:behaviours'
  | 'experience:providers'
  | 'schema'
  | 'renderer';

/**
 * Result of a boundary check.
 */
export interface BoundaryResult {
  /** Whether the file is within allowed sublayers */
  passed: boolean;
  /** The detected sublayer of the file (null if not recognized) */
  sublayer: Sublayer | null;
  /** Error message if boundary check failed */
  error?: string;
  /** Suggested agent to handle this file (if boundary violated) */
  suggestedAgent?: string;
}

/**
 * Path pattern definition for sublayer detection.
 */
interface PathPattern {
  sublayer: Sublayer;
  /** Regex pattern to match against normalized file path */
  pattern: RegExp;
  /** Agent that should handle this sublayer */
  agent: string;
}

/**
 * Path patterns for detecting sublayers.
 *
 * Order matters - more specific patterns should come first.
 * Patterns are matched against normalized paths (forward slashes, no leading slash).
 *
 * Canonical structure (from creativeshire-folder-structure.md):
 *   src/creativeshire/
 *   ├── content/          ← Content Layer
 *   │   ├── chrome/
 *   │   ├── sections/
 *   │   ├── widgets/{content,layout,composite}/
 *   │   └── features/
 *   ├── experience/       ← Experience Layer
 *   │   ├── presets/{name}/
 *   │   ├── drivers/
 *   │   ├── triggers/
 *   │   ├── behaviours/
 *   │   └── *Provider.tsx
 *   ├── schema/           ← Schema Layer
 *   └── renderer/         ← Renderer Layer
 */
const PATH_PATTERNS: PathPattern[] = [
  // =========================================================================
  // EXPERIENCE LAYER - Presets (most specific first)
  // =========================================================================
  // creativeshire/experience/presets/{name}/behaviours.ts
  {
    sublayer: 'experience:presets:behaviours',
    pattern: /creativeshire\/experience\/presets\/[^/]+\/behaviours\.ts$/,
    agent: 'behaviour-builder',
  },
  // creativeshire/experience/presets/{name}/index.ts or store.ts
  {
    sublayer: 'experience:presets:config',
    pattern: /creativeshire\/experience\/presets\/[^/]+\/(?:index|store)\.ts$/,
    agent: 'preset-builder',
  },

  // =========================================================================
  // EXPERIENCE LAYER - Providers
  // =========================================================================
  // creativeshire/experience/*Provider.tsx
  {
    sublayer: 'experience:providers',
    pattern: /creativeshire\/experience\/[^/]*Provider\.tsx$/,
    agent: 'provider-builder',
  },

  // =========================================================================
  // EXPERIENCE LAYER - Core components
  // =========================================================================
  // creativeshire/experience/behaviours/
  {
    sublayer: 'experience:behaviours',
    pattern: /creativeshire\/experience\/behaviours\//,
    agent: 'behaviour-builder',
  },
  // creativeshire/experience/drivers/
  {
    sublayer: 'experience:drivers',
    pattern: /creativeshire\/experience\/drivers\//,
    agent: 'driver-builder',
  },
  // creativeshire/experience/triggers/
  {
    sublayer: 'experience:triggers',
    pattern: /creativeshire\/experience\/triggers\//,
    agent: 'trigger-builder',
  },

  // =========================================================================
  // CONTENT LAYER - Widgets (most specific first)
  // =========================================================================
  // creativeshire/content/widgets/composite/
  {
    sublayer: 'content:widgets:composite',
    pattern: /creativeshire\/content\/widgets\/composite\//,
    agent: 'widget-composite-builder',
  },
  // creativeshire/content/widgets/content/
  {
    sublayer: 'content:widgets:content',
    pattern: /creativeshire\/content\/widgets\/content\//,
    agent: 'widget-builder',
  },
  // creativeshire/content/widgets/layout/
  {
    sublayer: 'content:widgets:layout',
    pattern: /creativeshire\/content\/widgets\/layout\//,
    agent: 'widget-builder',
  },

  // =========================================================================
  // CONTENT LAYER - Sections
  // =========================================================================
  // creativeshire/content/sections/composites/
  {
    sublayer: 'content:sections:composite',
    pattern: /creativeshire\/content\/sections\/composites\//,
    agent: 'section-composite-builder',
  },
  // creativeshire/content/sections/*.tsx (base section files)
  {
    sublayer: 'content:sections:base',
    pattern: /creativeshire\/content\/sections\/[^/]+\.tsx?$/,
    agent: 'section-builder',
  },

  // =========================================================================
  // CONTENT LAYER - Chrome and Features
  // =========================================================================
  // creativeshire/content/chrome/
  {
    sublayer: 'content:chrome',
    pattern: /creativeshire\/content\/chrome\//,
    agent: 'chrome-builder',
  },
  // creativeshire/content/features/
  {
    sublayer: 'content:features',
    pattern: /creativeshire\/content\/features\//,
    agent: 'feature-builder',
  },

  // =========================================================================
  // SCHEMA LAYER
  // =========================================================================
  // creativeshire/schema/
  {
    sublayer: 'schema',
    pattern: /creativeshire\/schema\//,
    agent: 'schema-builder',
  },

  // =========================================================================
  // RENDERER LAYER
  // =========================================================================
  // creativeshire/renderer/
  {
    sublayer: 'renderer',
    pattern: /creativeshire\/renderer\//,
    agent: 'renderer-builder',
  },
];

/**
 * Normalize a file path for pattern matching.
 *
 * - Converts backslashes to forward slashes (Windows compatibility)
 * - Removes leading slashes
 * - Preserves relative path structure
 *
 * @param filePath - The file path to normalize
 * @returns Normalized path
 */
function normalizePath(filePath: string): string {
  return filePath
    .replace(/\\/g, '/') // Windows → Unix
    .replace(/^\/+/, ''); // Remove leading slashes
}

/**
 * Detect which sublayer a file belongs to.
 *
 * Analyzes the file path and returns the matching sublayer.
 * Returns null if the file doesn't belong to any recognized sublayer.
 *
 * @param filePath - Absolute or relative path to the file
 * @returns The detected sublayer, or null if not recognized
 *
 * @example
 * ```typescript
 * detectSublayer('content/widgets/content/Image/index.tsx')
 * // → 'content:widgets:content'
 *
 * detectSublayer('experience/behaviours/depth.ts')
 * // → 'experience:behaviours'
 *
 * detectSublayer('package.json')
 * // → null
 * ```
 */
export function detectSublayer(filePath: string): Sublayer | null {
  const normalized = normalizePath(filePath);

  for (const { sublayer, pattern } of PATH_PATTERNS) {
    if (pattern.test(normalized)) {
      return sublayer;
    }
  }

  return null;
}

/**
 * Get the suggested agent for a given file path.
 *
 * @param filePath - Path to the file
 * @returns The agent name that should handle this file, or null
 */
export function getSuggestedAgent(filePath: string): string | null {
  const normalized = normalizePath(filePath);

  for (const { pattern, agent } of PATH_PATTERNS) {
    if (pattern.test(normalized)) {
      return agent;
    }
  }

  return null;
}

/**
 * Check if a file is within an agent's allowed sublayers.
 *
 * This is the main boundary enforcement function. Validators call this
 * to ensure an agent isn't editing files outside its scope.
 *
 * @param filePath - Absolute or relative path to the file
 * @param allowedSublayers - Array of sublayers the agent can edit
 * @returns BoundaryResult with pass/fail status and details
 *
 * @example
 * ```typescript
 * // Widget builder can edit content widgets
 * const result = checkBoundary(
 *   'content/widgets/content/Image/index.tsx',
 *   ['content:widgets:content', 'content:widgets:layout']
 * );
 * // → { passed: true, sublayer: 'content:widgets:content' }
 *
 * // Widget builder cannot edit behaviours
 * const result = checkBoundary(
 *   'experience/behaviours/depth.ts',
 *   ['content:widgets:content', 'content:widgets:layout']
 * );
 * // → {
 * //     passed: false,
 * //     sublayer: 'experience:behaviours',
 * //     error: 'BOUNDARY VIOLATION: Cannot edit experience:behaviours...',
 * //     suggestedAgent: 'behaviour-builder'
 * //   }
 * ```
 */
export function checkBoundary(
  filePath: string,
  allowedSublayers: Sublayer[]
): BoundaryResult {
  const sublayer = detectSublayer(filePath);

  // File doesn't match any known sublayer - allow by default
  // (non-architecture files like package.json, configs, etc.)
  if (sublayer === null) {
    return {
      passed: true,
      sublayer: null,
    };
  }

  // Check if sublayer is in allowed list
  if (allowedSublayers.includes(sublayer)) {
    return {
      passed: true,
      sublayer,
    };
  }

  // Boundary violation - file is in a sublayer the agent cannot edit
  const suggestedAgent = getSuggestedAgent(filePath);

  return {
    passed: false,
    sublayer,
    error: formatBoundaryError(filePath, sublayer, allowedSublayers, suggestedAgent),
    suggestedAgent: suggestedAgent ?? undefined,
  };
}

/**
 * Format a boundary violation error message.
 *
 * Error messages include:
 * 1. What the error is
 * 2. The file's actual sublayer
 * 3. Which sublayers are allowed
 * 4. Which agent should handle this file
 */
function formatBoundaryError(
  filePath: string,
  actualSublayer: Sublayer,
  allowedSublayers: Sublayer[],
  suggestedAgent: string | null
): string {
  let error = `BOUNDARY VIOLATION: Cannot edit file\n`;
  error += `  File: ${filePath}\n`;
  error += `  File sublayer: ${actualSublayer}\n`;
  error += `  Allowed sublayers: ${allowedSublayers.join(', ')}\n`;

  if (suggestedAgent) {
    error += `\n  This file belongs to: ${suggestedAgent}`;
  }

  return error;
}

/**
 * Get the layer (top-level category) for a sublayer.
 *
 * @param sublayer - The sublayer to categorize
 * @returns The layer name: 'content', 'experience', 'schema', or 'renderer'
 */
export function getLayer(sublayer: Sublayer): 'content' | 'experience' | 'schema' | 'renderer' {
  if (sublayer.startsWith('content:')) {
    return 'content';
  }
  if (sublayer.startsWith('experience:')) {
    return 'experience';
  }
  if (sublayer === 'schema') {
    return 'schema';
  }
  return 'renderer';
}

/**
 * Check if two sublayers are in the same layer.
 *
 * Used to detect cross-layer imports which may be violations.
 *
 * @param sublayer1 - First sublayer
 * @param sublayer2 - Second sublayer
 * @returns True if both sublayers are in the same layer
 */
export function isSameLayer(sublayer1: Sublayer, sublayer2: Sublayer): boolean {
  return getLayer(sublayer1) === getLayer(sublayer2);
}

/**
 * Get all sublayers in the content layer.
 */
export function getContentSublayers(): Sublayer[] {
  return [
    'content:widgets:content',
    'content:widgets:layout',
    'content:widgets:composite',
    'content:sections:base',
    'content:sections:composite',
    'content:chrome',
    'content:features',
  ];
}

/**
 * Get all sublayers in the experience layer.
 */
export function getExperienceSublayers(): Sublayer[] {
  return [
    'experience:behaviours',
    'experience:drivers',
    'experience:triggers',
    'experience:presets:config',
    'experience:presets:behaviours',
    'experience:providers',
  ];
}
