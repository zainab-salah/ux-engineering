# UX Engineering — UX Best Practices for AI Coding Agents

Help coding agents build interfaces that work well for people, not just connect to an API.

## Why I built this

I kept running into the same problem with AI-generated UIs: the backend was connected, but I still had to explain how a normal interface should work. Use a dropdown here. Make the table filters work across all results. Stop repeating headers. Keep the controls consistent.

After five years of building interfaces, I wanted to put that experience into something reusable instead of giving the same feedback in every project.

## What it helps with

- Choosing and implementing suitable inputs, dropdowns and relationship selectors.
- Building complete forms, tables and admin workflows.
- Preserving API rules, validation and permissions.
- Fixing wasted space, repeated headings and inconsistent controls.
- Keeping table footers visible while rows scroll inside the table.
- Removing unnecessary descriptions while keeping useful labels and feedback.
- Handling errors, loading states, keyboard access and smaller screens.

Use it before building a feature or to review an existing interface. It works across frameworks, with examples for React, Next.js, TypeScript, shadcn/ui and Django APIs.

## Install

```sh
npx @zainab-salah/ux-engineering
```

Run it from your project. Add `--global` for a personal install. The [installation guide](docs/installation.md) also covers the Skills CLI and manual setup.

## Use

```text
Use $ux-engineering to build this frontend from the API.
Check the workflow and choose suitable controls before writing code.
```

```text
Use $ux-engineering to review this page.
Find usability problems and fix them while keeping the existing theme.
```

## Testing

The project includes realistic form and table scenarios, package checks and recorded agent evaluations. The initial small comparison tied with and without the skill; there is no proven improvement percentage.

[Test results](evals/results/REPORT.md) · [Testing method](evals/METHODOLOGY.md)

## Inside the project

The installable skill lives in [`skills/ux-engineering`](skills/ux-engineering/SKILL.md). Detailed guidance loads only when needed. Research, examples and tests stay outside the installed skill.

[How it works](docs/architecture.md) · [Research](docs/research/landscape.md) · [Structure review](docs/research/structure-review.md) · [Contributing](CONTRIBUTING.md) · [MIT license](LICENSE)
