/**
 * Composite Validator
 *
 * Validates files in composite sublayers (widget and section composites).
 * Composites are pure factory functions that return schema objects.
 *
 * Used by agents:
 * - widget-composite-builder (PostToolUse)
 * - widget-composite-reviewer (Stop)
 * - section-composite-builder (PostToolUse)
 * - section-composite-reviewer (Stop)
 *
 * Two-phase validation:
 * 1. BOUNDARY CHECK: Is file in a composite sublayer?
 * 2. CONTRACT CHECK: Does file follow composite rules?
 *
 * Rules enforced:
 * | Rule ID                  | Check                                                    |
 * |--------------------------|----------------------------------------------------------|
 * | composite-pure-function  | No useState, useEffect, useRef, useContext, etc.         |
 * | composite-returns-schema | Returns WidgetSchema or SectionSchema                    |
 * | composite-no-jsx         | No JSX syntax (returns data, not React elements)         |
 * | composite-static-only    | No runtime dependencies, no async/await, no Promises     |
 *
 * What are composites?
 * - Pure factory functions that return schema objects
 * - Evaluated at build/initialization time, not runtime
 * - No React hooks, no JSX, no async operations
 * - Input: configuration parameters
 * - Output: WidgetSchema or SectionSchema object
 *
 * @module validators/composite
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
  checkCompositeContract,
  formatContractErrors,
} from './_shared/contracts';

/**
 * Composite sublayers that this validator handles.
 */
const COMPOSITE_SUBLAYERS: Sublayer[] = [
  'content:widgets:composite',
  'content:sections:composite',
];

/**
 * Main validation function.
 *
 * Phase 1: Boundary check - is the file in a composite sublayer?
 * Phase 2: Contract check - does the file follow composite rules?
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

  // Skip non-composite sublayers - this validator only handles composites
  if (!COMPOSITE_SUBLAYERS.includes(sublayer)) {
    outputAllow();
    return;
  }

  // =========================================================================
  // PHASE 1: BOUNDARY CHECK
  // =========================================================================
  // Is the file within allowed composite sublayers?

  const boundaryResult = checkBoundary(filePath, COMPOSITE_SUBLAYERS);

  if (!boundaryResult.passed) {
    outputBlock(boundaryResult.error!);
    return;
  }

  // =========================================================================
  // PHASE 2: CONTRACT CHECK
  // =========================================================================
  // Does the file follow composite architectural rules?

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
  const contractResult = checkCompositeContract(content);

  if (!contractResult.passed) {
    // Add composite-specific context to the error message
    const formattedErrors = formatContractErrors(filePath, contractResult.errors);
    const contextualHelp = getCompositeContextHelp(sublayer);
    outputBlock(formattedErrors + contextualHelp);
    return;
  }

  // All checks passed
  outputAllow();
}

/**
 * Get contextual help message explaining what composites should do.
 *
 * @param sublayer - The composite sublayer being validated
 * @returns Help message with examples
 */
function getCompositeContextHelp(sublayer: Sublayer): string {
  const isWidget = sublayer === 'content:widgets:composite';
  const schemaType = isWidget ? 'WidgetSchema' : 'SectionSchema';
  const example = isWidget
    ? `
Example widget composite:
\`\`\`typescript
import type { WidgetSchema } from '@/schema/widget';

export function createImageGallery(images: string[]): WidgetSchema {
  return {
    type: 'Flex',
    props: { direction: 'row', gap: 4 },
    children: images.map(src => ({
      type: 'Image',
      props: { src, alt: '' }
    }))
  };
}
\`\`\``
    : `
Example section composite:
\`\`\`typescript
import type { SectionSchema } from '@/schema/section';

export function createHeroSection(title: string): SectionSchema {
  return {
    type: 'section',
    contentType: 'hero',
    widgets: [
      { type: 'Text', props: { content: title, variant: 'h1' } }
    ]
  };
}
\`\`\``;

  return `
---
COMPOSITE GUIDELINES:

Composites are pure factory functions that:
1. Take configuration parameters as input
2. Return ${schemaType} objects (data, not React components)
3. Have NO side effects (no React hooks, no DOM access)
4. Are synchronous (no async/await, no Promises)

Think of composites as "schema templates" - they create data structures
that the renderer will later turn into actual React components.
${example}
`;
}

// Run the validator
main();
