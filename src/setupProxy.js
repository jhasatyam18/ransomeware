const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1/*',
    createProxyMiddleware({
      target: 'https://18.221.189.216:5000/',
      changeOrigin: true,
      secure: false,
    }),
  );
};
