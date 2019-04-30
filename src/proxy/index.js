import httpProxy from 'http-proxy';
import vhost from 'vhost';


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
  // source conf
  const source = config.source || {};
  // vhost conf
  const vhostConf = config.vhost || {};
  // base proxy config, can be overwritten by every dependency
  const proxyConf = config.proxy || {};
  // dependencies
  const deps = config.deps || [];

  return vhost(vhostConf.name, (req, res) => {

    const proxyOptions = {
      changeOrigin: proxyConf.changeOrigin || false,
      headers: {
        host: vhostConf.name,
      },
      secure: false,
      target: proxyUtils.buildUrl(source),
      ws: proxyConf.ws || false,
    };


    // get dependency that will proxy this request
    const dependency = proxyUtils.getDependency(deps, req.url);

    // extend proxy options if there is a dependency that will be used as proxy
    proxyUtils.extendOptions(proxyOptions, ssl, dependency);

    // proxy request
    proxy.proxyRequest(req, res, proxyOptions);
  });
}

export {
  createProxyMiddleware,
};
