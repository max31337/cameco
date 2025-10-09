# Copilot Instructions for AI Feature Planning (GitHub Issues)

## Overview
This project uses AI-assisted feature planning with GitHub Issues. Each issue has a corresponding `.aiplans/ISSUE-<number>.md` file for tracking phases, progress, and clarifications.

## When working on a GitHub issue (e.g., #42):

### 1. Initialize or Read the Plan
- If starting fresh: `pwsh ./scripts/init-plan.ps1 -IssueNumber 42`
- If continuing work: Read `.aiplans/ISSUE-42.md`
- Always check for unanswered questions in the "Clarifications" section

### 2. Planning File Structure
The plan file **must** include:
1. **Summary** - What the issue aims to achieve
2. **Acceptance Criteria** - Measurable success criteria
3. **Phased Plan** - Breakdown of implementation phases with status
4. **Progress** - Real-time updates (checkboxes or ✅ markers)
5. **Questions / Clarifications** - Outstanding questions for user
6. **Test Plan** - Unit, integration, and manual testing steps
7. **Related Issues** - Links to dependent or related issues

### 3. Development Workflow

<!-- **Phase-by-Phase Implementation:** -->
- ⚠️ **NEVER** delete old information; append updates
- ⚠️ **ALWAYS** confirm open questions before implementation
- ⚠️ **WAIT** for user validation before moving to next phase

**After each phase:**
1. Update the Progress section with ✅ markers
2. Commit with conventional commit format:
   ```
   feat(#42): complete phase 1 - setup API routes
   ```
3. Push changes and wait for validation

**After final phase:**
1. Generate comprehensive test plan
2. Add QA handoff notes
3. Clean up temporary artifacts
4. Update status in plan file

### 4. Commit Message Format
Use conventional commits tied to issue numbers:
- `feat(#42): add user authentication endpoint`
- `fix(#42): resolve validation error on login form`
- `docs(#42): update API documentation`
- `test(#42): add integration tests for auth flow`

### 5. Worktree Support
For parallel development on multiple issues:
```bash
git worktree add ../issue-42 feature/issue-42
git worktree add ../issue-43 feature/issue-43
```
Each worktree has its own `.aiplans/` directory with relevant issue plans.

### 6. Automation
- **On Issue Open**: GitHub Action creates basic plan template
- **On PR Open/Update**: Plan is posted as comment to issue
- **On PR Merge**: Plan is archived to `.aiplans/archive/`

### 7. Best Practices
- Keep plan files under 30KB (use `./scripts/check-plan-size.sh`)
- Archive completed plans: `mv .aiplans/ISSUE-42.md .aiplans/archive/ISSUE-42-$(date +%Y%m%d).md`
- Never store sensitive data (API keys, passwords) in plan files
- Use `sync-aiplans.ps1` to bulk-create plans for all open issues

### 8. Security Notes
- `.aiplans/` directory is `.gitignored` - plans are local only
- Plans are posted to GitHub issues only via PR workflow
- Archived plans should be reviewed before sharing externally

---

**Quick Reference Commands:**
```powershell
# Create plan for issue #42
pwsh ./scripts/init-plan.ps1 -IssueNumber 42

# Sync plans for all open issues
pwsh ./scripts/sync-aiplans.ps1

# Check plan file sizes
bash ./scripts/check-plan-size.sh
```ion Instructions

Each GitHub issue has a local `.aiplans/ISSUE-<number>.md` file.
This file contains the full feature plan, clarifications, and progress notes.

When working on an issue:

1. Read `.aiplans/ISSUE-<number>.md`.
2. If clarifications are unanswered, ask questions first.
3. Only begin implementation once the “Phased Plan” is complete and approved.
4. Use the file to record progress and mark phases complete.
5. After completion, update Test Plan and add a link to the PR.
6. Archive the file when merged.

Never store sensitive data in `.aiplans/`. Files are `.gitignored`.
