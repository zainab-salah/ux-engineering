# Additional maintainer-supplied history

Reviewed on 26 October 2026. The maintainer supplied three consolidated summaries of earlier Chatbot Manager, CRM and portfolio conversations. These are secondary evidence: the original transcripts, referenced images, exact markup and final shipped outcomes were not independently recovered in this pass. Requests below are paraphrased; a requested correction is not a verified result.

Private attachment locations and supplied chat identifiers remain in the separate provenance notes. This public synthesis contains no source code, customer data, private URLs, artwork or screenshots from those projects.

The maintainer requested generalizing useful prompts and excluding the portfolio's specific theme. The skill therefore extracts reusable constraints and verification steps; it carries over no named art direction, characters, palette or decorative effects.

## S01 — First interaction and successful completion

1. **Context:** mobile navigation, theme switching and role editing in an administration app.
2. **Reported original issue:** a navigation button did nothing, a theme control required two clicks after load, and the user requested closing the side panel after a successful save. The exact causes are not established by the summary.
3. **UX consequence:** a valid-looking action fails at the first attempt or leaves completion unclear.
4. **Requested correction:** working first-click controls and clean panel completion after confirmed save. No fresh runtime verification is claimed.
5. **Reusable principle:** test startup state and the full action lifecycle, not only the warmed-up screen.
6. **Detection/prevention:** start from a fresh page, activate once with pointer and keyboard, inspect state/request outcome, then verify success closes/restores focus where intended and failure preserves edits.

## S02 — Real data and useful dashboard defaults

1. **Context:** backend-connected dashboard and messaging screens.
2. **Reported original issue:** requests called for connecting available APIs, removing unsupported UI and choosing initial results that include accessible activity. The summaries do not establish every previous placeholder or endpoint.
3. **UX consequence:** plausible widgets or arbitrary empty ranges can misrepresent what the system can do or contains.
4. **Requested correction:** supported controls, truthful data and initial ranges informed by available activity. Historical completion is unverified here.
5. **Reusable principle:** every visible capability needs real behavior; defaults should serve the current task and access context.
6. **Detection/prevention:** trace widgets to response fields, distinguish unavailable/loading/zero, test old activity and no-access states, and never change tenant context merely to populate a chart.

## S03 — Sensitive edits and rich previews

1. **Context:** credentials, personal information and email/template previews.
2. **Reported original issue:** the supplied summary requests hidden passwords, consistent masking and safe HTML rendering. It does not prove a historical exploit or leak.
3. **UX consequence:** an edit can overwrite a secret with a mask, reveal restricted information, or expose users to unsafe fetched markup if display boundaries are mishandled.
4. **Requested correction:** preserve confidential values and use safe preview handling; no security assessment of the original projects was performed in this pass.
5. **Reusable principle:** understand the meaning and trust level of a displayed value before treating it as editable input or executable markup.
6. **Detection/prevention:** distinguish unchanged/replaced/cleared secrets in payloads, inspect table/detail/preview paths and reuse the maintained rendering boundary with focused malicious-content checks.

## S04 — Country/time-zone selection and date filtering

1. **Context:** CRM forms and date-filtered tables.
2. **Reported original issue:** the user requested country names, city/time-zone names, searchable large selectors and the user's timezone in display and filtering. Exact earlier time-zone markup was not recovered.
3. **UX consequence:** code entry creates avoidable recall work; a filter using another zone can omit records users expect to see.
4. **Requested correction:** recognizable choices with stable wire values and consistent timezone semantics. These directions also match the maintainer's current requests.
5. **Reusable principle:** translate domain vocabularies and calendar intent without changing the contract.
6. **Detection/prevention:** verify accepted catalogues, preserve stored choices and null/omission, test multiple zones within one country, then inspect filter boundaries and daylight-saving behavior where applicable. Free-form territory remains text.

## S05 — Reference fidelity and responsive relationships

1. **Context:** a reference-led portfolio with supplied composition and assets.
2. **Reported original issue:** repeated corrections addressed text/artwork alignment, mobile gaps, overflowing text, cropped artwork and shrinking a contribution graph too far. Images were not re-reviewed here.
3. **UX consequence:** a technically responsive layout can lose the intended composition or make its content unreadable.
4. **Requested correction:** match the static reference first, preserve anchors while adapting small screens and retain readable data with scoped scrolling. The summary also records a later restriction to supplied artwork.
5. **Reusable principle:** preserve meaningful relationships and the latest asset constraints rather than imposing arbitrary breakpoint positions.
6. **Detection/prevention:** establish fixed versus flexible elements, compare equal-size rendered references, inspect narrow layouts and transparent edges, and mark missing visual evidence as unverified.

## S06 — Motion, content integrity and performance

1. **Context:** mobile administration screens and an expressive portfolio.
2. **Reported original issue:** laggy mobile animation and portfolio corrections requesting more natural movement, continuous artwork and truthful project content. These are different surfaces with different goals.
3. **UX consequence:** decoration can slow tasks, obscure content or imply nonexistent product evidence.
4. **Requested correction:** reduce costly mobile motion; in the portfolio, add deliberate animation after static layout works, retain real content and use appropriate supplied assets. No measured performance improvement is established.
5. **Reusable principle:** choose motion and evidence for the surface's job, preserving accessibility and truthful content.
6. **Detection/prevention:** test reduced motion, offscreen work, narrow-device interaction and content availability without animation; verify project claims and keep private products private.

## Existing guidance reinforced, not duplicated

The summaries also reinforce H01–H14: full-dataset selectors across callers, compact matching controls, internal table scrolling with visible pagination, permission-aware writes, named saved views, inline errors, restrained descriptions and browser verification. They do not justify universal rules for an exact button size, an ×-only reset, newest-first sorting, automatic drawer dismissal, permission icons or a specific artwork style.

The Arabic/LTR preference, fixed saved-view tabs and portfolio animation/art direction remain product-specific. Compact controls still need accessible names and adequate targets; removing redundant prose must not remove labels, warnings or useful error feedback. Lighthouse scores are contextual targets, not measured results or permission to game the interface.
