// Writes routes.txt — the URL list the Angular builder prerenders.
// Derived from src/app/data/profile.ts, so adding a project adds its pages.
//   node tools/routes.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/app/data/profile.ts'), 'utf8');
const block = source.slice(
  source.indexOf('export const PROJECTS'),
  source.indexOf('export const EDUCATION'),
);
const ids = [...block.matchAll(/^ {4}id: '([a-z0-9-]+)',$/gm)].map((m) => m[1]);
if (!ids.length) throw new Error('No project ids found in profile.ts');

const prefixes = ['', '/it', '/fa'];
const routes = [
  ...prefixes.flatMap((p) => [
    p || '/',
    `${p}/projects`,
    ...ids.map((id) => `${p}/projects/${id}`),
  ]),
  '/404',
];

writeFileSync(join(root, 'routes.txt'), routes.join('\n') + '\n');
console.log(
  `routes.txt: ${routes.length} routes (${ids.length} projects × 3 languages + home, list, 404)`,
);
