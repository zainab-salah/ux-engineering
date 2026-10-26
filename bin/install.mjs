#!/usr/bin/env node
import { cp, lstat, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('ux-engineering [--global | --dest PATH]\nDefault: .agents/skills/ux-engineering in the current project. Existing skills are never overwritten.');
  process.exit(0);
}
if (!(args.length === 0 || (args.length === 1 && args[0] === '--global') ||
      (args.length === 2 && args[0] === '--dest' && args[1] && !args[1].startsWith('--')))) {
  console.error('Use --help for supported installation options.');
  process.exit(1);
}
const target = args[0] === '--dest' ? resolve(args[1]) : join(args[0] === '--global' ? homedir() : process.cwd(), '.agents', 'skills', 'ux-engineering');
const source = fileURLToPath(new URL('../skills/ux-engineering/', import.meta.url));
let created = false;
try {
  try {
    await lstat(target);
    throw new Error(`Already exists: ${target}. Review it before replacing it.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await mkdir(dirname(target), { recursive: true });
  await mkdir(target);
  created = true;
  for (const entry of await readdir(source)) {
    await cp(join(source, entry), join(target, entry), { recursive: true, errorOnExist: true, force: false });
  }
  console.log(`Installed UX Engineering: ${target}\nReload your agent's skills if needed, then use $ux-engineering.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (created && process.exitCode === 1) await rm(target, { recursive: true, force: true });
}
