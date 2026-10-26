# Extraction template editor: interaction decision

## Scope and form structure

Build one create/edit page with React, TypeScript, the existing native/shadcn controls, React Hook Form (RHF), and Zod. No wizard and no new package. Use the existing API and If-Match adapter. This note defines behavior; it does not implement the application or add endpoints.

Show four sections in reading order: template details, extraction instructions, output fields and languages, and optional follow-up. A short template should be completable without opening multiple steps. Keep the primary Save action and Cancel consistently available. While saving, announce progress and prevent duplicate submissions. A failed save keeps every draft value, selected owner label, row order, and expanded section.

On initial load, show a loading state. A failed template load gets a retry action without presenting an empty editor that could overwrite the record. Cancel or navigation with unsaved changes requires an explicit discard decision. Successful save updates the displayed record and baseline from the server response, including the version, and announces success.

## Field decisions

| Field | Control and behavior | Validation / serialization |
| --- | --- | --- |
| `name` | Labeled text input; show the 120-character limit. | Required string, maximum 120. Preserve entered text; do not silently truncate. |
| `description` | Optional textarea with “Internal description; not used for extraction” help. | Optional metadata; never concatenate it into instructions. |
| `prompt` | Base prompt textarea, visibly required on create. | On create, require nonblank text even if an override is populated. Retain its value when the override is active. |
| `system_prompt` | Optional textarea under “System prompt override,” collapsed initially only when empty. | A non-whitespace value takes precedence over `prompt`. Blank or whitespace falls back to `prompt`. No maximum or blocking character counter. |
| `fields` | Ordered editable rows: key input, type select (`text`, `number`, `date`), required checkbox, move up/down and remove buttons; Add field appends. | A nonempty list; each row contains the three contracted properties; keys unique. Preserve order exactly. |
| `languages` | Two labeled checkboxes, English (`en`) and Turkish (`tr`). | At least one selected; only the two allowed values. |
| follow-up enabled | Checkbox or switch labeled “Schedule a follow-up appointment.” | Off on create means omit the optional appointment. Off after removing an existing appointment means send `follow_up: null`. |
| `desk_id` | Allowed-desk select, fetched from `/desks/`. | Required whenever an appointment is being submitted. |
| follow-up date/time and timezone | Labeled date/time control plus explicit IANA timezone; show the zone next to the time. | Must resolve to a valid future instant. Send ISO datetime plus the selected IANA zone. |
| follow-up owner | Searchable, paginated combobox scoped to the selected desk. | Submit opaque `owner_id`, never the display name. Owner must belong to the selected desk. |

Next to the prompt controls, display the effective source: “Using the base prompt” or “Using the system prompt override.” Explain that field definitions and language rules are still appended by extraction. Derive the source from `(system_prompt ?? "").trim().length > 0`; do not invent a separate activation flag or persist a conflicting UI mode. Do not clear either prompt when the effective source changes.

The draft stakeholder suggestion of approximately 2500–3000 characters is not an approved rule. It must not become `maxLength`, a Zod maximum, a save blocker, or silently truncated content. Long overrides remain saveable subject to actual server responses.

Use RHF field-array IDs as rendering keys, separate from editable field keys. Move controls must update both form order and error locations. Allow removing a row but show the list-level error if none remain; focus Add field in that case. After adding a row, focus its key input. Do not sort fields, normalize keys, invent a key syntax, or assume case-insensitive uniqueness. Client duplicate checks use exact string equality; the server remains authoritative for additional rules.

## Permission behavior

Treat `edit_instructions` as a write capability, independent of general access to the template. When absent, show the existing `prompt`, `system_prompt`, and `fields` as readable content with a concise permission explanation. Hide their edit/add/remove/reorder actions. Keep `name`, `description`, `languages`, and follow-up editable.

Do not rely on disabled controls or hidden buttons for authorization. Build the request from an explicit allowlist of writable properties, and enforce the same capability in submit handling. Never include protected properties in a restricted user's PATCH. The API remains the final authority if permissions change while the page is open.

