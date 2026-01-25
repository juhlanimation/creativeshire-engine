#!/usr/bin/env npx tsx
/**
 * Skill Hints Validator - Lightweight Anti-Pattern Detection
 *
 * This validator provides WARNINGS (not errors) for common anti-patterns
 * related to React, Tailwind, and Creativeshire architecture.
 *
 * Purpose:
 * - Catch obvious mistakes before they become problems
 * - Gentle nudges, not blocking enforcement
 * - Similar to prompt injection detection - advisory only
 *
 * Usage:
 *   npx tsx skill-hints.validator.ts --check <file-path>
 *   npx tsx skill-hints.validator.ts --check-content "<content>"
 *
 * Exit codes:
 *   0 = No warnings or only warnings (always succeeds)
 *   1 = Script error
 *
 * Note: This validator never blocks execution - it only logs warnings.
 */

import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Types
// ============================================================================

interface HintResult {
  level: "warning" | "info";
  category: string;
  message: string;
  line?: number;
  suggestion?: string;
}

interface ValidationResult {
  file: string;
  hints: HintResult[];
  totalWarnings: number;
  totalInfo: number;
}

// ============================================================================
// Anti-Pattern Definitions
// ============================================================================

interface AntiPattern {
  id: string;
  category: string;
  pattern: RegExp;
  level: "warning" | "info";
  message: string;
  suggestion: string;
  // Optional: Only apply to certain file types
  filePatterns?: RegExp[];
  // Optional: Exclude from certain file types
  excludePatterns?: RegExp[];
}

