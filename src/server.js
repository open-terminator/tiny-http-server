const http = require('http');
const { URL } = require('url');

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const now = new Date().toISOString();

  if (req.method === 'GET' && url.pathname === '/') {
    return sendJson(res, 200, {
      ok: true,
      name: 'tiny-http-server',
      endpoints: ['/', '/health', '/echo?message=hello'],
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