Creation requires a nonblank `prompt` and a nonempty field list. A user without instruction-write permission cannot complete creation through the documented contract. Do not submit a knowingly invalid create request or invent an implicit default. Offer creation only to instruction editors unless an existing, verified server creation path supplies those values without unauthorized writes. Such a path is not established by this fixture.

## Follow-up dependencies and time handling

1. Enabling follow-up reveals desk, time, timezone, and owner. Validate the appointment only when submitting a newly enabled or changed appointment. An unchanged appointment is omitted from PATCH, so an appointment that has since passed does not locally block an unrelated metadata edit.
2. Fetch allowed desks independently of owner search. If loading fails, retain the draft and show Retry in that section. Disable only the unavailable selection and dependent appointment save, allowing unrelated edits through a PATCH that omits the appointment.
3. Until a desk is chosen, owner search is disabled with “Choose a desk first.” Use `/owners/?desk_id=…&search=…`, the API's actual pagination information, and a short debounced query. Do not fetch the whole owner population or filter just the loaded page as if it were complete.
4. On desk change, immediately clear the selected owner, cached search results, pagination, and owner errors. Keep the appointment time and other unrelated values. Announce “Choose an owner for this desk.” Never automatically select a same-named owner.
5. Abort obsolete requests or ignore responses whose desk/query/request identity is no longer current. Pagination appends only to its matching query and deduplicates by opaque owner ID. Expose loading, empty, retry, and load-more states inside the combobox.
6. On edit, resolve the current owner with `/owners/{id}/` so selection survives when its owner is absent from the first search page. Keep ID and label separate. A lookup failure shows the saved selection as unavailable/unverified, preserves its ID in the draft, and offers retry. It does not silently clear the stored appointment. A changed appointment requires a valid owner; an unrelated PATCH can leave the original appointment omitted.
7. Turning follow-up off removes it from validation and submission dependencies. Keep its current local draft so an accidental toggle can be reversed before save. After successfully clearing it, reset that draft. Clearing an existing appointment must send null; omission would preserve it.

Display the existing appointment in its recorded IANA timezone. Do not treat a `datetime-local` string as UTC or let the machine's timezone silently change the instant. Prefer an existing application scheduling/conversion utility if one exists and meets this contract. Otherwise use a small TypeScript/Intl conversion helper with explicit tests and round-trip checks; no dependency is required. A nonexistent local time during a daylight-saving jump gets an inline adjustment error. An ambiguous local time requires choosing between the two displayed offsets before an ISO instant is produced. Validate “future” again immediately before submission; server time validation resolves clock skew.

## Validation and save contract

Keep a typed snapshot of loaded values and their version. On create, submit all required values and allowed optional values. On PATCH, submit only changed, authorized properties. Diff serialized values against the snapshot so changing a control and reverting it is not a change. Keep `fields` ordered and treat a changed field list as a whole value. Send a changed appointment as its complete object plus `desk_id`, not a partial nested object. Do not send a desk without its relevant appointment edit. Reuse the existing If-Match adapter; do not create a second version mechanism.

Zod enforces verified constraints locally: required create values, the name maximum, nonblank create prompt, nonempty ordered field list, field types and booleans, exact duplicate keys, language membership and minimum count, and complete valid appointment values when submitted. On edit, do not force unchanged protected fields or an omitted appointment through new create-only requirements. Do not invent undocumented string limits, key normalization, PATCH prompt restrictions, or a field-count maximum. Surface additional server constraints as returned.

Use local errors after blur and on submit, rather than interrupting every keystroke. Required indicators and help belong to their labels. On invalid submission, show an error summary with links to controls and focus the first invalid field. Controls reference help/errors through accessible descriptions; color alone never carries meaning.

Map 400 errors recursively to RHF paths. For `{fields:[{}, {key:["This key is already used."]}]}`, attach the message to `fields.1.key`; empty objects are placeholders, not errors. Support list-level, field-level, and non-field errors together. Put unrecognized error shapes in the summary rather than discarding them. Keep the submitted field order stable until a response is mapped; disable changes during that request or map against the submitted snapshot before re-enabling edits.

## Failure recovery

