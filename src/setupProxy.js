const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1/*',
    createProxyMiddleware({
      target: 'https://51.68.208.96:5000/',
      changeOrigin: true,
      secure: false,
    }),
  );
};
