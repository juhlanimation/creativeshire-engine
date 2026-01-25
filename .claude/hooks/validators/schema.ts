/**
 * Schema Layer Validator
 *
 * Validates files in the schema layer (TypeScript type definitions).
 *
 * Used by agents:
 * - schema-builder (PostToolUse)
 * - site-builder (PostToolUse)
 * - page-builder (PostToolUse)
 *
 * Two-phase validation:
 * 1. BOUNDARY CHECK: Is file in schema layer?
 * 2. CONTRACT CHECK: Does file follow schema layer rules?
 *
 * Rules enforced:
 * | Rule ID                | Check                                           |
 * |------------------------|-------------------------------------------------|
 * | schema-types-only      | No runtime code (function implementations, etc) |
 * | schema-compiles        | tsc --noEmit passes                             |
 * | schema-exports-types   | Exports interfaces/types, not runtime values    |
 *
 * @module validators/schema
 */

import { execSync } from 'child_process';
import * as path from 'path';

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

/**
 * Schema layer sublayers that this validator handles.
 */
const SCHEMA_LAYER_SUBLAYERS: Sublayer[] = ['schema'];

/**
 * Contract error structure.
 */
interface ContractError {
  ruleId: string;
  message: string;
  line?: number;
  fix: string;
}

/**
 * Contract check result.
 */
interface ContractResult {
  passed: boolean;
  errors: ContractError[];
}

// =============================================================================
// SCHEMA CONTRACT CHECKS
// =============================================================================

/**
 * Check schema-types-only rule.
 *
 * Schema files should only contain:
 * - Type/interface definitions
 * - Type aliases
 * - Const type assertions (as const)
 * - Enums (which compile to runtime code, but are acceptable in schemas)
 *
 * Schema files should NOT contain:
 * - Function implementations (functions with bodies)
 * - const with runtime values (except enums and "as const" literals)
 * - let/var declarations
 * - Class implementations
 * - Side effects
 */
