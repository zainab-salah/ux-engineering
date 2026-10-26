# Extraction template editor decision

## Outcome and evidence boundary

Supervisors create or edit a reusable extraction template, optionally schedule one follow-up appointment, and save both in one atomic endpoint operation. Use one grouped form, with Save and Cancel, in the existing application shell. Do not introduce a wizard, package, new form framework, or visual redesign. A dedicated editor route is a reasonable proposed container for a long field list; reuse the existing editor container if one exists and accommodates it.

This note uses only the synthetic contract and the supplied UX Engineering skill and references. No application source, nearby screen, actual component API, lookup response envelope, or rendered UI was supplied. The interactions below are decisions; existing routes, labels, adapters and shared components must be inspected before implementation. API facts below are verified fixture facts, not verified live behavior.

Entry should be the existing template list's Create/Edit action. Initialize edits from the saved record and its version; do not initialize an edit with empty fields while loading. Keep return context. On confirmed save, show the saved name and a persistent saved state, then return to or link to the template's existing location. Reuse is only complete when users can find and apply the saved template in the existing extraction workflow. That discovery/application route is not provided: locate it and verify it; do not invent an apply endpoint or claim that flow exists.

## Field and payload decisions

| Data | Interaction | Contract and write behavior |
|---|---|---|
| `name` | Labelled single-line text, required, with 120-character limit feedback | Required string, maximum 120. Do not manufacture a uniqueness rule. |
| `description` | Optional textarea in template details | Explain “For reference only; not sent to extraction.” No invented maximum. Preserve existing blank/omission behavior through the adapter. |
| `prompt` | Labelled textarea, “Base instructions” | Required and nonblank on create even when system instructions are active. Keep its draft available and editable for authorized users when overridden; show that it is currently inactive. Do not auto-fill it with copied system instructions or dummy text. |
| `system_prompt` | Optional textarea in an “Override instructions” disclosure | A non-whitespace value replaces the base prompt used by the worker. Explain that field definitions and language rules are still appended. When stored content is active, expose that state outside the disclosure and open it initially. Clearing to blank restores base-instruction use. Preserve both drafts while switching. |
| `fields` | Ordered repeatable rows: key input, type select (`text`, `number`, `date`), Required checkbox, Move up/down, Remove; Add field after the list | Required nonempty list; unique keys; order preserved. Use RHF field-array stable row identities independent of array index and domain key. Serialize only `{key,type,required}` in displayed order; never send UI row IDs. Do not invent a key naming convention or additional maximum. |
| `languages` | Required fieldset with English and Turkish checkboxes | Nonempty subset of `en`, `tr`; display labels, submit exact codes. No unapproved default or “all languages” option. |
| `follow_up` | “Attach follow-up appointment” checkbox within the saved form, revealing one grouped appointment section | Optional object or null. Enabling requires complete appointment data; disabling an existing appointment means explicit removal on Save. Show that consequence beside the checkbox; retain its draft if re-enabled before saving. |
| `desk_id` | Select from allowed desks returned by `/desks/`; use a searchable shared selector if the observed list is too large to scan | Required with a follow-up. Show desk names, submit stable IDs. No invented default, manual relationship ID entry, or create-desk action. Resolve the current value from supplied record data or the allowed list; do not assume a desk-detail endpoint. |
| `follow_up.scheduled_at`, `.timezone` | Labelled date and time fields plus visible, editable timezone; show the resulting zone/offset before save | Submit a verified ISO datetime representing the selected instant plus the IANA zone. Future time required. A browser-local date/time input alone is insufficient. Reuse the existing date/time adapter and timezone control if available; otherwise an IANA-zone text field is possible, with clear guidance and authoritative server validation. Do not silently assume the browser zone, reinterpret an existing appointment, or silently normalize an invalid/ambiguous DST time. |
| `follow_up.owner_id` | Shared accessible, single-choice server-search picker, enabled once a desk is selected | Search `/owners/?desk_id=…&search=…`; follow actual pagination. Display names and approved distinguishing context, submit the opaque ID unchanged. Text typed into search is not a valid selection. Resolve the current selected owner through `/owners/{id}/` when needed. |

The stakeholder's “around 2500–3000 characters” is unapproved guidance, not validation. Neither a 3000-character cap nor truncation is permitted. A nonblocking character count is optional; it must not imply a server limit. `system_prompt` has no backend maximum. Check its active state using non-whitespace detection without rewriting the stored text. Preserve user text unless a verified adapter convention requires normalization.

For field keys, use exact duplicates in the submitted key strings for immediate feedback; server key normalization/case rules are unspecified. Do not silently trim or case-fold keys. Empty-key constraints beyond the provided string contract must be verified, not invented. New rows may begin incomplete, but an incomplete required type or key must not be silently replaced by a default. Row removal/reordering is local until Save. After removal focus the next useful row or Add field; after Add focus the new key. Keyboard Move up/down provides reordering without drag-only interaction.

## Permissions and form ownership

