# Frontend integration

Reuse the repository's transport, form, validation, query/cache and design-system primitives. These examples describe boundaries, not dependencies to install.

## React / Next.js / TypeScript

- Keep API representation and displayed labels separate. A relationship control can retain `{id, label}` while the mutation sends only `id`. Scope lookup query keys by tenant, parent and search. Preserve a selected object independently of the current result page.
- In Next.js, keep credentialed server access and secrets within the established server boundary. Interactive form state belongs in a client component when needed; do not make an entire route a client component simply for a selector. Do not introduce a new fetching architecture for this skill.
- Handle pending, server validation and conflict states explicitly. Cancel or disregard stale lookup responses; do not let a late response repopulate the previous parent's options.
- Use stable keys for repeatable rows; map server nested errors to their fields. Preserve dirty values on failed writes. Decide how background refresh affects a dirty form.

## Choosing libraries

Reuse installed, maintained tools before introducing another approach. For a nontrivial React CRUD app, established server-state tools such as TanStack Query or SWR can own caching, request lifecycle and invalidation; RHF with Zod can own form state and verified constraints when they fit the project. A component system can provide accessible dialog/selector primitives, but its composition still needs testing. Native controls remain suitable for simple cases. Explain what recurring problem a dependency solves, check the installed version's API, and avoid parallel fetch/form stacks or adding a library solely to make the project look advanced. Do not replace working architecture as part of a narrow UX correction.

## RHF and Zod when already used

Initialize edit values from the stored record. Use the existing resolver and controlled-field integration for custom controls. Keep form values in the representation expected by the adapter; a DOM select normally produces a string. Convert only at the verified API boundary.

Avoid generic coercions: `Boolean("false")` is true; `Number("")` is zero. Optional blanks, explicit clearing and omission need separate treatment. Client validation improves feedback; server validation remains authoritative. Unknown server errors belong in one form-level region rather than being dropped.

Illustrative TypeScript for a verified code catalogue:

```tsx
type CountryOption = { code: string; label: string };
function CountryField({ options, value, onChange }: {
  options: CountryOption[];
  value: string;
  onChange: (code: string) => void;
}) {
  return <label>Country
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Choose country</option>
      {options.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
    </select>
  </label>;
}
```

This minimal example assumes a complete supplied catalogue and required selection. For many options, use the product's searchable picker with the same code/label boundary. Include an existing unlisted value explicitly until resolved; silently replacing it risks a destructive edit. The snippet is illustrative, not a tested application component.

## Tailwind and shadcn/ui

Use semantic tokens and shared size variants; keep input, trigger and button heights coherent. Portalled popup content must inherit the same theme. Follow the installed component API; shadcn/ui projects can use different underlying primitives and versions. Do not assume a named component provides multi-select or remote search. Verify labels, keyboard behavior, focus return and field error associations in its actual composition.

For a horizontal toolbar, reuse the shell's flex/grid pattern with wrapping and `min-width: 0` where shrinking is required. Put the table's own overflow inside its region. Avoid feature-local hardcoded colors or a new “premium” card system.

## Django / REST adapter boundary

Use the serializer's accepted write keys, not every key in a response. Confirm filtering/search operators, pagination envelope, role/field access and nested validation shape. Submit only intended writable changes. Preserve ISO codes, stable IDs, decimals and dates. Exclude system-managed values from writes. Do not fabricate endpoints to make the UI appear complete.

The executable `examples/client-patch.mjs` example is distributed in the repository, outside the installable skill. The skill remains usable without that development example. Its behavior is also described here: map selected objects to IDs/codes, require known fields, distinguish missing keys from explicit null, and filter writes by permission. Do not rely on the example file being installed with the skill.
