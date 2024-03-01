const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/v1/*',
    createProxyMiddleware({
      target: 'https://51.68.202.155:5000/', // https://18.221.189.216/ 3.218.156.149// https://34.71.172.8/ // 51.68.208.96
      changeOrigin: true,
      secure: false,
    /** Below code is not used for debuging purposes 
     * whenever we want to see which request is going from setupProxy below codes need to be uncommented
     logLevel: 'debug',
       onProxyRes: (proxyRes, req, res) => {
        const exchange = `[${req.method}] [${proxyRes.statusCode}] ${req.path} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path}`;
        console.log(exchange);
      }
      */
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