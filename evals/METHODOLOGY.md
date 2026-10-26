# Testing effectiveness

## What each check means

1. **Automated package/tool checks:** manifest shape, portable references, valid fixture paths, grade integrity, aggregation and example adapter behavior. These are deterministic engineering checks, not UX scores.
2. **Judged agent behavior:** read the actual output against the case rubric. Accept justified alternatives; require evidence for contract preservation and recovery. State the judge and whether review was blind.
3. **Rendered behavior:** separately run browser, keyboard, zoom, responsive and assistive-technology checks against an implementation. Decision notes alone cannot pass these checks.
4. **Human usability:** representative users attempt tasks; measure completion, mistakes, time and observed friction. This project has not run such a study.

## Reproduce a paired run

Use `evals.json` prompts and raw fixtures. Give an independent agent only the prompt and input artifacts for the baseline. Give a separate agent the identical prompt/artifacts plus the skill path for the treatment. Neither sees research notes, expected outputs, the rubric, other runs or the author's conclusions. Prevent unrelated installed UX skills from loading. Restrict writes to separate output directories.

Record model/host/version/settings, date, available tools, skill content hash, prompt/fixture hashes, output, completion/error status and timing/token data when the host actually supplies them. Do not fabricate absent telemetry. Use fresh contexts and randomize order where the host allows it. Repeat on multiple seeds/runs and models before making comparative claims. Current first-pass runs did not capture all metadata; their evidentiary limits are in REPORT.md.

Run directories follow `results/iteration-N/eval-ID-name/{with_skill,without_skill}/outputs/decision.md`. Keep failures and incomplete outputs; never silently drop them into a success average. Freeze criteria before grading; for future studies, freeze them before execution too. The current pilot rubric was finalized after execution, so it is exploratory and vulnerable to author bias.

## Metrics

| Measure | Method | Important limitation |
|---|---|---|
| Component selection | Judge intent/options/timing trade-offs against the contract; allow multiple defensible controls. | No gold widget based only on type or count. |
| Workflow completeness | Entry → task → save → find/reuse/recover, limited to supported capabilities. | A detailed plan is not a working implementation. |
| Validation/recovery | Check actual handling of field/non-field errors, draft preservation, unknown outcomes and dependencies. | Planned tests remain planned. |
| Accessibility coverage | Count applicable specified and actually tested behaviors separately. | Mentioning ARIA is not a pass for runtime accessibility. |
| Backend preservation | IDs/codes, permissions, requiredness, omitted/null, pagination, immutable history, version semantics. | Must inspect payloads when code is implemented. |
| Audit detection | Against a predeclared issue inventory, count supported true findings, misses and false positives; deduplicate root causes and report severity. | No issue-detection score is claimed for current ungraded audits. |

Use S0–S3 task-impact severity from the skill. For audit studies, report precision/recall by severity only after establishing an independently reviewed issue inventory. Subjective styling preferences are separate. Do not infer a number of “issues prevented” from how many checklist items a note mentions.

`rubric.json` supplies six criteria per scenario. For the relationship pilot, binary judgments and evidence are in `results/grades.json`. Run `python3 scripts/score.py evals/results/grades.json` from the repository root. The aggregator excludes non-complete grades and does not calculate a paired causal effect. Compare equal completed case sets manually; do not compare totals across unequal subsets.

## Negative and ambiguous cases

Case 5 rejects automatic dropdowns for unknown external references and free-form territory; exact numeric priority is not a select; a read-only ID remains copyable. Costly choices require no guessed default. Case 2 tests the danger of inventing a 3000-character backend maximum from an approximate stakeholder note. Missing permissions/actions must be identified without blocking independent work.

The updated case 5 contrasts open territory with an approved closed time-zone catalogue, including edit hydration and null/omission. Case 8 adds startup, real-data, calendar-boundary and sensitive-edit failures. Case 9 tests reference-led work without exporting portfolio aesthetics to operational screens, and rejects performance score gaming or invented private-project evidence. These additions are authored fixtures, not completed agent runs; earlier pilot grades do not evaluate them.

## Suggested trigger evaluation

Positive prompts: “Wire owner assignment from this DRF serializer”; “Audit why this CRUD screen makes users type IDs”; “Fix duplicated admin headings and mismatched shared controls while keeping the theme.”

Negative prompts: “Change the brand logo”; “Optimize a backend-only SQL query”; “Write marketing copy”; “Explain React syntax.” These are authored trigger cases, not measured automatic-discovery results. Explicit invocation was tested in the pilot; implicit trigger accuracy was not.
