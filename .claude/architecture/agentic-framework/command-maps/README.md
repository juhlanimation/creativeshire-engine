# Command Maps

This folder contains caller maps for each command, showing the communication flow and which agents are invoked.

## Files

| File | Command | Description |
|------|---------|-------------|
| [plan.commandmap.md](plan.commandmap.md) | `/plan` | Planning workflow |
| [build.commandmap.md](build.commandmap.md) | `/build` | Build workflow |
| [fix.commandmap.md](fix.commandmap.md) | `/fix` | Quick fix workflow |
| [validate.commandmap.md](validate.commandmap.md) | `/validate` | Validation workflow |

## Purpose

These maps help understand:
- The communication flow when calling a command
- Which agents each command calls and in what order
- What each agent is responsible for
- How agents delegate to each other

## Key Principle

**Commands are PMs** - they coordinate but don't code. They launch agents via the `Task` tool.

**Generalists coordinate** - they analyze, validate, and delegate but don't write production code.

**Specialists implement** - they have write access to specific boundaries and are validated by hooks.
