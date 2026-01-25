# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Setup & Configuration (setup)

**Impact:** CRITICAL
**Description:** Proper v4 configuration is essential. v4 uses CSS-first configuration with new directives, replacing the JavaScript-based config of v3.

## 2. Migration from v3 (migration)

**Impact:** HIGH
**Description:** Breaking changes from v3 that require code updates. These patterns will silently fail or produce different results if not addressed.

## 3. Customization Patterns (custom)

**Impact:** MEDIUM
**Description:** Advanced patterns for extending Tailwind v4 with custom utilities, variants, and theme configurations.
