# ServiceDesk before/after implementation case study

## What was built

Two executable HTML artifacts share the same synthetic API and brief: a compact landing section and customer workspace with 137 clients, 41 paginated owners, search/filter/sort, pagination, details and create/edit. The baseline was produced independently without this skill. A second independent agent used UX Engineering to refine a copy, preserving the visual identity and API semantics. The author did not insert defects into the baseline or redesign it to exaggerate the difference.

Run from the repository root:

```sh
python3 evals/showcase/server.py
```

Then open `http://127.0.0.1:8765/baseline/` and `http://127.0.0.1:8765/with-skill/`. Keep the same viewport and restart the server before comparison to reset isolated in-memory data. This fixture is local-only and has no authentication or persistence. Do not deploy its server as a production API.

## Observed source changes

| Area | Baseline source | Revised source | Evidence status |
|---|---|---|---|
| Reopening an editor while details load | Late responses can populate a subsequently opened form. | Lifecycle tokens and open-state checks reject obsolete results. | Static code finding; runtime race check pending. |
| Editing during Save | Inputs remain active while the submitted snapshot is pending. | Controls lock during submission and recover on failure. | Static code finding; runtime check pending. |
| Paging during requests/search debounce | Navigation remains active and can advance against pending results. | Paging disabled while pending; search invalidates obsolete results immediately. | Static code finding; runtime check pending. |
| Country setup failure | Create remains reachable without loaded country options. | Create is gated on successful setup, retaining retry. | Static code finding; runtime check pending. |
| Dialog/error context | Visible titles and messages lack some programmatic associations. | Dialog title and inline error associations added; table scroller named/focusable. | Static inspection; keyboard and screen-reader check pending. |
| Primary action hover | Generic hover overrides the primary background. | Accent background retained, plus minor narrow-layout wrapping. | CSS inspection; rendered contrast/layout check pending. |

The baseline already includes server-wide filtering, paginated owner search, human labels, country-code/owner-ID submission and failed-save draft retention. These are **not** claimed as improvements supplied by the skill. This is not a dramatic visual makeover: the meaningful changes concern state, interaction and resilience.

## Checks and limits

- Both inline scripts passed `node --check`; expected API variants were checked.
- Four automated server-fixture tests cover dataset scale, valid/invalid writes, read-only rejection and label/wire separation.
- Live API checks are recorded separately in `api-checks.json` when actually executed.
- Browser attempts returned “Local browser use is disabled in Work settings.” No screenshots, browser task passes, mobile geometry, keyboard or measured contrast results are available. All ten predeclared browser acceptance checks in PROTOCOL.md remain **not tested**.
- Source hashes are in `artifacts.json`. Neither artifact was repaired by the author after freezing.

This sequential case study cannot isolate the skill's effect from a second pass and additional context. One implementation per condition, no blinded judging or real-user test. No improvement percentage, task-time saving or WCAG conformance is claimed. Browser verification and matching screenshots are required before presenting it as a completed visual before/after demonstration.
