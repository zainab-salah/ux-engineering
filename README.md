# UX Engineering — UX Best Practices for AI Coding Agents

Help coding agents build interfaces that work well for people, not just connect to an API.

## Why I built this

I kept running into the same problem with AI-generated UIs: the backend was connected, but I still had to explain how a normal interface should work. Use a dropdown here. Make the table filters work across all results. Stop repeating headers. Keep the controls consistent.

After five years of building interfaces, I wanted to put that experience into something reusable instead of giving the same feedback in every project.

## What it helps with

- Choosing inputs, dropdowns and relationship selectors.
- Building complete forms, tables and admin workflows.
- Preserving API rules, validation and permissions.
- Fixing wasted space, repeated headings and inconsistent controls.
- Handling errors, loading states, keyboard access and smaller screens.

Use it before building a feature or to review an existing interface. It works across frameworks, with examples for React, Next.js, TypeScript, shadcn/ui and Django APIs.

## Install

```sh
npx skills add zainab-salah/ux-engineering --skill ux-engineering
```

The installer lets you choose your agent and installation scope. See [manual installation](docs/installation.md) for other options.

## Use

```text
Use $ux-engineering to build this frontend from the API.
Check the workflow and choose suitable controls before writing code.
```

```text
Use $ux-engineering to review this page.
Find usability problems and fix them while keeping the existing theme.
```

## Examples and testing

The [before-and-after demo](evals/showcase/RESULTS.md) includes a customer workspace with 137 synthetic clients. Both versions are available to run. Browser screenshots are still pending.

The first small agent comparison scored equally with and without the skill. I’m keeping the results public rather than claiming an improvement that hasn’t been demonstrated. Read the [test results](evals/results/REPORT.md) or [testing method](evals/METHODOLOGY.md).

## Inside the project

The installable skill lives in [`skills/ux-engineering`](skills/ux-engineering/SKILL.md). Detailed guidance loads only when needed. Research, examples and tests stay outside the installed skill.

[How it works](docs/architecture.md) · [Research](docs/research/landscape.md) · [Structure review](docs/research/structure-review.md) · [Contributing](CONTRIBUTING.md) · [MIT license](LICENSE)
