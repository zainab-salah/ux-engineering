# Existing skills and standards

Reviewed 26 October 2026. Comparison is of available source text, not a benchmark of those projects. No claim is made that this is a unique or exhaustive market category. The skill is independently written; upstream source files are not redistributed.

| Skill / inspected source | Useful coverage | Boundary relevant to this project |
|---|---|---|
| [ui-form-design](https://github.com/narenaryan/agent-skills/blob/f31bf0bccae3e4f35c4df3e80ea948dfbe13cfaa/skills/ui/ui-form-design/SKILL.md) | Concise form-control, autocomplete, defaults and error guidance. | Does not supply a contract-tracing workflow. Its broad finite-set/select and summary/default advice needs context: precise numbers can be inputs; short forms need not repeat every error; consequential choices may need no default. |
| [ux-selection-controls](https://github.com/Uxcel-Lab/product-skills/blob/main/ux/components/selection-controls/SKILL.md) | Choice structure, selection count and effect timing guide controls; discusses contextual alternatives. | Strong overlap in component reasoning. Does not establish operation-specific serializer writes, permission-scoped lookup pagination or label/payload adapters. We avoid making its numerical thresholds or radio defaults universal. |
| [ux-usability-foundations](https://github.com/hueyexe/frontend-agent-skills/blob/2841c079dd8a9c634882227194dc42e25227710d/ux-usability-foundations/SKILL.md) | Task fit, affordances, feedback, recovery, states and critique. | Already treats usability as behavior. Our narrower addition is evidence from backend contracts and checking preserved write/filter semantics, with fixtures and an explicit evaluation record. |
| [forms-inputs-checkout](https://github.com/hueyexe/frontend-agent-skills/blob/2841c079dd8a9c634882227194dc42e25227710d/forms-inputs-checkout/SKILL.md) | Form sequencing, validation, dependencies, server errors and accessible implementation. | Considerable overlap; not merely styling advice. It does not center a repeatable DRF/OpenAPI-to-decision evidence table or relationship lookup contract as this package does. No general superiority is claimed. |
| [shadcn-agents-component-selector](https://github.com/Impertio-Studio/shadcn-ui-Claude-Skill-Package/blob/f261ed24ba8c702ede7acad1cdd270934584ee19/skills/source/shadcn-agents/shadcn-agents-component-selector/SKILL.md) | Interaction-family decision tables and specific component alternatives with reasons. | Library-specific and refers to companion skills/version assumptions. We stay portable and use installed APIs. Our decisions also trace data, permissions, workflow completion and existing layout conventions. |

Source retrieval: four files fetched from public GitHub at the pinned commits above. The selection-controls file was read through the web tool at its main-branch raw URL; its exact commit was not established. Failed raw-path guesses were excluded. The comparison concerns the inspected root instructions, not every supporting file or future version.

## The practical gap

General UX skills already explain recognition, error prevention and control trade-offs. This skill connects those principles to evidence that coding agents can inspect: operation → serializer/schema rule → user meaning → interaction → payload invariant → verification. A second recurring gap is preserving an existing operational design system across inner pages instead of generating a new card, control scale or header for each integration. These are narrow, testable workflow choices rather than claims to invent UX theory.

## Standards used

- [Agent Skills specification](https://agentskills.io/specification): directory-based package, required name/description frontmatter, optional resources and progressive disclosure. Our portable core has no tool/server dependency.
- [Codex skill guidance](https://learn.chatgpt.com/docs/build-skills) and [OpenAI's skill-authoring guidance](https://developers.openai.com/plugins/build/skills): a recognizable task boundary, concise entry instructions, conditional references and representative positive/negative tests. Local installed skill-creator guidance was also read.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): testable accessibility criteria. This project targets relevant criteria; it does not certify applications.
- [APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and [modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): keyboard/focus behavior for custom controls.
- [WAI form notifications](https://www.w3.org/WAI/tutorials/forms/notifications/): accessible error and status feedback.
- [DRF serializer fields](https://www.django-rest-framework.org/api-guide/fields/) and [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html): interpreting accepted/read-only/nullable values and operation contracts. OpenAPI 3.1.1 is the fixture's chosen version, not a claim that it is the latest OpenAPI release.

Recognition rather than recall, consistency, visibility of system state and error prevention/recovery are the organizing interaction principles. Decision notes must still explain why a principle applies to this task instead of citing it as an automatic rule.

Additional requested comparison: [Impeccable, gpt-taste and Designly](design-skills-review.md), including adopted gaps and conflicting rules intentionally excluded.
