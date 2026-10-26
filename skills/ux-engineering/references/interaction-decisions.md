# Interaction decision trees

## Input or choice control?

```text
Can the user edit this value in this task and role?
  no -> contextual read-only display, or omit when irrelevant
  yes -> Is the accepted value a verified closed set?
    no -> text / structured input; suggestions may help without restricting it
    yes -> How many may be chosen?
      several -> visible checkboxes or searchable multi-select
      one -> Do users need to see/compare alternatives?
        yes, and they fit -> radios or a clearly labelled segmented choice
        no -> Is search or disambiguation needed?
          yes -> searchable selector with a verified option source
          no -> native/shared select
```

Count is a clue, not a universal threshold. Three unfamiliar, consequential plans usually benefit from visible descriptions; three familiar statuses in a dense table filter can fit a select. A finite numeric range can still be a numeric input when precision matters. Do not replace search text, names, external references, or notes with invented dropdown options. Do not preselect consequential choices, consent, or permissions just to avoid validation.

## Select or combobox?

Use a select when users can scan a stable, manageable list. Prefer a combobox when users know a name to find, the list changes, or there are many similar choices. A search field accepting arbitrary text is different from a closed-set combobox. Explain whether unlisted values are allowed. Reuse the existing accessible pattern; adding a text field inside a select popup does not automatically create an accessible combobox.

## Checkbox or switch?

Ask when the effect happens. A checkbox fits an option submitted with other form values, independent multi-selection, and consent. A switch often communicates an immediate on/off setting; make its saving behavior clear and restore the last confirmed state on failure. Some established design systems use switches within saved settings forms: preserve that documented convention and make the deferred effect explicit. A derived boolean belongs in a status display.

## Where should editing happen?

| Pattern | Fits | Trade-off / failure to prevent |
|---|---|---|
| Inline edit | Small, frequent, low-risk correction | Keep save/cancel, keyboard completion, errors, and row context; avoid invisible commits. |
| Modal | Short, bounded task that temporarily needs focus | Constrained space and focus handling; avoid long multi-entity forms or nested modals. |
| Drawer / side panel | Inspect/edit while keeping a list's context useful | Width and hidden context on mobile; modal drawers still need modal semantics. |
| Dedicated page | Deep account workspace, large form, shareable or revisitable task | Adds navigation; preserve return location, filters, and unsaved-work recovery. |
| Multi-step | Genuine dependencies, distinct stages, high complexity | Adds navigation and state persistence; use one grouped form for short tasks. Do not split every schema section into a wizard. |

Choose by task length, dependency, revisiting and available space. Mobile alone does not mandate a drawer. Dialogs can adapt to a full-height narrow layout. Destructive confirmation should state the actual object, scope, consequence, and recovery; use undo for reversible low-risk actions when practical. Do not invent deletion when only cancellation is supported.

## Table or cards? Pagination or infinite loading?

Use a table for comparing fields across records, sorting, bulk actions and operational scanning. Cards fit heterogeneous content, previews and object-first browsing. A narrow table may use a bounded horizontal scroller with key identity/actions retained, or a concise list; preserve filtering and selection semantics in either representation.

Pagination fits stable admin results, known counts, repeat visits, bulk scope and footer access. Infinite loading fits exploratory feeds where stable page positions matter less. It requires focus/position restoration, an accessible way to load more and reach subsequent content, and honest result boundaries. Never filter only the current page when users expect all records. Reset or reconcile pages on filter changes; do not present an empty high page as “no results.”

For bulk selection, distinguish visible rows from all matching server results. Show selected and eligible totals, the active scope and a clear reset. Offer explicit “select all matching” rather than secretly changing scope on repeated clicks unless the product intentionally specifies and clearly explains that behavior. Confirm destructive actions against that scope.
