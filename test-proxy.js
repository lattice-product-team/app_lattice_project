const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

const app = express();
const API_PREFIX = '/api/v1';

app.use(
  createProxyMiddleware({
    pathFilter: [`${API_PREFIX}/pois/**`, '/api/v1/pois'],
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const newPath = path.replace(API_PREFIX, '');
      console.log(`[Proxy] Rewriting: ${path} -> ${newPath}`);
      return newPath;
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] Forwarding: ${req.url} -> ${proxyReq.path}`);
      },
    },
  })
);

const server = app.listen(4000, () => {
  console.log('Proxy test server running on 4000');

  // Test the endpoint
  setTimeout(() => {
    http.get('http://localhost:4000/api/v1/pois/status', (res) => {
      console.log(`Response Status: ${res.statusCode}`);
      res.on('data', (d) => console.log(`Response Body: ${d}`));
      server.close();
      process.exit(0);
    });
  }, 1000);
});
