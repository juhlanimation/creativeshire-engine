/**
 * Preset Validator
 *
 * Validates files in preset config sublayers (experience/presets/[name]/index.ts, store.ts).
 * Presets are configuration objects that wire together triggers, store, and behaviours.
 *
 * Used by agents:
 * - preset-builder (PostToolUse)
 * - preset-reviewer (Stop)
 *
 * Two-phase validation:
 * 1. BOUNDARY CHECK: Is file in a preset config sublayer?
 * 2. CONTRACT CHECK: Does file follow preset rules?
 *
 * Rules enforced:
 * | Rule ID                     | Check                                          |
 * |-----------------------------|------------------------------------------------|
 * | preset-has-provides         | Has provides: array declaration                |
 * | preset-has-triggers         | Has triggers: array declaration                |
 * | preset-has-store-factory    | Has createStore function                       |
 * | preset-has-widget-behaviours| Has widgetBehaviours object                    |
 *
 * What are presets?
 * - Configuration objects that define an experience variant
 * - Wire together: triggers (event sources), store (state), behaviours (animations)
 * - Declare what state they provide to sections
 * - Define default behaviours per widget type
 *
 * @module validators/preset
 */

import {
  getFilePathFromHook,
  getFileContent,
  outputAllow,
  outputBlock,
} from './_shared/io';

import {
  checkBoundary,
  detectSublayer,
  type Sublayer,
} from './_shared/boundaries';

import {
  checkPresetContract,
  formatContractErrors,
} from './_shared/contracts';

/**
 * Preset sublayers that this validator handles.
 */
const PRESET_SUBLAYERS: Sublayer[] = [
  'experience:presets:config',
];

/**
 * Main validation function.
 *
 * Phase 1: Boundary check - is the file in a preset config sublayer?
 * Phase 2: Contract check - does the file follow preset rules?
 */
function main(): void {
  // Get file path from hook or command line
  const filePath = getFilePathFromHook();

  // No file path provided - allow (nothing to validate)
  if (!filePath) {
    outputAllow();
    return;
  }

  // Skip non-TypeScript files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    outputAllow();
    return;
  }

  // Detect sublayer
  const sublayer = detectSublayer(filePath);

  // File not in any recognized sublayer - allow (not architecture file)
  if (sublayer === null) {
    outputAllow();
    return;
  }

  // Skip non-preset sublayers - this validator only handles preset configs
  if (!PRESET_SUBLAYERS.includes(sublayer)) {
    outputAllow();
    return;
  }

  // =========================================================================
  // PHASE 1: BOUNDARY CHECK
  // =========================================================================
  // Is the file within allowed preset sublayers?

  const boundaryResult = checkBoundary(filePath, PRESET_SUBLAYERS);

  if (!boundaryResult.passed) {
    outputBlock(boundaryResult.error!);
    return;
  }

  // =========================================================================
  // PHASE 2: CONTRACT CHECK
  // =========================================================================
  // Does the file follow preset architectural rules?

  let content: string;
  try {
    content = getFileContent(filePath);
  } catch (error) {
    // If we can't read the file, block with the error
    const message = error instanceof Error ? error.message : String(error);
    outputBlock(`Failed to read file for validation: ${message}`);
    return;
  }

  // Run contract checks
  const contractResult = checkPresetContract(content);

  if (!contractResult.passed) {
    // Add preset-specific context to the error message
    const formattedErrors = formatContractErrors(filePath, contractResult.errors);
    const contextualHelp = getPresetContextHelp();
    outputBlock(formattedErrors + contextualHelp);
    return;
  }

  // All checks passed
  outputAllow();
}

/**
 * Get contextual help message explaining what presets should contain.
 *
 * @returns Help message with examples
 */
function getPresetContextHelp(): string {
  return `
---
PRESET GUIDELINES:

Presets are configuration objects that define an experience variant.
They must declare these four components:

1. provides: Array of state keys this preset exposes to sections
   \`\`\`typescript
   provides: ['scrollProgress', 'velocity', 'direction'] as const
   \`\`\`

2. triggers: Array of trigger hooks that produce state updates
   \`\`\`typescript
   triggers: [useScrollProgress, useVelocity, useIntersection]
   \`\`\`

3. createStore: Factory function that returns a Zustand store
   \`\`\`typescript
   createStore: () => create<InfiniteCarouselStore>((set) => ({
     scrollProgress: 0,
     setScrollProgress: (v) => set({ scrollProgress: v }),
     // ...
   }))
   \`\`\`

4. widgetBehaviours: Default behaviours mapped by widget type
   \`\`\`typescript
   widgetBehaviours: {
     Image: ['parallax', 'fadeIn'],
     Text: ['slideUp'],
     Video: ['autoplay', 'parallax'],
   }
   \`\`\`

Example preset structure:
\`\`\`typescript
import type { ExperiencePreset } from '@/experience/types';

export const infiniteCarouselPreset: ExperiencePreset = {
  provides: ['scrollProgress', 'velocity', 'direction'] as const,
  triggers: [useScrollProgress, useVelocity],
  createStore: () => create<InfiniteCarouselStore>((set) => ({ ... })),
  widgetBehaviours: {
    Image: ['parallax', 'fadeIn'],
    Text: ['slideUp'],
  },
};
\`\`\`
`;
}

// Run the validator
main();
