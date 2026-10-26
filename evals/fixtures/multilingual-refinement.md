# Synthetic multilingual invoice admin

Refine an existing invoice editor used in English and Arabic. Preserve its compact shared theme, current labels, field permissions and API behavior; the request is to fix usability, not redesign the brand.

API uses opaque customer IDs, exact decimal strings with a dot separator, ISO dates and an explicit currency code. The current adapter already handles locale-aware parsing and preserves precision. Operators copy Latin invoice references and customer email addresses inside Arabic text. Arabic and English labels come from the established translation system. Read-only tax values must remain excluded from writes.

Reported problems: dropdown opens inside an overflow-hidden card and clips options; a fixed Save footer covers the last error when the virtual keyboard opens; long translated buttons are clipped; an entrance animation delays the first editable field; the screen says “Saved” optimistically before a rejected request. A proposed AI fix adds global overflow-x-hidden, a new animation package, smaller fonts everywhere, reversed Arabic strings and a rewrite of all field labels.

Task: propose a scoped correction and verification note, explaining what stays fixed. Address long and mixed-direction text, exact values, open popup/keyboard states, motion, pending/failure recovery and evidence limits. No new endpoint, package or offline sync is required. Do not claim runtime verification from this fixture.
