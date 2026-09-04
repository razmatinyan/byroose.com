---
name: git
description: Safely deliver byroose.com changes through focused Git commits and a normal GitHub push. Use whenever the user invokes /git or $git, asks to use the project git skill, or explicitly asks to review current changes, create conventional commits, and push the current branch. Audit instructions, ownership, diffs, documentation impact, verification, branch state, and remotes before any Git mutation.
compatibility: Requires a Git worktree and repository access. Push requires an accessible origin remote and valid authentication.
metadata:
  author: byroose
  version: "1.0.0"
---

# Git commit and push workflow

Treat `/git` or `$git` as authorization to prepare, commit, and normally push the intended current change set. Use any text after the invocation as the requested scope or commit intent. This authorization does not extend to unrelated changes, history rewriting, destructive cleanup, failing work, secrets, or generated artifacts.

## Delivery gate

Do not stage, commit, or push until the audit and verification below are complete. Git delivery is the final quality boundary, so inspect the actual diff rather than relying on a prior summary.

### 1. Refresh project instructions

1. Confirm the repository root.
2. If the required session startup in `AGENTS.md` has not been completed in this session, complete it before proceeding.
3. Always reread `docs/AI_WORKFLOW.md` before Git mutations.
4. Read every applicable `AGENTS.md` for the changed paths.
5. Reread any governing file that changed during the session.

### 2. Audit repository state

Inspect:

- Current branch and whether HEAD is detached
- Upstream branch and ahead or behind state when available
- `git status --short --branch`
- Full unstaged diff
- Full staged diff
- Relevant untracked files
- Recent commit subjects and conventions
- Configured remotes

Use the current conversation and the session's initial Git baseline to identify ownership. Changes present before agent work are user-authored unless there is clear evidence otherwise. If `/git` is invoked without earlier implementation context, treat the uncommitted work as user-authored and use the user's stated scope to decide what may be committed.

If unrelated or ambiguous changes cannot be separated safely, ask one concise question before staging. Do not guess across change sets.

### 3. Review change safety and completeness

For every intended file:

1. Read the diff and confirm it implements a coherent, complete change.
2. Check for secrets, credentials, personal data, generated build output, temporary files, debug output, and unintended formatting churn.
3. Confirm no user-authored work will be folded into an agent-authored commit.
4. Review the documentation impact using the map in `docs/AI_WORKFLOW.md`.
5. Add a required documentation update only when it is clearly part of the same requested change. If the correct documentation decision is ambiguous, stop and ask.
6. Confirm changed text follows the project's no em dash rule and code contains no newly added comments.

Do not create an empty commit. If there is nothing to commit, report the clean state and stop without pushing.

### 4. Verify before committing

Run the smallest verification set that proves the intended change, including:

- `git diff --check`
- Focused checks required by the change type in `docs/AI_WORKFLOW.md`
- Typecheck, build, tests, visual checks, interaction checks, or policy searches when applicable
- A final documentation accuracy review

Do not commit or push a failing or partially verified change. Fix only a straightforward blocker that is clearly within the current task. Otherwise report the failure and leave the work uncommitted.

### 5. Partition the commits

Create one focused conventional commit for each coherent change set. Keep user-authored and agent-authored changes in separate commits. Keep implementation and its required documentation together.

Use this subject format:

```text
<type>(<optional-scope>): <short imperative summary>
```

Use the allowed types and subject rules from `docs/AI_WORKFLOW.md`. Infer the subject from the diff, not from a vague request. Do not add `Co-Authored-by`, AI attribution, a period, or an em dash.

Stage explicit paths only:

```bash
git add -- path/to/file path/to/other-file
```

Do not use `git add .`, `git add -A`, or `git commit -a`. After staging each change set, inspect `git diff --cached` and `git diff --cached --check` before committing.

### 6. Commit safely

1. Commit with the verified conventional subject.
2. Do not amend an existing commit unless the user explicitly asked for that exact operation.
3. Do not rebase, reset, clean, checkout files, switch branches, or stash as part of this workflow.
4. If a hook changes files or the commit fails, inspect the new state before deciding what to do.
5. Record the resulting commit hash and subject.

### 7. Push normally

After all intended commits succeed and the working tree is in the expected state, push the current branch with:

```bash
git push origin HEAD
```

Never force push and never rewrite published history. Do not switch branches. If the push is rejected because the remote moved, report the rejection and current branch state. Do not pull, merge, or rebase without separate authorization.

If authentication, policy, network access, a missing remote, or a detached HEAD prevents the push, keep the local commit intact and report the exact blocker.

### 8. Confirm delivery

Inspect final status and report:

- Files and change sets committed
- Documentation updated, or confirmation that its impact was reviewed with no contract change
- Verification that passed
- Commit hash and exact subject
- Current branch
- Push remote and result
- Any files intentionally left uncommitted

Do not say the work is on GitHub unless the push command succeeded.
