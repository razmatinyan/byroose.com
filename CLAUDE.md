# Claude Code guide

Claude Code must follow AGENTS.md and every document it references. This file is a quick project entry point, not a second set of rules.

## Project snapshot

byroose.com is a Nuxt 4 and Vue 3 website for the byroose creative agency. The current application is a responsive landing experience built with TypeScript, Tailwind CSS v4, Shadcn Vue source components, Nuxt Icon with Lucide, Nuxt Fonts, VueUse, and GSAP.

## Required session startup

At the start of every new Claude Code session, before planning, proposing, or
writing code:

1. Read AGENTS.md.
2. Read CLAUDE.md.
3. Read README.md.
4. Enumerate the complete docs directory and read every project document it contains.
5. Read every applicable skill in .agents/skills and its required references.
6. Inspect git status, unstaged diffs, and staged diffs.

Do not rely on documentation remembered from another session. Reread any required
file that changes while the session is active. Treat user-authored working tree
changes as a separate change set and follow docs/AI_WORKFLOW.md for review, verification,
documentation impact, commit, and push behavior.

## Essential implementation rules

- Use script setup with TypeScript and the Vue 3 Composition API.
- Destructure defineProps directly and place primitive defaults in the destructure.
- Never use withDefaults in this project.
- Do not import React patterns into Vue components.
- Do not add code comments.
- Do not write em dashes.
- Reuse existing UI primitives, cards, shared components, composables, utilities, icons, tokens, and Tailwind class groups.
- Keep source-owned Shadcn primitives compatible with Reka UI and preserve their accessibility behavior.
- Keep client-only APIs inside safe Vue or Nuxt client lifecycles.
- Preserve unrelated work and never use destructive Git commands.
- Review and synchronize the relevant project documentation after every feature, refactor, bug fix, dependency update, configuration change, or design-system change.
- Keep documentation updates in the same focused commit as the change they describe.

## Commands

~~~bash
npm install
npm run dev
npm run typecheck
npm run build
npm run generate
npm run preview
~~~

Use the smallest relevant verification set. Follow docs/AI_WORKFLOW.md for documentation synchronization, Git delivery, and handoff.
