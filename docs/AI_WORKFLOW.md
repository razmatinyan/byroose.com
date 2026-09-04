# AI agent workflow

This workflow defines how AI agents plan, implement, verify, commit, push, and hand off changes in byroose.com.

## 1. Start every new session

Complete this startup workflow before planning, proposing, or writing code:

1. Read the root AGENTS.md file.
2. Read the root CLAUDE.md file.
3. Read README.md.
4. Enumerate the complete docs directory and read every project document it contains.
5. Read every applicable skill file in .agents/skills and its required references.
6. Run git status, inspect unstaged diffs, and inspect staged diffs.
7. Separate user-authored working tree changes from the requested agent work.

Do not rely on documentation remembered from another session. Repeat the full
startup workflow for every new session. If a required document changes while the
session is active, reread it before planning or implementing affected work.

### User-authored working tree changes

Treat changes already present when the session starts, or changes that appear
independently while the agent works, as user-owned unless there is clear evidence
otherwise.

- Review the diff to understand its scope without rewriting it.
- Verify the affected behavior with checks proportionate to its risk.
- Review its documentation impact and include any necessary documentation with
  that user change set.
- Commit the user change set with its own accurate conventional commit.
- Keep it separate from every agent-authored implementation or documentation
  commit.
- Never amend, squash, reformat, discard, or silently absorb the user's work.
- Do not commit secrets, generated output, temporary files, or an unsafe or
  incomplete change. Report the exact blocker instead.
- Ask one concise question when ownership or intended scope cannot be determined
  safely.

## 2. Understand the request

- Inspect the current implementation, package versions, configuration, and relevant tests.
- Restate the acceptance criteria internally in observable terms.
- Ask one concise question if a missing answer would materially change behavior, architecture, visual direction, content meaning, or public data.
- Continue with a safe assumption when the decision is minor and reversible.

## Project-local workflow skills

Two project-local skills provide explicit entry points for the full repository workflow and final Git delivery:

- `/roose <task>` completes the required documentation, skill, architecture, implementation, and Git reconnaissance before it creates a plan or changes files. It then executes the requested task through verification and delivery.
- `/git [scope]` audits the intended change set, verifies it, creates focused conventional commits, and pushes the current branch with the repository's normal non-force workflow.

Both skills remain subordinate to current user instructions, `AGENTS.md`, and this workflow. `/roose` respects review-only and diagnose-only requests, while `/git` never treats unrelated working tree changes as authorized scope.

## 3. Plan the smallest complete change

- Identify the files and boundaries that own the requested behavior.
- Reuse existing components, class groups, tokens, composables, utilities, and schemas.
- Separate unrelated improvements into later tasks.
- Identify likely failure modes and the verification needed for them.
- Avoid speculative abstractions.

## 4. Implement

- Keep the working tree focused on the task.
- Preserve user changes and avoid formatting unrelated files.
- Write self-explanatory code without comments.
- Keep functions and components small enough to name precisely.
- Update types, empty states, error states, accessibility, responsive behavior, and reduced motion where the feature requires them.
- Render images through NuxtImg or NuxtPicture with intrinsic dimensions,
  responsive sizes, loading intent, and accurate alternative text.
- Let raster images inherit the central WebP output default. Add a `format`
  override only for intentional exceptions such as vector assets.
- Stop and ask before an irreversible choice or a change outside the requested scope.

## 5. Synchronize documentation

Documentation synchronization is required after every implementation change. Review the impact immediately after the code is stable, before final verification and commit.

Use this sequence:

1. Identify what changed for users, contributors, components, data, architecture, design, setup, or delivery.
2. Find the document that owns that contract.
3. Update durable guidance, examples, commands, and links.
4. Remove instructions that became inaccurate.
5. Keep the documentation change in the same commit as the implementation.
6. If no content change is required, record Documentation reviewed: no contract change in the final handoff.

Use this impact map:

