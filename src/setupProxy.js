const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1/*',
    createProxyMiddleware({
      target: 'https://54.38.208.206:5000/', // https://18.221.189.216/ // https://34.71.172.8/ // 51.68.208.96
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/support/*',
    createProxyMiddleware({
      target: 'https://54.38.208.206:5000/', // https://18.221.189.216/ // https://34.71.172.8/ // 51.68.208.96
      changeOrigin: true,
      secure: false,
    }),
  );
};
