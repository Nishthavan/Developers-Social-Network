const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(createProxyMiddleware("/api/**", {
    target: "http://[::1]:5000",
    secure: false,
    changeOrigin: true
  }));
};
