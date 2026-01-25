/**
 * Technical Director Validator
 *
 * Validates that the Technical Director agent stays within its boundaries:
 * - Cannot edit code files (specialists own implementation)
 * - Can only edit task files in .claude/tasks/
 * - Must include "Assigned To:" field when creating/editing tasks
 * - Must include "Scope:" section when creating/editing tasks
 *
 * The Technical Director is the architecture guardian - they coordinate work
 * but never implement it themselves.
 *
 * Rules:
 * - td-no-code-edit: File extension not .ts, .tsx, .js, .jsx, .css, .scss, .json
 * - td-allowed-paths: Path matches .claude/tasks/*.md
 * - td-has-assignment: Task includes "Assigned To:" field
 * - td-has-scope: Task includes "Scope:" section
 *
 * @module validators/generalist/technical-director
 */

import { getFilePathFromHook, getFileContent, outputAllow, outputBlock } from '../_shared/io';
import { checkGeneralistBoundary } from '../_shared/generalist-boundaries';
import { checkTaskProtocol, formatTaskProtocolError } from '../_shared/protocol-checks';

/**
 * Main validation function for Technical Director.
 *
 * Two-phase validation:
 * 1. File type and path check (via generalist-boundaries)
 * 2. Protocol check (task must have Assigned To and Scope)
 */
function validate(): void {
  // Get the file path from hook input
  const filePath = getFilePathFromHook();

  // If no file path, allow (nothing to validate)
  if (!filePath) {
    outputAllow();
    return;
  }

  // ============================================================================
  // PHASE 1: File Type & Path Check
  // ============================================================================

  const boundaryResult = checkGeneralistBoundary(filePath, 'technical-director');

  if (!boundaryResult.allowed) {
    outputBlock(boundaryResult.reason!);
    // outputBlock never returns (exits process)
  }

  // ============================================================================
  // PHASE 2: Protocol Check (Task Fields)
  // ============================================================================

  // Only check protocol for task files
  // Technical Director can only edit .claude/tasks/*.md files
  const isTaskFile = filePath.includes('.claude/tasks/') && filePath.endsWith('.md');

  if (isTaskFile) {
    let content: string;
    try {
      content = getFileContent(filePath);
    } catch (error) {
      // If we can't read the file, allow the edit
      // (file might not exist yet for new files)
      outputAllow();
      return;
    }

    const taskResult = checkTaskProtocol(content);

    // Technical Director requires: Assigned To and Scope
    // (Acceptance Criteria and Status are checked by Project Manager)
    const errors: string[] = [];

    if (!taskResult.hasAssignedTo) {
      errors.push('Assigned To');
    }

    if (!taskResult.hasScope) {
      errors.push('Scope');
    }

    if (errors.length > 0) {
      outputBlock(`PROTOCOL VIOLATION: Task missing required fields for delegation.

  File: ${filePath}
  Missing: ${errors.join(', ')}

  Technical Director tasks must specify:
${!taskResult.hasAssignedTo ? '  - Assigned To: [specialist-agent-name]\n    (Which specialist will implement this task?)\n' : ''}${!taskResult.hasScope ? '  - Scope: (section describing files/folders the specialist can touch)\n    (What boundaries does the specialist work within?)\n' : ''}
  Generalist agents coordinate work, they don't implement it.
  Each task must clearly hand off to a specialist with defined boundaries.`);
      // outputBlock never returns
    }
  }

  // All checks passed
  outputAllow();
}

// Run validation
validate();
