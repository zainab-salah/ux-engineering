# Validation record — 26 October 2026

## Automated checks

- Package validator: passed; 51-line core and seven scenario fixtures after the additional design-skill gap review.
- Python tooling tests: five passed, including incomplete-run exclusion and malformed/duplicate grade rejection.
- Node adapter tests: three passed, covering ID/code mapping, omission versus null, unauthorized/malformed writes and draft preservation.
- Grade aggregation: one complete run per condition, six of six criteria each.
- Full skill-authoring validator: passed using an existing project Python runtime with PyYAML. The system and bundled Python runtimes lacked PyYAML; no dependency was installed.

These checks do not validate UX effectiveness or certify accessibility. The synthetic flawed HTML/TSX are evaluation inputs, not production application code.

## Agent pilot

Five independent agents were launched in fresh contexts, with default inherited host model settings and no explicit model override. Prompts constrained baselines to raw fixtures and treatment runs to the skill/relevant references. The outputs are saved beside this report. Complete model revision, token totals and run durations were not supplied in the agent completion notifications and were not reconstructed.

| Scenario | Without skill | With skill | Scoring status |
|---|---|---|---|
| Relationship form | Completed | Completed | Author manually judged 6/6 criteria for each. |
| Complex template | Output written; agent ended with account usage-limit error | Completed | Neither included in the scored comparison; baseline incomplete. |
| Layout audit | Completed | Not run | Saved baseline only; ungraded. |
| CRUD audit | Not run | Not run | Fixture/rubric prepared. |
| Ambiguous fields | Not run | Not run | Fixture/rubric prepared. |
| Pagination workflow | Not run | Not run | Fixture/rubric prepared. |

The completed relationship pair is a **tie** on the chosen six criteria. Both selected suitable controls, preserved wire values, handled paginated relationships/current selection, planned recovery and accessibility, and identified missing edit contracts. The treatment gave more explicit scope/permission and layout verification detail, but that qualitative observation is author interpretation, not a measured improvement. A native country select in the baseline and a searchable country selector in the treatment are both defensible here; the rubric does not force a preferred widget.

The complex-form treatment surfaced a desk-write permission ambiguity explicitly. Its baseline artifact is available for inspection but its run failed at the host level; it cannot establish a fair efficacy comparison. The layout baseline itself found many important problems. That is useful counterevidence against claiming the skill supplies capabilities a capable baseline never has.

## Limits and next evidence

This is an exploratory static-output pilot: one completed pair, one run per condition, author judging without blinding, criteria finalized after execution, no implicit-trigger study, no live app implementation, no browser/keyboard/screen-reader verification and no human usability study. The author had seen historical cases before writing fixtures. Skill references were held stable during the pilot apart from correcting a repository-only example link after evaluation.

No general improvement percentage, user time saving, issue-detection precision/recall, or production outcome is established. To evaluate efficacy, complete all paired cases with frozen criteria, independent blinded judges, repeated runs and actual implementation tasks. Then test representative users and preserve backend regression checks.

## Post-pilot refinement

Impeccable/gpt-taste/Designly source comparison added conditional resilience/scope guidance and scenario 7. Scenario 7 is unrun. Historical pilot scores were not recomputed as evidence for the revised skill; only package/link/tool/adapter checks were rerun. See `docs/research/design-skills-review.md`.

## Executable showcase addition

Added `evals/showcase` with independent baseline and skill-assisted refinement artifacts, frozen source hashes and a predeclared browser protocol. Four new fixture tests bring the Python suite to nine tests (plus three Node adapter tests). Fourteen live HTTP assertions passed across the isolated variants. Browser access remained disabled, so UI acceptance checks/screenshots remain pending. See `evals/showcase/RESULTS.md`; no runtime UI improvement is claimed.
