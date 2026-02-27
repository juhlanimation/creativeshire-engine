# Presets

**Templates defining visual structure. Platform injects content.**

Preset = bundled configuration (theme, chrome, experience, page templates)
Site = assembled instance that uses/extends a preset

Flow: User picks preset -> platform resolves bindings -> site renders

## Binding Expressions

All content props MUST use binding expressions:

```typescript
// Correct - binding expression
props: { email: '{{ content.footer.email }}' }
props: { projects: '{{ content.projects.featured }}' }

// Wrong - hardcoded content
props: { email: 'hello@example.com' }
props: { projects: [] }
```

Platform resolves `{{ content.xxx }}` at runtime.

## Rules

1. **No hardcoded content** - emails, URLs, text, arrays
2. **Use `{{ content.xxx }}`** for all content props
3. **Generic components** - no site-specific names
4. **Preset name** only appears in this folder

## Content Schema

Document expected content structure in `content-schema.ts`:

```typescript
export interface PresetContentSchema {
  hero: { title: string; subtitle: string }
  footer: { email: string; links: LinkData[] }
}
```

Spec: [preset.spec.md](/.claude/skills/engine/specs/components/preset/preset.spec.md)

## Assembling a Preset

A preset wires existing engine bricks into a site template:

1. **Theme:** Color, typography, spacing, scrollbar, container settings
2. **Pages:** Import section factories, compose into PageSchema arrays
3. **Experience:** Map section IDs to behaviour assignments
4. **Chrome:** Wire header/footer regions + overlay configurations
5. **Content Contract:** `buildContentContract()` from section `content.ts` imports
6. **Sample Content:** `buildSampleContent()` from the same declarations

Content declarations live in the sections, not the preset. The preset only:
- Overrides labels (e.g. `{ ...galleryContent, label: 'Azuki Elementals' }`)
- Adds site-level fields (head, contact) inline
- Passes `withContentBindings(namespace, fields)` for auto-generated bindings

Run `npm run inventory:quick` to see available bricks before assembling.
