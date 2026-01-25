/**
 * Architectural contract check functions for validators.
 *
 * Each function validates that code follows the Creativeshire architecture rules.
 * Contract checks are run AFTER boundary checks pass.
 *
 * Contract Rules (from spec):
 * | Contract | Rules |
 * |----------|-------|
 * | Content | no experience imports, no driver hooks, no store access |
 * | Behaviour | no DOM, CSS vars only, declares requires/applicableTo, pure |
 * | Driver | CSS vars only, has cleanup, no React state, has register/unregister |
 * | Trigger | returns cleanup, store-only writes, no DOM mutation |
 * | Composite | pure function, returns schema, no JSX, static only |
 * | Preset | has provides, triggers, store factory, widgetBehaviours |
 * | Renderer | uses registry, has ErrorBoundary, has fallback, forwards refs |
 *
 * @module _shared/contracts
 */

import {
  DOM_ACCESS,
  REACT_HOOKS,
  EXPERIENCE_IMPORTS,
  EXPERIENCE_HOOKS,
  STORE_ACCESS,
  CSS_VAR_RETURN,
  CSS_VAR_SET_PROPERTY,
  NON_CSS_VAR_SET_PROPERTY,
  JSX_SYNTAX,
  ASYNC_PATTERNS,
  CLEANUP_METHODS,
  REGISTRATION_METHODS,
  BEHAVIOUR_DECLARATIONS,
  PRESET_DECLARATIONS,
  RENDERER_PATTERNS,
  findMatches,
  hasMatch,
  getLineNumber,
} from './patterns';

/**
 * A single contract error with fix instructions.
 */
export interface ContractError {
  /** Rule ID that was violated (e.g., 'content-no-experience-import') */
  ruleId: string;
  /** Human-readable error message */
  message: string;
  /** How to fix this violation */
  fix: string;
  /** Line number where violation was found (if applicable) */
  line?: number;
  /** The matched text that triggered the violation */
  match?: string;
}

/**
 * Result of a contract check.
 */
export interface ContractResult {
  /** Whether all contract rules passed */
  passed: boolean;
  /** Array of errors found (empty if passed) */
  errors: ContractError[];
}

/**
 * Helper to create a passing result.
 */
function pass(): ContractResult {
  return { passed: true, errors: [] };
}

/**
 * Helper to create a failing result.
 */
function fail(errors: ContractError[]): ContractResult {
  return { passed: false, errors };
}

// =============================================================================
// CONTENT LAYER CONTRACT
// =============================================================================

/**
 * Check content layer contract.
 *
 * Applies to: content:widgets:*, content:sections:base, content:chrome, content:features
 *
 * Rules:
 * - content-no-experience-import: No imports from experience/ internals
 * - content-no-driver-hooks: No useDriver, useExperience, useScrollProgress
 * - content-no-store-access: No direct Zustand store access
 *
 * Allowed cross-layer imports:
 * - schema/* (type definitions)
 * - experience/types.ts (shared types only)
 *
 * @param content - The file content to validate
 * @returns ContractResult with pass/fail and errors
 */