Use the application's verified permission source. `edit_instructions` gates writes to all three of `prompt`, `system_prompt` and `fields`; it is not a page-wide edit gate. Without it, name, description, languages and permitted follow-up editing remain usable. Show restricted instructions/fields read-only only if the read contract permits their disclosure. Do not load forbidden information merely to render it disabled. Explain the instruction-edit restriction once when useful.

Construct an explicit writable payload, never spread the fetched record. Restricted instruction values must be omitted even if present in RHF state. Hidden inputs and client-side disabling do not replace API enforcement. Reconcile a permission change during editing before retrying; retain the draft, but never resend newly forbidden values.

Two contract gaps require a targeted implementation check:

1. Can a supervisor without `edit_instructions` create a template when create requires writable `prompt` and a nonempty `fields` list? No server-provided default or clone capability is documented. Do not offer a create flow that submits forbidden instructions; existing-template editing can proceed independently.
2. Is `desk_id` writable for that role? The fixture permits editing `follow_up` but names only name/description/languages/follow_up as its writable fields. Do not infer permission to change `desk_id` from the existence of `/desks/`. Until verified, show an existing desk as context and support same-desk appointment edits where permitted; a new or changed desk for this role is blocked. Authorized instruction editors still follow the endpoint's verified desk permission.

## Dependencies and persistence

Keep the last loaded record/version separate from the dirty draft. Background refetch must not replace dirty inputs. Use existing RHF/Zod resolver and controlled shared components; use Zod for known contract constraints and RHF errors for server responses. Form state should distinguish unchanged/omitted values from explicit clearing.

On PATCH, send intended writable changes. Omitting `follow_up` preserves it; removing a saved appointment sends `follow_up: null`. If absent originally and still absent, omit it. When the appointment changes, send the complete valid nested object unless verified endpoint semantics support a partial nested update. Include required desk context when follow-up is present through the existing adapter. Do not send hidden stale appointment values after removal. Do not infer that `null` clears `description`, `system_prompt`, or `desk_id`; null-clearing is only documented for follow-up. Confirm create omission/blank conventions through the adapter rather than translating optional blanks to null globally.

Changing desk invalidates the owner's known eligibility. Immediately mark the owner as needing selection, clear it from the submission-ready value, and show “Choose an owner for this desk.” Preserve all unrelated inputs. Retain the previous owner label as explanatory context if helpful, never as a silently valid submission. Scope owner search/cache by desk, query, page and permission context. Cancel or ignore prior-desk/prior-query responses. Do not let a late response restore an old owner.

Keep `{id,label}` for the selected owner independently of search pages; searching or advancing pages must not lose that selection. Resolve existing owners absent from the first page using the documented detail endpoint. Distinguish loading, no matching owners, no eligible owners, lookup failure and access denial. Offer scoped Retry for transient lookups; do not automatically clear or replace an inaccessible saved owner. Unchanged unrelated edits should preserve the saved follow-up by omission where allowed; appointment changes require a confirmed eligible owner. An unavailable existing desk similarly needs a visible unresolved state, not a substituted default.

When follow-up is disabled, its conditional requiredness is inactive and its section can collapse. Re-enable restores its local draft and revalidates the date, desk and owner. The future-time check must run again at submission because a once-valid appointment can become past while editing. Reuse a verified conversion mechanism; test DST gaps and overlaps. An overlap needs an explicit offset/occurrence decision or must be blocked with correction guidance, not guessed. The server remains authoritative for current time and desk membership.

## Validation and save recovery

Validate on the existing form's interaction cadence, then validate all applicable fields on Save. Name is required and at most 120; create prompt is nonblank; fields nonempty and keys unique; types limited to the contract; languages nonempty and only `en`/`tr`; enabled follow-up complete, future, with IANA zone and a selected eligible owner/desk. Preserve all typed input after any failed save. Do not impose a new nonblank-prompt PATCH rule without verifying update validation.

For the nested response `{fields:[{}, {key:["This key is already used."]}]}`, map the second row's error to `fields.1.key`. Keep row order stable during an in-flight save, or retain the submitted index-to-row-ID mapping so a late response cannot attach errors to another row. Apply the same principle to follow-up errors. Expand disclosures containing errors, associate inline text with controls, and focus the first invalid field or a compact linked summary when several errors are offscreen. Put non-field and unmapped server errors in one persistent form-level region.

| Save result | Required behavior |
|---|---|
| Pending | Prevent duplicate submissions and clearly show Saving. Keep draft visible. Freeze payload-affecting edits while pending, or use an explicit submitted snapshot; do not accidentally report later edits as saved. |
| Success | Only after a confirmed response, adopt the confirmed record/version, clear dirty status, and show persistent Saved feedback. Atomicity means appointment and template succeed together; no separate owner/appointment mutation is needed. |
| 400 | Map field/nested errors; show non-field errors; keep the draft. Do not turn an outage into an input error. |
| 403 | Show access denied, preserve draft, and use established session/permission recovery. Do not retry unchanged unauthorized writes automatically. |
| 409 | Preserve draft and submitted version. Fetch latest through the existing read flow and offer review/reconciliation of changes before retrying with its current version. Never silently replace the draft or blindly resend with a fresh version. |
| 5xx / connection failure | Show a persistent scoped failure and recovery action. A failed/absent response can leave the write outcome uncertain. Re-read the record to establish whether it committed before retrying an edit; do not assume failure. |
| Unknown create outcome | Do not blindly repeat POST or claim safe deduplication. No idempotency key, unique-name rule or creation-status endpoint is provided. Check existing supported reconciliation, and if it cannot identify the created record, explain the uncertainty and direct the user to inspect the template list before an explicit retry. Name equality alone is not proof. |

