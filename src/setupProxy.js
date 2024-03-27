const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		"/auth/**",
		createProxyMiddleware({
			target: "http://localhost:5001",
			changeOrigin: true, // Change the origin of the host header
		}),
	);
};
