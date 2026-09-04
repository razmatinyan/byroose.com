---
name: roose
description: Run the complete repository-first workflow for byroose.com tasks. Use whenever the user invokes /roose or $roose, asks to use the roose skill, or requests a change that must begin with a full review of project instructions, documentation, architecture, applicable skills, current implementation, Git state, and relevant history before planning or implementation.
compatibility: Requires repository filesystem access and Git. Uses the project-local git skill for commit and push delivery when available.
metadata:
  author: byroose
  version: "1.0.0"
---

# Roose repository workflow

Treat the text after `/roose` or `$roose` as the task. Run the task from discovery through delivery while respecting the user's requested action. A request to review or diagnose authorizes investigation and reporting, not an implementation. A request to build, change, or fix authorizes the matching implementation.

The discovery gate exists because this repository keeps product rules, architecture boundaries, design decisions, and delivery requirements in separate sources. Reading only the code or only one guide can produce a locally plausible change that violates the project contract.

## Discovery gate

Do not propose a plan, edit files, install dependencies, stage changes, commit, or push until every applicable discovery step is complete. Brief progress updates are allowed during discovery.

Never claim that a file was read when it was only listed, summarized by another agent, or partially loaded. Read long files in chunks until the end when needed.

### 1. Establish the instruction hierarchy

1. Resolve the repository root with Git.
2. Find every `AGENTS.md` that governs the repository root and the files likely to be involved.
3. Read the root files in this order:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `README.md`
4. Enumerate the complete `docs` directory recursively.
5. Read every project document in `docs` completely, including at least:
   - `docs/AI_WORKFLOW.md`
   - `docs/ARCHITECTURE.md`
   - `docs/RULES.md`
   - `docs/DESIGN_SYSTEM.md`
   - `docs/CONTENT_GUIDE.md`
6. Read any more specific `AGENTS.md` before inspecting or changing files in its scope.
7. If a required instruction file changes during the task, reread it before continuing with affected work.

### 2. Select and read applicable skills

1. Enumerate `.agents/skills` so the available project-local skills are known.
2. Read `.agents/skills/using-superpowers/SKILL.md` when present because it governs skill selection.
3. Select only the skills that match the requested work.
4. Read each selected `SKILL.md` completely before planning.
5. Read every reference that a selected skill marks as required for the task.
6. Announce which skills are being used and why.

Typical selection includes Nuxt, Nuxt 4 patterns, and Vue best practices for Vue or Nuxt work; Tailwind design system guidance for styling; backend patterns for server work; GSAP guidance for motion; and SEO guidance for public content. The repository instructions and current skill metadata decide the final set.

### 3. Capture the Git baseline and history

Inspect without mutating the working tree:

1. Current branch and upstream.
2. `git status --short --branch`.
3. Complete unstaged and staged diffs.
4. Untracked files relevant to the task.
5. Recent commit history and subjects.
6. Recent commits that changed the relevant files or subsystem.
7. File history or blame only where it helps explain an existing decision.

Record which changes existed before this task. Treat them as user-authored unless there is clear evidence otherwise. Do not overwrite, reformat, stage, or absorb them into agent-authored work.

### 4. Explore the implementation

1. Enumerate the repository structure with `rg --files` or the nearest available equivalent.
2. Inspect `package.json`, relevant configuration, and installed versions.
3. Trace the current implementation that owns the requested behavior.
4. Read callers, consumers, shared primitives, composables, utilities, schemas, tests, and documentation that define its contract.
5. Search for an existing component, pattern, token, icon, helper, or abstraction before proposing a new one.
6. Identify dependency direction, SSR boundaries, data ownership, accessibility needs, responsive behavior, error states, and security boundaries that apply.
7. Note the smallest relevant verification commands and any focused manual checks.

Use web research only when the user asks for it or when current external facts, official framework behavior, or another unstable dependency must be verified. Prefer official primary sources for technical work.

## Discovery completion report

Before presenting a plan, give the user a concise `Reconnaissance complete` update containing:

- The instruction and documentation sources read
- The applicable skills loaded
- The relevant implementation paths inspected
- The Git baseline and ownership of existing changes
- The project constraints and acceptance criteria that will shape the work

This report is evidence that the discovery gate has completed. If a required source cannot be read, state the exact blocker. Continue only when the remaining gap cannot materially affect the task.

## Plan after discovery

Only after the discovery completion report:

1. Translate the request into observable acceptance criteria.
2. Ask one concise question if a missing answer would materially change public behavior, data contracts, architecture, design direction, or delivery scope.
3. Otherwise make a low-risk, reversible assumption and state it.
4. Plan the smallest complete change at the layer that owns the behavior.
5. Name the expected files, documentation impact, failure modes, and verification.
6. Keep unrelated improvements outside the task.

Do not produce a speculative plan before reading the implementation. The plan should describe the codebase that actually exists.

## Implement within the discovered boundaries

1. Preserve the recorded baseline and all unrelated user work.
2. Follow every applicable repository and skill rule.
3. Reuse established components, tokens, variants, composables, utilities, schemas, and patterns.
4. Keep the change focused and avoid speculative abstractions.
5. Handle accessibility, responsive behavior, SSR safety, error states, validation, and reduced motion where relevant.
6. Do not introduce a dependency unless the existing platform and project tools cannot solve the need cleanly.
7. Review documentation impact once the implementation is stable and update the canonical document in the same change when the contract changed.

Use `apply_patch` for deliberate file edits. Do not reformat unrelated files or use destructive Git commands.

## Review and verify

1. Inspect the final unstaged and staged diffs.
2. Run `git diff --check`.
3. Confirm the diff contains only intended files and no secrets, generated output, debug artifacts, AI attribution, new code comments, or em dashes in agent-authored text.
4. Verify the affected behavior with the smallest set that proves it, following `docs/AI_WORKFLOW.md`.
5. Review documentation accuracy against the final implementation.
6. Report any check that could not run and the remaining risk. Never claim an unexecuted check passed.

## Git delivery

When the user has not asked to keep the work local, read and follow the project-local `git` skill before staging. If that skill is unavailable, follow the commit and push sections of `docs/AI_WORKFLOW.md` directly.

Respect any explicit request not to commit or push. Never force push, rewrite published history, combine user-authored and agent-authored change sets, or add AI attribution.

## Final handoff

Lead with the completed outcome and include:

- What changed
- Which documentation changed, or that its impact was reviewed with no contract change
- Checks that passed
- Commit hash and subject when committed
- Push destination and status when pushed
- Any remaining limitation or required decision

Keep the handoff concise and do not repeat the full work log.