Use the current version through the existing If-Match adapter; do not create a second concurrency mechanism. Protect dirty navigation using the application's existing leave-without-saving pattern. This plan guarantees in-session draft preservation on failure, not persistence across reload or sign-out; no draft-storage capability was supplied.

## Layout and accessibility

Use one page title, then compact Details, Instructions and fields, Languages, and optional Follow-up sections. Avoid repeated title cards. Use existing semantic tokens, shared size variants and both supported themes. Let key/type/required/actions form rows on wide screens and stack labelled controls on narrow screens while preserving their semantic order. Keep long keys, textareas, lookup labels and error messages within the page width. Do not use a sticky Save bar that hides errors or the mobile keyboard unless the existing pattern is verified.

Provide persistent labels, visible requiredness, language fieldset/legend, named row actions (“Move field X up”, “Remove field X”), visible focus, inline `aria-invalid`/error associations, and a polite save/search status region. Search loading should preserve useful confirmed content; avoid announcing every keystroke. Verify the actual shared owner picker supports its accessible name, expanded state, active/selected option, arrows, Enter, Escape and normal text editing. Pagination/Load more must be keyboard reachable and honest about result boundaries. No automatic focus jump during remote searching.

## Implementation scope and verification

Reach the create/edit entry points, editor form and nested rows, date/time and relationship adapters, permission-aware payload builder, If-Match/error mapping, and existing template discovery/application flow. Reuse existing transport, lookup pagination and form primitives. Inspect their callers before changing a shared control. No app code is requested or written here.

Focused acceptance checks to implement/run:

1. Create with only base prompt; create with active system prompt plus nonblank base prompt; reject blank base prompt on create. Switch override off/on without losing either draft. Save system instructions longer than 3000 characters without a client cap. Confirm description never enters extraction instructions and appended field/language rules are explained correctly.
2. Add/remove/reorder fields and confirm serialized order, stable row identity and no UI-only IDs. Duplicate the second row key and confirm server error lands on that row. Check an error arriving after an attempted reorder cannot target the wrong field. Keep at least one valid field and at least one language at submission.
3. Exercise each permission profile. Verify forbidden instruction keys are absent from requests while permitted metadata/follow-up edits work. Resolve create and desk-write gaps before enabling those paths; verify server still rejects forged forbidden writes.
4. Verify PATCH omission preserves follow-up, explicit null removes it, re-enable restores the local draft, and saving a changed follow-up supplies all required data in one request. An unrelated metadata edit must not clear an inaccessible saved appointment.
5. Change desk during an owner search; return responses out of order; verify only current-desk results appear and no old owner is submitted. Search beyond the first page, preserve selection across searches/pages, resolve an existing selected owner through detail, and exercise loading, empty, no matches, forbidden, unavailable and transient failure states.
6. Test future/past boundary at Save, UTC/date rollover, existing appointment round trip, timezone change, DST nonexistent and repeated local times. Verify submitted ISO instant and IANA zone agree and the displayed appointment is not shifted unexpectedly.
7. Exercise 400 field/non-field errors, 403, 409 reconciliation, 5xx, timeout-after-commit, and repeated Save. Confirm draft preservation, correct version use, no silent overwrite and no automatic duplicate creation. Verify success reflects a confirmed stored state and the saved template can be found and applied through the actual reuse flow.
8. Render short and long templates at 320, 768 and 1440 CSS pixels, zoom/reflow, long labels, both themes, open selectors and all error states. Check keyboard-only row operations, focus/error announcement, picker controls, touch target spacing, contrast and no hidden controls or page-level horizontal overflow. Use available automated accessibility checks plus manual keyboard and assistive-technology checks; do not claim conformance from component choice.

Checks actually done: read the complete fixture, SKILL.md, and its backend-to-UX, interaction, workflow/feedback, layout, accessibility and frontend-integration references; checked this plan against the supplied contract, including nested error indexing, permissions, override precedence, omission/null, atomic save and version/conflict behavior. No repository inspection, code execution, live API, browser, keyboard, timezone runtime or accessibility test was performed. All acceptance checks above remain planned work.

Skipped app implementation, new dependencies, speculative endpoints, a wizard and an invented instruction-length limit. Material risks are the unresolved create/desk-write permissions, unknown reuse route, date/time adapter behavior and absent documented create-outcome reconciliation.
