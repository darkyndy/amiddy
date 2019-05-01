
import micromatch from 'micromatch';
import url from 'url';


const service = {};

/**
 * Build url
 *
 * @param {Object} [options] - data for url builder
 * @returns {String}
 */
service.buildUrl = (options) => {
  const opt = options || {};

  const urlOptions = {
    hostname: opt.name || '127.0.0.1',
    port: opt.port || 3000,
    protocol: opt.https ? 'https' : 'http',
    slashes: true,
  };

  return url.format(urlOptions);
};

/**
 * Get dependency that should be used to proxy this request
 *
 * @param {Array<Object>} deps - dependencies that can be used for proxy
 * @param {String} reqUrl - request url
 * @return {Object} [dependency]
 */
service.getDependency = (deps, reqUrl) => (
  deps.find(
    (dep) => {
      const {
        patterns,
      } = dep || {};

      return micromatch.isMatch(reqUrl, (patterns || []), {contains: true});
    }
  )
);

/**
 * Extend proxy options
 *
 * @param {Object} proxyOptions
 * @param {Object} [ssl]
 * @param {Object} [dependency] - dependency that should be used to proxy this request
 */
service.extendOptions = (proxyOptions, ssl, dependency) => {
  if (dependency) {
    // we have matching dependency for request url
    proxyOptions.target = service.buildUrl(dependency);

    if (dependency.https) {
      if (ssl) {
        proxyOptions.ssl = {
          cert: ssl.cert,
          key: ssl['private'],
        };
      }

    }

    // TODO other options
  }
};

export default service;
