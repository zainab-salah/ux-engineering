import assert from 'node:assert/strict';
import test from 'node:test';
import { filterProducts, mergeProducts, stockStatus, validProduct, type Product } from './products.ts';

const item: Product = { id: 1, key: '1', title: 'Green Chair', description: '', category: 'furniture', price: 80, stock: 6, brand: 'Home', sku: 'C-01', thumbnail: '', rating: 0 };

test('local changes replace, add, and delete products without duplicating them', () => {
  const added = { ...item, key: 'local-1', local: true, title: 'New chair' };
  const changed = { ...item, price: 95 };
  assert.deepEqual(mergeProducts([item], { upserts: [added, changed], deleted: [] }), [added, changed]);
  assert.deepEqual(mergeProducts([item], { upserts: [changed], deleted: ['1'] }), []);
});

test('search, category, stock and sort work together without changing the catalog', () => {
  const out = { ...item, id: 2, key: '2', title: 'Desk', stock: 0, price: 40 };
  const products = [item, out];
  assert.deepEqual(filterProducts(products, 'home', 'furniture', 'low', 'price-asc'), [item]);
  assert.deepEqual(filterProducts(products, '', '', 'out', 'name'), [out]);
  assert.deepEqual(filterProducts(products, '', '', 'all', 'price-asc'), [out, item]);
  assert.deepEqual(products, [item, out]);
});

test('zero stock is distinct from low stock, and invalid stored data is rejected', () => {
  assert.equal(stockStatus(0), 'Out of stock');
  assert.equal(stockStatus(10), 'Low stock');
  assert.equal(stockStatus(11), 'In stock');
  assert.equal(validProduct(item), true);
  assert.equal(validProduct({ ...item, stock: -1 }), false);
  assert.equal(validProduct({ ...item, price: '80' }), false);
});
