# Extension Principle

> Before creating anything new, check what exists. Extend before you invent.

---

## The Rule

**Check → Extend → Create**

```
Need identified
      ↓
Check catalog/registry
      ↓
  Exists? ──YES──→ Use existing
      │              (maybe add option/variant)
      NO
      ↓
  Similar? ──YES──→ Extend existing
      │              (add prop, expand range)
      NO
      ↓
  Create new
  + Add to catalog
  + Document purpose
```

---

## Why This Matters

| Without Principle | With Principle |
|-------------------|----------------|
| `--section-y`, `--translateY`, `--pos-y` | `--y` (one variable, documented) |
| Three widgets doing similar things | One widget with variants |
| Duplicate behaviours with slight differences | One behaviour with options |
| Maintenance nightmare | Single source of truth |

**The anti-pattern:** "I need X, let me create X" without checking what exists.

---

## Application by Domain

| Domain | Registry/Catalog | Check First | Extend How | Create When |
|--------|------------------|-------------|------------|-------------|
| **CSS Variables** | [Styling Guide](../reference/tech-stack/styling.md) | Variable catalog | Expand range, add fallback | Truly new animation property |
| **Widgets** | Widget Registry | Existing widgets | Add prop or variant | No existing widget fits |
| **Behaviours** | Behaviour Registry | Existing behaviours | Add option parameter | New animation pattern |
| **Sections** | Section Composites | Existing composites | Add variant function | New layout pattern |
| **Features** | Feature Set | Existing features | Add value to enum | New decorator type |

---

## Decision Examples

### CSS Variable Decision

**Need:** Fade effect for a new widget

```
Check catalog → --opacity exists (range 0-1, fallback 1)
Decision: Use existing --opacity
```

**Need:** Rotation animation

```
Check catalog → No rotation variable exists
Check similar → --scale exists (transform-based)
Decision: Create --rotate, add to catalog with range and fallback
```

### Widget Decision

**Need:** Display project title with subtitle

```
Check registry → Text widget exists
Decision: Text widget with variant="subtitle" prop? Or compose two Text widgets?
Check: Can Text handle two-line display with hierarchy?
If yes → Add variant prop
If no → Create TitleBlock widget (document why Text doesn't fit)
```

### Behaviour Decision

**Need:** Parallax with depth variation

```
Check registry → depth-layer behaviour exists
Check options → Has depth parameter (0-100)
Decision: Use depth-layer with custom depth value
```

---

## Catalog Maintenance

When creating something new:

1. **Add to catalog immediately** - Not "later"
2. **Document the purpose** - Why does this exist?
3. **Define boundaries** - What range/variants are valid?
4. **Reference related items** - What's similar but different?

| Item Type | Where to Document | Required Fields |
|-----------|-------------------|-----------------|
| CSS Variable | `reference/tech-stack/styling.md` | Name, range, fallback, set by, consumed by |
| Widget | Registry + contract | Props, variants, when to use |
| Behaviour | Registry + contract | Options, requires, CSS variables produced |
| Section Composite | Composite index | Variants, when to use |

---

## Validation

This principle is enforced through:

1. **Pre-creation checks** - Verify similar item doesn't exist before creating
2. **Blueprint review** - New items require justification for why existing items don't fit
3. **PR review** - Duplicates are flagged before merge

---

## Quick Checklist

Before creating:

- [ ] Searched catalog/registry for existing item
- [ ] Searched for similar items that could extend
- [ ] Documented why existing items don't fit (if creating new)
- [ ] Added new item to appropriate catalog
- [ ] Cross-referenced related items

---

## See Also

- [CSS Variable Catalog](../reference/styling.spec.md#css-variable-catalog) - Animation variable inventory
- [Widget Contract](../components/content/widget.spec.md) - Widget creation rules
- [Behaviour Contract](../components/experience/behaviour.spec.md) - Behaviour creation rules
- [Common Patterns](../patterns/common.spec.md) - Proven implementation patterns
