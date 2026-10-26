# Additional design-skill gap review

Reviewed 26 October 2026 after the initial pilot. Scope: the user-supplied Impeccable 4.6.0 and gpt-taste entrypoints, locally installed Impeccable `operate.md` and `harden.md`, and Designly 4.4.0 director, composition, visual-QA and Arabic/RTL entrypoints. This was source comparison, not execution of their UI/image-generation workflows. No claim is made to have audited every Designly specialist or benchmarked these skills.

## Findings and adopted changes

| Source | Useful contribution | Result in UX Engineering |
|---|---|---|
| Impeccable Operate guidance | Surface purpose, familiar components, restrained state language, structural responsiveness, popup clipping and task-serving motion. | Explicit surface-job distinction; expanded overlay, hierarchy and motion checks. |
| Impeccable hardening guidance | Extreme inputs, translations, RTL, formatted values, slow networks, rate limits, concurrency and gesture interruption. | New conditional resilience reference; localized feedback, mixed-direction data, precise value formatting, keyboard/overlay and slow-network checks. Existing conflict/draft rules retained. |
| Impeccable bounded verification | Batch inspection/correction rather than indefinite polishing. | Bounded verification and explicit unresolved blockers in the core. Further passes remain justified by actual defects. |
| gpt-taste | Attention to button contrast, text wrapping, grid gaps and animation overflow. | Keep contrast/overflow checks, meaningful grouping and representative viewport tests. Preserve DOM/focus order and useful breathing room rather than enforcing dense grid packing. |
| Designly director / visual QA | Explicit constraints outrank inferred taste; inspect actual output; compare edits to the approved source; detect collateral changes. | Record refinement invariants; compare against incumbent UI; check shared callers and scope drift. No typed specialist mesh or mandatory multi-agent orchestration added. |
| Designly composition / Arabic RTL | Hierarchy, intentional negative space, exact copy, mixed-language balance and no naive reversal. | Task-centered hierarchy and native RTL/mixed-direction checks, without importing poster eye-path recipes into forms. |

## Rules intentionally not adopted

The supplied gpt-taste requires simulated randomization, mandatory AIDA, very large section padding, mandatory GSAP, strict heading-line limits and page-wide overflow hiding. These can be harmful defaults for operational interfaces and contradict the user's compact, consistent CRM goals. UX Engineering never claims simulated execution as real testing. A narrow heading can legitimately wrap; the remedy is contextual, not a universal font ban or forced two-line limit. Fix overflow at its source rather than merely concealing it.

Impeccable's references contain contextual prescriptions that must not be copied mechanically: for example fluid type in hardening versus fixed scales in Operate, generic 401 redirects versus an application's established refresh/recovery contract, and skeletons versus spinners. Keep the product/contract-specific behavior. We also do not treat an approximate translation expansion percentage as a guarantee.

Designly primarily directs commercial imagery and campaigns. Poster margins, focal-anchor counts, cultural style generalizations and weighted art scores do not establish app usability or WCAG conformance. Adopt constraint preservation and actual-output review, not its domain-specific scoring thresholds or campaign orchestration.

## Validation status

Added a seventh synthetic scenario covering Arabic/English administration, localized values, overlay clipping, motion and scoped refinement. Its rubric is authored but unrun. The initial pilot outputs/results apply to the prior revision; these additions have package/link/regression validation only. No new behavioral improvement is claimed.

Local source locations (portable publication identifies relative paths and installed versions, not personal filesystem paths):

- Impeccable: `SKILL.md`, `reference/operate.md`, `reference/harden.md`, version 4.6.0.
- gpt-taste: user-supplied `SKILL.md`; version not declared.
- Designly: `skills/designly-director/SKILL.md`, `skills/composition-director/SKILL.md`, `skills/visual-qa/SKILL.md`, `skills/arabic-rtl-director/SKILL.md`, plugin 4.4.0. [Designly plugin](plugin://designly@openai-curated-remote).

No upstream instruction text was vendored. The new reference is an independently written synthesis for this package's narrower workflow.
