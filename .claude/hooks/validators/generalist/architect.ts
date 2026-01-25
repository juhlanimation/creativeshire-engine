/**
 * Architect Agent Validator
 *
 * Validates that the Architect agent stays within its boundaries:
 * - Architect is READ-ONLY - cannot write or edit any files
 * - Its job is to design blueprints and return them in the response
 *
 * The Architect designs implementation blueprints based on Explorer findings.
 * It never writes files - all blueprints are returned in the response
 * for Technical Director validation.
 *
 * Rules:
 * - architect-read-only: Block ALL Write/Edit operations
 *
 * @module validators/generalist/architect
 */

import { getFilePathFromHook, outputBlock } from '../_shared/io';

/**
 * Main validation function for Architect.
 *
 * Architect is strictly READ-only. Any attempt to write or edit
 * should be blocked with a clear message.
 */
function validate(): void {
  // Get the file path from hook input
  const filePath = getFilePathFromHook();

  // If we're here, a Write/Edit was attempted (hook only triggers on Write|Edit)
  // Architect should NEVER write or edit - block everything

  const targetFile = filePath || 'unknown file';

  outputBlock(`BOUNDARY VIOLATION: Architect is READ-ONLY.

  Attempted to modify: ${targetFile}

  The Architect agent can only:
  - Use Glob to search for files
  - Use Grep to search file contents
  - Use Read to examine files and documentation

  Architect CANNOT write or edit any files.
  All blueprints must be returned in the response,
  not written to files.

  The blueprint should be returned to the PM, who will:
  1. Pass it to Technical Director for validation
  2. After TD approval, write the backlog item

  If you need to create a blueprint, return it in your response.`);
}

// Run validation
validate();
