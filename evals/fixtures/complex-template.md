# Synthetic Django-backed extraction template

Task: supervisors create/edit reusable extraction templates and may attach an optional follow-up appointment.

Serializer contract (verified fixture facts):

- `name`: required string, max 120.
- `prompt`: required nonblank string on create, even when `system_prompt` is active.
- `system_prompt`: optional string, blank permitted. The extraction worker uses a non-whitespace value instead of `prompt`; it still appends field definitions and language rules. This backend imposes no length maximum. A draft stakeholder note says “around 2500–3000 characters”; no maximum was approved.
- `description`: optional metadata, never sent to extraction.
- `fields`: required nonempty list of `{key:string,type:enum(text,number,date),required:boolean}`. Keys must be unique. Server nested validation example: `{fields:[{}, {key:["This key is already used."]}]}`. Existing order is meaningful.
- `languages`: nonempty subset of `[en,tr]`.
- `follow_up`: optional object or null; `{scheduled_at:ISO datetime,timezone:IANA zone,owner_id:opaque user ID}`. Date/time must be in the future. Owner must belong to selected desk. Saving is atomic within this endpoint.
- `desk_id`: required when follow_up is present. GET `/desks/` lists allowed desks; GET `/owners/?desk_id=...&search=...` is paginated server search. GET `/owners/{id}/` resolves an allowed current owner.
- PATCH omission preserves; null clears follow_up. Only supervisors with `edit_instructions` may write prompt/system_prompt/fields. Others may edit `name`, `description`, `languages` and `follow_up` only. API enforces this per field.
- 400 has field and non-field errors; 403 access denied; 409 stale version; 5xx transient failure. Current version is sent through the existing If-Match adapter.

Existing application uses React, TypeScript, shared native/shadcn controls, RHF and Zod. No new package is needed. Keep draft values on failed saves. Changing desk can invalidate owner. A short template should not require a wizard.
