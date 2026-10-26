# Accessibility and feedback verification

Use WCAG 2.2 AA as a design/review target when applicable, not as a conformance claim. APG describes interaction patterns; it does not certify a component or replace testing.

Prefer native elements and landmarks, one useful primary page heading and a logical heading order. Keep meaningful text in the document, use descriptive alternatives for informative images and empty alternatives for purely decorative images. Add ARIA for semantics the native element cannot provide; it does not repair an inappropriate interaction.

| Concern | Implementation and verification | Guidance |
|---|---|---|
| Names and instructions | Persistent labels, grouped choices with fieldset/legend where appropriate, visible requiredness and constraints. Placeholder alone is insufficient. | WCAG 1.3.1, 3.3.2, 4.1.2 |
| Keyboard and focus | Reach and operate all actions without a pointer; visible focus; no hidden focused element under sticky headers/footers. | 2.1.1, 2.1.2, 2.4.7, 2.4.11 |
| Errors | Associate correction text using `aria-describedby`; set `aria-invalid` when invalid; announce submission failure; move focus sensibly and preserve input. | 3.3.1, 3.3.3; [WAI form notifications](https://www.w3.org/WAI/tutorials/forms/notifications/) |
| Status | Announce significant async state with an appropriate status/live region, without moving focus or announcing each keystroke. Keep saved/pending/error distinguishable by text. | 4.1.3, 1.4.1 |
| Reflow and touch | Test zoom and 320 CSS px reflow; preserve content and actions; use adequate target size/spacing with applicable exceptions. Dense data tables may require two-dimensional scrolling. | 1.4.10, 2.5.8 |
| Contrast | Check text, control boundaries and meaningful states in every supported theme; do not use color alone. | 1.4.3, 1.4.11, 1.4.1 |

For a custom combobox: check its accessible name, expanded state, controlled popup, selected/active option, arrow navigation, Enter acceptance and Escape dismissal. Preserve normal text-editing keys in editable comboboxes. Make search results and no-results feedback perceivable. Use the [APG combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) appropriate to its actual popup; multi-selection may need a different listbox pattern and removable selections with named buttons.

For a modal dialog or modal drawer: provide a title and close affordance; move focus inside, contain Tab/Shift+Tab, make the background inert, allow appropriate dismissal, and restore focus to the initiating control or a logical next target. Protect an unsaved draft deliberately. See [APG modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). A non-modal side panel has different focus behavior.

For tables: use real headers and cell relationships, named selection checkboxes, exposed sort state, an accessible pagination region with current-page information, and selection-scope feedback. Do not turn every data table into an ARIA grid unless its interaction needs grid keyboard behavior.

Verify with automated accessibility tooling when available and manual keyboard, zoom, touch and assistive-technology checks. List each check actually performed. Static code review can identify likely failures but cannot establish complete accessibility coverage.

Normative source: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Specific pattern choices and the review matrix are this project's implementation guidance.
