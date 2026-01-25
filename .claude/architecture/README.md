u Architecture

This folder contains two complementary frameworks for building and maintaining the portfolio.

---

## Quick Navigation

| I want to... | Go to |
|--------------|-------|
| Understand how everything fits together | [FRAMEWORK-GUIDE.md](FRAMEWORK-GUIDE.md) |
| Create a new agent | [FRAMEWORK-GUIDE.md](FRAMEWORK-GUIDE.md) |
| See which agents a command needs | [agentic-framework/agent-maps/](agentic-framework/agent-maps/) |
| Create a new component spec or validator | [templates/](templates/) |
| Understand a specific domain (widget, chrome, etc.) | [creativeshire/](creativeshire/) |

---

## Two Frameworks

### Creativeshire Architecture (the WHAT)

Defines **what things are** and **what is valid**.

```
creativeshire/
├── components/          # Component specs and validators by layer
│   ├── content-layer/   # Widgets, sections, chrome, features
│   └── experience-layer/# Behaviours, drivers, triggers, providers
├── core/                # Core concepts and principles
├── layers/              # Layer definitions
├── patterns/            # Design patterns
└── reference/           # Reference documentation
```

**Key files:**
- `{domain}.spec.md` - Defines what something IS (purpose, interfaces, requirements)
- `{domain}.validator.ts` - Defines what IS VALID (validation rules)

### Agentic Framework (the HOW)

Defines **how agents interact** with the architecture.

```
agentic-framework/
└── agent-maps/              # Which agents each command orchestrates
    ├── build.agentmap.md
    ├── fix.agentmap.md
    ├── plan.agentmap.md
    └── validate.agentmap.md
```

**Key concept:** Agent maps show the flow of agents for each command (`/plan`, `/build`, `/validate`, `/fix`).

---

## Shared Resources

### Templates

Start here when creating new components or agents:

```
templates/
├── spec.template.md              # Domain specification template
├── domain-validator.template.ts  # Domain validation rules template
├── agent-contract.template.md    # Agent scope and workflow template
└── composite-validator.template.ts # Agent-to-validator wiring template
```

### Archive

Legacy and deprecated documentation lives in [old/](old/).

---

## How They Work Together

```
┌─────────────────────────────────────────┐
│         CREATIVESHIRE (WHAT)            │
│  "What IS a widget? What IS valid?"     │
│                                         │
│  creativeshire/{domain}.spec.md         │
│  creativeshire/{domain}.validator.ts    │
└────────────────────┬────────────────────┘
                     │ references
                     ▼
┌─────────────────────────────────────────┐
│         AGENTIC FRAMEWORK (HOW)         │
│  "How do agents use this knowledge?"    │
│                                         │
│  agentic-framework/agent-maps/          │
│  .claude/agents/{name}.md               │
└─────────────────────────────────────────┘
```

For detailed explanation, see [FRAMEWORK-GUIDE.md](FRAMEWORK-GUIDE.md).
