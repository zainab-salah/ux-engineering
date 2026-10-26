export interface Product {
  id: number;
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
  local?: boolean;
}

export interface Changes {
  upserts: Product[];
  deleted: string[];
}

export type StockFilter = 'all' | 'low' | 'out';
export const EMPTY_CHANGES: Changes = { upserts: [], deleted: [] };
export const STORAGE_KEY = 'shelf-catalog-changes-v1';
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
export const categoryName = (value: string) => value.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
export const stockStatus = (stock: number) => stock === 0 ? 'Out of stock' : stock <= 10 ? 'Low stock' : 'In stock';

export function mergeProducts(products: Product[], changes: Changes): Product[] {
  const replacements = new Map(changes.upserts.map(product => [product.key, product]));
  return [
    ...changes.upserts.filter(product => !products.some(existing => existing.key === product.key)),
    ...products.map(product => replacements.get(product.key) ?? product),
  ].filter(product => !changes.deleted.includes(product.key));
}

export function filterProducts(products: Product[], search: string, category: string, stock: StockFilter, sort: string): Product[] {
  const query = search.trim().toLocaleLowerCase();
  const filtered = products.filter(product =>
    (!query || `${product.title} ${product.brand} ${product.sku}`.toLocaleLowerCase().includes(query)) &&
    (!category || product.category === category) &&
    (stock === 'all' || (stock === 'out' ? product.stock === 0 : product.stock > 0 && product.stock <= 10))
  );
  if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'stock') filtered.sort((a, b) => a.stock - b.stock);
  return filtered;
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

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`https://dummyjson.com/products${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: options?.signal ?? AbortSignal.timeout(20000),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new Error('We couldn’t reach the catalog. Check your connection and try again.');
  }
  if (!response.ok) {
    let message = 'The request could not be completed. Please try again.';
    try { message = (await response.json()).message || message; } catch { /* Keep the useful fallback. */ }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}
