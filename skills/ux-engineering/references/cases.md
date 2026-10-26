# Worked cases

These are generalized examples informed by retrieved project history. Exact source limits and historical status are recorded in the repository's research notes. Names, IDs and counts below are synthetic.

## Country code to country name

**Before:** A client form asks the operator to enter a two-letter country code. The API accepts codes, but the user thinks in country names.

**After:** A verified country list supplies names for selection/search. The selected value remains the code in create/edit requests. Clearing is available only if allowed. A legacy unknown code is shown for reconciliation rather than silently discarded.

**Reason:** Recognition reduces recall and invalid input. **Exception:** a free-form territory or expert code-import tool can still need text; a two-character string alone does not establish a country enum.

## Named filters are a workflow

**Before:** A filter component exists but is not rendered. After being exposed as a panel, it still misses the user's goal: named saved tabs.

**After:** A visible New filter action collects a name, conditions and permitted columns. The created tab reapplies conditions to the full server list. Its ownership and persistence match the backend. Where supported, users can find, edit and delete saved views.

**Reason:** Reaching the component is necessary; completing the task matters more than rendering its fields. Do not claim saved persistence if only URL query filtering exists.

## Advanced prompt overrides

**Before:** The backend supports an optional advanced prompt, but the frontend does not explain that it overrides the standard prompt. “Description” is confused with the actual prompt field.

**After:** Keep existing content visible, show an inline warning when the override is active, and preserve any API-required standard field. Verify whitespace behavior and the source of any character limit rather than making the frontend change backend rules.

**Reason:** Cross-field semantics need explanation at the decision point; serializer presence alone does not describe the workflow.

## Compact inner pages

**Before:** Repeated page/card/table titles, a separate search row, oversized controls and large empty panels push useful records below the fold. A short table's capped container leaves pagination floating above unused space.

**After:** Keep one useful title at each level, align related search/filter/actions in a wrapping toolbar, reuse control sizes and group related content. Use the existing full-height table shell where that page calls for one. Retain appropriate mobile spacing, bounded table overflow, visible focus and reachable pagination.

**Reason:** Use the viewport for the task. Removing structure, shrinking text, and fixing every footer to the viewport are not substitutes for a coherent layout.

## Decoration versus state

**Before:** An appointment status uses a rounded colored side border that conflicts with the product's established marker.

**After:** Use the existing straight inset marker with textual status and a separate visible focus style. Match tokens in both themes.

**Reason:** Consistency reduces relearning. A user preference for this product's marker is not a universal ban on rounded borders.

## Permission-aware editing and reusable presets

**Before:** A section opens if any field is writable, then sends other visible read-only fields. A mapping preset can be saved but cannot be selected and applied.

**After:** Gate each editable field and outgoing key; keep allowed edits reachable. Add the supported find/apply/manage path for presets.

**Reason:** Preserve permission semantics and close the reuse loop. An API success on Create proves neither successful editing nor reusable workflow completion.