function checkSchemaTypesOnly(content: string): ContractError[] {
  const errors: ContractError[] = [];

  // Split into lines for line number reporting
  const lines = content.split('\n');

  // Patterns that indicate runtime code (not allowed)
  const runtimePatterns = [
    {
      // Function implementation with body (function foo() { ... })
      // Exclude: declare function, type definitions, overload signatures
      pattern: /^(?!.*\bdeclare\b).*\bfunction\s+\w+\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/,
      message: 'Function implementation found',
      fix: 'Schema files should only contain type definitions. Move function implementations to a separate module.',
    },
    {
      // Arrow function with body (not in type position)
      // Match: const foo = () => { ... } or const foo = (x) => x + 1
      // Exclude: type aliases like `type Fn = () => void`
      pattern: /^\s*(?:export\s+)?(?:const|let|var)\s+\w+\s*(?::\s*[^=]+)?\s*=\s*(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>/,
      message: 'Arrow function assignment found',
      fix: 'Schema files should only contain type definitions. Move function implementations to a separate module.',
    },
    {
      // let/var declarations (always runtime)
      pattern: /^\s*(?:export\s+)?(?:let|var)\s+\w+/,
      message: 'let/var declaration found',
      fix: 'Schema files should not have mutable variables. Use type definitions instead.',
    },
    {
      // Class with implementation (has constructor or method body)
      pattern: /^\s*(?:export\s+)?(?:abstract\s+)?class\s+\w+[^{]*\{[\s\S]*?(?:constructor|(?:\w+\s*\([^)]*\)\s*\{))/,
      message: 'Class implementation found',
      fix: 'Schema files should only contain type definitions. Use interfaces instead of classes, or move class implementations to a separate module.',
    },
    {
      // Runtime const with object/array literal (not "as const")
      // Exclude: type Position = { x: number } (type definitions)
      // Exclude: const foo = { ... } as const (type-safe constants)
      // Include: const foo = { bar: 5 } (runtime values)
      pattern: /^\s*(?:export\s+)?const\s+\w+\s*(?::\s*[^=]+)?\s*=\s*(?:\{|\[)(?![\s\S]*\bas\s+const\b)/,
      message: 'Runtime object/array constant found',
      fix: 'Schema files should only contain type definitions. Either use "as const" for type-safe constants, or move runtime values to a separate module.',
    },
  ];

  // Check each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip comments and empty lines
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim() === '') {
      continue;
    }

    // Skip import/export type statements
    if (/^\s*(?:import|export)\s+type\b/.test(line)) {
      continue;
    }

    // Skip type/interface definitions
    if (/^\s*(?:export\s+)?(?:type|interface)\s+\w+/.test(line)) {
      continue;
    }

    // Skip enum definitions (enums are acceptable in schemas)
    if (/^\s*(?:export\s+)?(?:const\s+)?enum\s+\w+/.test(line)) {
      continue;
    }

    // Skip declare statements
    if (/^\s*declare\s+/.test(line)) {
      continue;
    }

    // Skip namespace declarations
    if (/^\s*(?:export\s+)?namespace\s+\w+/.test(line)) {
      continue;
    }

    // Check against runtime patterns
    for (const { pattern, message, fix } of runtimePatterns) {
      if (pattern.test(line)) {
        errors.push({
          ruleId: 'schema-types-only',
          message: `${message} at line ${lineNum}`,
          line: lineNum,
          fix,
        });
        break; // Only report first match per line
      }
    }
  }

  return errors;
}

/**
 * Check schema-compiles rule.
 *
 * Runs `tsc --noEmit` on the file to verify TypeScript validity.
 */
function checkSchemaCompiles(filePath: string): ContractError[] {
  const errors: ContractError[] = [];

  try {
    // Get project root (where tsconfig.json is)
    const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();

    // Run tsc --noEmit on the specific file
    // Use --skipLibCheck to avoid checking node_modules
    execSync(`npx tsc --noEmit --skipLibCheck "${filePath}"`, {
      cwd: projectRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (error) {
    // tsc returned non-zero exit code
    const stderr = error instanceof Error && 'stderr' in error
      ? String((error as { stderr: unknown }).stderr)
      : '';
    const stdout = error instanceof Error && 'stdout' in error
      ? String((error as { stdout: unknown }).stdout)
      : '';

    const output = stderr || stdout || 'Unknown TypeScript error';

    // Extract relevant error messages
    const errorLines = output
      .split('\n')
      .filter(line => line.includes('error TS') || line.includes(path.basename(filePath)))
      .slice(0, 5) // Limit to first 5 errors
      .join('\n');

    errors.push({
      ruleId: 'schema-compiles',
      message: `TypeScript compilation failed:\n${errorLines || output.slice(0, 500)}`,
      fix: 'Fix the TypeScript errors reported above. Schema files must be valid TypeScript.',
    });
  }

  return errors;
}

/**
 * Check schema-exports-types rule.
 *
 * Schema files should export types/interfaces, not runtime values.
 *
 * Allowed exports:
 * - export type Foo = ...
 * - export interface Foo { ... }
 * - export { Foo } (re-export)
 * - export enum Foo { ... } (acceptable in schemas)
 * - export const Foo = { ... } as const (type-safe constant)
 *
 * Disallowed exports:
 * - export const foo = function() { ... }
 * - export function foo() { ... }
 * - export const foo = { ... } (without "as const")
 * - export class Foo { ... } (with implementation)
 */
function checkSchemaExportsTypes(content: string): ContractError[] {
  const errors: ContractError[] = [];

  const lines = content.split('\n');

  // Patterns for disallowed exports
  const runtimeExportPatterns = [
    {
      // export function with body
      pattern: /^\s*export\s+(?!declare\b)function\s+\w+\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/,
      message: 'Exported function implementation',
      fix: 'Schema files should only export type definitions. Use "export type" or "export interface" instead.',
    },
    {
      // export const with function expression
      pattern: /^\s*export\s+const\s+\w+\s*=\s*(?:function|\([^)]*\)\s*=>)/,
      message: 'Exported function constant',
      fix: 'Schema files should only export type definitions. Move function exports to a separate module.',
    },
    {
      // export const with object literal (not "as const")
      pattern: /^\s*export\s+const\s+\w+\s*(?::\s*[^=]+)?\s*=\s*\{(?![\s\S]*\bas\s+const\b)/,
      message: 'Exported runtime object (missing "as const")',
      fix: 'Schema files should only export type definitions. Either add "as const" for type-safe constants, or move to a separate module.',
    },
    {
      // export let/var
      pattern: /^\s*export\s+(?:let|var)\s+\w+/,
      message: 'Exported mutable variable',
      fix: 'Schema files should not export mutable variables. Use type definitions instead.',
    },
    {
      // export class with implementation
      pattern: /^\s*export\s+(?:abstract\s+)?class\s+\w+[^{]*\{/,
      message: 'Exported class implementation',
      fix: 'Schema files should only export type definitions. Use "export interface" instead, or move class to a separate module.',
    },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip non-export lines
    if (!line.includes('export')) {
      continue;
    }

    // Skip type/interface exports (these are allowed)
    if (/^\s*export\s+(?:type|interface)\s+/.test(line)) {
      continue;
    }

    // Skip re-exports
    if (/^\s*export\s*\{/.test(line) || /^\s*export\s+\*\s+from/.test(line)) {
      continue;
    }

    // Skip export type { ... }
    if (/^\s*export\s+type\s*\{/.test(line)) {
      continue;
    }

    // Skip enum exports (acceptable)
    if (/^\s*export\s+(?:const\s+)?enum\s+/.test(line)) {
      continue;
    }

    // Skip declare exports
    if (/^\s*export\s+declare\s+/.test(line)) {
      continue;
    }

    // Skip namespace exports
    if (/^\s*export\s+namespace\s+/.test(line)) {
      continue;
    }

    // Check for "as const" pattern (allowed)
    // Need to check the full statement which may span multiple lines
    const remainingContent = lines.slice(i).join('\n');
    if (/^\s*export\s+const\s+\w+[^;]*as\s+const/.test(remainingContent.split(';')[0])) {
      continue;
    }

    // Check against runtime export patterns
    for (const { pattern, message, fix } of runtimeExportPatterns) {
      if (pattern.test(line)) {
        errors.push({
          ruleId: 'schema-exports-types',
          message: `${message} at line ${lineNum}`,
          line: lineNum,
          fix,
        });
        break;
      }
    }
  }

  return errors;
}

/**
 * Run all schema contract checks.
 */
function checkSchemaContract(filePath: string, content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule 1: schema-types-only
  errors.push(...checkSchemaTypesOnly(content));

  // Rule 2: schema-compiles (only if no types-only errors)
  // Skip tsc check if we already found runtime code issues
  if (errors.length === 0) {
    errors.push(...checkSchemaCompiles(filePath));
  }

  // Rule 3: schema-exports-types
  errors.push(...checkSchemaExportsTypes(content));

  return {
    passed: errors.length === 0,
    errors,
  };
}

/**
 * Format contract errors into a readable message.
 */
function formatContractErrors(filePath: string, errors: ContractError[]): string {
  let message = `CONTRACT VIOLATION in ${filePath}\n\n`;

  for (const error of errors) {
    message += `  Rule: ${error.ruleId}\n`;
    message += `  ${error.message}\n`;
    message += `\n  Fix: ${error.fix}\n\n`;
  }

  return message.trim();
}

/**
 * Main validation function.
 *
 * Phase 1: Boundary check - is the file in the schema layer?
 * Phase 2: Contract check - does the file follow schema layer rules?
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

  // Skip non-schema sublayers - this validator only handles schema layer
  if (!SCHEMA_LAYER_SUBLAYERS.includes(sublayer)) {
    outputAllow();
    return;
  }

  // =========================================================================
  // PHASE 1: BOUNDARY CHECK
  // =========================================================================
  // Is the file within allowed schema sublayers?

  const boundaryResult = checkBoundary(filePath, SCHEMA_LAYER_SUBLAYERS);

  if (!boundaryResult.passed) {
    outputBlock(boundaryResult.error!);
    return;
  }

  // =========================================================================
  // PHASE 2: CONTRACT CHECK
  // =========================================================================
  // Does the file follow schema layer architectural rules?

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
  const contractResult = checkSchemaContract(filePath, content);

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
