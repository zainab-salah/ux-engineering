# Project-history research

Research date: 26 October 2026. This is a sanitized synthesis, not a transcript archive. Historical implementation/test statements below describe retrieved conversations and are not fresh verification of those applications. No proprietary source, credentials, customer records, private hostnames or screenshots are distributed.

## Coverage and limits

Reviewed my notes and conversation summaries from recent frontend work, then read the most relevant ones in full; one long CRM history was too large to read completely. A keyword search over locally saved session files produced 114 frontend-related candidate messages. These are search counts, not counts of verified UX defects.

I also checked selected current CRM and Chatbot Manager files to separate what was requested from what the code actually did. The usable recurring evidence is concentrated in those two projects. Local records do not contain every older conversation, so I cannot fully reconstruct every margin or input/dropdown mismatch I remember, and I did not re-review historical screenshots. We do not claim an exhaustive account-wide search or that every proposed correction shipped.

Local reproducibility notes, thread identifiers, selected quotes and source locations are supplied separately from this publishable repository. Public case IDs below link principles to evidence without publishing private conversations.

A later [maintainer-supplied history supplement](history-supplement.md) adds six grouped lessons from three consolidated project summaries. Its secondary-evidence limits are documented separately; it does not expand the original transcript-retrieval claims above.

## Retrieved examples

### H01 — CRM: an unreachable filter builder

1. **Context:** client list with lifecycle tabs and dynamic filtering.
2. **Originally present:** a field/operator/value component and URL/API plumbing, but no rendered entry point; the agent reported this when the user asked how to reach it.
3. **Problem:** code-level integration did not make the feature usable or discoverable.
4. **Agreed/reported correction:** expose filtering in the Clients header; later refine it into named views (H02).
5. **Principle:** trace a real user path, not only component existence.
6. **Prevention:** find the component's rendered callers; verify the visible entry, supported operators, full-result request and outcome.

### H02 — CRM: inline filters versus saved tabs

1. **Context:** the user wanted named filter tabs controlling the entire client table.
2. **Originally implemented:** an inline field-filter panel.
3. **Problem:** the controls could filter but did not provide the named, reusable workspace the user requested.
4. **Agreed/reported correction:** name + conditions → create a saved tab. Personal server persistence was the agent's stated default, not a separately retrieved explicit user choice. A later correction replaced built-in tabs with one fixed All clients tab and saved tabs; the historical case evolved.
5. **Principle:** clarify the object and persistence of the task before building CRUD-shaped controls.
6. **Prevention:** describe completion and next reuse; distinguish query filtering, URL state and a persisted view resource. Verify ownership/sharing rather than treating one historical default as universal.

### H03 — CRM: owner choices without desk context

1. **Context:** owner pickers in filters, create/edit and bulk operations.
2. **Originally present:** two different picker paths without the requested desk grouping.
3. **Problem:** flat owner names lacked the organization context operators used to recognize people.
4. **Agreed/reported correction:** group users under desk headings in both pickers. Current selected-owner code also resolves selected labels separately from the search page.
5. **Principle:** display relationship meaning, submit stable identity, and keep variants consistent.
6. **Prevention:** inspect label fields, duplicate-name context, pagination and every affected caller. Grouping alone does not fix incomplete search.

### H04 — CRM: country names rather than code entry

1. **Context:** client create/edit country field.
2. **Originally present:** the user identified the existing country control as needing a country-name dropdown; the agent said it would replace the field. The exact old markup was not independently recovered.
3. **Problem:** operators should recognize country names rather than remember storage codes.
4. **Agreed/reported correction:** searchable names while continuing to save country codes, reused for editing. The retrieved follow-up establishes the implementation direction, not a complete production acceptance test.
5. **Principle:** separate human labels from wire values.
6. **Prevention:** establish the validated country vocabulary and source, preserve unknown stored values, and round-trip code/label mapping. Do not infer a country enum from any short string.

### H05 — CRM: section permissions lose field semantics

1. **Context:** client ownership/contact editing after field-access integration.
2. **Originally reported by review:** one writable field opened controls for other read-only fields; another section required every field to be writable.
3. **Problem:** valid edits were blocked or the UI offered writes the server would reject.
4. **Agreed/reported correction:** user requested fixes; the final response reported per-field controls and payload gating. Selected current code corroborates these gates.
5. **Principle:** visibility, editability and submission permission are distinct.
6. **Prevention:** test a role allowed to edit exactly one field and inspect outgoing PATCH keys, not merely whether a section opens.

### H06 — CRM: presets saved but not reusable

1. **Context:** import column-mapping presets.
2. **Originally reported:** a Save button created a preset without a list/load/apply/manage path.
3. **Problem:** successful creation did not deliver reuse.
4. **Agreed/reported correction:** after the user requested review fixes, the agent reported save/select/apply/delete, preserving ignored columns. Selected current code contains preset retrieval and apply handling.
5. **Principle:** complete the task lifecycle.
6. **Prevention:** follow create → discover → apply → manage using supported endpoints; do not add unsupported lifecycle operations.

### H07 — Chatbot Manager: prompt override and misleading terminology

