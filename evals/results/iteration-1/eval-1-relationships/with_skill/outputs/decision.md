# Client create and edit interaction decision

Use one compact form with explicit Save and Cancel actions, reusing the product's existing form and accessible picker components. The operator creates a client or updates an existing client, receives a confirmed saved result, and returns to the originating client context. Entry screen and return route are product assumptions; no application UI was supplied.

## Controls and representation

| Field | Interaction | Contract and payload |
| --- | --- | --- |
| Name | Required labelled text input; explain the 120-character limit. | Submit `name` as a string. The schema requires its presence but supplies no minimum length or trimming rule; do not invent either. Confirm business validation for blank names. |
| Country | Required searchable single-choice control displaying localized country names. Filter the complete catalogue locally. | Load `/countries/` for the current locale; submit its exact `code`, never the label. Only supported catalogue values are selectable. No default is supplied. |
| Owner | Optional searchable single-choice relationship picker, with an explicit “Unassigned”/clear action. Display name and desk to distinguish similar names. | Submit the selected opaque `owner_id`, never the displayed name, search text, or entire user object. No manual ID entry or user creation is needed. |
| Status | Required radio group: New, Contacted, Closed. All three choices remain visible because operators compare them during triage. | Submit exactly `new`, `contacted`, or `closed`. Start creation with no selection: there is no default. Edit starts at the stored status. |
| Sales territory | Optional free-text input. Permit arbitrary labels. | Submit `sales_territory` as text. Previous values may be suggestions, but there is no suggestion endpoint in this contract; do not invent one or restrict input to remembered values. Null is not accepted. |
| Created at | Omit on create; show a formatted read-only timestamp on edit if useful and present in the client read data. | Never send `created_at`. |

There is no declared country-to-owner or desk dependency. Desk disambiguates users; changing country must not clear the owner.

## Loading and owner retention

Approximately 13,000 eligible users rules out downloading the entire list or treating page one as the allowed set. Query `/users/` using its server-side name search and follow pagination (`next`), showing 25 results at a time with an accessible Load more action. Search parameter syntax is unspecified and must be confirmed before wiring requests. Debounce requests and cancel or ignore obsolete responses; changing a query resets its pagination. A later page must never append into a newer query.

Keep the selected `{id, name, desk}` independently of search results, keyed by ID. Paging, clearing search text, and receiving an empty result must not change the selection. Scope cached results to the authenticated permission context and invalidate them when that context changes.

On edit, initialize the form from authoritative client data, then resolve a non-null owner through `/users/{id}/`. This endpoint explicitly supports accessible inactive current owners, who may be absent from the active-user search. Keep such an owner selected and label them Inactive; offer retain, replace, or explicitly clear. Do not insert inactive users into general search results. A detail 404 means “Current owner unavailable,” not unassigned: retain the underlying ID internally without exposing inaccessible identity, and offer replacement or clearing. On transient detail failure show Retry and preserve the stored value. Unchanged owners must remain omitted from a supported PATCH, even if their detail lookup fails.

## Payload and save behavior

- Create with `POST /clients/`: include `name`, catalogue `country`, and an explicitly chosen `status`. Include `owner_id` only after a selection, or `null` after explicit clearing. Leave an untouched optional owner omitted; its create-time default is unspecified, so confirm that behavior before promising the saved client is unassigned. Omit untouched optional sales territory.
- Edit: the description establishes owner semantics for PATCH, but no client read or update operation is defined. Design for a change-only PATCH once the actual route, method, schema, and permissions are confirmed. An untouched owner is omitted; an explicit clear sends `owner_id: null`; a replacement sends its stable ID. Do not turn a failed lookup into null. Confirm omission behavior for every other field rather than assuming the POST schema defines PATCH.
- Build an explicit writable-field payload, preserving untouched draft values and respecting confirmed field permissions. Do not copy a response object into a write. To clear an existing territory, confirm whether empty string is the supported clearing representation; do not silently substitute null or omission.
- Preserve any stored country or status absent from the current allowed values visibly as an unresolved current value. Do not auto-replace it; confirm update rules before deciding whether an unchanged value can be omitted or must be corrected.

## States and recovery

Keep unrelated fields usable while catalogue or owner requests load. Distinguish loading, no search matches, no eligible active users, request failure with Retry, and an unavailable current owner. A failed catalogue load prevents choosing a valid country; it must not become an empty catalogue or a free-text fallback.

During saving, keep the draft and prevent duplicate submission. Map a 400 response to associated inline field errors once its error shape is confirmed; keep a persistent home for non-field failures and focus the first error. For permission or session failure, preserve the draft and follow the established access recovery flow. A timeout has an unknown write outcome: do not automatically retry POST. Reconcile through a confirmed client lookup or supported idempotency mechanism; neither is supplied here. On confirmed 201, show “Client created.” The response body and client URL are unspecified, so opening the saved record is blocked until those are known. Edit success handling similarly depends on the missing update contract.

Use persistent labels, visible requiredness, a fieldset/legend for status, associated errors, and text feedback for async states. Verify picker arrow/Enter/Escape operation, visible focus, and normal text editing. Keep actions reachable at 320 CSS px and 200% zoom; reuse established spacing and theme tokens.

## Essential unknowns and verification

Before implementing edit, obtain the client read/update routes, response schema, operation-specific requiredness, permissions, and owner retention behavior on update. Also confirm lookup search/locale parameters, error shape, create-time owner omission, territory clearing, and a supported way to reconcile uncertain saves. These are contract gaps, not reasons to invent endpoints.

Implementation checks: assert exact IDs/codes and enum payloads; excluded read-only fields; untouched-versus-cleared owner; page-two selection retained after searching; inactive owner resolved by detail; 404/error without silent clearing; stale search responses ignored; unrestricted territory text; failed save retains draft; duplicate clicks and uncertain creation outcomes. Exercise long/duplicate names, empty results, keyboard navigation, focus/error announcements, and narrow-screen reflow in the rendered interface.

Checks actually performed: read the supplied OpenAPI fixture and the skill's backend interpretation, interaction, workflow, and accessibility references; statically cross-checked the decisions against the declared paths and field schema. No application, endpoint requests, browser checks, or accessibility conformance testing were available or performed.
