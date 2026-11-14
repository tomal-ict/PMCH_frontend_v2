import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5000';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  // 1. Proxy API requests to backend
  if (req.url.startsWith('/api')) {
    const backendReq = http.request(
      `${BACKEND_URL}${req.url}`,
      {
        method: req.method,
        headers: {
          ...req.headers,
          host: '127.0.0.1:5000'
        }
      },
      (backendRes) => {
        res.writeHead(backendRes.statusCode, backendRes.headers);
        backendRes.pipe(res);
      }
    );

    backendReq.on('error', (err) => {
      console.error('API Proxy error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Backend service unreachable' }));
    });

    req.pipe(backendReq);
    return;
  }

  // 2. Normalize requested path (strip query params)
  const cleanUrl = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, cleanUrl);

  // If path is root or a directory, check for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // If file exists in dist, serve it directly
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 3. SPA Fallback: For all other routes, serve dist/index.html
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(indexPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('PMCH dist folder not found. Please run "npm run build" first.');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 PMCH Production Frontend Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static files from: ${DIST_DIR}`);
});
