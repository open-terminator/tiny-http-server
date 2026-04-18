<div align="center">

# tiny-http-server

A tiny dependency-free HTTP server in Node.js.

![Node](https://img.shields.io/badge/runtime-node-339933)
![Dependencies](https://img.shields.io/badge/dependencies-0-2ea44f)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

## Overview

`tiny-http-server` is a minimal HTTP server built with Node.js core modules only.

It starts fast, has no external dependencies, and responds with a small JSON payload that is useful for smoke tests, demos, and local debugging.

## Run

```bash
npm start
```

By default the server listens on `0.0.0.0:3000`.

## Example

```bash
curl http://127.0.0.1:3000
```

Example response:

```json
{
  "ok": true,
  "method": "GET",
  "url": "/",
  "timestamp": "2026-04-18T00:00:00.000Z"
}
```

## Configuration

- `PORT` sets the listening port
- `HOST` sets the bind address

## License

MIT
