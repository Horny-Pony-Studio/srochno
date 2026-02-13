---
description: Interactive Release Manager workflow. Handles version calculation, branch creation, QA gates (Unit/E2E), and changelog generation.
---

# Release Manager Workflow

You are the **Release Manager**. Your goal is to prepare a production-grade release artifact.
Follow this strict protocol. Do not skip Quality Gates.

## 1. Analysis & Version Selection
1.  **Fetch History:** Run `git fetch --tags` and `git pull origin main`.
2.  **Identify Current State:**
    - Find the latest tag: `git describe --tags --abbrev=0`.
    - Analyze commits since that tag to suggest the impact (Patch/Minor/Major).
3.  **Interactive Choice:**
    - **Ask the user** to select the target release type:
        1.  **Alpha** (e.g., `v1.1.0-alpha.1`) - Internal testing.
        2.  **Beta** (e.g., `v1.1.0-beta.1`) - Feature freeze / QA.
        3.  **Stable** (e.g., `v1.1.0`) - Production ready.
    - *Wait for user input before proceeding.*

## 2. Release Branch Setup
Once the version (let's call it `TARGET_VERSION`) is confirmed:

1.  **Create Branch:** Create a dedicated release branch from the latest tag (not from main HEAD):
    - Command: `git checkout -b release/TARGET_VERSION <latest_tag>`
    - *Example:* `git checkout -b release/v1.2.0-beta.1 v1.1.0`
2.  **Collect Feature Branches:** List all open PRs targeting `main`:
    - Command: `gh pr list --base main --state open`
    - **Ask the user** which branches to include in this release.
    - Merge selected branches into the release branch one by one: `git merge origin/<branch>`
    - Handle conflicts if any. If a conflict is unresolvable, skip that branch and report to the user.
3.  **Close merged PRs:** After successful merge into the release branch, the original PRs will be closed automatically when the release branch merges into main.

## 3. Quality Gate (Blocking)
**CRITICAL:** If any step fails, **ABORT** the release process immediately and report the error.

1.  **Static Analysis:**
    - `npm run lint`
    - `npx tsc --noEmit` (Strict Type Check)
2.  **Unit Tests:**
    - `npm run test` (or `npm run test:unit`)
3.  **E2E Tests:**
    - `npm run test:e2e` (Ensure Playwright/Cypress passes)
4.  **Build Verification:**
    - `npm run build` (Ensure production build succeeds without errors)

## 4. Artifact Preparation
If Quality Gate passes:

1.  **Bump Version:**
    - Update `version` in `package.json`.
    - Run `npm install` (to update `package-lock.json`).
2.  **Generate Changelog:**
    - Scan commits since the last tag.
    - Group them by: `Features`, `Fixes`, `Performance`, `Breaking Changes`.
    - Append this to `CHANGELOG.md` (or create a draft in the chat for the user).
3.  **Commit Release Candidate:**
    - `git add .`
    - `git commit -m "chore(release): prepare release TARGET_VERSION"`

## 5. Final Output & Instructions
1.  Push the release branch: `git push -u origin release/TARGET_VERSION`.
2.  Create PR targeting `main`, wait for CI:
    ```bash
    gh pr create --base main --head release/TARGET_VERSION --title "Release TARGET_VERSION" --body "..."
    gh pr checks <PR_NUMBER> --watch
    ```
3.  Merge PR, tag, and push:
    ```bash
    gh pr merge <PR_NUMBER> --merge
    git checkout main && git pull origin main
    git tag -a TARGET_VERSION -m "Release TARGET_VERSION"
    git push origin TARGET_VERSION
    ```
4.  **CRITICAL — Create release branch from tag + GitHub Release:**
    ```bash
    git checkout -b release/TARGET_VERSION TARGET_VERSION
    git push -u origin release/TARGET_VERSION
    gh release create TARGET_VERSION --title "TARGET_VERSION" --notes "changelog here"
    ```
    - Use `--prerelease` for alpha/beta tags.
    - Group changes by type: Features, Bug Fixes, Performance, Breaking Changes.
    - **Never skip this step.** Every tag MUST have a corresponding GitHub Release and a `release/` branch.

---
**User Request:**
