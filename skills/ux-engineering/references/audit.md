# Audit mode

## Evidence and severity

Each finding needs: location; user/task; trigger; observed behavior; consequence; severity; evidence type (code, browser, contract, or hypothesis); smallest correction; backend invariant; verification. Mark inference and missing evidence. Report a clean inspected scope when no meaningful issue is found.

| Level | Task impact | Example |
|---|---|---|
| S0 Critical | Data loss, unauthorized exposure/action, or similarly serious harm supported by evidence | Cross-tenant relationship choices reveal private records. |
| S1 Major | Core task cannot be completed, or likely wrong outcome with no reasonable recovery | Required relationship accepts guessed IDs; failed saves discard a long draft. |
| S2 Moderate | Task remains possible with substantial avoidable effort, confusion or repeated errors | Preset can be saved but cannot be applied; global search covers only one result page. |
| S3 Minor | Local friction or consistency issue with limited task impact | Redundant heading, inconsistent control padding without clipping. |

Severity depends on consequence, frequency and affected users, not on how much code changes. A decorative border is not automatically S1; the same border concealing keyboard focus may block keyboard users. Record subjective preference separately. Avoid counting the same root issue once per caller.

## Structured checklist

- **Intent and reachability:** Does the flow support the requested job? Is there a visible entry point? Can saved objects be found and reused? Are detail links real and return paths preserved?
- **Contract and controls:** Confirm enums, lookup sources, IDs/labels, read/write distinctions, nullable/omitted/blank semantics, array cardinality and hidden conditional values. Keep search/free text where valid values are open.
- **Relationships:** Search the full eligible set, preserve selections outside the current page, disambiguate labels, handle unavailable records, and reconcile parent changes.
- **Workflow:** Check required/optional sequence, progressive disclosure, override warnings, partial permissions, destructive scope, undo/recovery, and duplicate-submit prevention.
- **Tables and filters:** Verify server filtering, sorting, page reset, counts, URL/return state, multi-value operators, full-result selection scope and stale selection reconciliation.
- **Layout and consistency:** Check shared page shell, one useful title per level, aligned toolbar items, compact shared controls, purposeful spacing, short-table footer position and responsive wrapping. Avoid repeated empty panels that push useful content below the fold.
- **Feedback:** Separate initial loading, updating, no data, no matches, forbidden, errors, success and unknown outcome. Avoid multiple identical errors or Refresh controls. Preserve drafts on failure.
- **Accessibility:** Labels, keyboard, focus, semantics, status announcements, contrast, touch and zoom. Test open menus and dialogs, not only the closed default screen.
- **Resilience and scope:** For relevant tasks, inspect RTL/mixed-direction text, localized values, long translations, open popup clipping, virtual keyboards, slow/rate-limited requests and purposeful motion. Compare refinements against the original scope; preserve copy and unrelated behavior. Read [resilience-and-scope.md](resilience-and-scope.md).
- **Regression boundary:** Check create/edit/filter/bulk and mobile variants touched by shared controls. Preserve payloads, validation, permissions and backend audit/history semantics.

## Deliver and correct

Lead with the highest-impact findings, each tied to evidence. Include verified-good behavior when it limits a claim. In report-only work stop at recommendations. When fixes are requested, change the shared cause, verify the affected user path, and report which findings remain unresolved. Do not quietly turn a layout audit into a rewrite.
