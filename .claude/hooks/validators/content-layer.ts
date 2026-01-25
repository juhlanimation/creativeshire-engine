/**
 * Content Layer Validator
 *
 * Validates files in the content layer (widgets, sections, chrome, features).
 *
 * Used by agents:
 * - widget-builder (PostToolUse)
 * - widget-reviewer (Stop)
 * - section-builder (PostToolUse)
 * - section-reviewer (Stop)
 * - chrome-builder (PostToolUse)
 * - chrome-reviewer (Stop)
 * - feature-builder (PostToolUse)
 * - feature-reviewer (Stop)
 *
 * Two-phase validation:
 * 1. BOUNDARY CHECK: Is file in content layer?
 * 2. CONTRACT CHECK: Does file follow content layer rules?
 *
 * Rules enforced:
 * | Rule ID                      | Check                                           |
 * |------------------------------|-------------------------------------------------|
 * | content-no-experience-import | No imports from experience/ internals           |
 * | content-no-driver-hooks      | No useDriver, useExperience, useScrollProgress  |
 * | content-no-store-access      | No direct Zustand store access                  |
 *
 * Allowed cross-layer imports:
 * - schema/* (type definitions)
 * - experience/types.ts (shared types only)
 *
 * @module validators/content-layer
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
  getContentSublayers,
  type Sublayer,
} from './_shared/boundaries';

import {
  checkContentLayerContract,
  formatContractErrors,
} from './_shared/contracts';

/**
 * Content layer sublayers that this validator handles.
 *
 * Does NOT include composite sublayers - those use composite.ts validator.
 */
const CONTENT_LAYER_SUBLAYERS: Sublayer[] = [
  'content:widgets:content',
  'content:widgets:layout',
  'content:sections:base',
  'content:chrome',
  'content:features',
];

/**
 * All allowed sublayers for content layer agents.
 * Includes composites since some agents may need to read them.
 */
const ALLOWED_SUBLAYERS: Sublayer[] = getContentSublayers();

/**
 * Main validation function.
 *
 * Phase 1: Boundary check - is the file in the content layer?
 * Phase 2: Contract check - does the file follow content layer rules?
 */
function main(): void {
  // Get file path from hook or command line
  const filePath = getFilePathFromHook();

  // No file path provided - allow (nothing to validate)
  if (!filePath) {
    outputAllow();
    return;
  }

  // Skip non-TypeScript/TSX files
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

  // Skip composite sublayers - they use composite.ts validator
  if (sublayer === 'content:widgets:composite' || sublayer === 'content:sections:composite') {
    outputAllow();
    return;
  }

  // Skip non-content sublayers - this validator only handles content layer
  if (!CONTENT_LAYER_SUBLAYERS.includes(sublayer)) {
    outputAllow();
    return;
  }

  // =========================================================================
  // PHASE 1: BOUNDARY CHECK
  // =========================================================================
  // Is the file within allowed content sublayers?

  const boundaryResult = checkBoundary(filePath, ALLOWED_SUBLAYERS);

  if (!boundaryResult.passed) {
    outputBlock(boundaryResult.error!);
    return;
  }

  // =========================================================================
  // PHASE 2: CONTRACT CHECK
  // =========================================================================
  // Does the file follow content layer architectural rules?

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
  const contractResult = checkContentLayerContract(content);

  if (!contractResult.passed) {
    const formattedErrors = formatContractErrors(filePath, contractResult.errors);
    outputBlock(formattedErrors);
    return;
  }

  // All checks passed
  outputAllow();
}

// Run the validator
main();
