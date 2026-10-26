# Create and edit client: decision note

Basis: the supplied synthetic service-desk contract only. The create request is specified; the edit transport and client read endpoint are missing, so the edit design below assumes the stated PATCH omission semantics without inventing an endpoint.

## Form and controls

- **Name:** labelled text input, required, maximum 120 characters. Show the limit and a useful error near the field. Do not silently truncate or invent a minimum beyond the contract; clarify how empty and whitespace-only names are treated.
- **Country:** required native select populated from the complete supported catalogue. Start create with an unselected prompt; store and submit `code`, display `label`. A two-character string alone is insufficient: it must be a supported code. Cache by locale; changing locale updates labels without changing the selected code. Do not substitute an arbitrary global country list.
- **Owner:** optional searchable combobox with one selection and an explicit “Clear owner” action. Search users on the server, show name and desk to disambiguate duplicate names, and store the opaque ID unchanged. A dropdown containing 13,000 users, a free-text name field, and a numeric-ID input are inappropriate. Support keyboard navigation, announced loading/results/errors, an accessible label, and selection independent of text being typed.
- **Status:** required radio group containing New, Contacted, and Closed. Keep all three visible because operators compare them during triage. Create has no preselection; do not infer status from position or label. Submit the exact enum value. Edit retains the saved status until deliberately changed.
- **Sales territory:** optional text input. Suggestions may enhance it if a supported source is provided, but must never restrict typing or require a match. Preserve the entered label rather than converting it into an ID. Do not block shipping on an unspecified suggestions API.
- **Created at:** omitted from create input; optionally shown as read-only information in edit. Never included in write payloads.

Keep visible required markers and field-level messages linked to inputs. Put a submission error summary above the form, move focus to it or the first invalid field, and retain the draft after failures.

## Loading and relationship resolution

Load countries independently from owner searches. Use a short search debounce, cancel obsolete requests or ignore late responses, reset pagination on a new query, and follow the server-provided next page. Do not download or client-filter the entire user catalogue. Keep selected owner separate from search results so a changed query or page never removes it. Pagination must stay associated with its query; prevent overlapping duplicate page requests and deduplicate by ID.

For edit, load the existing client using the host application's established read path once confirmed. Resolve its current `owner_id` through `/users/{id}/`, even when absent from the active-user search. An inactive current owner remains selected and is labelled inactive; replacement choices come from the active-user search. Resolution loading must not be treated as an empty owner.

A 404 resolving the current owner means unavailable, not unassigned. Show “Current owner unavailable” without inventing a name or leaking inaccessible details. Retain its original ID internally, explain that it will be kept unless changed, and allow explicit replacement or clearing. A transient lookup error offers retry and also preserves the original value. A failed catalogue load offers retry and prevents choosing an unsupported new country. If a stored country is absent from the catalogue, show the unresolved saved value and require a deliberate resolution when necessary; never silently select the first country.

## States and submission

Distinguish idle, loading, results, no matches, loading more, lookup failure, and unavailable current selection. Keep errors separate from empty results. Country loading, owner search, and owner hydration each have local feedback; one failure must not erase another field's state.

Maintain saved values, the editable draft, and explicit changes separately. Create sends `name`, `country`, and `status`; omit an untouched optional owner and territory unless confirmed API semantics require otherwise. Selecting an owner sends `owner_id` as its original string; explicit clear sends `null`. The contract does not define create ownership defaults, so an omitted owner must not be presented as guaranteed unassigned until that is clarified.

For PATCH, send changed writable fields only, subject to confirmation of the endpoint's required-field rules. An untouched owner is omitted, including an inactive or unavailable current owner; selected replacement sends its ID; clear sends `null`. Never derive a cleared value from a failed fetch, missing option, empty search text, or loading state. Do not submit a blank territory as “delete” until its clearing semantics are confirmed. Avoid merging a detail object wholesale into a write payload: allowlist writable fields to exclude `created_at` and display metadata.

Validate required choices, name length, and catalogue membership before submission; server validation remains authoritative. While saving, prevent duplicate submissions and show progress. Map documented 400 field errors to the matching controls, preserve all input, and show unmapped errors at form level. On 201, use the established success/navigation flow. For network failures with uncertain outcome, retain the draft and avoid automatic POST retries that could create duplicates.

## Essential contract gaps

Confirm the client read response, client identifier, edit endpoint/method, PATCH required-field interpretation, success/error responses, and concurrent-edit behavior. Confirm user search parameter names and minimum query rules, pagination URL handling, locale negotiation, create owner default, territory suggestion source and clearing semantics, and name whitespace rules. These are integration questions; do not invent API capabilities or defaults to resolve them.

## Verification to run during implementation

1. Create cannot submit without name, supported country, and an explicitly chosen status; valid requests contain exact country codes and status values and exclude read-only fields.
2. Search covers later pages and duplicate names, ignores stale responses after query changes, and retains selection after paging and no-match results. Exercise the combobox with keyboard and screen reader announcements.
3. Edit hydrates an active owner absent from the first page and an inactive current owner. A 404, timeout, and retry preserve the original ID. An unrelated edit omits owner; clear emits null; replacement emits the selected opaque ID.
4. A new locale changes country labels without changing codes. Catalogue failure and unsupported stored values never cause silent replacement. Territory accepts a value absent from suggestions.
5. A 400, network failure, and duplicate save attempt retain the draft and produce the expected feedback. Check the actual outgoing payloads rather than only rendered labels.

Checks performed for this note: read the raw fixture and reconciled each supplied field and endpoint with these decisions. No application, browser, API, or accessibility tests were run; the list above is an implementation verification plan.
