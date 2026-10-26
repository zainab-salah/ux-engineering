import { normalizeProduct, validProduct, type Product, type ProductPayload } from './products';

const BASE = 'https://dummyjson.com/products';

export class ApiError extends Error {
  constructor(message: string, readonly kind: 'network' | 'server' | 'timeout') { super(message); }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: options?.signal ?? AbortSignal.timeout(20000),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') throw new ApiError('The catalog took too long to answer. Try again.', 'timeout');
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('We couldn’t reach the catalog. Check your connection and try again.', 'network');
  }
  if (!response.ok) {
    let message = 'The request could not be completed. Please try again.';
    try { message = (await response.json()).message || message; } catch { /* keep the fallback */ }
    throw new ApiError(message, 'server');
  }
  return response.json() as Promise<T>;
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await apiRequest<{ products?: Record<string, unknown>[] }>('?limit=0', { signal });
  if (!Array.isArray(data.products)) throw new ApiError('The catalog returned an unexpected response. Please try again.', 'server');
  const products = data.products.map(normalizeProduct);
  if (!products.every(validProduct)) throw new ApiError('Some catalog information could not be read. Please try again.', 'server');
  return products;
}

export const fetchCategories = (signal?: AbortSignal) => apiRequest<string[]>('/category-list', { signal });
export const createProduct = (payload: ProductPayload) => apiRequest<Partial<Product>>('/add', { method: 'POST', body: JSON.stringify(payload) });
export const updateProduct = (id: number, payload: ProductPayload) => apiRequest<Partial<Product>>(`/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteProduct = (id: number) => apiRequest<{ isDeleted?: boolean }>(`/${id}`, { method: 'DELETE' });
