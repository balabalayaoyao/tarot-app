/**
 * 轻量 Anthropic API 代理
 * 解决浏览器直连 api.anthropic.com 的 CORS 问题
 * 运行: node proxy-server.mjs
 */
import http from 'http';
import https from 'https';

const PORT = 3001;
const ANTHROPIC_HOST = 'api.anthropic.com';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!API_KEY) {
  console.error('❌ 请设置环境变量 ANTHROPIC_API_KEY');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version, anthropic-beta');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/v1/messages') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  // Collect request body
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);

    const options = {
      hostname: ANTHROPIC_HOST,
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15',
      },
    };

    const proxyReq = https.request(options, proxyRes => {
      // Stream SSE back to client
      res.writeHead(proxyRes.statusCode, {
        'Content-Type': proxyRes.headers['content-type'] || 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', err => {
      console.error('代理请求失败:', err.message);
      if (!res.headersSent) {
        res.writeHead(502);
        res.end(JSON.stringify({ error: err.message }));
      }
    });

    proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`✅ 代理服务器已启动: http://localhost:${PORT}`);
  console.log(`   转发至: https://${ANTHROPIC_HOST}/v1/messages`);
});
