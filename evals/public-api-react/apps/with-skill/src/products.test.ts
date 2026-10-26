import { describe, expect, it } from 'vitest';
import {
  buildSavedProduct, categoryOptions, EMPTY_CHANGES, filterProducts, hasChanges, mergeProducts, normalizeProduct, paginate, parseChanges,
  removeProduct, restoreProduct, stockStatus, toPayload, upsertProduct, validProduct, type Product,
} from './products';
import { productFormSchema } from './schema';

const item: Product = { id: 1, key: '1', title: 'Green Chair', description: '', category: 'furniture', price: 80, stock: 6, brand: 'Home', sku: 'C-01', thumbnail: '', rating: 0 };
const local: Product = { ...item, id: 195, key: 'local-a', local: true, title: 'New chair' };

describe('local overlay', () => {
  it('replaces, adds and deletes without duplicating', () => {
    const changed = { ...item, price: 95 };
    expect(mergeProducts([item], { upserts: [local, changed], deleted: [] })).toEqual([local, changed]);
    expect(mergeProducts([item], { upserts: [changed], deleted: ['1'] })).toEqual([]);
  });

  it('removes a local product entirely but remembers a deleted API product', () => {
    expect(removeProduct({ upserts: [local], deleted: [] }, local)).toEqual(EMPTY_CHANGES);
    expect(removeProduct(EMPTY_CHANGES, item)).toEqual({ upserts: [], deleted: ['1'] });
    expect(removeProduct({ upserts: [], deleted: ['1'] }, item).deleted).toEqual(['1']);
  });

  it('undoes a delete for both kinds of product', () => {
    expect(restoreProduct(removeProduct(EMPTY_CHANGES, item), item)).toEqual(EMPTY_CHANGES);
    expect(restoreProduct(removeProduct({ upserts: [local], deleted: [] }, local), local).upserts).toEqual([local]);
  });

  it('upsert puts the newest edit first and keeps one copy per key', () => {
    const next = upsertProduct(upsertProduct(EMPTY_CHANGES, local), { ...local, title: 'Renamed' });
    expect(next.upserts).toHaveLength(1);
    expect(next.upserts[0].title).toBe('Renamed');
    expect(hasChanges(next)).toBe(true);
    expect(hasChanges(EMPTY_CHANGES)).toBe(false);
  });

  it('ignores malformed stored data', () => {
    expect(parseChanges('not json')).toEqual(EMPTY_CHANGES);
    expect(parseChanges(JSON.stringify({ upserts: [{ ...item, stock: -1 }], deleted: [] }))).toEqual(EMPTY_CHANGES);
    expect(parseChanges(JSON.stringify({ upserts: [item], deleted: ['2'] })).deleted).toEqual(['2']);
    expect(parseChanges(null)).toEqual(EMPTY_CHANGES);
  });
});

describe('saved product semantics', () => {
  const payload = toPayload({ title: ' Desk ', description: '', category: 'furniture', price: '40.5', stock: '3', brand: ' ', sku: '', thumbnail: '' });

  it('trims and converts the payload at the API boundary', () => {
    expect(payload).toMatchObject({ title: 'Desk', price: 40.5, stock: 3, brand: '' });
  });

  it('flags created products as local and ignores the placeholder id for identity', () => {
    const created = buildSavedProduct(undefined, { id: 195 }, payload, () => 'local-x');
    expect(created).toMatchObject({ local: true, key: 'local-x', id: 195 });
  });

  it('keeps identity and local flag on edits', () => {
    expect(buildSavedProduct(item, { id: 1 }, payload, () => 'unused')).toMatchObject({ key: '1', local: false, id: 1, title: 'Desk' });
    expect(buildSavedProduct(local, {}, payload, () => 'unused')).toMatchObject({ key: 'local-a', local: true });
  });
});

describe('listing', () => {
  const out = { ...item, id: 2, key: '2', title: 'Desk', stock: 0, price: 40 };
  it('combines search, category, stock and sort without mutating the input', () => {
    const products = [item, out];
    expect(filterProducts(products, 'home', 'furniture', 'low', 'price-asc')).toEqual([item]);
    expect(filterProducts(products, '', '', 'out', 'name')).toEqual([out]);
    expect(filterProducts(products, '', '', 'all', 'price-asc')).toEqual([out, item]);
    expect(products).toEqual([item, out]);
  });
  it('paginates and clamps out-of-range pages', () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    expect(paginate(items, 3, 10)).toMatchObject({ page: 3, pageCount: 3, from: 21, to: 25, items: [20, 21, 22, 23, 24] });
    expect(paginate(items, 9, 10).page).toBe(3);
    expect(paginate([], 1, 10)).toMatchObject({ from: 0, to: 0, pageCount: 1 });
  });
  it('distinguishes out of stock from low stock and validates records', () => {
    expect(stockStatus(0)).toBe('Out of stock');
    expect(stockStatus(10)).toBe('Low stock');
    expect(stockStatus(11)).toBe('In stock');
    expect(validProduct(item)).toBe(true);
    expect(validProduct({ ...item, price: '80' })).toBe(false);
  });
  it('normalizes missing API fields', () => {
    expect(normalizeProduct({ id: 7, title: 'x', category: 'a', price: 1, stock: 1 })).toMatchObject({ key: '7', brand: '', sku: '', thumbnail: '', description: '', rating: 0 });
  });
  it('keeps an in-use category selectable even if the API list lacks it', () => {
    expect(categoryOptions(['beauty'], [item], 'legacy')).toEqual(['beauty', 'furniture', 'legacy']);
  });
});

describe('form schema', () => {
  const valid = { title: 'Desk', category: 'furniture', brand: '', price: '19.99', stock: '0', sku: '', description: '', thumbnail: '' };
  const errorsFor = (patch: object) => {
    const result = productFormSchema.safeParse({ ...valid, ...patch });
    return result.success ? [] : result.error.issues.map(issue => String(issue.path[0]));
  };
  it('accepts a valid product', () => expect(errorsFor({})).toEqual([]));
  it('requires name and category', () => expect(errorsFor({ title: '  ', category: '' }).sort()).toEqual(['category', 'title']));
  it('rejects bad prices instead of coercing blanks to zero', () => {
    for (const price of ['', 'abc', '-1', '1.234', '1e3']) expect(errorsFor({ price })).toContain('price');
    expect(errorsFor({ price: '0' })).toEqual([]);
  });
  it('requires whole, non-negative stock', () => {
    for (const stock of ['', '1.5', '-2', 'x']) expect(errorsFor({ stock })).toContain('stock');
  });
  it('allows blank image URL but only http(s) otherwise', () => {
    expect(errorsFor({ thumbnail: '' })).toEqual([]);
    expect(errorsFor({ thumbnail: 'https://x.test/a.png' })).toEqual([]);
    expect(errorsFor({ thumbnail: 'javascript:alert(1)' })).toContain('thumbnail');
    expect(errorsFor({ thumbnail: 'nope' })).toContain('thumbnail');
  });
});
