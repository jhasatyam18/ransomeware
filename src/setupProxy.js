const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1/*',
    createProxyMiddleware({
      target: 'https://20.204.63.250:5000/', // https://18.221.189.216/ 3.218.156.149// https://34.71.172.8/ // 51.68.208.96
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyRes: (proxyRes, req, res) => {
        const exchange = `[${req.method}] [${proxyRes.statusCode}] ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path}`;
        console.log(exchange);
      }
    }),
  );
  app.use(
    '/support/*',
    createProxyMiddleware({
      target: 'https://54.38.208.203:5000/', // https://18.221.189.216/ // https://34.71.172.8/ // 51.68.208.96
      changeOrigin: true,
      secure: false,
    }),
  );
};