export function checkContentLayerContract(content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule: content-no-experience-import
  const experienceImports = findMatches(content, EXPERIENCE_IMPORTS);
  for (const { match, index } of experienceImports) {
    errors.push({
      ruleId: 'content-no-experience-import',
      message: 'Content layer cannot import from experience layer internals',
      fix: 'Content widgets receive behaviour via data attributes, not direct imports.\nRemove this import. If you need types, import from experience/types.ts only.',
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: content-no-driver-hooks
  const driverHooks = findMatches(content, EXPERIENCE_HOOKS);
  for (const { match, index } of driverHooks) {
    errors.push({
      ruleId: 'content-no-driver-hooks',
      message: `Experience hook detected: ${match.trim()}`,
      fix: 'Content widgets should NOT use experience hooks directly.\nThe WidgetRenderer handles driver registration and applies CSS variables.\nRemove this hook usage.',
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: content-no-store-access
  const storeAccess = findMatches(content, STORE_ACCESS);
  for (const { match, index } of storeAccess) {
    errors.push({
      ruleId: 'content-no-store-access',
      message: `Direct store access detected: ${match.trim()}`,
      fix: 'Content does not access experience state directly.\nState flows through behaviours → CSS variables → styles.\nRemove this store access.',
      line: getLineNumber(content, index),
      match,
    });
  }

  return errors.length > 0 ? fail(errors) : pass();
}

// =============================================================================
// BEHAVIOUR CONTRACT
// =============================================================================

/**
 * Check behaviour contract.
 *
 * Applies to: experience:behaviours, experience:presets:behaviours
 *
 * Rules:
 * - behaviour-no-dom: No document., window., element., .style., .classList.
 * - behaviour-css-vars-only: Return type is CSSVariables or returns --* keys
 * - behaviour-declares-requires: Has requires: or requires = declaration
 * - behaviour-declares-applicable: Has applicableTo: declaration
 * - behaviour-pure-function: No side effects
 *
 * @param content - The file content to validate
 * @returns ContractResult with pass/fail and errors
 */
export function checkBehaviourContract(content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule: behaviour-no-dom
  const domAccess = findMatches(content, DOM_ACCESS);
  for (const { match, index } of domAccess) {
    errors.push({
      ruleId: 'behaviour-no-dom',
      message: `DOM access detected: ${match.trim()}`,
      fix: 'Behaviours cannot access DOM directly. They compute CSS variables only.\nThe driver applies these CSS variables to the DOM.\nRemove DOM access and return CSS variables instead.',
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: behaviour-css-vars-only
  // Check if there's a compute function that returns something
  const hasCompute = /\bcompute\s*[:=]/i.test(content);
  if (hasCompute) {
    // Check for return statements in compute that return CSS variables
    const returnsCssVars = hasMatch(content, CSS_VAR_RETURN);
    // Also check for type annotation with CSSVariables
    const hasCssVarType =
      /CSSVariables|Record<\s*`--\$\{string\}`/.test(content);

    if (!returnsCssVars && !hasCssVarType) {
      // Check if there are any return statements with non-CSS-var objects
      const hasNonCssReturn = /return\s*\{[^}]*['"][^-]/.test(content);
      if (hasNonCssReturn) {
        errors.push({
          ruleId: 'behaviour-css-vars-only',
          message:
            'Behaviour compute function must return CSS variables only',
          fix: "All returned keys must start with '--', e.g., { '--y': value, '--opacity': 0.5 }.\nType should be Record<`--${string}`, string | number>.",
        });
      }
    }
  }

  // Rule: behaviour-declares-requires
  const hasRequires = hasMatch(content, BEHAVIOUR_DECLARATIONS.REQUIRES);
  if (!hasRequires && hasCompute) {
    errors.push({
      ruleId: 'behaviour-declares-requires',
      message: 'Behaviour must declare state dependencies',
      fix: "Add 'requires' array listing the state keys this behaviour depends on.\nExample: requires: ['scrollProgress', 'velocity']",
    });
  }

  // Rule: behaviour-declares-applicable
  const hasApplicableTo = hasMatch(content, BEHAVIOUR_DECLARATIONS.APPLICABLE_TO);
  if (!hasApplicableTo && hasCompute) {
    errors.push({
      ruleId: 'behaviour-declares-applicable',
      message: 'Behaviour must declare applicable widget types',
      fix: "Add 'applicableTo' array listing widget types this behaviour works with.\nExample: applicableTo: ['Image', 'Video', 'Text']",
    });
  }

  // Rule: behaviour-pure-function (no side effects)
  // Check for common side effect patterns
  const sideEffectPatterns = [
    { pattern: /\bconsole\.(log|warn|error)\(/g, name: 'console output' },
    { pattern: /\bfetch\s*\(/g, name: 'fetch calls' },
    { pattern: /\bsetTimeout\s*\(/g, name: 'setTimeout' },
    { pattern: /\bsetInterval\s*\(/g, name: 'setInterval' },
  ];

  for (const { pattern, name } of sideEffectPatterns) {
    if (pattern.test(content)) {
      // Reset lastIndex for global patterns
      pattern.lastIndex = 0;
      const match = pattern.exec(content);
      if (match) {
        errors.push({
          ruleId: 'behaviour-pure-function',
          message: `Side effect detected: ${name}`,
          fix: 'Behaviours must be pure functions with no side effects.\nThey should only compute and return CSS variables based on input.',
          line: getLineNumber(content, match.index),
          match: match[0],
        });
      }
    }
  }

  return errors.length > 0 ? fail(errors) : pass();
}

// =============================================================================
// DRIVER CONTRACT
// =============================================================================

/**
 * Check driver contract.
 *
 * Applies to: experience:drivers
 *
 * Rules:
 * - driver-css-vars-only: Only uses setProperty('--*', value), no direct style assignment
 * - driver-has-cleanup: Has destroy(), cleanup(), or kill() method
 * - driver-no-react-state: No useState, useReducer
 * - driver-registers-targets: Has register() and unregister() methods
 *
 * @param content - The file content to validate
 * @returns ContractResult with pass/fail and errors
 */
export function checkDriverContract(content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule: driver-css-vars-only
  // Check for non-CSS-variable setProperty calls
  if (hasMatch(content, NON_CSS_VAR_SET_PROPERTY)) {
    const match = NON_CSS_VAR_SET_PROPERTY.exec(content);
    if (match) {
      errors.push({
        ruleId: 'driver-css-vars-only',
        message: 'Driver setting non-CSS-variable style property',
        fix: "Drivers can only set CSS variables (--* properties).\nUse setProperty('--propertyName', value) instead of direct style properties.\nThis ensures React stays in control of base styles.",
        line: getLineNumber(content, match.index),
        match: match[0],
      });
    }
  }

  // Check for direct .style.property = value assignments (not via setProperty)
  const directStyleAssignment = /\.style\.\w+\s*=/g;
  const directMatches = findMatches(content, [directStyleAssignment]);
  for (const { match, index } of directMatches) {
    errors.push({
      ruleId: 'driver-css-vars-only',
      message: `Direct style assignment detected: ${match.trim()}`,
      fix: "Use .style.setProperty('--varName', value) instead of direct style assignment.\nDrivers communicate with components via CSS variables only.",
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: driver-has-cleanup
  const hasCleanup = findMatches(content, CLEANUP_METHODS).length > 0;
  if (!hasCleanup) {
    errors.push({
      ruleId: 'driver-has-cleanup',
      message: 'Driver must have a cleanup method',
      fix: 'Add a destroy(), cleanup(), or kill() method that:\n- Removes event listeners\n- Clears intervals/timeouts\n- Releases references\nThis prevents memory leaks.',
    });
  }

  // Rule: driver-no-react-state
  const reactStateHooks = findMatches(content, [
    /\buseState\s*[<(]/g,
    /\buseReducer\s*[<(]/g,
  ]);
  for (const { match, index } of reactStateHooks) {
    errors.push({
      ruleId: 'driver-no-react-state',
      message: `React state hook detected: ${match.trim()}`,
      fix: 'Drivers bypass React for performance - they cannot use React state.\nStore state in class properties or use the experience store instead.',
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: driver-registers-targets
  const hasRegister = findMatches(content, [/\bregister\s*[:(]/g]).length > 0;
  const hasUnregister = findMatches(content, [/\bunregister\s*[:(]/g]).length > 0;

  if (!hasRegister || !hasUnregister) {
    const missing = [];
    if (!hasRegister) missing.push('register()');
    if (!hasUnregister) missing.push('unregister()');

    errors.push({
      ruleId: 'driver-registers-targets',
      message: `Driver missing required methods: ${missing.join(', ')}`,
      fix: 'Drivers must support target registration:\n- register(element): Add element to driver\n- unregister(element): Remove element from driver\nThis allows dynamic adding/removing of animated elements.',
    });
  }

  return errors.length > 0 ? fail(errors) : pass();
}

// =============================================================================
// TRIGGER CONTRACT
// =============================================================================

/**
 * Check trigger contract.
 *
 * Applies to: experience:triggers
 *
 * Rules:
 * - trigger-returns-cleanup: Returns cleanup function or has cleanup in useEffect
 * - trigger-store-only: Only calls store setter methods
 * - trigger-no-dom-mutation: No direct DOM manipulation
 *
 * @param content - The file content to validate
 * @returns ContractResult with pass/fail and errors
 */
export function checkTriggerContract(content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule: trigger-returns-cleanup
  // Check for return statements with cleanup functions OR useEffect with cleanup
  const hasCleanupReturn =
    /return\s*\(\s*\)\s*=>/.test(content) || // return () =>
    /return\s+function/.test(content) || // return function
    /return\s+cleanup/i.test(content); // return cleanup
  const hasEffectCleanup = /useEffect\s*\([^)]*,\s*\[[^\]]*\]\s*\)/.test(content);

  if (!hasCleanupReturn && !hasEffectCleanup) {
    errors.push({
      ruleId: 'trigger-returns-cleanup',
      message: 'Trigger must return a cleanup function',
      fix: 'Return a cleanup function that removes event listeners and cleans up resources.\nExample: return () => { window.removeEventListener(...) }',
    });
  }

  // Rule: trigger-store-only
  // Check that writes go through store methods, not external state
  const externalStatePatterns = [
    { pattern: /\blocal[Ss]torage\./g, name: 'localStorage' },
    { pattern: /\bsession[Ss]torage\./g, name: 'sessionStorage' },
    { pattern: /\bfetch\s*\(/g, name: 'fetch calls' },
    { pattern: /\bXMLHttpRequest/g, name: 'XMLHttpRequest' },
  ];

  for (const { pattern, name } of externalStatePatterns) {
    const matches = findMatches(content, [pattern]);
    for (const { match, index } of matches) {
      errors.push({
        ruleId: 'trigger-store-only',
        message: `External state write detected: ${name}`,
        fix: 'Triggers should only write to the experience store via store.set*() methods.\nRemove external state mutations and update the store instead.',
        line: getLineNumber(content, index),
        match,
      });
    }
  }

  // Rule: trigger-no-dom-mutation
  // Triggers can observe but not mutate
  const domMutations = [
    /\.innerHTML\s*=/g,
    /\.textContent\s*=/g,
    /\.innerText\s*=/g,
    /\.style\./g,
    /\.classList\./g,
    /\.appendChild\(/g,
    /\.removeChild\(/g,
    /\.setAttribute\(/g,
  ];

  const mutations = findMatches(content, domMutations);
  for (const { match, index } of mutations) {
    errors.push({
      ruleId: 'trigger-no-dom-mutation',
      message: `DOM mutation detected: ${match.trim()}`,
      fix: 'Triggers observe events and update the store - drivers mutate the DOM.\nRemove this DOM manipulation and update the store instead.',
      line: getLineNumber(content, index),
      match,
    });
  }

  return errors.length > 0 ? fail(errors) : pass();
}

// =============================================================================
// COMPOSITE CONTRACT
// =============================================================================

/**
 * Check composite contract.
 *
 * Applies to: content:widgets:composite, content:sections:composite
 *
 * Rules:
 * - composite-pure-function: No useState, useEffect, useRef, useContext, useMemo, useCallback
 * - composite-returns-schema: Returns WidgetSchema or SectionSchema type
 * - composite-no-jsx: No JSX/TSX syntax (returns data, not components)
 * - composite-static-only: No runtime dependencies, no async
 *
 * @param content - The file content to validate
 * @returns ContractResult with pass/fail and errors
 */
export function checkCompositeContract(content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule: composite-pure-function
  const hookUsage = findMatches(content, REACT_HOOKS);
  for (const { match, index } of hookUsage) {
    errors.push({
      ruleId: 'composite-pure-function',
      message: `React hook detected in composite: ${match.trim()}`,
      fix: 'Composites must be pure factory functions - no React hooks.\nThey return static schema data, not React components.\nRemove all hook usage.',
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: composite-no-jsx
  const jsxUsage = findMatches(content, JSX_SYNTAX);
  for (const { match, index } of jsxUsage) {
    errors.push({
      ruleId: 'composite-no-jsx',
      message: `JSX syntax detected in composite: ${match.trim()}`,
      fix: 'Composites return schema objects, not React elements.\nReturn a WidgetSchema or SectionSchema object instead of JSX.',
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: composite-static-only
  const asyncUsage = findMatches(content, ASYNC_PATTERNS);
  for (const { match, index } of asyncUsage) {
    errors.push({
      ruleId: 'composite-static-only',
      message: `Async code detected in composite: ${match.trim()}`,
      fix: 'Composites are evaluated at build time - they must be synchronous.\nRemove async/await, Promises, and .then() calls.',
      line: getLineNumber(content, index),
      match,
    });
  }

  // Rule: composite-returns-schema
  // Check for schema return type or schema-like return
  const hasSchemaType =
    /:\s*(Widget|Section)Schema/.test(content) ||
    /WidgetSchema|SectionSchema/.test(content);
  const hasSchemaReturn = /return\s*\{[^}]*type\s*:/.test(content);

  if (!hasSchemaType && !hasSchemaReturn) {
    // Only warn if there's a function that might be a factory
    const hasPossibleFactory =
      /export\s+(default\s+)?function|export\s+const\s+\w+\s*=\s*\(/.test(
        content
      );
    if (hasPossibleFactory) {
      errors.push({
        ruleId: 'composite-returns-schema',
        message: 'Composite should return a WidgetSchema or SectionSchema',
        fix: 'Composites are factory functions that return schema objects.\nEnsure return type is WidgetSchema or SectionSchema.',
      });
    }
  }

  return errors.length > 0 ? fail(errors) : pass();
}

// =============================================================================
// PRESET CONTRACT
// =============================================================================

/**
 * Check preset contract.
 *
 * Applies to: experience:presets:config
 *
 * Rules:
 * - preset-has-provides: Has provides: array declaration
 * - preset-has-triggers: Has triggers: array declaration
 * - preset-has-store-factory: Has createStore function
 * - preset-has-widget-behaviours: Has widgetBehaviours object
 *
 * @param content - The file content to validate
 * @returns ContractResult with pass/fail and errors
 */
export function checkPresetContract(content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule: preset-has-provides
  const hasProvides = hasMatch(content, PRESET_DECLARATIONS.PROVIDES);
  if (!hasProvides) {
    errors.push({
      ruleId: 'preset-has-provides',
      message: 'Preset must declare what state it provides',
      fix: "Add 'provides' array listing the state keys this preset exposes.\nExample: provides: ['scrollProgress', 'velocity', 'direction']",
    });
  }

  // Rule: preset-has-triggers
  const hasTriggers = hasMatch(content, PRESET_DECLARATIONS.TRIGGERS);
  if (!hasTriggers) {
    errors.push({
      ruleId: 'preset-has-triggers',
      message: 'Preset must declare its triggers',
      fix: "Add 'triggers' array listing the trigger hooks this preset uses.\nExample: triggers: [useScrollProgress, useVelocity]",
    });
  }

  // Rule: preset-has-store-factory
  const hasStoreFactory = hasMatch(content, PRESET_DECLARATIONS.CREATE_STORE);
  if (!hasStoreFactory) {
    errors.push({
      ruleId: 'preset-has-store-factory',
      message: 'Preset must have a store factory function',
      fix: "Add 'createStore' function that returns a Zustand store.\nThis factory is called for each section using the preset.",
    });
  }

  // Rule: preset-has-widget-behaviours
  const hasWidgetBehaviours = hasMatch(
    content,
    PRESET_DECLARATIONS.WIDGET_BEHAVIOURS
  );
  if (!hasWidgetBehaviours) {
    errors.push({
      ruleId: 'preset-has-widget-behaviours',
      message: 'Preset must declare default behaviours per widget type',
      fix: "Add 'widgetBehaviours' object mapping widget types to their default behaviours.\nExample: widgetBehaviours: { Image: ['parallax', 'fadeIn'], Text: ['slideUp'] }",
    });
  }

  return errors.length > 0 ? fail(errors) : pass();
}

// =============================================================================
// RENDERER CONTRACT
// =============================================================================

/**
 * Check renderer contract.
 *
 * Applies to: renderer
 *
 * Rules:
 * - renderer-uses-registry: Uses registry lookup, no hardcoded component imports
 * - renderer-has-error-boundary: Wraps children in ErrorBoundary
 * - renderer-has-fallback: Has fallback UI for unknown types
 * - renderer-forwards-refs: Uses forwardRef or passes ref prop
 *
 * @param content - The file content to validate
 * @returns ContractResult with pass/fail and errors
 */
export function checkRendererContract(content: string): ContractResult {
  const errors: ContractError[] = [];

  // Rule: renderer-uses-registry
  const usesRegistry = hasMatch(content, RENDERER_PATTERNS.REGISTRY_LOOKUP);
  // Check for hardcoded widget/section imports
  const hardcodedImports =
    /import\s+\{[^}]*\}\s+from\s+['"]\.\.?\/(content|widgets|sections)\//.test(
      content
    );

  if (!usesRegistry && hardcodedImports) {
    errors.push({
      ruleId: 'renderer-uses-registry',
      message: 'Renderer has hardcoded component imports',
      fix: 'Renderers must use registry lookup for component resolution.\nThis allows adding new components without modifying the renderer.\nUse: registry[schema.type] or similar lookup pattern.',
    });
  }

  // Rule: renderer-has-error-boundary
  const hasErrorBoundary = hasMatch(content, RENDERER_PATTERNS.ERROR_BOUNDARY);
  if (!hasErrorBoundary) {
    errors.push({
      ruleId: 'renderer-has-error-boundary',
      message: 'Renderer should wrap content in ErrorBoundary',
      fix: 'Wrap rendered components in an ErrorBoundary to gracefully handle errors.\nThis prevents one broken component from crashing the entire page.',
    });
  }

  // Rule: renderer-has-fallback
  const hasFallback = hasMatch(content, RENDERER_PATTERNS.FALLBACK);
  // Also check for null/undefined type handling
  const handlesUnknown =
    /if\s*\(\s*!.*type\s*\)|type\s*===?\s*undefined|default\s*:/.test(content);

  if (!hasFallback && !handlesUnknown) {
    errors.push({
      ruleId: 'renderer-has-fallback',
      message: 'Renderer should have fallback for unknown types',
      fix: 'Add fallback handling for unknown or undefined schema types.\nThis prevents runtime errors when encountering unexpected data.',
    });
  }

  // Rule: renderer-forwards-refs
  const forwardsRefs = hasMatch(content, RENDERER_PATTERNS.FORWARD_REF);
  if (!forwardsRefs) {
    errors.push({
      ruleId: 'renderer-forwards-refs',
      message: 'Renderer should support ref forwarding',
      fix: 'Use forwardRef or pass ref prop to enable driver registration.\nDrivers need refs to access DOM elements for CSS variable application.',
    });
  }

  return errors.length > 0 ? fail(errors) : pass();
}

// =============================================================================
// HELPER: FORMAT ERRORS
// =============================================================================

/**
 * Format contract errors into a human-readable string.
 *
 * @param filePath - The file being validated
 * @param errors - Array of contract errors
 * @returns Formatted error string for output
 */
export function formatContractErrors(
  filePath: string,
  errors: ContractError[]
): string {
  let output = `CONTRACT VIOLATION in ${filePath}\n\n`;

  for (const error of errors) {
    output += `  Rule: ${error.ruleId}\n`;
    if (error.line) {
      output += `  Line: ${error.line}\n`;
    }
    if (error.match) {
      output += `  Found: ${error.match.trim()}\n`;
    }
    output += `  ${error.message}\n`;
    output += `\n  Fix: ${error.fix}\n\n`;
    output += '  ---\n\n';
  }

  return output;
}
