const { createProxyMiddleware } = require('http-proxy-middleware');
const querystring = require('querystring');

module.exports = function (app) {
  app.use(
    ['/api', '/auth/google'],
    createProxyMiddleware({
      target: 'http://localhost:5000',
      onProxyReq: (proxyReq, req, res) => {
        if (!req.body || !Object.keys(req.body).length) {
          return;
        }

        const contentType = proxyReq.getHeader('Content-Type');
        const writeBody = (bodyData) => {
          proxyReq.setHeader(
            'Content-Length', Buffer.byteLength(bodyData)
          );
          proxyReq.write(bodyData);
        };

        // ADD SUPPORT FOR contentType: 'application/json; charset:utf-8'
        if (contentType && contentType.includes('application/json')) {
          writeBody(JSON.stringify(req.body));
        }

        if (contentType === 'application/x-www-form-urlencoded') {
          writeBody(querystring.stringify(req.body));
        }
      }
    })
  );
};