1. **Context:** data-extraction template gains `system_prompt`.
2. **Originally present:** backend storage/extraction behavior but no manager field, payload mapping, validation or warning, according to the retrieved analysis.
3. **Problem:** a nonempty system prompt overrides the standard Extraction Prompt, while literal Description is only metadata. Rendering two independent textareas would conceal the dependency.
4. **Agreed/reported correction:** keep existing content and warn that Extraction Prompt is ignored. Create/edit integration, a counter and a 3,000-character UI maximum were reported; the maximum was the agent's interpretation of an approximate request, not proof of a backend limit.
5. **Principle:** verify cross-field behavior and terminology; separate actual constraints from assumptions.
6. **Prevention:** trace serializer and runtime use, preserve required inactive fields, inspect whitespace semantics, and establish a limit before enforcing it as product policy. The evaluation deliberately tests this historical ambiguity.

### H08 — CRM: duplicated deep account content on a client page

1. **Context:** integrating trading accounts, transactions and documents into CRM.
2. **Originally described:** stacked creation history, summaries, details and transactions with oversized empty states.
3. **Problem:** the user reported a broken, duplicated workspace and excessive whitespace.
4. **Agreed/reported correction:** group account information, use a dedicated View account page, tighten the client workspace, and preserve supported transaction actions/history.
5. **Principle:** organize by task and revisitable object, not one full panel per endpoint.
6. **Prevention:** draw the navigation and information hierarchy, review occupied viewport space, and distinguish editable requests from immutable financial history.

### H09 — CRM: too many Refresh buttons

1. **Context:** account/transaction/document workspace.
2. **Originally present:** repeated Refresh controls across sections, challenged explicitly by the user.
3. **Problem:** duplicated actions added noise and made refresh scope unclear.
4. **Agreed/reported correction:** one workspace header Refresh; retain targeted retry/status actions only where their effect differs. The agent reported code/read verification and an unavailable browser check.
5. **Principle:** consolidate equivalent actions; expose distinct recovery actions deliberately.
6. **Prevention:** map each action to the data it updates and compare scope before deleting controls.

### H10 — CRM: bulky controls, unused table space and theme drift

1. **Context:** Clients and Settings/management inner pages.
2. **Originally present/reported:** oversized add/action buttons, inconsistent input/select/button sizes, a capped Users table and content-height wrapper leaving a gap above the footer.
3. **Problem:** the user repeatedly requested compact controls matching the established theme; available space was poorly used.
4. **Agreed/reported correction:** shared size tokens/defaults, remove oversized overrides, reuse the full-height table pattern on affected pages and place pagination at its bottom. Search was separately requested on the same row as Add IP.
5. **Principle:** reuse layout and size contracts across inner pages; reduce avoidable scrolling through structure, not tiny text.
6. **Prevention:** inspect shell/ancestor heights, short and long tables, wrapped toolbars, narrow screens and all shared-control callers. The reported 32 px button is a CRM decision, not a global target.

### H11 — CRM: decorative rounded status border

1. **Context:** appointment cards in narrow calendar columns.
2. **Originally present:** a rounded colored side-border treatment the user rejected.
3. **Problem:** it conflicted with the desired existing marker style; this is primarily an evidenced product preference.
4. **Agreed/reported correction:** straight inset blue/red marker matching the sidebar, with times and identifiers fitting narrow columns. The agent reported browser checks.
5. **Principle:** preserve the product's state language and inspect constrained layouts.
6. **Prevention:** compare with an established component/reference and preserve textual state and keyboard focus. Do not turn this preference into a universal border ban.

### H12 — CRM: duplicated validation wastes vertical space

1. **Context:** client create and import dialogs.
2. **Originally present:** the same error in a large top box and under the input, sometimes alongside a generic failure box.
3. **Problem:** the user said repeated errors consumed too much screen space.
4. **Agreed/reported correction:** field errors under their inputs, one compact place for general failures, and reset stale workbook validation when replacing a file.
5. **Principle:** give errors a useful location without redundant feedback or stale results.
6. **Prevention:** trace one failed submission, count duplicated messages, test long/offscreen errors and verify changed inputs invalidate old results. Long forms may still need a compact linked summary.

### H13 — Chatbot Manager: lookup-first limits hide existing settings

1. **Context:** company calling limits.
2. **Originally present:** the user had to search/select a company before seeing its configured limits.
3. **Problem:** existing configured companies and their settings were not immediately visible.
4. **Agreed/reported correction:** configured-company table first; Create selects a company without settings; Edit opens that company's settings with company fixed.
5. **Principle:** design around the object operators manage, not the API's lookup parameter.
6. **Prevention:** establish whether the task is finding existing configuration or creating a new one; test the first screen against that goal.

### H14 — CRM: duplicated dropdown labels and hidden bulk scope

1. **Context:** import/export filters and multi-page table selection.
2. **Originally reported:** “All domains” supplied by both a shared clear option and page options; selection feedback did not express selected out of total.
3. **Problem:** repeated labels and unclear selection scope made state harder to interpret.
4. **Agreed/reported correction:** remove duplicate options at the source and show selected/total counts. Other retrieved requests specified multi-select filters and a page/all-results selection cycle.
5. **Principle:** one owner for synthetic options; make filter and selection semantics explicit.
6. **Prevention:** inspect component-injected options, distinguish labels from values, verify OR within a filter versus AND across filters, and show page versus all-matching scope. Do not silently generalize a two-click selection cycle to other products.

## Added requirements without a fully recovered historical implementation

The user explicitly requested checking repeated headers, horizontal placement, excessive margins and whitespace, input-versus-dropdown reasoning, theme consistency and screen sizes in this skill. Specific supporting history exists above for grouping, toolbar placement, compact controls, duplicated content and empty panels. We did not establish every exact historical margin/header change; the new rules and synthetic layout fixture are authored requirements, not invented past resolutions.
