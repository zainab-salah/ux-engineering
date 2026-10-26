# Synthetic expert import console

Operators paste external customer reference codes. Valid values are unknown until submitted to a third-party resolver. There is no options endpoint. Some previous values can be suggested but new values must remain valid.

`priority` is an integer from 1 to 1000; exact values matter for queue ordering. `territory` is free-form despite the old UI showing three frequently used suggestions. `enabled` is edited with five other settings and only takes effect after Save. `plan` has three costly contractual choices; no default is approved. `request_id` is generated and read-only, but support operators copy it for troubleshooting.

`preferred_time_zone` accepts an IANA zone identifier or explicit `null`; omission preserves the existing value. Unlike territory, its choices are closed: the application already bundles the backend-approved zone catalogue with city labels and country codes. It includes `Europe/Istanbul`, `America/New_York` and `America/Phoenix`, among hundreds of entries. The current editor renders a plain text box. An edit may start with a saved zone excluded by the current search. Country is a separate optional setting; it does not restrict valid zones, and countries can have multiple zones.

The task is to choose interactions and preserve the API contract. Do not fabricate catalogues. Some information is intentionally missing: whether plan changes require separate authorization and whether reference resolution may create records. State what must be established before implementing those actions. Do not block ordinary layout and input decisions on those unknowns.

The proposed form also repeats “Enter the reference here” below Reference and “Manage your import settings” below Import settings, but omits the 1–1000 priority range and plan-change consequence. Simplify the redundant copy while retaining labels and the information needed to choose safely. Implement appropriate controls when implementation is requested; a recommendation alone is not a finished UI change.
