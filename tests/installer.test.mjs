import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const cli = fileURLToPath(new URL('../bin/install.mjs', import.meta.url));
test('installs portable skill and refuses to overwrite', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ux-install-'));
  try {
    const target = join(dir, 'ux-engineering');
    assert.equal(spawnSync(process.execPath, [cli, '--dest', target]).status, 0);
    assert.match(await readFile(join(target, 'SKILL.md'), 'utf8'), /name: ux-engineering/);
    assert.equal(spawnSync(process.execPath, [cli, '--dest', target]).status, 1);
    assert.match(await readFile(join(target, 'SKILL.md'), 'utf8'), /name: ux-engineering/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test('rejects unknown options and existing symlink destinations', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ux-install-'));
  try {
    assert.equal(spawnSync(process.execPath, [cli, '--force']).status, 1);
    const target = join(dir, 'ux-engineering');
    await symlink(join(dir, 'missing'), target);
    assert.equal(spawnSync(process.execPath, [cli, '--dest', target]).status, 1);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
