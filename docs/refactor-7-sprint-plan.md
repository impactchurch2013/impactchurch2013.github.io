# Refactor Sprint Plan (7 Sprints)

This tracks the remaining major refactor as larger, deliberate chunks.

## Sprint 1: Entry Infrastructure Hardening
- Consolidate entry mode handling (`legacy` vs `standalone`) in shared entry helpers.
- Keep `login.html` and `directory.html` default behavior unchanged (legacy redirect).
- Ensure standalone test shells use shared `index` link generation utilities.
- Status: completed.

## Sprint 2: Standalone Diagnostics Consolidation
- Keep standalone probes read-only.
- Consolidate diagnostics orchestration and status handling.
- Reduce duplication across directory standalone diagnostics.
- Status: completed.

## Sprint 3: Login Standalone Parity Expansion
- Add safe, read-only parity probes in login standalone mode.
- Validate auth readiness, auth state, and minimal auth UI parity checkpoints.
- Keep standalone guarded by `loginMode=standalone`.
- Status: completed.

## Sprint 4: Directory Standalone Read-Only Runtime Slice
- Move first real directory runtime slice into standalone mode (read-only).
- Load member list and render a minimal directory preview without edit actions.
- Keep legacy redirect as default fallback.
- Status: completed.

## Sprint 5: Shared Runtime Extraction from `index.html`
- Pull remaining setup/runtime blocks out of `index.html` into entry/runtime modules.
- Minimize inline boot logic and keep thin delegating wrappers.
- Preserve existing `window.*` compatibility surface during transition.
- Status: completed.

## Sprint 6: Entry Activation + Routing Cleanup
- Enable standalone runtime behind explicit mode switches and test gates.
- Align URL routing/canonical behavior for login and directory pages.
- Remove transitional duplication once parity is verified.
- Status: completed.

## Sprint 7: Final Cutover + Verification
- Promote multi-page runtime path to primary path.
- Keep rollback option briefly, then retire legacy bootstrap path.
- Execute full smoke checklist and update docs.
- Status: ready for verification.
