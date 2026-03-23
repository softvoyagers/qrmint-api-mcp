// @ts-nocheck
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const API_BASE = process.env.QRMINT_API_URL || 'https://qrmint.dev';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'qrmint-mcp',
    version: '1.3.0',
  });

  server.tool(
    'generate_qr_code',
    'Generate a styled QR code from text or URL. Returns a base64-encoded image.',
    {
      data: z.string().describe('The text or URL to encode in the QR code'),
      foreground: z.string().optional().describe('Foreground color as hex (e.g. #000000)'),
      background: z.string().optional().describe('Background color as hex (e.g. #ffffff)'),
      size: z.number().optional().describe('Image size in pixels (e.g. 300)'),
      format: z.enum(['png', 'svg']).optional().describe('Output image format'),
      style: z.enum(['square', 'rounded', 'dots', 'classy-rounded']).optional().describe('QR dot style'),
      eyeShape: z.enum(['square', 'rounded', 'circle', 'leaf']).optional().describe('QR eye/finder pattern shape'),
      gradientType: z.enum(['linear', 'radial']).optional().describe('Gradient type for foreground'),
      gradientColors: z.array(z.string()).optional().describe('Array of hex color strings for gradient'),
      gradientAngle: z.number().optional().describe('Gradient angle in degrees (for linear gradient)'),
      frameId: z.string().optional().describe('Frame template ID (use list_frames to see available frames)'),
      frameLabel: z.string().optional().describe('Text label to display on the frame'),
    },
    async ({ data, foreground, background, size, format, style, eyeShape, gradientType, gradientColors, gradientAngle, frameId, frameLabel }) => {
      const body: Record<string, unknown> = { data, output: 'base64' };
      if (foreground) body.foreground = foreground;
      if (background) body.background = background;
      if (size) body.size = size;
      if (format) body.format = format;
      if (style) body.style = style;
      if (eyeShape) body.eyeShape = eyeShape;
      if (gradientType) body.gradientType = gradientType;
      if (gradientColors) body.gradientColors = gradientColors;
      if (gradientAngle !== undefined) body.gradientAngle = gradientAngle;
      if (frameId) body.frameId = frameId;
      if (frameLabel) body.frameLabel = frameLabel;

      const response = await fetch(`${API_BASE}/api/v1/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [{ type: 'text' as const, text: `QRMint API error (${response.status}): ${errorText}` }],
          isError: true,
        };
      }

      const result = await response.json();
      const mimeType = (format === 'svg') ? 'image/svg+xml' : 'image/png';

      if (result.base64) {
        return {
          content: [
            {
              type: 'image' as const,
              data: result.base64,
              mimeType,
            },
          ],
        };
      }

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'generate_typed_qr',
    'Generate a QR code from structured data (WiFi, vCard, Email, Phone, SMS, Event, EPC, Geo). Returns a base64-encoded image.',
    {
      type: z.enum(['wifi', 'vcard', 'email', 'phone', 'sms', 'event', 'epc', 'geo']).describe('QR data type'),
      fields: z.record(z.string(), z.string()).describe('Type-specific fields as key-value pairs (e.g. {"ssid":"MyWifi","password":"secret","encryption":"WPA"} for wifi)'),
      foreground: z.string().optional().describe('Foreground color as hex (e.g. #000000)'),
      background: z.string().optional().describe('Background color as hex (e.g. #ffffff)'),
      size: z.number().optional().describe('Image size in pixels (e.g. 300)'),
      format: z.enum(['png', 'svg']).optional().describe('Output image format'),
      style: z.enum(['square', 'rounded', 'dots', 'classy-rounded']).optional().describe('QR dot style'),
      eyeShape: z.enum(['square', 'rounded', 'circle', 'leaf']).optional().describe('QR eye/finder pattern shape'),
      gradientType: z.enum(['linear', 'radial']).optional().describe('Gradient type for foreground'),
      gradientColors: z.array(z.string()).optional().describe('Array of hex color strings for gradient'),
      frameId: z.string().optional().describe('Frame template ID'),
      frameLabel: z.string().optional().describe('Text label to display on the frame'),
    },
    async ({ type, fields, foreground, background, size, format, style, eyeShape, gradientType, gradientColors, frameId, frameLabel }) => {
      const body: Record<string, unknown> = { type, ...fields, output: 'base64' };
      if (foreground) body.foreground = foreground;
      if (background) body.background = background;
      if (size) body.size = size;
      if (format) body.format = format;
      if (style) body.style = style;
      if (eyeShape) body.eyeShape = eyeShape;
      if (gradientType) body.gradientType = gradientType;
      if (gradientColors) body.gradientColors = gradientColors;
      if (frameId) body.frameId = frameId;
      if (frameLabel) body.frameLabel = frameLabel;

      const response = await fetch(`${API_BASE}/api/v1/generate/typed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [{ type: 'text' as const, text: `QRMint API error (${response.status}): ${errorText}` }],
          isError: true,
        };
      }

      const result = await response.json();
      const mimeType = (format === 'svg') ? 'image/svg+xml' : 'image/png';

      if (result.base64) {
        return {
          content: [
            {
              type: 'image' as const,
              data: result.base64,
              mimeType,
            },
          ],
        };
      }

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    'list_qr_types',
    'List all supported QR data types (WiFi, vCard, Email, etc.) with their required and optional fields.',
    {},
    async () => {
      const response = await fetch(`${API_BASE}/api/v1/types`);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [{ type: 'text' as const, text: `QRMint API error (${response.status}): ${errorText}` }],
          isError: true,
        };
      }

      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    'list_frames',
    'List all available QR code frame templates with their IDs and descriptions.',
    {},
    async () => {
      const response = await fetch(`${API_BASE}/api/v1/frames`);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [{ type: 'text' as const, text: `QRMint API error (${response.status}): ${errorText}` }],
          isError: true,
        };
      }

      const data = await response.json();
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  return server;
}
