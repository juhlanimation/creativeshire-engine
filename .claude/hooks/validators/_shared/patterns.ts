/**
 * Reusable regex patterns for contract checks.
 *
 * These patterns detect architectural violations in code files.
 * Used by contract checkers in contracts.ts to validate that
 * code follows the Creativeshire architecture rules.
 *
 * @module _shared/patterns
 */

/**
 * DOM access patterns.
 *
 * Detects direct DOM manipulation which is forbidden in:
 * - Behaviours (they compute, drivers apply)
 * - Triggers (they observe events, drivers mutate DOM)
 *
 * Patterns match:
 * - document. (document.getElementById, document.querySelector, etc.)
 * - window. (window.addEventListener, window.scrollY, etc.)
 * - element. (element.style, element.classList, etc.)
 * - .style. (direct style property access)
 * - .classList. (classList manipulation)
 * - .innerHTML, .textContent (DOM mutation)
 * - .appendChild, .removeChild (DOM tree manipulation)
 */
export const DOM_ACCESS: RegExp[] = [
  // Global DOM objects
  /\bdocument\./g,
  /\bwindow\./g,

  // Element property access (but not as property names in objects)
  /(?<!['":])\belement\./g,

  // Style manipulation
  /\.style\./g,
  /\.style\s*=/g,

  // ClassList manipulation
  /\.classList\./g,

  // DOM content manipulation
  /\.innerHTML/g,
  /\.outerHTML/g,
  /\.textContent\s*=/g,
  /\.innerText\s*=/g,

  // DOM tree manipulation
  /\.appendChild\(/g,
  /\.removeChild\(/g,
  /\.insertBefore\(/g,
  /\.replaceChild\(/g,
  /\.remove\(\)/g,

  // DOM query methods
  /\.getElementById\(/g,
  /\.getElementsByClassName\(/g,
  /\.getElementsByTagName\(/g,
  /\.querySelector\(/g,
  /\.querySelectorAll\(/g,

  // DOM attribute manipulation (excluding data attributes via dataset)
  /\.setAttribute\(/g,
  /\.removeAttribute\(/g,
  /\.getAttribute\(/g,
];

/**
 * React hook patterns.
 *
 * Detects React hooks which are forbidden in:
 * - Composites (they must be pure factory functions)
 * - Drivers (they bypass React reconciler)
 *
 * Patterns match standard React hooks and common custom hooks.
 */
export const REACT_HOOKS: RegExp[] = [
  // State hooks
  /\buseState\s*[<(]/g,
  /\buseReducer\s*[<(]/g,

  // Effect hooks
  /\buseEffect\s*\(/g,
  /\buseLayoutEffect\s*\(/g,
  /\buseInsertionEffect\s*\(/g,

  // Ref hooks
  /\buseRef\s*[<(]/g,
  /\buseImperativeHandle\s*\(/g,

  // Context hooks
  /\buseContext\s*[<(]/g,

  // Memoization hooks
  /\buseMemo\s*[<(]/g,
  /\buseCallback\s*[<(]/g,

  // Other React hooks
  /\buseDebugValue\s*\(/g,
  /\buseDeferredValue\s*\(/g,
  /\buseTransition\s*\(/g,
  /\buseId\s*\(/g,
  /\buseSyncExternalStore\s*\(/g,
];

/**
 * Experience layer import patterns.
 *
 * Detects imports from experience/ internals which are forbidden in:
 * - Content layer (content cannot depend on experience internals)
 *
 * ALLOWED: imports from experience/types.ts (shared types only)
 * FORBIDDEN: imports from experience/behaviours/, experience/drivers/, etc.
 */
export const EXPERIENCE_IMPORTS: RegExp[] = [
  // Import from experience/ internals (not types.ts)
  /import\s+.*\s+from\s+['"]@?\/?(experience\/(?!types\.ts['"]))/g,
  /import\s+.*\s+from\s+['"]\.\.?\/?.*experience\/(?!types\.ts['"])/g,

  // Specific forbidden hook imports
  /\bfrom\s+['"].*\/useDriver['"]/g,
  /\bfrom\s+['"].*\/useExperience['"]/g,
  /\bfrom\s+['"].*\/useScrollProgress['"]/g,
  /\bfrom\s+['"].*DriverProvider['"]/g,
  /\bfrom\s+['"].*ExperienceProvider['"]/g,
];

/**
 * Experience hook usage patterns.
 *
 * Detects usage of experience hooks which are forbidden in:
 * - Content widgets (they receive behaviour via data attributes)
 */
export const EXPERIENCE_HOOKS: RegExp[] = [
  /\buseDriver\s*\(/g,
  /\buseExperience\s*\(/g,
  /\buseScrollProgress\s*\(/g,
];

/**
 * Zustand store access patterns.
 *
 * Detects direct Zustand store access which is forbidden in:
 * - Content layer (does not access experience state directly)
 */
export const STORE_ACCESS: RegExp[] = [
  /\buseStore\s*\(/g,
  /\.getState\s*\(/g,
  /\.setState\s*\(/g,
  /\bcreate\s*\(\s*\(/g, // Zustand create pattern
];

/**
 * CSS variable return pattern.
 *
 * Detects functions that return CSS variables (--* keys).
 * Used to verify behaviours return the correct type.
 *
 * Matches patterns like:
 * - return { '--y': value }
 * - return { '--opacity': 0.5, '--scale': 1 }
 * - returns Record<`--${string}`, value>
 */
export const CSS_VAR_RETURN: RegExp = /return\s*\{[^}]*['"]--[a-zA-Z]/;

/**
 * CSS variable setProperty pattern.
 *
 * Detects setProperty calls that set CSS variables.
 * Used to verify drivers only set CSS variables, not direct styles.
 *
 * Matches patterns like:
 * - element.style.setProperty('--y', value)
 * - target.style.setProperty('--opacity', '0.5')
 * - .setProperty('--scale', String(scale))
 */
export const CSS_VAR_SET_PROPERTY: RegExp =
  /\.setProperty\s*\(\s*['"`]--[a-zA-Z]/;

/**
 * Non-CSS variable setProperty pattern.
 *
 * Detects setProperty calls that set non-CSS-variable properties.
 * Used to block drivers from setting direct style properties.
 *
 * Matches patterns like:
 * - element.style.setProperty('transform', value)
 * - target.style.setProperty('opacity', '0.5')
 */
export const NON_CSS_VAR_SET_PROPERTY: RegExp =
  /\.setProperty\s*\(\s*['"`](?!--)[a-zA-Z]/;

/**
 * JSX/TSX syntax patterns.
 *
 * Detects JSX elements which are forbidden in:
 * - Composites (they return data, not React elements)
 *
 * Matches patterns like:
 * - <div>
 * - <Component />
 * - <Component.Sub>
 */
export const JSX_SYNTAX: RegExp[] = [
  /<[A-Z][a-zA-Z0-9]*[\s/>]/g, // <Component or <Component.
  /<[a-z]+[\s>]/g, // <div, <span, etc.
  /<\/[a-zA-Z]+>/g, // </div>, </Component>
  /React\.createElement\s*\(/g, // React.createElement calls
];

/**
 * Async patterns.
 *
 * Detects async code which is forbidden in:
 * - Composites (they are evaluated at build time, must be static)
 */
export const ASYNC_PATTERNS: RegExp[] = [
  /\basync\s+function/g,
  /\basync\s*\(/g,
  /\bawait\s+/g,
  /\.then\s*\(/g,
  /new\s+Promise\s*\(/g,
];

/**
 * Cleanup method patterns.
 *
 * Detects cleanup methods required in:
 * - Drivers (must have destroy/cleanup/kill)
 * - Triggers (must return cleanup function)
 */
export const CLEANUP_METHODS: RegExp[] = [
  /\bdestroy\s*[:(]/g,
  /\bcleanup\s*[:(]/g,
  /\bkill\s*[:(]/g,
  /\bdispose\s*[:(]/g,
];

/**
 * Registration method patterns.
 *
 * Detects registration methods required in:
 * - Drivers (must have register/unregister)
 */
export const REGISTRATION_METHODS: RegExp[] = [
  /\bregister\s*[:(]/g,
  /\bunregister\s*[:(]/g,
];

/**
 * Behaviour declaration patterns.
 *
 * Detects required declarations in behaviours:
 * - requires: (state dependencies)
 * - applicableTo: (applicable widget types)
 */
export const BEHAVIOUR_DECLARATIONS: {
  REQUIRES: RegExp;
  APPLICABLE_TO: RegExp;
} = {
  REQUIRES: /\brequires\s*[:=]/,
  APPLICABLE_TO: /\bapplicableTo\s*[:=]/,
};

/**
 * Preset declaration patterns.
 *
 * Detects required declarations in presets:
 * - provides: (state they provide)
 * - triggers: (their triggers)
 * - createStore (store factory)
 * - widgetBehaviours (default behaviours per widget type)
 */
export const PRESET_DECLARATIONS: {
  PROVIDES: RegExp;
  TRIGGERS: RegExp;
  CREATE_STORE: RegExp;
  WIDGET_BEHAVIOURS: RegExp;
} = {
  PROVIDES: /\bprovides\s*[:=]/,
  TRIGGERS: /\btriggers\s*[:=]/,
  CREATE_STORE: /\bcreateStore\s*[:=(/]/,
  WIDGET_BEHAVIOURS: /\bwidgetBehaviours\s*[:=]/,
};

/**
 * Renderer patterns.
 *
 * Detects required patterns in renderers:
 * - Registry lookup (no hardcoded imports)
 * - ErrorBoundary wrapping
 * - Fallback handling
 * - Ref forwarding
 */
export const RENDERER_PATTERNS: {
  REGISTRY_LOOKUP: RegExp;
  ERROR_BOUNDARY: RegExp;
  FALLBACK: RegExp;
  FORWARD_REF: RegExp;
} = {
  REGISTRY_LOOKUP: /\bregistry\s*[\[.]/,
  ERROR_BOUNDARY: /\bErrorBoundary\b/,
  FALLBACK: /\bfallback\b/i,
  FORWARD_REF: /\bforwardRef\b|\bref\s*[:=]/,
};

/**
 * Helper function to test if content matches any pattern in an array.
 *
 * @param content - The content to test
 * @param patterns - Array of regex patterns to test against
 * @returns Array of matches found (pattern + match text)
 */
export function findMatches(
  content: string,
  patterns: RegExp[]
): Array<{ pattern: RegExp; match: string; index: number }> {
  const matches: Array<{ pattern: RegExp; match: string; index: number }> = [];

  for (const pattern of patterns) {
    // Reset regex lastIndex for global patterns
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(content)) !== null) {
      matches.push({
        pattern,
        match: match[0],
        index: match.index,
      });

      // Prevent infinite loop for non-global patterns
      if (!pattern.global) break;
    }
  }

  return matches;
}

/**
 * Helper function to test if content matches a single pattern.
 *
 * @param content - The content to test
 * @param pattern - Regex pattern to test against
 * @returns True if the pattern matches
 */
export function hasMatch(content: string, pattern: RegExp): boolean {
  pattern.lastIndex = 0;
  return pattern.test(content);
}

/**
 * Helper function to get line number from character index.
 *
 * @param content - The full content
 * @param index - Character index in the content
 * @returns Line number (1-indexed)
 */
export function getLineNumber(content: string, index: number): number {
  const lines = content.substring(0, index).split('\n');
  return lines.length;
}
