<div align="center">

# tiny-http-server

A tiny dependency-free HTTP server in Node.js.

![Node](https://img.shields.io/badge/runtime-node-339933)
![Dependencies](https://img.shields.io/badge/dependencies-0-2ea44f)
![Routes](https://img.shields.io/badge/routes-3-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

## Overview

`tiny-http-server` is a minimal HTTP server built with Node.js core modules only.

It starts fast, has no external dependencies, and exposes a few simple JSON endpoints that are useful for smoke tests, demos, and local debugging.

## Run

```bash
npm start
```

By default the server listens on `0.0.0.0:3000`.

## Endpoints

### `GET /`
Returns a small overview payload.

### `GET /health`
Returns a simple health response with uptime.

### `GET /echo?message=hello`
Returns the provided `message` query parameter.

## Examples

```bash
curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/health
curl 'http://127.0.0.1:3000/echo?message=hello'
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

## Configuration

- `PORT` sets the listening port
- `HOST` sets the bind address

## License

MIT
