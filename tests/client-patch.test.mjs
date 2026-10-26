import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clientPatch } from '../examples/client-patch.mjs';

test('preserves opaque ID and code, excludes display labels', () => {
  assert.deepEqual(clientPatch({ owner: { id: '007-x', label: 'Sample' }, country: { code: 'TR', label: 'Türkiye' } }, ['owner_id', 'country']), { owner_id: '007-x', country: 'TR' });
});
test('omitted owner and explicit clearing remain distinct', () => {
  assert.deepEqual(clientPatch({ name: 'Example' }, ['name']), { name: 'Example' });
  assert.deepEqual(clientPatch({ owner: null }, ['owner_id']), { owner_id: null });
});
test('rejects read-only writes and malformed selections without mutating draft', () => {
  const draft = { owner: { id: 'a', label: 'A' } };
  assert.throws(() => clientPatch(draft, ['name']), /not writable/);
  assert.deepEqual(draft, { owner: { id: 'a', label: 'A' } });
  assert.throws(() => clientPatch({ created_at: 'today' }, ['created_at']), /Unknown/);
  assert.throws(() => clientPatch({ owner: '' }, ['owner_id']), /Choose/);
  assert.throws(() => clientPatch({ country: { code: 'Türkiye' } }, ['country']), /country/);
});
