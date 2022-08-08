const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1/*',
    createProxyMiddleware({
      target: 'https://20.216.170.187:5000/', // https://18.221.189.216/ 3.218.156.149// https://34.71.172.8/ // 51.68.208.96
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/support/*',
    createProxyMiddleware({
      target: 'https://20.216.170.187:5000/', // https://18.221.189.216/ // https://34.71.172.8/ // 51.68.208.96
      changeOrigin: true,
      secure: false,
    }),
  );
};
