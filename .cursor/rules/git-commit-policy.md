---
name: Commit and Push Policy
description: After every code or content change, stage precisely, commit with Conventional Commits, and push to upstream.
globs:
  - "**/*"
---

Execution rules
- After each accepted change (file add/edit/delete), immediately:
  1) Stage only the modified files explicitly (no `-A`, `-u`, or `.`)
  2) Commit with a single-line Conventional Commits header
  3) Push to `origin` on the current branch (default: `HEAD:main`)

Staging
- Use precise paths, e.g.:
  - git add /absolute/path/to/file1.ext /absolute/path/to/file2.ext

Commit format (Conventional Commits 1.0.0)
- Header only; no body/footers. Max 100 characters.
- Format: `<type>[optional scope][!]: <description>`
- Allowed types (lowercase): feat, fix, build, chore, ci, docs, style, refactor, perf, test, revert
- Examples:
  - feat(expenses): add organized accounting toggle
  - fix(calculations): correct simplified regime coefficient for general services
  - docs(copy): clarify IFICI/NHR fine-print
  - style(layout): unify tabs into master tab-shell

Commit granularity
- Commit each logical change separately. If a change spans distinct concerns (e.g., copy update and logic fix), split into two commits.
- Keep headers concise; prefer specific scopes (e.g., ui, copy, expenses, ss, freelancer, cursor, css).

Push
- After every commit, immediately push:
  - git push origin HEAD:main

Do not
- Do not stage with `git add -A`, `git add -u`, or `git add .`.
- Do not exceed 100 chars in the commit header.
- Do not include a commit body or footers.

Notes
- Follow project user rules: precise staging and Conventional Commits.
- If multiple files are changed by a single logical edit, include them in one commit; otherwise split.

