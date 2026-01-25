/**
 * Explorer Agent Validator
 *
 * Validates that the Explorer agent stays within its boundaries:
 * - Explorer is READ-ONLY - cannot write or edit any files
 * - Its job is to explore and return findings in the response
 *
 * The Explorer analyzes the codebase to gather context for planning.
 * It never writes files - all findings are returned in the response.
 *
 * Rules:
 * - explorer-read-only: Block ALL Write/Edit operations
 *
 * @module validators/generalist/explorer
 */

import { getFilePathFromHook, outputBlock } from '../_shared/io';

/**
 * Main validation function for Explorer.
 *
 * Explorer is strictly READ-only. Any attempt to write or edit
 * should be blocked with a clear message.
 */
function validate(): void {
  // Get the file path from hook input
  const filePath = getFilePathFromHook();

  // If we're here, a Write/Edit was attempted (hook only triggers on Write|Edit)
  // Explorer should NEVER write or edit - block everything

  const targetFile = filePath || 'unknown file';

  outputBlock(`BOUNDARY VIOLATION: Explorer is READ-ONLY.

  Attempted to modify: ${targetFile}

  The Explorer agent can only:
  - Use Glob to search for files
  - Use Grep to search file contents
  - Use Read to examine files

  Explorer CANNOT write or edit any files.
  All exploration findings must be returned in the response,
  not written to files.

  If you need to save findings, return them in your response
  so the PM can pass them to the next agent.`);
}

// Run validation
validate();
