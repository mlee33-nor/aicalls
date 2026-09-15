const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, 'dist');
const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || '0.0.0.0';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml'
};

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const requested = path.resolve(root, `.${pathname}`);

  if (!requested.startsWith(`${root}${path.sep}`) && requested !== root) {
    response.writeHead(403);
    return response.end('Forbidden');
  }

  let file = requested === root ? path.join(root, 'index.html') : requested;
  if (!path.extname(file)) file = path.join(root, 'index.html');

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return response.end('Not found');
    }
    response.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': path.extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    response.end(data);
  });
}).listen(port, host, () => console.log(`NO RING AI listening on ${host}:${port}`));
