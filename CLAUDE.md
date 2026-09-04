# Claude Code guide

Claude Code must follow AGENTS.md and every document it references. This file is a quick project entry point, not a second set of rules.

## Project snapshot

byroose.com is a Nuxt 4 and Vue 3 website for the byroose creative agency. The current application is a responsive landing experience built with TypeScript, Tailwind CSS v4, Shadcn Vue source components, Nuxt Icon with Lucide, Nuxt Fonts, VueUse, and GSAP.

## Read before editing

1. AGENTS.md
2. docs/RULES.md
3. docs/ARCHITECTURE.md
4. docs/DESIGN_SYSTEM.md
5. docs/CONTENT_GUIDE.md
6. docs/AI_WORKFLOW.md

Inspect the relevant skill instructions in .agents/skills before implementation. Inspect the current file and git diff before changing it.

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

## Commands

~~~bash
npm install
npm run dev
npm run typecheck
npm run build
npm run generate
npm run preview
~~~

Use the smallest relevant verification set. Follow docs/AI_WORKFLOW.md for the required Git and handoff process.
