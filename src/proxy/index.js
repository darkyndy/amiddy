import httpProxy from 'http-proxy';
import vhost from 'vhost';
import micromatch from 'micromatch';


import proxyListen from './listen';
import proxyUtils from './utils';


// create proxy
const proxy = httpProxy.createProxyServer();

// request
proxy.on('proxyReq', proxyListen.request);

// response
proxy.on('proxyRes', proxyListen.response);

// error
proxy.on('error', proxyListen.error);


/**
 * Create proxy middleware.
 * Return `vhost` middleware.
 *
 * @param {Object} config
 * @param {Object} ssl
 * @return {Object}
 */
function createProxyMiddleware(config, ssl) {
  const api = config.api;
  const dev = config.dev;
  const apiUrl = proxyUtils.buildUrl(api);
  const devUrl = proxyUtils.buildUrl(dev.sourcehost);

  return vhost(dev.vhost.name, function (req, res) {
    const proxyOptions = {
      target: devUrl,
      changeOrigin: false,
      secure: false,
    };

    if (api.https) {
      if (ssl) {
        proxyOptions.ssl = {
          key: ssl.private,
          cert: ssl.cert,
        };
      }

      proxyOptions.headers = {host: dev.vhost.name};
    }

    if (api.routes && api.routes.length) {
      const matches = micromatch(req.url, api.routes);

      if (matches && matches.length) {
        proxyOptions.target = apiUrl;
      }
    }

    // Proxy requests
    proxy.proxyRequest(req, res, proxyOptions);
  });
}

export {
  createProxyMiddleware,
};
