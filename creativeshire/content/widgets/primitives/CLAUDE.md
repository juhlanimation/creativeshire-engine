# Primitives

**Atoms. No children. Single purpose.**

Examples: Text, Image, Icon, Button, Link

Note: Video is in interactive/ due to complex state (hover-play, visibility, modal).

Before creating:
- Is this truly atomic? No children?
- Does it have internal state/multiple elements? → Move to interactive/
- Is the name generic? (not `LogoLink`, just `Link`)
- Every primitive folder needs a meta.ts for platform UI hints

Spec: [widget.spec.md](/.claude/skills/creativeshire/specs/components/content/widget.spec.md)
