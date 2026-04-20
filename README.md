<div align="center">

# tiny-http-server

A tiny dependency-free HTTP server in Node.js.

![Node](https://img.shields.io/badge/runtime-node-339933)
![Dependencies](https://img.shields.io/badge/dependencies-0-2ea44f)
![Routes](https://img.shields.io/badge/routes-7-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

## Overview

`tiny-http-server` is a minimal HTTP server built with Node.js core modules only.

It starts quickly, has no external dependencies, serves a small static page, and exposes a few JSON endpoints that are useful for smoke tests, demos, and local debugging.

## Run

```bash
npm start
```

By default the server listens on `0.0.0.0:3000`.

Each completed request is logged to stdout as a single line:

```text
2026-04-18T00:00:00.000Z GET /api 200 2ms
```

## Endpoints

### `GET /`
Serves `public/index.html`.

### `GET /public/*`
Serves files from the local `public/` directory.

### `GET /api`
Returns the JSON overview payload.

### `GET /health`
Returns a simple health response with uptime.

### `GET /echo?message=hello`
Returns the provided `message` query parameter.

### `GET /headers`
Returns the request method, path, and headers as JSON.

### `POST /echo`
Accepts `application/json`, parses the request body, and echoes the JSON payload back.

If the body is not valid JSON, the server responds with `400 Bad Request`.

If the `Content-Type` is not `application/json`, the server responds with `415 Unsupported Media Type`.

## Examples

```bash
curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/public/index.html
curl http://127.0.0.1:3000/api
curl http://127.0.0.1:3000/health
curl 'http://127.0.0.1:3000/echo?message=hello'
curl http://127.0.0.1:3000/headers -H 'X-Debug: demo'
curl -X POST http://127.0.0.1:3000/echo \
  -H 'Content-Type: application/json' \
  -d '{"message":"hello","count":2}'
curl -X POST http://127.0.0.1:3000/echo \
  -H 'Content-Type: application/json' \
  -d '{"message":'
curl -X POST http://127.0.0.1:3000/echo \
  -H 'Content-Type: text/plain' \
  -d 'hello'
```

Example response from `/api`:

```json
{
  "ok": true,
  "name": "tiny-http-server",
  "endpoints": [
    "/",
    "/public/*",
    "/api",
    "/health",
    "/echo?message=hello",
    "/headers"
  ],
  "timestamp": "2026-04-18T00:00:00.000Z"
}
```

Example response from `/health`:

```json
{
  "ok": true,
  "status": "healthy",
  "uptimeSeconds": 3,
  "timestamp": "2026-04-18T00:00:00.000Z"
}
```

Example response from `/headers`:

```json
{
  "method": "GET",
  "path": "/headers",
  "headers": {
    "host": "127.0.0.1:3000",
    "user-agent": "curl/8.0.0",
    "accept": "*/*",
    "x-debug": "demo"
  }
}
```

Example response from `POST /echo`:

```json
{
  "ok": true,
  "payload": {
    "message": "hello",
    "count": 2
  },
  "timestamp": "2026-04-18T00:00:00.000Z"
}
```

Example response for invalid JSON:

```json
{
  "ok": false,
  "error": "Invalid JSON",
  "timestamp": "2026-04-18T00:00:00.000Z"
}
```

Example response for an unsupported `Content-Type`:

```json
{
  "ok": false,
  "error": "Unsupported media type",
  "expected": "application/json",
  "received": "text/plain",
  "timestamp": "2026-04-18T00:00:00.000Z"
}
```

## Configuration

- `PORT` sets the listening port
- `HOST` sets the bind address

## Notes

- Static file serving is intentionally small and dependency-free.
- Request logging is intentionally minimal and does not include headers, bodies, or client addresses.
- `GET /` maps to `public/index.html`.
- `GET /echo` reads from the query string; `POST /echo` reads a JSON body.
- `GET /headers` is useful for quick request inspection during local debugging.
- JSON endpoints remain simple and practical for local use.

## License

MIT