| Response / failure | User-visible outcome and next action |
| --- | --- |
| 400 | Retain draft; show field errors beside controls plus non-field errors in the summary; focus the first relevant error. |
| 403 | Retain draft; show that access was denied. Refresh capability/access state before another save. If instruction permission was removed, make those fields read-only and allow a deliberate save of remaining authorized edits; never silently drop edits and announce full success. If access to the record is lost, block saving and retain the draft for copying where access policy allows. |
| 409 | Retain draft and submitted baseline; show that the record changed elsewhere. Fetch the latest record without replacing the draft. Present changed values side by side, including protected values, field order, and appointment. The user explicitly chooses/reapplies their edits over the latest baseline before retrying with its version. Do not automatically retry, overwrite the record, or simply replace If-Match while retaining all old values. |
| 5xx | Retain draft; show a concise temporary-failure message and Retry. Re-enable saving after the response. |
| Network timeout / interrupted connection | Retain draft; explain that the result could not be confirmed. Re-fetch the saved record before retrying. Reconcile with the server baseline; if it already matches the intended save, show success. Do not blindly repeat a create request; use existing request recovery/idempotency facilities only if already supported. |
| Desk / owner request failure | Keep all draft values, show local retry and loading state, and do not turn a failed lookup into “no matching owners.” |

The endpoint saves template and appointment atomically. Use one save operation, one success state, and no second appointment request or compensating delete. A failed save must never produce UI claims of partial template/appointment success.

## Verification plan

Use the application's existing test tools. Add focused tests around payload construction, validation, nested error mapping, async dependencies, and time conversion, with a small set of browser interaction checks. No framework or package change is needed.

- Create with a base prompt, one field, and English; create with an override still rejects a blank base prompt. Whitespace override reports the base as effective. Overrides exceeding 3000 characters are not client-rejected. Description never enters extraction instructions.
- Fields retain meaningful order across edit/save; duplicate keys and an empty list fail; changing a row's editable key does not remount another row. The supplied second-row nested error lands on that row's key. Reordering, removing, and re-adding rows leaves correct error/focus targets.
- No instruction capability: instruction controls are read-only, every editable metadata/language/appointment property still works, and protected properties are absent from payloads even if form state is manipulated. Mid-session revocation preserves edits and gives an honest recovery path.
- Owner search sends the selected desk, search query, and server pagination; late old-desk responses cannot replace current results. Changing desk clears owner. Current owner outside the first page is resolved. Empty results, unavailable current owner, and lookup/pagination failures are distinct states.
- Follow-up off on create omits it; unchanged follow-up on PATCH is omitted; clearing an existing appointment sends null; a changed appointment sends all three nested fields plus desk. Owner from another desk and past time are rejected. Toggling off bypasses hidden appointment errors and toggling back restores the unsaved local draft.
- Time tests cover a normal future instant, machine zone differing from selected zone, daylight-saving gap and overlap, and a time that passes while the form is open. Confirm the submitted ISO instant and displayed zone round-trip.
- Exercise 400 field and non-field errors, 403, 409 with independent and overlapping changes, 5xx, and uncertain network outcome. Every failure preserves values and row order. Conflict recovery preserves unrelated server changes and uses the refreshed version only after reconciliation. Atomic failure shows no partial success.
- Keyboard-only checks cover tab order, field reordering, removal focus, owner combobox search/selection/load-more, validation summary links, and save announcements. Check narrow-screen layout and screen-reader label/error associations.

## Basis and remaining integration details

This decision uses only the provided fixture. Template create/detail URLs, capability source, owner response/pagination shape, current desk hydration, and any existing scheduling utility are not specified. Reuse and verify their actual application contracts during implementation rather than inventing them here. If the edit representation does not expose the existing appointment's desk, obtain that from a supported server representation before allowing an appointment edit; do not infer it from an owner search.

Checks performed for this note: read the complete raw fixture and manually traced its field, permission, dependency, PATCH/null, version, error, and atomicity requirements against the decisions above. No application code, installed skill, package documentation, external reference, browser, or network was consulted. No executable tests or application behavior were run; the verification items above are required implementation checks, not reported passes.
