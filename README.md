# UX Engineering

An AI Agent Skill for translating backend functionality into usable frontend interactions.

An API-connected form can still ask users to type database IDs, hide useful options, repeat headings, waste vertical space or omit the steps that make a feature useful. UX Engineering gives coding agents a focused workflow: inspect the contract, understand the task, choose the interaction, preserve backend behavior, then verify the result.

## Why I built this

I kept running into the same problem with AI-generated UIs: the API was connected, but the interface still needed several rounds of correction. Tables, filters, dropdowns and forms worked technically, yet missed things I would expect from a normal website.

After five years of building interfaces, I was repeating the same feedback about how people actually use them. I started turning those decisions into a reusable skill so I could carry that experience into each project instead of explaining it again.

## What it does

- **Design mode:** choose controls and workflows before implementation, with contract evidence and trade-offs.
- **Audit mode:** inspect existing forms, tables and admin screens; rank usability problems by their effect on users.
- **Backend translation:** reason about enums, relationships, validation, permissions, system fields, nested objects and omission versus clearing.
- **Product continuity:** reuse page shells, compact controls, theme tokens and state language. Reduce redundant headers, repeated actions and avoidable scrolling; keep toolbar items horizontal when space allows and wrap deliberately.
- **Feedback and accessibility:** plan keyboard/focus behavior, validation, loading, empty, failure, success and recovery states.

The skill is framework-independent, with practical React/Next.js, TypeScript, Tailwind, shadcn/ui, RHF/Zod and Django/REST guidance. It is neither a theme generator nor an automatic schema-to-form renderer. It does not require those libraries or any remote service.

## Install

From this repository's root, copy the self-contained skill into a project's Codex skill directory. The command refuses to overwrite an existing installation:

```sh
mkdir -p /path/to/your-project/.agents/skills
test ! -e /path/to/your-project/.agents/skills/ux-engineering && cp -R skills/ux-engineering /path/to/your-project/.agents/skills/
```

For personal installation, use `~/.agents/skills` as the destination instead. Other Agent Skills-compatible tools may use different discovery directories; follow their documentation. The portable manifest is `SKILL.md`; `agents/openai.yaml` supplies optional Codex UI metadata. Restart/reload the agent's skill discovery as required by the host. This project has not installed the skill globally for you.

## Use

```text
Use $ux-engineering in design mode. Inspect the client serializer,
lookup endpoints and existing form. Choose the create/edit interactions,
preserving IDs, validation and permissions, then implement the agreed scope.
```

```text
Use $ux-engineering in audit mode on the Clients workspace.
Check relationship controls, filtering, pagination, redundant headers,
spacing, theme consistency and failure recovery. Report evidence and severity.
```

Example decision: a country field backed by a verified code catalogue displays country names and submits codes. A free-form sales territory remains text. A large owner relationship uses server search and retains the selected label outside the current result page. Three consequential alternatives may need visible choices with no guessed default.

Explicit user instructions and repository conventions take precedence. The skill supports a brief note for a small change; it does not mandate a large design document for every input.

## Evidence and current validation

The research synthesized **14 sanitized historical cases** from accessible CRM and Chatbot Manager work. Coverage limits and distinctions between user correction, agent report and current code are documented in [history research](docs/research/history.md). An [additional design-skill review](docs/research/design-skills-review.md) covers Impeccable, gpt-taste and Designly. The [landscape review](docs/research/landscape.md) compares the five requested skills and primary standards without claiming to have invented their UX principles.

Seven synthetic scenarios cover relationships, complex forms, CRUD audits, layout, ambiguous controls, paginated bulk workflows, and multilingual scoped refinement. One completed independent paired scenario was manually graded: **6/6 criteria both with and without the skill**. This is a tie, not evidence of a performance improvement. Other saved outputs are partial or ungraded; no user study, live application benchmark or accessibility conformance test was performed. See [results](evals/results/REPORT.md) and [methodology](evals/METHODOLOGY.md).

## Before and after: a working customer workspace

The [ServiceDesk case study](evals/showcase/RESULTS.md) uses a real local API fixture with **137 synthetic clients and 41 owners**. One agent built the landing page and table workspace without the skill; another used the skill to improve a copy.

The revised code addresses editor races, pending-state controls, failed setup and accessibility associations while keeping the original design. Both versions and the [test protocol](evals/showcase/PROTOCOL.md) are included. Browser verification and screenshots are still pending, so this is a source-level demonstration, not a measured UX improvement.

## Repository

```text
skills/ux-engineering/  Installable skill and focused references
docs/research/         Sanitized history and existing-skill comparison
docs/architecture.md  Decision workflow and boundaries
docs/portfolio.md     CV and LinkedIn descriptions
examples/             Executable contract-boundary example
evals/fixtures/       Synthetic schemas and flawed UI examples
evals/results/        Actual agent outputs and evidence-backed grades
scripts/              Dependency-free package validation and grade aggregation
tests/                Tooling and adapter regression tests
```

## Run checks

Requires Python 3.10+ and Node.js 18+. The development checks use their standard libraries; the installed skill needs neither runtime.

```sh
python3 scripts/validate.py
python3 -m unittest discover -s tests -p 'test_*.py'
node --test tests/client-patch.test.mjs
python3 scripts/score.py evals/results/grades.json
```

The validator checks this package's expected frontmatter, portable local references and evaluation fixtures. It is intentionally not a complete YAML/Agent Skills validator or a usability scorer. CI runs the same checks. The adapter example demonstrates IDs/codes, omission/null and write permissions; it is not production-ready form infrastructure.

Contributions: [CONTRIBUTING.md](CONTRIBUTING.md). License: [MIT](LICENSE). Source: [zainab-salah/ux-engineering](https://github.com/zainab-salah/ux-engineering). No release or registry listing has been created.