| Change | Required documentation review |
| --- | --- |
| New feature | README.md for capabilities or setup, ARCHITECTURE.md for ownership and data flow, RULES.md for new standards, and public content where relevant |
| Component or UI feature | DESIGN_SYSTEM.md for tokens, variants, accessibility, responsive behavior, and usage contracts |
| Refactor | ARCHITECTURE.md for changed boundaries, ownership, dependencies, composables, utilities, or state flow |
| Bug fix | Existing documented behavior, affected examples, troubleshooting guidance, and any invariant needed to prevent recurrence |
| Backend or API work | ARCHITECTURE.md for route and data flow, RULES.md for validation and security, and shared request or response contracts |
| Dependency or Nuxt configuration | README.md for setup and commands, ARCHITECTURE.md for runtime impact, and RULES.md for new constraints |
| SEO or copy | CONTENT_GUIDE.md, metadata guidance, page intent, and visible public copy |
| Design token or theme | DESIGN_SYSTEM.md palette, token purpose, light and dark pairs, contrast, and consumers |
| Test, CI, build, or release | This workflow, README.md commands, and verification expectations |

A bug fix does not always need a new paragraph. Update documentation when the fix changes expected behavior, exposes a reusable invariant, corrects an example, or adds a useful troubleshooting path. Otherwise record the completed impact review in the handoff.

Do not maintain duplicate rules in multiple files. Update the canonical document and keep entry-point files concise.

## 6. Review the diff

Before running final checks:

- Inspect git diff and git diff --check.
- Remove debug output, dead code, temporary files, and accidental formatting changes.
- Confirm user-authored working tree changes are staged only in their own separate change set.
- Confirm the active agent change contains no unrelated files.
- Search changed text for em dashes.
- Confirm no code comments were added.
- Confirm filenames, imports, links, and documentation paths are correct.
- Confirm documentation matches the final implementation.
- Confirm required documentation is included in the same change.

## 7. Verify

Use the smallest set that proves the result:

| Change | Minimum verification |
| --- | --- |
| Documentation only | Read rendered structure, verify links, run text policy checks |
| TypeScript or Vue logic | npm run typecheck and focused behavior checks |
| Layout or styling | Typecheck plus visual checks at 390px, 768px, and 1440px |
| Image or media | Typecheck, build, optimized response, alternative text, loading behavior, and responsive visual checks |
| Interaction | Keyboard, focus, pointer, touch, loading, disabled, and error states |
| GSAP motion | Default motion, reduced motion, cleanup, and route lifecycle |
| Nuxt config or module | npm run typecheck and npm run build |
| Nitro route or backend logic | Schema, success, failure, authorization, and focused endpoint tests |
| Release-critical change | npm run typecheck and npm run build |

Do not report a check as passed unless it was executed. If a check cannot run, report the reason and the remaining risk.

## 8. Commit

Create one focused commit after the requested change, documentation synchronization, and verification are complete. Stage the implementation and its documentation together. Stage only the files that belong to the task.

If the working tree contains user-authored changes, commit those changes separately
with their own documentation impact review and verification. Never combine them
with the agent-authored change, even when both affect the same file.

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

## 9. Push

After a successful commit, push the current branch to its normal remote when access is available and the user has not asked to keep the work local.

~~~bash
git push origin HEAD
~~~

- Never force push.
- Never rewrite published history.
- Never switch the user to a different branch unless the task requires it.
- Never push a failing or partially verified change.
- If authentication, policy, or network access prevents a push, keep the local commit and report the exact blocker.
- Push each verified user and agent commit without rewriting or combining them.

## 10. Handoff

Lead with the completed outcome. Include:

- What changed
- Which documentation was updated, or confirmation that it was reviewed with no contract change
- Important architecture or design decisions
- Checks that passed
- Commit and push status when relevant
- Any known limitation or required next decision

Keep the handoff concise. Do not repeat the full implementation history.
