# CMS Setup Review

> Analysis of creativeshire-engine's readiness for CMS customization integration.
>
> Date: 2026-01-31

---

## Executive Summary

The preset → site architecture is **correctly set up**. What's missing is a formal **Settings Layer** that describes component customization for visual editors. Tests are solid but validators are dead code.

---

## 1. Architecture Assessment

### Current Flow ✓

```
creativeshire/presets/{name}/  →  site/config.ts + site/pages/
         (template)                   (deployed instance)
```

### Key Files

| File | Purpose |
|------|---------|
| `creativeshire/presets/bojuhl/` | Complete preset (theme, chrome, pages) |
| `site/config.ts` | Imports preset, overrides values |
| `site/pages/home.ts` | Uses section factories with site-specific content |
| `site/data/` | Content data (projects, bio, logos) |

### What's Working

| Aspect | Status |
|--------|--------|
| Preset → Site inheritance | ✓ |
| Widget registry & lookup | ✓ |
| Section factories | ✓ |
| Style overrides via `style`/`className` | ✓ |
| Behaviour/effect separation | ✓ |
| Chrome (header/footer/overlays) | ✓ |

---

## 2. Settings Layer (NEW)

### Gap Identified

Components have TypeScript prop interfaces but no **CMS editor metadata**:
- No field labels/descriptions for UI
- No validation rules
- No default values centralized
- No field type hints (color picker vs text input)

### Solution Created

**Spec:** `.claude/skills/creativeshire/specs/layers/settings.spec.md`

Defines a `SettingsSchema` type that describes:

```typescript
interface SettingsSchema {
  component: string           // Widget/section name
  displayName: string         // UI label
  groups: SettingsGroup[]     // Grouped settings
  fields?: SettingsField[]    // Ungrouped fields
}

interface SettingsField {
  key: string                 // Maps to prop name
  type: SettingsFieldType     // 'text', 'color', 'select', etc.
  label: string               // UI label
  default?: SerializableValue // Default value
  required?: boolean
  responsive?: boolean        // Per-breakpoint values
  options?: FieldTypeOptions  // Type-specific constraints
}
```

### Implementation Path

| Phase | Task |
|-------|------|
| 1 | Add types (done in spec) |
| 2 | Create `.settings.ts` for each widget |
| 3 | Build validation functions |
| 4 | Auto-discovery registry |
| 5 | Platform integration (visual editor consumes) |

### File Structure

```
creativeshire/settings/
├── types.ts              # Core types
├── registry.ts           # Schema registry
├── validate.ts           # Runtime validation
├── defaults.ts           # Default resolution
└── widgets/
    ├── Text.settings.ts
    ├── Flex.settings.ts
    └── ...
```

---

## 3. Test Architecture Review

### Two-Tier System

| Layer | Location | When Run | Purpose |
|-------|----------|----------|---------|
| **Architecture Tests** | `__tests__/architecture/` | `npm run test:arch` | Verify codebase integrity |
| **Validators** | `.claude/specs/components/*.validator.ts` | Never (not wired) | Dead code |

### Test Value Assessment

| Test File | Value | Verdict |
|-----------|-------|---------|
| `imports.test.ts` | **Critical** | Keep - L1/L2 boundary |
| `widgets.test.ts` | **High** | Keep - Widget contract |
| `behaviours.test.ts` | **High** | Keep - Behaviour contract |
| `triggers.test.ts` | **High** | Keep - SSR safety |
| `structure.test.ts` | **Medium** | Keep - Consistency |
| `css.test.ts` | **Medium** | Keep - CSS rules |

### Issues Found

1. **15+ skipped tests** - Document violations, not aspirational rules
2. **Validators not wired** - 13 files doing nothing
3. **Missing tests** - Settings coverage, registry consistency

### Tests Created

| File | Purpose |
|------|---------|
| `__tests__/architecture/settings.test.ts` | Ensures widgets/sections have `.settings.ts` files |
| `__tests__/architecture/registry.test.ts` | Verifies registry matches actual components |

---

## 4. Validator Status

### Finding: NOT USED

Evidence:
- No `.claude/hooks.json` configuration
- No Husky hooks
- Git hooks are all `.sample` (inactive)
- No npm scripts reference validators

### Files Affected (13 total)

```
.claude/skills/creativeshire/specs/components/
├── content/
│   ├── widget.validator.ts
│   ├── section.validator.ts
│   ├── section-pattern.validator.ts
│   ├── widget-composite.validator.ts
│   └── chrome.validator.ts
├── experience/
│   ├── behaviour.validator.ts
│   ├── driver.validator.ts
│   ├── provider.validator.ts
│   └── trigger.validator.ts
├── preset/
│   └── preset.validator.ts
├── renderer/
│   └── renderer.validator.ts
├── schema/
│   └── schema.validator.ts
└── site/
    └── site.validator.ts
```

### Recommendation: Delete Validators

**Reasoning:**
1. Architecture tests already verify the same rules
2. Tests run in CI; validators do nothing
3. Dead code creates false sense of security
4. One testing location is easier to maintain

**Alternative:** Wire validators to Claude hooks for real-time blocking. But architecture tests are the better solution.

---

## 5. Action Items

### Immediate

- [ ] Run `npm install` to enable tests
- [ ] Run `npm run test:arch` to verify tests pass
- [ ] Decide: Delete validators or wire to hooks

### Short-term

- [ ] Clean up skipped tests (fix violations or delete tests)
- [ ] Create `creativeshire/settings/` directory structure
- [ ] Implement settings for core widgets (Text, Flex, Image)

### Medium-term

- [ ] Complete settings for all widgets
- [ ] Add settings for section patterns
- [ ] Build validation utilities
- [ ] Create settings registry with auto-discovery

---

## 6. Files Created/Modified

### New Files

| File | Purpose |
|------|---------|
| `.claude/skills/creativeshire/specs/layers/settings.spec.md` | Settings layer specification |
| `__tests__/architecture/settings.test.ts` | Settings coverage test |
| `__tests__/architecture/registry.test.ts` | Registry consistency test |
| `.claude/CMS-SETUP-REVIEW.md` | This document |

### Modified Files

| File | Change |
|------|--------|
| `.claude/skills/creativeshire/specs/index.spec.md` | Added settings spec to index |

---

## 7. Commands Reference

```bash
# Run architecture tests
npm run test:arch

# Run all tests
npm test

# Type check
npx tsc --noEmit
```

---

## 8. Related Documentation

- [Settings Layer Spec](skills/creativeshire/specs/layers/settings.spec.md)
- [Schema Spec](skills/creativeshire/specs/components/schema/schema.spec.md)
- [Widget Spec](skills/creativeshire/specs/components/content/widget.spec.md)
- [Testing Strategy](skills/creativeshire/specs/testing/strategy.spec.md)