const ANTI_PATTERNS: AntiPattern[] = [
  // ============================================================================
  // React Anti-Patterns (from react-best-practices)
  // ============================================================================
  {
    id: "react-useState-in-behaviour",
    category: "React/Behaviour",
    pattern: /useState\s*[<(]/,
    level: "warning",
    message: "useState detected - behaviours should be pure functions",
    suggestion: "Behaviours compute CSS variables from state, they don't manage state",
    filePatterns: [/behaviour.*\.ts$/i, /behaviours?[/\\]/],
    excludePatterns: [/\.test\.ts$/, /\.spec\.ts$/],
  },
  {
    id: "react-useState-in-driver",
    category: "React/Driver",
    pattern: /useState\s*[<(]/,
    level: "warning",
    message: "useState detected in driver - drivers operate outside React",
    suggestion: "Drivers use DOM APIs directly, not React state",
    filePatterns: [/driver.*\.ts$/i, /drivers?[/\\]/],
    excludePatterns: [/\.test\.ts$/, /\.spec\.ts$/],
  },
  {
    id: "react-useEffect-in-behaviour",
    category: "React/Behaviour",
    pattern: /useEffect\s*\(/,
    level: "warning",
    message: "useEffect detected - behaviours are pure compute functions",
    suggestion: "Behaviours have no side effects - they just compute CSS variables",
    filePatterns: [/behaviour.*\.ts$/i, /behaviours?[/\\]/],
  },

  // ============================================================================
  // CSS Variable Anti-Patterns (SSR safety)
  // ============================================================================
  {
    id: "css-var-no-fallback",
    category: "CSS/SSR",
    pattern: /var\(--[^,)]+\)(?!\s*,)/,
    level: "warning",
    message: "CSS variable without fallback value",
    suggestion: "Use var(--name, fallback) for SSR safety",
    filePatterns: [/\.css$/, /\.tsx?$/],
    excludePatterns: [/tailwind\.css$/, /globals\.css$/],
  },
  {
    id: "css-direct-style-assignment",
    category: "CSS/Driver",
    pattern: /\.style\.\w+\s*=(?!\s*['"]--)/,
    level: "warning",
    message: "Direct style property assignment - use setProperty for CSS variables",
    suggestion: "Use element.style.setProperty('--name', value) instead",
    filePatterns: [/driver.*\.ts$/i, /drivers?[/\\]/],
  },

  // ============================================================================
  // Content Layer (L1) Anti-Patterns
  // ============================================================================
  {
    id: "l1-scroll-listener",
    category: "L1/Separation",
    pattern: /addEventListener\s*\(\s*['"]scroll['"]/,
    level: "warning",
    message: "Scroll listener in content layer - violates L1/L2 separation",
    suggestion: "Scroll handling belongs in triggers (L2), not widgets (L1)",
    filePatterns: [/widgets?[/\\]/, /content[/\\]/],
    excludePatterns: [/trigger/, /driver/, /experience/],
  },
  {
    id: "l1-resize-listener",
    category: "L1/Separation",
    pattern: /addEventListener\s*\(\s*['"]resize['"]/,
    level: "warning",
    message: "Resize listener in content layer - violates L1/L2 separation",
    suggestion: "Resize handling belongs in triggers (L2), not widgets (L1)",
    filePatterns: [/widgets?[/\\]/, /content[/\\]/],
    excludePatterns: [/trigger/, /driver/, /experience/],
  },
  {
    id: "l1-viewport-units",
    category: "L1/Sizing",
    pattern: /:\s*\d+v[wh]/,
    level: "info",
    message: "Viewport units detected - widgets should use intrinsic sizing",
    suggestion: "BehaviourWrapper imposes extrinsic constraints, widgets fill intrinsically",
    filePatterns: [/widgets?[/\\].*\.(css|tsx?)$/],
  },
  {
    id: "l1-position-fixed",
    category: "L1/Layout",
    pattern: /position:\s*(fixed|sticky)/,
    level: "warning",
    message: "Fixed/sticky positioning in widget - use chrome for persistent UI",
    suggestion: "Persistent UI should be in chrome (regions/overlays), not widgets",
    filePatterns: [/widgets?[/\\].*\.(css|tsx?)$/],
    excludePatterns: [/chrome[/\\]/],
  },

  // ============================================================================
  // Experience Layer (L2) Anti-Patterns
  // ============================================================================
  {
    id: "l2-passive-missing",
    category: "L2/Performance",
    pattern: /addEventListener\s*\(\s*['"](?:scroll|touchstart|touchmove|wheel)['"]\s*,\s*\w+\s*\)/,
    level: "info",
    message: "Event listener may need { passive: true } for performance",
    suggestion: "Scroll/touch listeners should be passive unless preventDefault needed",
    filePatterns: [/trigger.*\.ts$/i, /driver.*\.ts$/i],
  },
  {
    id: "l2-no-cleanup",
    category: "L2/Memory",
    pattern: /addEventListener[^]*(?!removeEventListener)/,
    level: "info",
    message: "Event listener without obvious cleanup",
    suggestion: "Ensure cleanup in destroy() or useEffect return",
    filePatterns: [/trigger.*\.ts$/i, /driver.*\.ts$/i],
  },

  // ============================================================================
  // Tailwind v4 Anti-Patterns
  // ============================================================================
  {
    id: "tailwind-v3-ring-default",
    category: "Tailwind/Migration",
    pattern: /\bring\b(?!-\d|ring-\[)/,
    level: "info",
    message: "Bare 'ring' class - v4 removed default ring width",
    suggestion: "Use ring-3 or ring-[3px] for explicit width",
    filePatterns: [/\.tsx?$/, /\.css$/],
  },
  {
    id: "tailwind-v3-shadow-default",
    category: "Tailwind/Migration",
    pattern: /\bshadow\b(?!-\w)/,
    level: "info",
    message: "Bare 'shadow' class - consider v4 shadow scale",
    suggestion: "V4 has updated shadow scale, verify appearance",
    filePatterns: [/\.tsx?$/],
  },

  // ============================================================================
  // Import Anti-Patterns (Bundle Size)
  // ============================================================================
  {
    id: "import-lodash-full",
    category: "Bundle/Size",
    pattern: /import\s+.*\s+from\s+['"]lodash['"]/,
    level: "warning",
    message: "Full lodash import - use specific imports",
    suggestion: "Import from 'lodash/functionName' to reduce bundle size",
    filePatterns: [/\.tsx?$/],
  },
  {
    id: "import-moment",
    category: "Bundle/Size",
    pattern: /import\s+.*\s+from\s+['"]moment['"]/,
    level: "info",
    message: "moment.js detected - consider date-fns or dayjs",
    suggestion: "Lighter alternatives exist for date formatting",
    filePatterns: [/\.tsx?$/],
  },
];

// ============================================================================
// Validation Logic
// ============================================================================

function checkContent(
  content: string,
  filePath: string
): HintResult[] {
  const results: HintResult[] = [];
  const lines = content.split("\n");

  for (const antiPattern of ANTI_PATTERNS) {
    // Check file pattern filters
    if (antiPattern.filePatterns) {
      const matchesFile = antiPattern.filePatterns.some((fp) =>
        fp.test(filePath)
      );
      if (!matchesFile) continue;
    }

    if (antiPattern.excludePatterns) {
      const excluded = antiPattern.excludePatterns.some((ep) =>
        ep.test(filePath)
      );
      if (excluded) continue;
    }

    // Check each line for the pattern
    lines.forEach((line, index) => {
      if (antiPattern.pattern.test(line)) {
        results.push({
          level: antiPattern.level,
          category: antiPattern.category,
          message: antiPattern.message,
          line: index + 1,
          suggestion: antiPattern.suggestion,
        });
      }
    });
  }

  return results;
}

function validateFile(filePath: string): ValidationResult {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const hints = checkContent(content, filePath);

    return {
      file: filePath,
      hints,
      totalWarnings: hints.filter((h) => h.level === "warning").length,
      totalInfo: hints.filter((h) => h.level === "info").length,
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error}`);
    return {
      file: filePath,
      hints: [],
      totalWarnings: 0,
      totalInfo: 0,
    };
  }
}

// ============================================================================
// Output Formatting
// ============================================================================

function formatResult(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.hints.length === 0) {
    lines.push(`✓ ${result.file}: No hints`);
    return lines.join("\n");
  }

  lines.push(`\n📋 ${result.file}`);
  lines.push(`   Warnings: ${result.totalWarnings}, Info: ${result.totalInfo}`);
  lines.push("");

  result.hints.forEach((hint) => {
    const icon = hint.level === "warning" ? "⚠️" : "ℹ️";
    const lineInfo = hint.line ? `:${hint.line}` : "";
    lines.push(`   ${icon} [${hint.category}] ${hint.message}`);
    if (hint.line) {
      lines.push(`      Line ${hint.line}`);
    }
    if (hint.suggestion) {
      lines.push(`      💡 ${hint.suggestion}`);
    }
    lines.push("");
  });

  return lines.join("\n");
}

// ============================================================================
// Main CLI
// ============================================================================

function printUsage(): void {
  console.log(`
Skill Hints Validator - Lightweight Anti-Pattern Detection

Usage:
  npx tsx skill-hints.validator.ts --check <file-path>
  npx tsx skill-hints.validator.ts --check-content "<content>"

Options:
  --check <path>         Check a specific file
  --check-content        Check content from stdin or argument
  --quiet                Only show warnings, suppress info

Exit codes:
  0 = Always (this validator never blocks)
  1 = Script error only

Examples:
  npx tsx skill-hints.validator.ts --check src/widget.tsx
  echo "const x = useState()" | npx tsx skill-hints.validator.ts --check-content
`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(0);
  }

  const command = args[0];
  const quiet = args.includes("--quiet");

  switch (command) {
    case "--check": {
      const filePath = args[1];
      if (!filePath) {
        console.error("Error: File path required");
        process.exit(1);
      }

      if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
      }

      const result = validateFile(filePath);

      if (quiet) {
        // Only show if there are warnings
        if (result.totalWarnings > 0) {
          console.log(formatResult(result));
        }
      } else {
        console.log(formatResult(result));
      }

      // Always exit 0 - this validator is advisory only
      process.exit(0);
      break;
    }

    case "--check-content": {
      const content = args[1] || "";
      const hints = checkContent(content, "<stdin>");

      const result: ValidationResult = {
        file: "<stdin>",
        hints,
        totalWarnings: hints.filter((h) => h.level === "warning").length,
        totalInfo: hints.filter((h) => h.level === "info").length,
      };

      if (!quiet || result.totalWarnings > 0) {
        console.log(formatResult(result));
      }

      process.exit(0);
      break;
    }

    case "--help":
    case "-h":
      printUsage();
      process.exit(0);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

main();
