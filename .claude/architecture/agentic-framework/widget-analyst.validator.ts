#!/usr/bin/env npx tsx
/**
 * Widget Analyst Validator
 *
 * Validates widget-analyst output using the shared analyst validator.
 *
 * Exit codes:
 *   0 = Pass
 *   1 = Validator crashed
 *   2 = Validation failed
 */

import { execSync } from "child_process";

try {
  execSync(
    "npx tsx .claude/architecture/creativeshire/meta/analyst/analyst.validator.ts Widget",
    { stdio: "inherit" }
  );
  process.exit(0);
} catch (error: any) {
  process.exit(error.status || 1);
}
