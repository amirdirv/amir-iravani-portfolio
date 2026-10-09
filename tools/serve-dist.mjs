// Serves the production build locally the way the cPanel host does:
// clean URLs (/it/projects/diar → …/index.html), trailing-slash redirects
// and the custom 404 page with a real 404 status.
//   npm run build && npm run serve:dist   →   http://localhost:4400
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { OUT } from './site-pages.mjs';

const PORT = Number(process.env.PORT) || 4400;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function send(res, status, file) {
  res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  let path = decodeURIComponent(url.pathname);
  if (path.includes('..') || /(^|\/)\.git(\/|$)/.test(path))
    return send(res, 403, join(OUT, '404.html'));
  if (path !== '/' && path.endsWith('/')) {
    res.writeHead(301, { Location: path.replace(/\/+$/, '') + url.search });
    return res.end();
  }
  const file = normalize(join(OUT, path));
  if (existsSync(file) && statSync(file).isFile()) return send(res, 200, file);
  const index = join(file, 'index.html');
  if (existsSync(index)) return send(res, 200, index);
  send(res, 404, join(OUT, '404.html'));
}).listen(PORT, () => console.log(`Serving ${OUT} at http://localhost:${PORT}`));
