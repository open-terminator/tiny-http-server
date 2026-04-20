const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const publicDir = path.join(__dirname, '..', 'public');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

function sendText(res, statusCode, body) {
  res.writeHead(statusCode, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(body);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'));
    });

    req.on('error', reject);
  });
}

function logRequest(req, res, startedAt) {
  const durationMs = Date.now() - startedAt;
  const timestamp = new Date().toISOString();
  const method = req.method || 'UNKNOWN';
  const pathName = req.url ? req.url.split('?', 1)[0] : '/';

  console.log(`${timestamp} ${method} ${pathName} ${res.statusCode} ${durationMs}ms`);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        return sendText(res, 404, 'Not found');
      }

      return sendText(res, 500, 'Internal server error');
    }

    const contentType = contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': contentType });
    res.end(data);
  });
}

function resolvePublicPath(urlPath) {
  const relativePath = urlPath === '/' || urlPath === '/public/' ? 'index.html' : urlPath.replace(/^\/public\//, '');
  const normalizedPath = path.normalize(decodeURIComponent(relativePath)).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(publicDir, normalizedPath);

  if (!filePath.startsWith(publicDir + path.sep) && filePath !== publicDir) {
    return null;
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    logRequest(req, res, startedAt);
  });

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const now = new Date().toISOString();

  if (req.method === 'GET' && url.pathname === '/') {
    return serveFile(res, path.join(publicDir, 'index.html'));
  }

  if (req.method === 'GET' && url.pathname === '/api') {
    return sendJson(res, 200, {
      ok: true,
      name: 'tiny-http-server',
      endpoints: ['/', '/public/*', '/api', '/health', '/echo?message=hello', '/headers'],
      timestamp: now,
    });
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, {
      ok: true,
      status: 'healthy',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: now,
    });
  }

  if (req.method === 'GET' && url.pathname === '/echo') {
    return sendJson(res, 200, {
      ok: true,
      message: url.searchParams.get('message') || '',
      timestamp: now,
    });
  }

  if (req.method === 'GET' && url.pathname === '/headers') {
    return sendJson(res, 200, {
      method: req.method,
      path: url.pathname,
      headers: req.headers,
    });
  }

  if (req.method === 'POST' && url.pathname === '/echo') {
    const contentType = (req.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();

    if (contentType !== 'application/json') {
      return sendJson(res, 415, {
        ok: false,
        error: 'Unsupported media type',
        expected: 'application/json',
        received: contentType || null,
        timestamp: now,
      });
    }

    return readRequestBody(req)
      .then((rawBody) => {
        let payload;

        try {
          payload = JSON.parse(rawBody);
        } catch {
          return sendJson(res, 400, {
            ok: false,
            error: 'Invalid JSON',
            timestamp: now,
          });
        }

        return sendJson(res, 200, {
          ok: true,
          payload,
          timestamp: now,
        });
      })
      .catch(() => {
        return sendJson(res, 500, {
          ok: false,
          error: 'Internal server error',
          timestamp: now,
        });
      });
  }

  if (req.method === 'GET' && url.pathname.startsWith('/public/')) {
    const filePath = resolvePublicPath(url.pathname);

    if (!filePath) {
      return sendText(res, 403, 'Forbidden');
    }

    return serveFile(res, filePath);
  }

  return sendJson(res, 404, {
    ok: false,
    error: 'Not found',
    method: req.method,
    path: url.pathname,
    timestamp: now,
  });
});

server.listen(port, host, () => {
  console.log(`tiny-http-server listening on http://${host}:${port}`);
});
