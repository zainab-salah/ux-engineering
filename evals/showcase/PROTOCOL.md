# Before/after implementation protocol

This is a sequential improvement case study, not a controlled causal benchmark. A fresh baseline agent receives the brief and API contract without the skill. Its HTML artifact is frozen. Another fresh agent receives the same brief/contract, that baseline artifact and the skill, then improves a copy. The second agent has an existing implementation to work from; additional context and effort can explain differences. No deliberate defects are inserted into the baseline.

The common fixture supplies 137 synthetic records, 41 paginated owners, stable IDs/country codes and deterministic failures. Conditions use isolated in-memory API datasets. No real data, credentials or external services. Restart resets state. The local server is demonstration infrastructure, not a production backend.

Freeze these acceptance checks before looking at either artifact:

1. Initial count reflects all 137 records; page changes fetch the server and show different rows.
2. Searching Zulu finds the end-of-dataset target, including after starting from a later page.
3. Status and country filters combine on the server; a zero-result query differs from a failed request.
4. Owner choices display human labels/context and can reach an owner absent from the first server page.
5. Editing hydrates a selected owner outside page one without silently clearing it.
6. A valid create/edit submits country codes and stable owner IDs, without read-only response keys.
7. A simulated failed save retains draft values, displays an actionable error and permits recovery.
8. Primary controls have accessible names; native/custom selectors and dialogs support keyboard operation and sensible focus.
9. At 390 px width there is no page-wide horizontal overflow and main actions remain reachable; table-only horizontal scrolling is acceptable.
10. At 1440×1000, the landing introduction does not force excessive scrolling before workspace controls; redundant headings/actions and control-size consistency are reviewed separately as judgments.

Checks 1–7 are functional browser/network observations where feasible. Check 9 uses DOM geometry plus a screenshot. Check 8 is partial keyboard/name inspection, not screen-reader or WCAG certification. Check 10 is an author judgment with screenshots; no invented usability score. Record pass/fail/not tested separately and preserve failures. No runtime claim comes from static code alone.

Use identical viewport, data seed and screenshot framing for both. Capture desktop and narrow screenshots and a failure/relationship state if useful. Cite actual observed behavior and requested payloads. Do not repair a failed baseline after freezing; common infrastructure defects can be fixed and documented for both. Freeze revised output before evaluation, too. Record artifact hashes and agent limitations. Do not infer general effectiveness from this one sequential demonstration.
