/**
 * Static file server Lambda entry point template for frontend distribution.
 */
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function respond(statusCode, headers, body) {
  return {
    statusCode,
    headers,
    body: Buffer.from(body).toString('base64'),
    isBase64Encoded: true,
  };
}

module.exports.handler = async (event) => {
  try {
    let filePath = event.path || '/';
    if (filePath === '/') {
      filePath = '/index.html';
    }

    const fullPath = path.join(distDir, filePath);
    if (!fullPath.startsWith(distDir)) {
      return respond(403, { 'Content-Type': 'text/plain' }, 'Forbidden');
    }

    const body = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    return respond(200, { 'Content-Type': CONTENT_TYPES[ext] || 'application/octet-stream' }, body);
  } catch (error) {
    if (error.code === 'ENOENT') {
      try {
        const body = fs.readFileSync(path.join(distDir, 'index.html'));
        return respond(200, { 'Content-Type': 'text/html; charset=utf-8' }, body);
      } catch (notFound) {
        return respond(404, { 'Content-Type': 'text/plain' }, 'Not Found');
      }
    }
    console.error('Frontend handler error:', error);
    return respond(500, { 'Content-Type': 'text/plain' }, 'Internal Server Error');
  }
};
