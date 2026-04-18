const http = require('http');

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
  const body = {
    ok: true,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  };

  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
});

server.listen(port, host, () => {
  console.log(`tiny-http-server listening on http://${host}:${port}`);
});
