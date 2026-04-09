# QRMint MCP Server

[![npm](https://img.shields.io/npm/v/qrmint-mcp)](https://www.npmjs.com/package/qrmint-mcp)
[![Website](https://img.shields.io/badge/website-qrmint.dev-00f0ff)](https://qrmint.dev)
[![API Status](https://img.shields.io/badge/API-online-39ff14)](https://qrmint.dev/health)

> Integrate [QRMint](https://qrmint.dev) into Claude, Cursor, VS Code, and any MCP-compatible AI assistant.

**No API key required. Free forever.**

QRMint MCP Server is a thin stdio client that connects AI assistants to the [QRMint REST API](https://qrmint.dev/docs), enabling styled QR code generation directly from your AI workflow.

## Quick Start

Add to your MCP client configuration (e.g. `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "qrmint": {
      "command": "npx",
      "args": ["-y", "qrmint-mcp"]
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `generate_qr_code` | Generate a styled QR code from text or URL with customizable colors, styles, gradients, and frames |
| `generate_typed_qr` | Generate a QR code from structured data (WiFi, vCard, Email, Phone, SMS, Event, EPC, Geo) |
| `list_qr_types` | List all supported QR data types with their required and optional fields |
| `list_frames` | List all available QR code frame templates |

## Tool Usage Examples

### Generate a QR code for a URL

Generate QR codes for any URL — see the [URL QR code guide](https://qrmint.dev/qr-code-url) for formatting tips and examples.

```
Use generate_qr_code to create a QR code for https://example.com
```

### Generate a styled QR code with gradient

```
Generate a QR code for "Hello World" with rounded dots, circle eye shape,
a linear gradient from #ff00aa to #00f0ff, and size 400px
```

### Generate a WiFi QR code

```
Use generate_typed_qr to create a WiFi QR code with SSID "MyNetwork",
password "secret123", and WPA encryption
```

### Generate a vCard QR code

```
Create a vCard QR code for John Doe, email john@example.com, phone +1234567890
```

### List available frames

```
What QR code frames are available? Use list_frames to check.
```

## Architecture

This MCP server is a thin stdio client over the [QRMint REST API](https://qrmint.dev/docs).
All requests are forwarded to `https://qrmint.dev` -- no data is processed or stored locally.

| Transport | Usage |
|-----------|-------|
| **stdio** | `npx qrmint-mcp` -- for Claude Desktop, Cursor, VS Code |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `QRMINT_API_URL` | `https://qrmint.dev` | Override the API base URL |

## Part of SoftVoyagers

Part of the [SoftVoyagers](https://github.com/softvoyagers) free API portfolio.

| Product | Domain | Description |
|---------|--------|-------------|
| LinkMeta | [linkmeta.dev](https://linkmeta.dev) | URL metadata extraction API |
| PageShot | [pageshot.site](https://pageshot.site) | Screenshot & webpage capture API |
| PDFSpark | [pdfspark.dev](https://pdfspark.dev) | HTML/URL to PDF conversion API |
| OGForge | [ogforge.dev](https://ogforge.dev) | Open Graph image generator API |
| LinkShrink | [linkshrink.dev](https://linkshrink.dev) | Privacy-first URL shortener API |
| Faktuj | [faktuj.pl](https://faktuj.pl) | Polish invoice generator |
| QRMint | [qrmint.dev](https://qrmint.dev) | Styled QR code generator API |
| PageDrop | [pagedrop.dev](https://pagedrop.dev) | Instant HTML hosting API |
| PismoSzyteNaMiarę | [pismoszytenamiare.pl](https://pismoszytenamiare.pl) | AI-powered formal letter generator (Polish) |

## License

MIT
