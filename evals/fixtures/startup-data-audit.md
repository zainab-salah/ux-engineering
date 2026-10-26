# Synthetic operations dashboard review

Audit this proposed implementation before release. The active account is chosen explicitly by the operator and must not change during recovery. This fixture describes behavior; it is not a running app or private project export.

- **Startup:** the theme's click handler initializes its local state and returns on the first click; only subsequent clicks change the theme. The mobile navigation button is visible but has no handler. Desktop navigation works.
- **Dashboard:** counts load asynchronously. The current renderer turns both missing values and a 403 response into `0`. It defaults to the last seven days even though the server's permitted metadata includes `first_activity_at` from months earlier. A “Send report” action has no supported endpoint. The proposed workaround is to switch to the first account that has records.
- **Calendar filter:** timestamps are displayed in the saved `America/New_York` zone. The user selects March 8, 2026. The endpoint expects UTC `start` inclusive and `end` exclusive. The current client constructs local midnight in the browser's zone and adds exactly 24 hours. The browser may be in another zone. Date-only business fields elsewhere must remain date-only.
- **Role editing:** a drawer closes and clears its draft immediately when Save is clicked. The PATCH can return per-field errors or time out. On confirmed success, this product's intended workflow is to close the drawer, update the row and return focus to Edit.
- **Credentials:** GET returns `credential_configured: true`, never the secret. The editor displays `••••••••`, then PATCH submits that string even if the user changes only the label. The contract supports omission to preserve, a new value to replace and explicit `null` to clear with permission.
- **Preview:** fetched message HTML is placed directly into the application's DOM. A maintained safe preview component already exists elsewhere in the app. The current fallback logs the full message and credential draft to help debugging.

Report task-impacting issues, minimal corrections, preserved API behavior and concrete verification. Do not fabricate new endpoints, claim runtime checks or rewrite unrelated architecture. Product-specific save and calendar semantics above are deliberate.
