# Layout, density and design-system continuity

Reduce avoidable scrolling by removing duplication and using the available space well. Do not reduce readability, touch access or task clarity to make a screenshot shorter.

## Inspect the established product first

Compare a nearby list page, detail page and edit form. Find the shared shell, title/breadcrumb, action bar, table container, field, input, select, dropdown trigger, button and feedback primitives. Identify tokens for control heights, padding, spacing, radius, border, focus, typography, dark/light themes and transition timing. Extend the common owner of a mismatch and inspect its callers; scattered page overrides create future drift.

Use one primary page title. A breadcrumb, page title, card title and table caption should not all repeat the same words. Keep section headings when they genuinely orient the user. Remove redundant headings and wrappers, not semantic labels or accessible table names. Avoid decorative cards around each small field group just because the schema has nested objects.

## Use horizontal space deliberately

- Put related search, filters, counts and actions in a shared toolbar when they fit. Use grouping and alignment so unrelated actions do not look connected.
- Let controls wrap in a meaningful order at narrower widths. Test long translations and keyboard focus order, not only English labels at one width.
- Align input/select/button baselines, heights and label/helper rows using the shared size variants. An input and a dropdown should belong to the same system even when their internal mechanics differ.
- On detail pages, group related account information in one compact workspace. Move a deep revisitable account task to a dedicated page instead of stacking every endpoint's full output on the client page.
- Avoid excessive top/bottom padding, repeated empty-state panels, arbitrary minimum heights and oversized headings in operational screens. Keep breathing room where it supports scanning.

## Inner-page height and pagination

Inspect the full ancestor chain when a short table leaves a gap or a footer floats in the middle: viewport shell → page area → table region → scroller → pagination. In a flex layout, an existing pattern such as `flex: 1` with `min-height: 0` may be appropriate; do not blindly use `100vh` inside a shell that already includes a header.

For a full-height operational table, let the table region fill the available space and place pagination consistently at its bottom. For a content-length page, normal document flow may be correct. Do not add fixed footers that cover rows, validation messages or the mobile keyboard. Keep horizontal table scrolling scoped to the table, not the whole page.

## Borders and themes

Use the product's semantic neutral borders and its established selected/active indicator. A colored side strip or rounded rainbow border is not a universal improvement. If a user requests a straight status marker, preserve its meaning and add text/icon state where color alone would be ambiguous. Keep keyboard focus visible: removing a decorative outline must not remove the only focus indicator.

Theme changes should apply to input surfaces, select popups/portals, menus, disabled states and overlays consistently. Reuse motion tokens; avoid animating every property, layout shifts or staggered theme updates. Respect reduced motion.

## Review matrix

Check a narrow mobile viewport, a medium viewport, a wide viewport, zoom/reflow, long labels and both supported themes. Useful starting widths are 320, 768 and 1440 CSS pixels, adjusted to product breakpoints; these are tests, not hardcoded layout targets. Check:

- No page-level sideways overflow; a two-dimensional table may use its own scroll region.
- No clipped dropdown, trapped field, overlapping sticky action, or unreachable pagination.
- Short and long tables, empty and error content, open selectors and dialogs.
- Related controls share size/alignment; spacing is intentional at each breakpoint.
- Repeated titles and error messages are removed without losing context.
- Compact controls remain operable: WCAG 2.2 target size (minimum), spacing and exceptions still apply. Do not enshrine one project's 32 px control height as a universal rule.

Visual style mismatches are usually low severity. Escalate when they hide controls, obscure state, block a task, or force substantial repeated scrolling. Record personal preference as preference rather than a standards violation.
