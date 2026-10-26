# Backend to interaction

## Read the contract, then the task

Inspect the request and response separately. Trace serializer overrides, model choices, custom validation, permission filtering, related endpoints, and actual frontend adapters. A database field may never be writable through the API. A serializer's label can be misleading: verify behavior when one field overrides another.

For each relevant field capture: user meaning; create/edit/filter usage; accepted values; displayed label; option source; multiplicity; required/nullable/blank/default; read/write access; dependencies; submitted representation; errors. Resolve `$ref`, composition, and operation-specific schemas when relevant. Do not infer a foreign key solely from an `_id` suffix.

In Django REST framework, `required=False`, `allow_null=True`, `allow_blank=True`, and `read_only=True` mean different things. PATCH omission generally preserves a value; explicit null may clear it if accepted. Defaults and custom `validate()` logic may change that behavior. DRF decimal values may be strings; preserve precision through the adapter. In OpenAPI 3.0, nullable differs from 3.1 union types; use the document's declared version. A `format` or `description` alone does not prove server enforcement.

## Mapping candidates, not automatic widgets

| Backend evidence | User-facing candidates | Decision / contract guard |
|---|---|---|
| Small enum | Radios, select, segmented choice | Visible alternatives help comparison; a select may fit a dense, familiar filter. Keep exact enum values. A status transition may require a workflow action rather than direct editing. |
| Foreign key | Native select for a few known records; searchable relationship picker for many | Display names and useful context; submit the stable key. Derive tenant/company where the server owns it. No manual ID entry for ordinary lookup tasks. |
| Boolean | Checkbox, switch, read-only state | Deferred form choice vs immediate setting vs system state. Explain saving behavior. An immediate toggle needs pending/failure rollback. |
| Date / timestamp | Typed date, date picker, date-time with zone, formatted read-only value | Birthdates should not require decades of calendar paging. Scheduling needs timezone and invalid/past-time handling. Do not turn a local date into a shifted UTC date. |
| Array of choices | Checkbox group, multi-select, removable selected tokens | Zero/one/many, duplicates, order, and maximum size matter. Tags created freely are different from controlled permissions. |
| Array of objects | Repeatable structured rows or sections | Stable row keys, add/remove, nested errors, reordering and payload order. Avoid raw JSON for nontechnical tasks. |
| Nested object | Grouped fields or a task flow | Determine whether writes are nested or use separate endpoints. Do not assume atomicity across several requests. |
| System ID, timestamps, calculated balance | Hidden, contextual read-only display, copy/reference affordance | Hide from editing, not necessarily from all views. Support agents may need a copyable identifier. Never submit an entire response object as an update. |
| String with no option source | Text or textarea, optional suggestions | Unknown semantics are not evidence of an enum. Preserve user-created values. Ask only if ambiguity affects correctness. |

## Relationship selectors need a data strategy

- Confirm lookup search, scope, permissions, pagination, stable keys, and display fields. Local filtering of the first server page is not global search.
- Preserve the selected label independently of search results. Resolve an existing value missing from the current page using a supported detail endpoint or supplied selected-object data.
- Group or disambiguate names with user-relevant context such as desk or organization. Do not leak sensitive details merely to disambiguate.
- Treat loading, no matches, no eligible options, lookup failure, forbidden lookup, and an unavailable existing selection as separate states. Show a retry when appropriate; do not silently clear or replace the value.
- Scope/cache searches by parent and permissions; cancel or disregard obsolete responses. Changing a parent must visibly reconcile dependent selections and prevent stale submission.
- Permit clearing only when the contract allows it. Do not offer creating a related record unless that operation exists and is authorized.

## Worked decision

`country: string, maxLength=2` is not enough to invent a country catalogue. If validation confirms ISO alpha-2 and an approved list is available, offer localized country names, preserve a stored legacy code visibly, and submit the two-letter code. If the field is actually a free-form sales territory, preserve text. For an expert import-mapping tool, a validated code input with name suggestions may be appropriate.

Sources: [DRF fields](https://www.django-rest-framework.org/api-guide/fields/), [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html). These explain contracts; the interaction choices above are this project's synthesis.
