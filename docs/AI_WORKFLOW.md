# AI agent workflow

This workflow defines how AI agents plan, implement, verify, commit, push, and hand off changes in byroose.com.

## 1. Understand the request

- Read AGENTS.md and the linked project documents.
- Read every applicable skill file in .agents/skills and its required references.
- Inspect the current implementation, package versions, configuration, and relevant tests.
- Run git status and inspect existing diffs before editing.
- Restate the acceptance criteria internally in observable terms.
- Ask one concise question if a missing answer would materially change behavior, architecture, visual direction, content meaning, or public data.
- Continue with a safe assumption when the decision is minor and reversible.

## 2. Plan the smallest complete change

- Identify the files and boundaries that own the requested behavior.
- Reuse existing components, class groups, tokens, composables, utilities, and schemas.
- Separate unrelated improvements into later tasks.
- Identify likely failure modes and the verification needed for them.
- Avoid speculative abstractions.

## 3. Implement

- Keep the working tree focused on the task.
- Preserve user changes and avoid formatting unrelated files.
- Write self-explanatory code without comments.
- Keep functions and components small enough to name precisely.
- Update types, empty states, error states, accessibility, responsive behavior, and reduced motion where the feature requires them.
- Update documentation when a public contract, architecture rule, token, command, or setup step changes.
- Stop and ask before an irreversible choice or a change outside the requested scope.

## 4. Review the diff

Before running final checks:

- Inspect git diff and git diff --check.
- Remove debug output, dead code, temporary files, and accidental formatting changes.
- Confirm no unrelated files are staged or modified by the task.
- Search changed text for em dashes.
- Confirm no code comments were added.
- Confirm filenames, imports, links, and documentation paths are correct.

## 5. Verify

Use the smallest set that proves the result:

| Change | Minimum verification |
| --- | --- |
| Documentation only | Read rendered structure, verify links, run text policy checks |
| TypeScript or Vue logic | npm run typecheck and focused behavior checks |
| Layout or styling | Typecheck plus visual checks at 390px, 768px, and 1440px |
| Interaction | Keyboard, focus, pointer, touch, loading, disabled, and error states |
| GSAP motion | Default motion, reduced motion, cleanup, and route lifecycle |
| Nuxt config or module | npm run typecheck and npm run build |
| Nitro route or backend logic | Schema, success, failure, authorization, and focused endpoint tests |
| Release-critical change | npm run typecheck and npm run build |

Do not report a check as passed unless it was executed. If a check cannot run, report the reason and the remaining risk.

## 6. Commit

Create one focused commit after the requested change is complete and verified. Stage only the files that belong to the task.

Use this format:

~~~text
<type>(<optional-scope>): <short imperative summary>
~~~

Allowed prefixes:

- feat: user-visible capability
- fix: defect correction
- refactor: internal structure without intended behavior change
- style: visual or formatting-only change
- perf: performance improvement
- docs: documentation-only change
- test: test-only change
- build: dependency or build-system change
- ci: continuous integration change
- chore: maintenance that fits no other prefix
- revert: reversal of an earlier commit

Commit subject rules:

- Use lowercase after the prefix.
- Use an imperative summary.
- Keep the subject short, specific, and normally within 72 characters.
- Do not end the subject with a period.
- Do not use vague subjects such as update files, changes, or fixes.
- Do not include an em dash.
- Do not add Co-Authored-by.
- Do not add AI-generated, assistant, bot, or model attribution.

Examples:

~~~text
docs: add project rules and agent workflow
feat(button): add compact Lucide icon variant
fix(header): prevent mobile menu overflow
refactor(motion): centralize GSAP context cleanup
~~~

## 7. Push

After a successful commit, push the current branch to its normal remote when access is available and the user has not asked to keep the work local.

~~~bash
git push origin HEAD
~~~

- Never force push.
- Never rewrite published history.
- Never switch the user to a different branch unless the task requires it.
- Never push a failing or partially verified change.
- If authentication, policy, or network access prevents a push, keep the local commit and report the exact blocker.
- If the working tree contains unrelated user changes, do not include them in the commit.

## 8. Handoff

Lead with the completed outcome. Include:

- What changed
- Important architecture or design decisions
- Checks that passed
- Commit and push status when relevant
- Any known limitation or required next decision

Keep the handoff concise. Do not repeat the full implementation history.
