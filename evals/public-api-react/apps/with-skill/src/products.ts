export interface Product {
  id: number;
  /** Stable client key. API products use their id; locally created products get `local-<uuid>`. */
  key: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  sku: string;
  thumbnail: string;
  rating: number;
  /** True when the product exists only in this browser (DummyJSON does not store created products). */
  local?: boolean;
}

export interface Changes {
  upserts: Product[];
  deleted: string[];
}

/** Values the product form edits. Everything is a string because that is what inputs produce. */
export interface ProductFormValues {
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  brand: string;
  sku: string;
  thumbnail: string;
}

/** The body sent to DummyJSON for create and update. */
export interface ProductPayload {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  sku: string;
  thumbnail: string;
}

export type StockFilter = 'all' | 'low' | 'out';
export type SortKey = 'default' | 'name' | 'price-asc' | 'price-desc' | 'stock';

export const LOW_STOCK_MAX = 10;
export const EMPTY_CHANGES: Changes = { upserts: [], deleted: [] };
export const STORAGE_KEY = 'shelf-catalog-changes-v1';

export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
export const categoryName = (value: string) => value.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
export const stockStatus = (stock: number) => stock === 0 ? 'Out of stock' : stock <= LOW_STOCK_MAX ? 'Low stock' : 'In stock';
export const isLowStock = (product: Product) => product.stock > 0 && product.stock <= LOW_STOCK_MAX;

export function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    ...raw,
    key: String(raw.id),
    brand: (raw.brand as string) ?? '',
    sku: (raw.sku as string) ?? '',
    thumbnail: (raw.thumbnail as string) ?? '',
    description: (raw.description as string) ?? '',
    rating: (raw.rating as number) ?? 0,
  } as Product;
}

export function validProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const product = value as Product;
  return typeof product.key === 'string' && typeof product.id === 'number' &&
    typeof product.title === 'string' && typeof product.category === 'string' &&
    typeof product.description === 'string' && typeof product.brand === 'string' &&
    typeof product.sku === 'string' && typeof product.thumbnail === 'string' &&
    Number.isFinite(product.price) && product.price >= 0 && Number.isInteger(product.stock) && product.stock >= 0;
}

/** Parse the locally stored change set; anything malformed is ignored rather than trusted. */
export function parseChanges(text: string | null): Changes {
  try {
    const saved = JSON.parse(text ?? 'null');
    if (saved && Array.isArray(saved.upserts) && saved.upserts.every(validProduct) &&
      Array.isArray(saved.deleted) && saved.deleted.every((key: unknown) => typeof key === 'string')) return saved;
  } catch { /* fall through to an empty change set */ }
  return EMPTY_CHANGES;
}

export function mergeProducts(products: Product[], changes: Changes): Product[] {
  const replacements = new Map(changes.upserts.map(product => [product.key, product]));
  const existing = new Set(products.map(product => product.key));
  const deleted = new Set(changes.deleted);
  return [
    ...changes.upserts.filter(product => !existing.has(product.key)),
    ...products.map(product => replacements.get(product.key) ?? product),
  ].filter(product => !deleted.has(product.key));
}

export const upsertProduct = (changes: Changes, product: Product): Changes =>
  ({ ...changes, upserts: [product, ...changes.upserts.filter(item => item.key !== product.key)] });

/** Local products vanish entirely; API products are remembered as deleted so the overlay hides them. */
export const removeProduct = (changes: Changes, product: Product): Changes => ({
  upserts: changes.upserts.filter(item => item.key !== product.key),
  deleted: product.local || changes.deleted.includes(product.key) ? changes.deleted : [...changes.deleted, product.key],
});

/** Reverse of removeProduct, used by Undo. Safe to call twice. */
export const restoreProduct = (changes: Changes, product: Product): Changes =>
  product.local ? upsertProduct(changes, product) : { ...changes, deleted: changes.deleted.filter(key => key !== product.key) };

export const hasChanges = (changes: Changes) => changes.upserts.length > 0 || changes.deleted.length > 0;

export function toPayload(values: ProductFormValues): ProductPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    price: Number(values.price),
    stock: Number(values.stock),
    brand: values.brand.trim(),
    sku: values.sku.trim(),
    thumbnail: values.thumbnail.trim(),
  };
}

export function toFormValues(product?: Product): ProductFormValues {
  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    category: product?.category ?? '',
    price: product ? String(product.price) : '',
    stock: product ? String(product.stock) : '0',
    brand: product?.brand ?? '',
    sku: product?.sku ?? '',
    thumbnail: product?.thumbnail ?? '',
  };
}

/**
 * Build the stored product after a successful save.
 * DummyJSON's create response carries a placeholder id that is never stored, so created products are
 * flagged local and keyed by a client id; the placeholder is kept only for reference.
 */
export function buildSavedProduct(existing: Product | undefined, response: Partial<Product>, payload: ProductPayload, makeKey: () => string): Product {
  return {
    ...existing,
    ...response,
    ...payload,
    id: existing?.id ?? response.id ?? 0,
    key: existing?.key ?? makeKey(),
    rating: existing?.rating ?? 0,
    local: existing?.local ?? !existing,
  };
}

export function filterProducts(products: Product[], search: string, category: string, stock: StockFilter, sort: SortKey | string): Product[] {
  const query = search.trim().toLocaleLowerCase();
  const filtered = products.filter(product =>
    (!query || `${product.title} ${product.brand} ${product.sku}`.toLocaleLowerCase().includes(query)) &&
    (!category || product.category === category) &&
    (stock === 'all' || (stock === 'out' ? product.stock === 0 : isLowStock(product)))
  );
  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'stock') filtered.sort((a, b) => a.stock - b.stock);
  return filtered;
}

export function paginate<T>(items: T[], page: number, size: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * size;
  return { items: items.slice(start, start + size), page: current, pageCount, from: items.length ? start + 1 : 0, to: Math.min(start + size, items.length) };
}

/** Category options for the form: the API's category list, plus any category already in use (including the edited product's own). */
export function categoryOptions(apiCategories: string[], products: Product[], extra?: string): string[] {
  return [...new Set([...apiCategories, ...products.map(product => product.category), ...(extra ? [extra] : [])])].sort();
}
