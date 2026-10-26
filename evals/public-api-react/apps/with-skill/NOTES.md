# Shelf product manager (skill-guided revision)

React + TypeScript + Vite frontend for the DummyJSON products API (https://dummyjson.com/docs/products).

```sh
npm install
npm run dev          # http://127.0.0.1:5173
npm run typecheck && npm test && npm run build
```

Node 20+ is fine (tests run on Vitest, so the Node 22.18 type-stripping requirement of the baseline is gone).

## Skill references used

`.agents/skills/ux-engineering/SKILL.md` (Design mode for the changes, then Audit mode on the result), plus:
`references/audit.md` (severity rubric, checklist), `interaction-decisions.md` (select vs combobox, modal, table vs cards, pagination),
`workflows-and-feedback.md` (state contract, drafts, error placement, unknown outcome), `layout-and-consistency.md` (duplicate headings, shared control system, narrow viewports),
`accessibility.md` (labels, error association, dialog focus, combobox), `backend-to-ux.md` (contract to control mapping), `frontend-integration.md` (RHF/Zod/library guidance).
`cases.md` and `resilience-and-scope.md` were not needed (no RTL/i18n/motion scope).

## Contract evidence (DummyJSON)

| User task | Contract evidence | Interaction decision |
|---|---|---|
| List/browse | `GET /products?limit=0` returns all 194 items | Client-side search/filter/sort/pagination across the full set (not just a page) |
| Pick a category | `GET /products/category-list` returns slugs (closed set, ~24) | Searchable combobox, label = humanised slug, submitted value = slug; in-use categories not in the list are kept selectable |
| Create | `POST /products/add` returns a placeholder id, nothing stored | Marked "Local only", keyed by client UUID, told so before and after saving |
| Edit | `PUT /products/:id` simulated; local products have no server record | Local products never call PUT (would 404); edit is local |
| Delete | `DELETE /products/:id` returns isDeleted but nothing is removed | Confirmation states the real effect; hidden locally; Undo toast |

## Dependencies added and why

| Package | Why |
|---|---|
| `@tanstack/react-query` | Server state: caching, loading/error/retry for products and categories (replaces hand-rolled effect + abort + attempt counter); mutation lifecycle. |
| `react-hook-form` + `zod` + `@hookform/resolvers` | Form state, touched/dirty tracking, focus-first-invalid, one verified schema (price/stock regex avoids `Number("")` = 0 pitfalls). |
| `@radix-ui/react-dialog`, `react-alert-dialog` | Accessible modal/alert dialogs: focus trap, inert background, focus return, `role=alertdialog` for delete. Replaces native `<dialog>` with hand-written focus code, and (unlike top-layer `<dialog>`) keeps toasts visible. |
| `@radix-ui/react-popover` + `cmdk` | The shadcn combobox composition: searchable category selector with listbox semantics and keyboard support. |
| `sonner` | Toasts with an action (Undo), live-region announcements, stacking; replaces the single hand-made toast. |
| dev: `vitest`, `jsdom`, `@testing-library/react`, `/dom`, `/user-event`, `/jest-dom` | Component tests for form recovery behaviour; Vitest also runs on Node 20. |

Not added: a CSS framework, a table library, a router (one screen), a form-less select library for filters/sort (native `<select>` is the right control for 5 fixed options).
Install note: `@hookform/resolvers` has an optional peer (`effect`) that conflicts with an unrelated optional peer tree under npm's strict resolver; the committed lockfile installs cleanly with plain `npm install` (verified in a clean directory), but fresh dependency additions needed `--legacy-peer-deps`.

## Before / after

| Area | Baseline | Now | Why |
|---|---|---|---|
| Shell/headers | Sidebar with fake workspace switcher and user, topbar breadcrumb "Products", eyebrow, h1 "Products.", tagline, catalog h2 "Product catalog", subtitle, "Demo mode" pill, demo banner, "Connected to DummyJSON" card (demo/save notice repeated 4 times) | One slim header, one `h1`, one-line summary, one demo notice | Duplicate headings/notices, non-functional controls; table was pushed below the fold |
| Overview | 4 large stat cards before the table | Summary line + stock filter counts | Table visible on first screen |
| Stock navigation | Sidebar nav + stat link + filter chip | Single segmented control with counts (`aria-pressed`) | One way to do one thing |
| Category (form) | `<select>` of categories derived from loaded products | Searchable combobox over `/products/category-list`, keyboard-only verified | 24 similar options; closed set from the API |
| Category (filter) | Native select (different look from inputs) | Same combobox with "All categories" | Control consistency |
| Controls | Mixed heights/paddings per component | Shared `.control` token (40px height, border, focus) for input/select/combobox/buttons | Layout-and-consistency guidance |
| Validation | Single generic banner ("Choose a category and enter a valid price..."), native `required` | Per-field messages next to fields, `aria-invalid` + `aria-describedby`, first invalid field focused, price/stock strict | Errors name the problem and correction |
| Failed save | Error banner at the bottom of a long dialog | Error banner at top of dialog, focused and announced, draft kept, button becomes "Try again" | Visible recovery, no lost work |
| Double submit | Disabled button only | Disabled fieldset + in-flight guard (tested) | Enter-key / repeat-click safety |
| Close with edits | Closes silently, losing the draft | Inline "Discard your changes?" when dirty | Lost-work prevention |
| Simulated writes | Footer text "Saved in this browser"; banner | Stated before create, in each success toast (create/update/delete wording differs), persistent notice, "Reset local changes" | User knows what really happened and can return to the server catalog |
| Created IDs | Fake API id shown as `#id`-style data | Created items show "Local only", never use the fake id for requests | DummyJSON repeats the same placeholder id |
| Delete | Confirm only, "cannot be undone" | States real effect, error stays in dialog with retry, **Undo** toast | The server did nothing, so undo is honest |
| Narrow screens | Hidden sidebar + hamburger, 8 columns of small 7-9px text in places | Category/status/stock folded into the product cell under 760px, stacked toolbar, full-screen form dialog under 560px, no page-level horizontal overflow (checked at 375px) | Reflow, legible type |
| Typography/fonts | Google Fonts `@import`, 7-12px text in many places | System font stack, 12-15px | No render-blocking third-party request; legibility |
| Data layer | `useEffect` fetch + manual abort/retry | TanStack Query | Caching, retry, cancellation |
| Tests | 3 node tests of pure helpers | 22 Vitest tests: overlay/undo semantics, saved-product identity, schema, pagination, form recovery/double-submit/discard | Behaviour added needs tests |

Endpoints are unchanged for CRUD (`GET /products?limit=0`, `POST /products/add`, `PUT /products/:id`, `DELETE /products/:id`); one extra read, `GET /products/category-list`, feeds the form's category list.

## Checks actually run

Node v20.19.5.

| Check | Result |
|---|---|
| `npm install` (clean directory, from package.json + lockfile) | OK |
| `npm run typecheck` (`tsc --noEmit`, includes tests) | 0 errors |
| `npm test` (Vitest + jsdom) | 2 files, 22 tests passed |
| `npm run build` | Succeeded; JS bundle 524 kB (162 kB gzip), Vite warns about the 500 kB chunk limit |
| Manual browser check (Vite dev server, in-app browser at ~800x600 and emulated 375x812) | Loaded 194 products; opened Add dialog; combobox search + Enter selection by keyboard; inline price error with focus moved to the field; simulated network failure on POST kept the draft, showed the top error and "Try again", retry succeeded and added a "Local only" product with toast; delete confirm + Undo on a local product; observed `DELETE /products/1` and `PUT /products/2` requests for API products; no page-level horizontal overflow at 375px; edit dialog fills the screen at 375px |

## Known limits / not verified

- No automated accessibility tooling (axe, Lighthouse) was run and no screen reader was used; accessibility is based on Radix/cmdk semantics, explicit labels/ARIA, and the manual keyboard pass above. No conformance claim.
- Combobox is covered by manual checks only, not by unit tests (cmdk/Popover under jsdom is brittle).
- Only Chromium-based in-app browser; no Safari/Firefox, no real touch device, no 320px or zoom/reflow check, no dark theme (light only).
- Filters, sort and page are not in the URL, so reload/back resets them.
- Overlay is per-browser localStorage; local edits cannot be reconciled with a changed server catalog (DummyJSON data is static, so not an issue here).
- Row selection/bulk actions, image upload and category management are out of scope (no API support for the last two).
- Bundle is a single 524 kB chunk (no code splitting).
- DummyJSON rejects nothing in practice (writes always succeed), so server-side validation error shapes were exercised only through a simulated network failure.
