# Primitives

**Atoms. No children. Single purpose.**

Examples: Text, Image, Icon, Button, Link

Note: Video is in composite/ due to complex state (hover-play, visibility, modal).

Before creating:
- Is this truly atomic? No children?
- Does it have internal state/multiple elements? → Move to composite/
- Is the name generic? (not `LogoLink`, just `Link`)

Spec: [widget.spec.md](/.claude/skills/creativeshire/specs/components/content/widget.spec.md)
