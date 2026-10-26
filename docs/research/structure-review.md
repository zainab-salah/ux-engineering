# Structure and guidance review

Reviewed 26 October 2026 against the [Agent Skills specification](https://agentskills.io/specification), [Anthropic's skill template](https://github.com/anthropics/skills/blob/main/template/SKILL.md) and [skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md), [Vercel's React skill](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md), and [OpenAI's Playwright skill](https://github.com/openai/skills/blob/main/skills/.curated/playwright/SKILL.md). Sources were read; this is a structural review, not an endorsement or performance comparison.

## Assessment

The package follows the standard structure. `skills/ux-engineering/SKILL.md` has name/description metadata and a concise workflow. Supporting references are loaded for specific decisions; Codex UI metadata is optional. The installed skill does not depend on research notes or evaluation tooling. Keeping repository-level examples, tests and research outside the skill is appropriate.

| Area | Comparison | Assessment / correction |
|---|---|---|
| Entry point | All inspected skills use SKILL.md with name and trigger description. | Present and validated. Preserve the stable `ux-engineering` identifier. |
| Progressive disclosure | Vercel routes to focused rule files; the specification permits references/scripts/assets. | Focused references are appropriate; no need to copy Vercel's generated catalogue or introduce extra folders without purpose. |
| Useful instructions | Strong skills identify when to act, operational constraints and observable verification. | Design/audit modes, contract invariants, permission boundaries and contextual control choices are concrete. Avoid rigid widget-count rules. |
| Portable paths | Supporting files must travel with the skill. | All local skill references resolve inside the package. Repository examples are optional and explicitly separated. |
| Evaluation | Anthropic's creator recommends real tasks, baselines and observable assertions. | Fixtures and actual outputs exist; small samples, incomplete runs and untested browser behavior remain limitations. |
| Reader experience | Repository documentation should support adoption without loading the full research process. | The original README was too dense. Replaced it with a short explanation, installation, usage and links; detailed evidence remains available. |
| Distribution | Common catalogues use an existing installer and skill folders. | Added a one-command GitHub Skills CLI route. A separate npm package is optional; its prepared tarball has a strict allowlist. |

## Naming and discoverability

Published examples use short descriptive identifiers such as `web-design-guidelines`, `frontend-design` and `vercel-react-best-practices`. The standard requires lowercase names that match their skill folders. Keep repository/skill name **ux-engineering**; use the human-readable README title **UX Engineering — UX Best Practices for AI Coding Agents**. The description names the actual tasks: API integration, forms, tables, workflows and accessibility.

[GitHub topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics) provide explicit discovery categories. Add relevant topics without promising popularity or keyword-ranking gains. Neither a name change nor a longer list of keywords proves usefulness; inspect activation on real tasks.

## Remaining quality gaps

- The initial paired score tied. Broader independent runs and real user tasks are needed to establish effectiveness.
- Source/build checks must not be presented as browser or usability success.
- Automatic invocation accuracy, screen-reader behavior and npm registry publication are not established by this structure review.

No private work-project source is needed for any of these improvements.
