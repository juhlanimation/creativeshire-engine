import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noDocumentEvents from "./eslint-rules/no-document-events.js";

// Local plugin for engine-specific rules
const localPlugin = {
  meta: {
    name: "local",
    version: "1.0.0",
  },
  rules: {
    "no-document-events": noDocumentEvents,
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent tooling (not application code)
    ".claude/**",
  ]),
  // Engine-specific rules for container awareness
  {
    files: ["engine/**/*.ts", "engine/**/*.tsx"],
    plugins: {
      local: localPlugin,
    },
    rules: {
      // Error on document-level APIs - breaks iframe/container support
      "local/no-document-events": "error",
    },
  },
]);

export default eslintConfig;
