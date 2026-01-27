# Platform Context

Creativeshire operates as a platform wrapper around individual site instances. This document clarifies that boundary.

## Platform Overview

Creativeshire is a portfolio platform targeting artists, studios, and project presentations. The platform provides:

| Capability | Description |
|------------|-------------|
| CMS | Visual web builder with preset templates |
| Domain reselling | Custom domain registration and management |
| Portfolio discovery | Search and browse published portfolios |
| User authentication | Account management, login, sessions |
| Metadata storage | User profiles, site settings, analytics |
| Booking sidebar | Contact forms, scheduling, independent of site content |

The platform wraps individual site instances, each powered by the Creativeshire engine.

## Architecture Relationship

```
┌─ Creativeshire Platform ─────────────────────────────┐
│  - CMS + Domain reseller + Portfolio search          │
│  - User auth, metadata, booking sidebar              │
│  - Web builder with preset templates                 │
│                                                      │
│  ┌─ Site Instance (creativeshire engine) ──────────┐ │
│  │  - L1 Content + L2 Experience                   │ │
│  │  - Schema-driven, animation-focused             │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

The engine runs inside the platform. The platform handles everything outside content rendering and animation.

## Separation of Concerns

| Concern | Owner | Engine Responsibility |
|---------|-------|----------------------|
| Content rendering | Engine | Full ownership |
| Animation/Experience | Engine | Full ownership |
| Schema interpretation | Engine | Full ownership |
| User authentication | Platform | None |
| Data persistence | Platform | None |
| Domain management | Platform | None |
| Booking/sidebar UI | Platform | None |
| CMS interface | Platform | None |
| Analytics collection | Platform | None |

The engine receives schema data and renders it. The engine does not know about users, databases, or platform features.

## Documentation Scope

This architecture documentation covers the **engine only**.

Platform documentation lives separately. This repository documents:

- Content layer (widgets, sections, chrome, features)
- Experience layer (behaviours, drivers, triggers, presets)
- Schema layer (type definitions, validation)
- Renderer layer (schema-to-component bridges)

Platform concerns (auth, CMS, domains, booking) fall outside this scope.

## Interface Contract

The platform communicates with the engine through a defined interface layer. The interface layer specifies:

- Schema format the engine accepts
- Props the engine exposes
- Events the engine emits
- Callbacks the platform provides

See [interface.spec.md](../layers/interface.spec.md) for the complete contract specification.

## See Also

- [philosophy.spec.md](./philosophy.spec.md) - Core engine principles
- [interface.spec.md](../layers/interface.spec.md) - Platform ↔ Engine contract
