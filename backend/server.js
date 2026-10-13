const http = require('http');
const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('?');
  const reqUrl = urlParts[0];

  // --- Backend API Endpoints ---
  if (reqUrl === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      service: 'Rakzs Studio API',
      studio: 'Rakzs Studio',
      timestamp: new Date().toISOString()
    }));
  }

  if ((reqUrl === '/api/enquire' || reqUrl === '/api/enquiry') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const { name, phone, date, city, message } = data;
        
        if (!name || !phone || !date) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Name, phone and date are required.' }));
        }

        const text = `Hi Rakzs Studio! I'm ${name} (${phone}).\nEvent date: ${date}${city ? '\nVenue / city: ' + city : ''}${message ? '\nDetails: ' + message : ''}\nPlease share availability and collection details.`;
        const waUrl = 'https://wa.me/918522059034?text=' + encodeURIComponent(text);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, waUrl }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // --- Static Frontend File Serving ---
  let reqPath = decodeURI(reqUrl);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(FRONTEND_DIR, reqPath);

  // Security check: prevent directory traversal outside FRONTEND_DIR
  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend server active on http://localhost:${PORT}`);
  console.log(`Serving frontend from: ${FRONTEND_DIR}`);
});
