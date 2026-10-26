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

## Full-height table pages: visible footer, scrolling rows

For operational dashboards and admin lists, use a viewport-fitted shell by default when this matches the product's working table pages. Keep the page header, filters/actions and footer/pagination visible. The rows scroll inside a bounded middle region; users should not need to scroll the whole document to reach the next-page controls. Preserve the available table height when filters, panels or navigation change.

Inspect the full ancestor chain: viewport shell → page area → table panel → scroll wrapper → rows. Each shrinking flex/grid ancestor needs an appropriate minimum size, commonly `min-height: 0` and `min-width: 0`. Reuse the existing full-height table component rather than adding a second page shell. Do not put a new `100vh` region below an existing app header; account for the shell's actual available space, using dynamic viewport units at the shell boundary when appropriate.

The structural pattern is:

```text
Viewport-fitted application shell
  Header / navigation                    stays visible
  Page area                              fills remaining height
    Title / filters / actions            stays visible
    Table panel                          grows and can shrink
      Table scroll wrapper               overflow: auto; min-height: 0
        Table headings / rows            rows scroll here
    Pagination / page footer             stays visible, outside scroller
```

Keep semantic table markup inside a scrolling wrapper; `overflow` on a table element itself is not a dependable shell. Sticky column headings can remain inside that wrapper so they stay aligned during horizontal scrolling. Give a keyboard-scrollable region an appropriate name/focus path where needed. Menus must escape the scroller through the established portal/top-layer pattern rather than being clipped by it.

This is a layout allocation, not a fixed overlay: the footer occupies its own row and must not cover data, focus or validation. Short/empty/loading/error tables should still place it consistently at the panel bottom. On narrow or very short screens, zoom or a virtual keyboard may make the full stack impossible to fit. Adapt the toolbar and allow a deliberate fallback scroll path so every control remains reachable; never conceal overflow or shrink text to force the pattern. Reading pages, long forms and marketing pages may correctly use normal document flow.

Verify with enough rows to overflow: scroll to the last row and back, while confirming that the toolbar and footer remain in view. Also check a few rows, no results, page-size changes, wrapped filters, narrow/short viewports, zoom and keyboard focus. Record which region actually scrolls and whether the footer is visible; a desktop screenshot alone does not prove this behavior.

## Borders and themes

Use the product's semantic neutral borders and its established selected/active indicator. A colored side strip or rounded rainbow border is not a universal improvement. If a user requests a straight status marker, preserve its meaning and add text/icon state where color alone would be ambiguous. Keep keyboard focus visible: removing a decorative outline must not remove the only focus indicator.

Theme changes should apply to input surfaces, select popups/portals, menus, disabled states and overlays consistently. Reuse motion tokens; avoid animating every property, layout shifts or staggered theme updates. Respect reduced motion.

## Review matrix

Check a narrow mobile viewport, a medium viewport, a wide viewport, zoom/reflow, long labels and both supported themes. Useful starting widths are 320, 768 and 1440 CSS pixels, adjusted to product breakpoints; these are tests, not hardcoded layout targets. Check:

- No page-level sideways overflow; a two-dimensional table may use its own scroll region.
- No clipped dropdown, trapped field, overlapping sticky action, or unreachable pagination.
- On full-height table pages, the footer/pagination stays visible while rows scroll internally; short/empty states retain the same footer position.
- Short and long tables, empty and error content, open selectors and dialogs.
- Related controls share size/alignment; spacing is intentional at each breakpoint.
- Repeated titles and error messages are removed without losing context.
- Compact controls remain operable: WCAG 2.2 target size (minimum), spacing and exceptions still apply. Do not enshrine one project's 32 px control height as a universal rule.

Visual style mismatches are usually low severity. Escalate when they hide controls, obscure state, block a task, or force substantial repeated scrolling. Record personal preference as preference rather than a standards violation.
