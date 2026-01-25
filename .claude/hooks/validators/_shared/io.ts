/**
 * Shared I/O utilities for all validators.
 *
 * These functions handle the common patterns for:
 * - Reading file paths from Claude Code hooks
 * - Reading file content
 * - Outputting allow/block decisions
 *
 * Hook data format (from stdin):
 * {
 *   "tool_input": {
 *     "file_path": "/path/to/file"
 *   }
 * }
 *
 * @module _shared/io
 */

import * as fs from 'fs';

/**
 * Hook input data structure from Claude Code.
 */
interface HookData {
  tool_input?: {
    file_path?: string;
  };
}

/**
 * Block response structure for Claude Code hooks.
 */
interface BlockResponse {
  decision: 'block';
  reason: string;
}

/**
 * Extract file path from hook data (stdin) or command line arguments.
 *
 * Claude Code hooks provide data via stdin as JSON with the structure:
 * { "tool_input": { "file_path": "..." } }
 *
 * Falls back to command line argument if stdin is not available.
 *
 * @returns The file path, or null if not found
 *
 * @example
 * ```typescript
 * const filePath = getFilePathFromHook();
 * if (!filePath) {
 *   outputAllow(); // No file to validate
 *   return;
 * }
 * ```
 */
export function getFilePathFromHook(): string | null {
  // Try stdin first (hook provides JSON)
  // Note: In Node.js, we need to read stdin synchronously
  // process.stdin.fd is 0
  try {
    // Check if there's data on stdin (non-TTY means piped input)
    if (!process.stdin.isTTY) {
      const stdinBuffer = fs.readFileSync(0, 'utf-8');
      if (stdinBuffer.trim()) {
        const data: HookData = JSON.parse(stdinBuffer);
        const filePath = data.tool_input?.file_path;
        if (filePath) {
          return filePath;
        }
      }
    }
  } catch {
    // Stdin not available or invalid JSON, try args
  }

  // Fall back to command line argument
  if (process.argv.length > 2) {
    return process.argv[2];
  }

  return null;
}

/**
 * Read file content with proper error handling.
 *
 * @param filePath - Absolute path to the file to read
 * @returns The file content as a string
 * @throws Error if the file cannot be read (with descriptive message)
 *
 * @example
 * ```typescript
 * try {
 *   const content = getFileContent('/path/to/file.ts');
 *   // Validate content...
 * } catch (error) {
 *   outputBlock(`Failed to read file: ${error.message}`);
 * }
 * ```
 */
export function getFileContent(filePath: string): string {
  if (!filePath) {
    throw new Error('File path is required');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read file "${filePath}": ${message}`);
  }
}

/**
 * Output allow response and exit successfully.
 *
 * Prints `{}` to stdout and exits with code 0.
 * This signals to Claude Code that the operation is allowed to proceed.
 *
 * @example
 * ```typescript
 * // File passes validation
 * if (isValid) {
 *   outputAllow();
 * }
 * ```
 */
export function outputAllow(): void {
  console.log('{}');
  process.exit(0);
}

/**
 * Output block response with reason and exit with error code.
 *
 * Prints `{"decision": "block", "reason": "..."}` to stdout and exits with code 2.
 * Exit code 2 signals a blocking error that is fed back to Claude.
 *
 * The reason should include:
 * 1. What the error is
 * 2. Where it occurred
 * 3. How to fix it
 *
 * @param reason - The reason for blocking (should include fix instructions)
 * @returns Never returns (exits the process)
 *
 * @example
 * ```typescript
 * outputBlock(`CONTRACT VIOLATION in ${filePath}:
 *   - DOM access detected: document.getElementById
 *   Fix: Behaviours must be pure functions. Remove DOM access.`);
 * ```
 */
export function outputBlock(reason: string): never {
  const response: BlockResponse = {
    decision: 'block',
    reason,
  };
  console.log(JSON.stringify(response));
  process.exit(2);
}
