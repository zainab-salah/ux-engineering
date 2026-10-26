# Public API React case study

Date: 26 October 2026. API: https://dummyjson.com/docs/products. DummyJSON supplies synthetic product data and simulates writes without persisting changes. No real work-project code or customer data is involved.

## Baseline prompt

> Build me a React frontend to manage products. Integrate https://dummyjson.com/docs/products for CRUD.

The independent baseline agent receives only that product request plus execution constraints: assigned directory, runnable React build, no skill/reference loading, no publication, and parent-owned browser capture. It chooses its own libraries and implementation. The author does not seed defects or give a UX checklist to the baseline.

## Skill-assisted pass

After the baseline is frozen, another fresh agent receives a copy, the same product task, the installed UX Engineering skill and the user's additional instruction to follow frontend best practices and use established libraries when they solve a concrete problem. The extra review pass, implementation context and best-practice instruction are confounders: this is a demonstration, not an isolated causal estimate of the skill.

Record version/hashes, source changes, chosen dependencies, actual checks and failures. Preserve the baseline artifact unchanged. Freeze the revised artifact before evaluation. Do not turn a failed runtime check into a static pass or invent screenshot results.

## Acceptance observations

- Fetch actual API products/categories and distinguish loading, failure, empty and no-match states.
- Search/filter/sort/page across the intended result set without misrepresenting local versus server scope.
- Choose meaningful controls for categories, text, prices and stock; retain accepted API representations.
- Complete create/edit/delete with confirmed response feedback and explicit simulation/persistence semantics.
- Preserve drafts after a failed mutation; prevent accidental duplicate submissions and ambiguous success.
- Handle local-only created IDs without pretending they are durable server records.
- Keyboard labels/focus and responsive data/action access on desktop and narrow viewports.
- Reuse appropriate React/server-state/form primitives without adding packages merely for a checklist.

Source/build/unit tests, live HTTP tests, browser interactions and human judgments are reported separately. Identical viewport/data framing is required for paired screenshots. Automatic accessibility scans and manual keyboard inspection do not establish full WCAG conformance. Live API catalogue contents can change; record the observation date rather than hardcoding counts into claims.
