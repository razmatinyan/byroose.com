# AI agent guide

This file is the entry point for every AI agent working in this repository. It applies to the entire project. User instructions and system instructions take priority. A more specific AGENTS.md file may add rules for its own directory, but it must not weaken the rules here.

## Required reading

Read these files before changing code:

1. AGENTS.md
2. docs/RULES.md
3. docs/ARCHITECTURE.md
4. docs/DESIGN_SYSTEM.md
5. docs/CONTENT_GUIDE.md
6. docs/AI_WORKFLOW.md
7. README.md

Read the relevant files in .agents/skills before implementation. Use only the skills that match the task. Nuxt and Vue work normally requires the Nuxt, Nuxt 4 patterns, and Vue best practices skills. Use the Tailwind design system skill for styling, the backend patterns skill for server work, the GSAP skills for animation, and the SEO skill for public content.

## Start every task

- Read the current implementation before proposing a change.
- Inspect git status and preserve unrelated user work.
- Identify the smallest complete change that satisfies the request.
- Ask one concise question when missing information would change the public behavior, data contract, design direction, or delivery scope.
- Make a reasonable documented assumption when the decision is low risk and easy to reverse.

## Non-negotiable rules

- Do not use em dashes in interface copy, documentation, metadata, commits, or agent-authored text.
- Do not add comments to code. Prefer clear names, small functions, and explicit structure. If a critical constraint cannot be expressed clearly in code, ask before adding an exception.
- Use Nuxt 4, Vue 3 Composition API, TypeScript, and script setup.
- Declare prop defaults with reactive destructuring from defineProps. Do not use withDefaults.
- Keep components focused, reusable, accessible, and responsive.
- Extract shared stateful behavior into composables and pure shared logic into utilities.
- Use Shadcn Vue primitives, semantic Tailwind CSS v4 tokens, and reusable class groups before creating new patterns.
- Use Lucide icons through Nuxt Icon. Do not add Unicode symbols as interface icons.
- Keep browser-only behavior out of server rendering and avoid hydration mismatches.
- Validate untrusted input at backend boundaries and keep secrets on the server.
- Do not use any, suppress TypeScript errors, or introduce a dependency without a clear need.
- Do not overwrite, discard, or include unrelated user changes.
- Verify the affected behavior before delivery.

## Delivery

Follow docs/AI_WORKFLOW.md for verification, commits, pushes, and handoff. Each completed change should have one focused conventional commit and should be pushed to the current remote branch when access is available and the user has not asked otherwise. Never force push. Never add Co-Authored-by or any other AI attribution to a commit.

## Sources of truth

- Product and engineering rules: docs/RULES.md
- Directory and dependency boundaries: docs/ARCHITECTURE.md
- Tokens and UI patterns: docs/DESIGN_SYSTEM.md
- Brand and SEO writing: docs/CONTENT_GUIDE.md
- Execution and Git workflow: docs/AI_WORKFLOW.md
- Setup and project overview: README.md
