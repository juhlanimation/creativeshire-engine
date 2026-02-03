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
