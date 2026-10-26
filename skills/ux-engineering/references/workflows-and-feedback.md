# Workflows, dependencies and feedback

## Task completeness

Trace entry → selection/input → submit → result → next use. For a saved view, include naming, validation, saving, discovering the tab, applying it, changing/deleting it if supported, and the ownership/sharing boundary. For a mapping preset, include save, find and apply; creation alone does not deliver reuse. For a new account page, include a real navigation target and return context.

Read permissions at page, action and field levels. A writable phone field should remain usable when address is read-only. Do not show restricted data or queries, and exclude unauthorized fields from payloads. Hiding an input does not secure its endpoint. Explain an available but disabled action's blocker when helpful; hide irrelevant or forbidden information according to the product's privacy rules.

## Dependencies

- Derive safe context where the server does: choosing a bot may determine company. Do not ask for a second independent company field that could contradict it.
- If changing a desk invalidates the owner, show the impact, reconcile the selection, and guard submission. Preserve unrelated draft data.
- If an advanced field overrides another, show that relationship at the point of editing. Keep the overridden draft available unless the user explicitly clears it. Preserve API-required fields even if they are currently inactive.
- Conditional fields should appear at the relevant point and expose requiredness. Decide what happens to hidden values based on contract semantics; do not silently erase data or submit stale hidden values.

## State contract

| State | Expected behavior |
|---|---|
| Initial loading | Indicate the region being loaded; do not show a fake zero metric or “no data.” |
| Updating/searching | Keep useful confirmed content; identify pending results and ignore stale responses. |
| Empty dataset | Explain what exists and a permitted next action. Avoid a huge empty panel for every subresource. |
| No matches | Show active criteria and clear/change controls. Distinguish from no records and access denial. |
| Field invalid | Name the problem and correction next to the field; preserve the draft. |
| Non-field failure | One persistent, scoped message with retry/recovery; do not mislabel an API outage as bad input. |
| Success | Show the saved state and next useful action; do not rely exclusively on a disappearing toast. |
| Forbidden / expired session | Explain access or reauthentication without discarding the draft; obey established auth behavior. |
| Conflict / stale version | Keep draft, show conflict, offer refresh/reconcile; do not overwrite newer state silently. |
| Unknown write outcome | Verify status or reuse a supported idempotency mechanism. Do not blindly create a duplicate. |

Put field errors inline by default. A compact linked summary helps with long/offscreen or multi-step errors; avoid repeating the same short-form error in a large banner, a toast and an inline message. Always provide a home for non-field errors. Focus the first invalid field or an appropriate summary after submit, with an announced result.

Consolidate repeated refresh actions at the workspace level when they refresh the same context. Keep targeted retry/status controls when they have distinct effects. Label status with what it proves: “form submitted” does not prove that a message was delivered. Preserve financial and audit history even when the user asks for generic CRUD.
