# Shelf product manager

React + TypeScript + Vite frontend for the DummyJSON products API.

## Run

```sh
npm install
npm run dev -- --port 5173
```

The development server binds to `127.0.0.1`. Use Node 22.18+ for the TypeScript test command. Checks here ran on Node 26.5.0.

## Implemented

- Product list with images, prices, category, stock, and stock status.
- Search by product name, brand, or SKU; category and stock filtering; sorting and pagination.
- Add and edit dialogs with required-field, price, stock, and image URL validation.
- Delete confirmation, loading placeholders, empty states, retryable load failures, mutation errors, and success feedback.
- Responsive navigation and layout; native modal dialogs with keyboard focus and Escape support.

## API behavior and limits

Official reference: https://dummyjson.com/docs/products

- Reads use `GET /products?limit=0`.
- Creates use `POST /products/add`; updates to original products use `PUT /products/:id`; deletions of original products use `DELETE /products/:id`.
- DummyJSON simulates writes and does not persist them. Successful changes are overlaid on the fetched catalog and saved in this browser's local storage. The interface explains this.
- A newly created product does not exist at a persistent API endpoint, so subsequent edits and deletions of that product are local. Local products use unique browser keys to avoid collisions with the API's repeated simulated IDs.
- If local storage is unavailable, changes remain in memory and a warning explains that they will be lost on reload.
- Catalog reads and images require an internet connection. Google Fonts is optional; system font fallbacks are present. The full demo catalog is loaded once and filtered locally.
- No authentication, deployment, real customer data, bulk actions, or export was added.

## Checks completed

- `npm run build` — passed (TypeScript and production Vite build).
- `npm run typecheck` — passed.
- `npm test` — passed, 3 tests for change merging, combined filtering/sorting, stock boundary handling, and invalid stored product data.
- Package installation completed without registry blockers; npm reported zero vulnerabilities at installation.

Browser interaction and screenshot checks were not performed by this implementation agent; the parent owns that evaluation after source freeze. Live mutation success and failure flows have not been claimed as verified.

Source frozen after the checks above.
