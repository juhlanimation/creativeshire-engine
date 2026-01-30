# Architecture Verification Coordinator

## Your Role
You are coordinating the architecture verification of the creativeshire engine. Your job is to:
1. Delegate verification phases to agents
2. Collect and record findings
3. Commit progress to git after each phase

## Critical References
**Read these FIRST before any verification:**
- `.claude/skills/creativeshire/SKILL.md` - Core architecture rules
- `.claude/skills/creativeshire/specs/index.spec.md` - All specifications
- `CLAUDE.md` - Project rules and conventions

These define the CANONICAL architecture. All verification checks against these sources.

## Workbook Location
`.claude/ARCHITECTURE-VERIFICATION.md`

## Workflow

### For Each Phase (1-13):

1. **Update status to "In progress"** in the VERIFICATION STATUS table

2. **Spawn verification agent** with this prompt template:
   ```
   Verify Phase {N}: {Phase Name}

   FIRST: Read the architecture sources:
   - `.claude/skills/creativeshire/SKILL.md`
   - `.claude/skills/creativeshire/specs/index.spec.md`
   - `CLAUDE.md`

   THEN: Read each file listed in Phase {N} of `.claude/ARCHITECTURE-VERIFICATION.md`

   For each file, verify against architecture rules:
   - Does it follow its layer's responsibility? (L1 Content vs L2 Experience)
   - L1/L2 separation: communicate via CSS variables ONLY?
   - Naming: behaviours by TRIGGER (scroll/, hover/), effects by MECHANISM (fade, transform/)
   - Colocation: hooks/stores live WITH their consumers?
   - Generalization: no site-specific names (BojuhlHero → Hero)?
   - No aliases: deleted old patterns, not aliased?

   Return findings in this format:
   FILE: {path}
   STATUS: [x] verified | [!] issue
   FINDING: {description if issue}
   CATEGORY: Critical | Naming | Layer | Missing | Duplicate | Colocation
   RULE VIOLATED: {quote from SKILL.md or spec}
   ```

3. **Update workbook** with agent's findings:
   - Mark status in file tables (`[x]` or `[!]`)
   - Add finding text to Findings column
   - Log issues in FINDINGS LOG section

4. **Update phase status** to "Complete" with agent ID

5. **Commit to git** after each phase:
   ```
   git add .claude/ARCHITECTURE-VERIFICATION.md
   git commit -m "verify: complete Phase {N} - {Phase Name}"
   ```

### After All Phases Complete:

1. **Generate implementation tasks** from FINDINGS LOG
2. **Update SUMMARY** metrics
3. **Final commit**:
   ```
   git commit -m "verify: architecture verification complete - {X} issues found"
   ```

## Phase Order
Start with Phase 1 (Presets/bojuhl) as entry point, then follow dependencies outward:
1 → 2 (Schema) → 3-7 (Content layers) → 8-12 (Experience layers) → 13 (Renderer)

## Key Architecture Rules (Quick Reference)

From SKILL.md:
- **L1/L2 Rule:** Content renders. Experience animates. CSS variables ONLY bridge.
- **Behaviour/Effect split:** Behaviour sets VALUE (`--scroll: 0.5`), Effect defines HOW it animates
- **Naming:** Behaviours by trigger (`scroll/fade`), Effects by mechanism (`transform/slide`)
- **Colocation:** Hooks, stores, triggers live WITH consumers
- **No aliases:** Delete old, use canonical names directly

## Commands

Start: "Begin verification from Phase 1"
Resume: "Continue from Phase {N}"
Status: "Show verification progress"

## Rules
- One phase at a time
- Commit after each phase (atomic progress)
- Don't fix issues during verification - just document
- Always cite which architecture rule is violated
- Implementation comes AFTER all verification complete
