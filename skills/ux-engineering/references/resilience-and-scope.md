# Resilience and bounded refinement

Read the sections relevant to the task; this is not a requirement to add every capability to every interface.

## Surface job and visual hierarchy

Operational screens help users scan, compare and act. Keep a clear primary task and related secondary actions without making every panel equally prominent. Reuse familiar typography and control semantics. A report or documentation page may need a different reading rhythm; a campaign page can justify expressive imagery and motion. Do not impose hero sections, AIDA, random layouts, giant padding or arbitrary font bans on an existing admin tool.

Remove whitespace that creates avoidable effort, but retain grouping and legibility. Test at normal working size and with realistic data. A thumbnail or grayscale check can reveal competing emphasis or color-only meaning, but it does not prove text contrast, readability or interaction correctness. Preserve truthful copy, domain labels and user-selected assets; do not invent claims or replace meaningful labels to make a screen look cleaner.

## Internationalization and mixed-direction data

- Use the product's translation and pluralization system. Counts, validation and loading messages need localization too; avoid string concatenation that assumes English grammar.
- Format dates, numbers and currencies for the chosen locale while preserving wire values and precision. Display the relevant timezone/currency explicitly when ambiguity matters. Formatting is not parsing: a localized decimal must pass through a verified input adapter before becoming an API value.
- Follow the product's explicit language and direction policy; an Arabic interface may intentionally retain an LTR shell. Test long translations, RTL where supported and mixed Latin IDs/emails. Use logical spacing/alignment properties where suitable; isolate mixed-direction fragments with appropriate directionality. Do not reverse strings, codes, numbers or every icon mechanically. Verify text shaping, selection and copying in the browser.
- Keep full meaningful labels available when truncating. An inaccessible hover-only tooltip is not adequate recovery for a clipped name on touch or keyboard. Do not ellipsize the only error explanation or a consequential choice without an accessible way to read it.
- Preserve the source contract's length semantics. Unicode characters, code units and bytes are not interchangeable limits; do not add ASCII-only rules to names or addresses without evidence.

## Overlays, mobile keyboards and responsiveness

Inspect an open menu inside the actual scrolling shell. A popup can be clipped by an ancestor even when the trigger fits. Use the established portal/top-layer pattern and its theme/focus behavior rather than hiding overflow across the whole page. A global `overflow-x: hidden` can conceal unreachable controls instead of fixing the cause.

Test the virtual keyboard, short viewport and zoom with a field focused. Keep the active field, correction message and completion action reachable; a fixed footer must not cover them. Hover effects need keyboard/touch equivalents. If drag, swipe or custom gesture behavior exists, support a non-gesture alternative where applicable, clean up cancelled interactions and verify the next interaction works. Do not add custom gestures solely for visual novelty.

## Motion and performance serve feedback

Use motion to explain state, continuity or a consequential change. Do not make an operator wait for entrance sequences or scroll choreography to use a form. Respect reduced motion; provide stable alternatives for any essential information. Avoid layout jumps that displace a pending click or reading position. Preserve semantic DOM/focus order when CSS grid placement changes visual order; dense packing is not automatically better.

Keep typing, selection and scrolling responsive with representative data. Reuse scoped server queries, batching, existing debounce/cancellation and cache patterns. Avoid a request per visible cell or downloading an entire large relationship catalogue. Consider virtualization only for demonstrated scale needs, and test focus/reading order and selection when rows unmount. Do not add animation or performance dependencies without a concrete need.

Reduce or disable decorative motion on constrained devices when observed performance warrants it; keep task feedback intact. Pause expensive offscreen work, avoid React state updates on every animation frame and reserve stable image/container dimensions. Use supplied assets at suitable sizes and load priority only for genuinely critical content. Measure the affected flow on representative screens; Lighthouse targets are contextual goals, not permission to hide content, fabricate structured data or sacrifice usability for a score.

For slow operations distinguish queued, pending and confirmed states using actual backend evidence. Do not invent progress percentages, elapsed-time estimates or “saved” feedback. If 429 is supported, explain rate limiting and respect the server's retry guidance; do not create an aggressive retry loop. Offline editing is optional and requires a real storage/synchronization design, not a promised button.

## Preserve edit scope and verify bounded changes

Before a refinement, note the target plus invariants: behavior, copy, permissions, payloads, component identity and unrelated routes. Use a nearby approved screen or a current screenshot as visual evidence; a filename such as DESIGN.md is not proof that its content matches the shipped interface.

When a task includes a supplied composition or artwork, read [reference-fidelity.md](reference-fidelity.md). Match the approved structure before layering motion; preserve asset restrictions and content integrity without imposing that reference's visual style on other products.

Inspect the changed result against that baseline, including shared callers. A border correction must not remove focus; a density fix must not hide labels; a narrower page must not drop actions or field relationships. Keep the correction proportional to the observed issue. Batch representative desktop/narrow/state checks, correct demonstrated defects together and confirm affected behavior. Further passes need a new failure or unresolved blocker, not an aspiration to endless polish. Record unverified states explicitly.
