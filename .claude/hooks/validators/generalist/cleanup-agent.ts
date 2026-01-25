/**
 * Cleanup Agent Validator
 *
 * Validates that the Cleanup Agent stays within its boundaries:
 * - Cannot edit code files (must delegate to specialists)
 * - Can only add cleanup tasks to current-sprint.md
 * - Must create task entries, not direct code edits
 * - Verification checklist items must be complete before declaring clean
 *
 * The Cleanup Agent verifies that old code has been removed after migrations.
 * It doesn't delete files directly - it creates tasks for specialists.
 *
 * Rules:
 * - cleanup-no-code-edit: File extension not .ts, .tsx, .js, .jsx, .css, .scss, .json
 * - cleanup-creates-task: Output creates task entry, not direct code edit
 * - cleanup-checklist-complete: Verification items are checked before declaring clean
 *
 * @module validators/generalist/cleanup-agent
 */

import { getFilePathFromHook, getFileContent, outputAllow, outputBlock } from '../_shared/io';
import { checkGeneralistBoundary, isCodeFile } from '../_shared/generalist-boundaries';

/**
 * Check if content creates proper task entries rather than direct code changes.
 *
 * The cleanup agent should identify issues and create tasks for specialists,
 * not directly edit or delete code.
 *
 * @param content - The file content to check
 * @returns Object with validation result
 */
function checkCreatesTaskEntry(content: string): { valid: boolean; reason?: string } {
  // Check for common patterns that indicate direct code manipulation instructions
  // rather than task creation
  const directCodePatterns = [
    /```(typescript|tsx|javascript|jsx|css|scss)/i, // Code blocks with implementation
    /delete\s+this\s+(file|code|function|component)/i, // Direct deletion instructions
    /remove\s+the\s+following\s+code/i, // Direct code removal
    /replace\s+with\s+the\s+following/i, // Direct code replacement
  ];

  for (const pattern of directCodePatterns) {
    if (pattern.test(content)) {
      // If code blocks exist, check if they're in a task context
      // Task entries have "Assigned To:" which indicates proper delegation
      const hasTaskAssignment = /assigned\s+to\s*:/i.test(content);
      if (!hasTaskAssignment) {
        return {
          valid: false,
          reason: `Content appears to contain direct code instructions without task delegation.

  Cleanup Agent must create tasks for specialists, not provide direct code changes.

  Fix: Add a task entry with:
    - Assigned To: [specialist-agent-name]
    - Scope: [files/folders to clean]
    - Acceptance Criteria: [what needs to be deleted/cleaned]`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Check if verification checklist items are complete.
 *
 * The cleanup agent uses checklists to track what has been verified.
 * Before declaring something "clean", all checklist items should be checked.
 *
 * @param content - The file content to check
 * @returns Object with validation result
 */
function checkVerificationComplete(content: string): { valid: boolean; reason?: string } {
  // Look for checklist items (markdown checkboxes)
  const checkboxPattern = /^\s*-\s*\[([ xX])\]/gm;
  const matches = content.match(checkboxPattern);

  // If no checkboxes, nothing to validate
  if (!matches || matches.length === 0) {
    return { valid: true };
  }

  // Count checked vs unchecked
  const unchecked = matches.filter((m) => /\[\s\]/.test(m));
  const checked = matches.filter((m) => /\[[xX]\]/.test(m));

  // If there are unchecked items and the content declares something as "clean" or "complete",
  // that's a violation
  const declaresClean = /(?:clean(?:ed|up)?|complete[d]?|verified|removed|deleted)\s*$/im.test(content);
  const hasStatusComplete = /status\s*:\s*(?:clean|complete|verified)/i.test(content);

  if ((declaresClean || hasStatusComplete) && unchecked.length > 0) {
    return {
      valid: false,
      reason: `Cleanup verification incomplete.

  Found ${unchecked.length} unchecked verification items out of ${matches.length} total.
  Cannot declare cleanup complete while verification items remain unchecked.

  Fix: Complete all verification checklist items before marking as clean:
  ${unchecked
    .slice(0, 3)
    .map((_, i) => `    - [ ] Item ${i + 1}: Verify and check off`)
    .join('\n')}${unchecked.length > 3 ? `\n    ... and ${unchecked.length - 3} more` : ''}`,
    };
  }

  return { valid: true };
}

/**
 * Main validation function for Cleanup Agent.
 *
 * Two-phase validation:
 * 1. File type and path check (via generalist-boundaries)
 * 2. Protocol checks:
 *    - Creates task entries, not direct code changes
 *    - Verification checklist complete before declaring clean
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

  // Rule: cleanup-no-code-edit
  // Cleanup Agent cannot edit code files directly
  if (isCodeFile(filePath)) {
    outputBlock(`BOUNDARY VIOLATION: Cleanup Agent cannot edit code files directly.

  File: ${filePath}

  Cleanup Agent verifies old code removal but cannot delete files directly.

  Workflow:
  1. Verify old code locations are empty or deleted
  2. Create a task in current-sprint.md if cleanup is needed
  3. Assign the cleanup task to the appropriate specialist

  Fix: Instead of editing this code file, add a cleanup task to
  .claude/tasks/current-sprint.md with:
    - Assigned To: [specialist who owns this code]
    - Scope: ${filePath}
    - Action: Delete or clean up the specified file`);
    // outputBlock never returns
  }

  const boundaryResult = checkGeneralistBoundary(filePath, 'cleanup-agent');

  if (!boundaryResult.allowed) {
    outputBlock(boundaryResult.reason!);
    // outputBlock never returns
  }

  // ============================================================================
  // PHASE 2: Protocol Checks
  // ============================================================================

  // Only check protocol for the sprint file (cleanup agent's allowed edit path)
  const isSprintFile = filePath.includes('.claude/tasks/current-sprint.md');

  if (isSprintFile) {
    let content: string;
    try {
      content = getFileContent(filePath);
    } catch {
      // If we can't read the file, allow the edit
      // (file might not exist yet)
      outputAllow();
      return;
    }

    // Rule: cleanup-creates-task
    // Check that output creates task entries, not direct code instructions
    const taskResult = checkCreatesTaskEntry(content);
    if (!taskResult.valid) {
      outputBlock(`PROTOCOL VIOLATION: ${taskResult.reason}`);
      // outputBlock never returns
    }

    // Rule: cleanup-checklist-complete
    // Check that verification items are complete before declaring clean
    const checklistResult = checkVerificationComplete(content);
    if (!checklistResult.valid) {
      outputBlock(`PROTOCOL VIOLATION: ${checklistResult.reason}`);
      // outputBlock never returns
    }
  }

  // All checks passed
  outputAllow();
}

// Run validation
validate();
