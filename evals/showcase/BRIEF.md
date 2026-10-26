# ServiceDesk: landing page and customer operations table

Build a complete, local, buildless HTML/CSS/JavaScript demonstration for a fictional ServiceDesk product. This is a synthetic evaluation, not a real company or production app. Use no external assets, frameworks, packages or network services.

The page introduces the product with a compact navigation/header, concise landing section and a prominent Open workspace link to the table section. The main experience is an operational customer directory: search, status/country filters, sorting, pagination, create/edit and a detail inspection panel or page. Keep a coherent light/dark theme and responsive layout. All displayed actions must work; errors should be recoverable. Choose the interactions and information layout yourself. Do not deliberately inject bad UX for the evaluation.

Create `index.html` in your assigned output directory. Shared API facts are in `contract.json` one level above your directory. Requests use `/api/` on the same origin, with a `variant` query parameter: `baseline` for the baseline directory and `with-skill` for the revised directory. The server maintains separate in-memory datasets for each variant so their writes do not affect the other. There are 137 deterministic synthetic clients. Start page size is 10. No login is needed for this local fixture.

Goals: operators find clients across the full result set, inspect details, correct a name/country/owner, and create a client. Names may repeat, owners span several result pages, and a selected owner may be absent from the first owner page. Show human labels while retaining backend IDs and country codes. Explain the outcome after a save and preserve a draft on failure. The API provides all the required capabilities; do not invent additional ones.

Use semantic controls and support keyboard interaction. The table should fit a normal working viewport without excessive repeated headings, giant cards or avoidable scrolling. On narrow screens, keep actions and data reachable. A compact presentation section should not dominate the operational workspace.

This is an implementation request, not a decision note. You may run static checks. Browser verification is performed independently after the artifact is frozen. Do not read evaluation criteria, results, another agent's output, installed skills or documentation beyond the explicitly supplied skill for the revised condition.
