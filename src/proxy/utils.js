import url from 'url';


const service = {};

/**
 * Build url
 *
 * @param {Object} options - data for url builder
 * @returns {String}
 */
service.buildUrl = (options) => {
  const opt = options || {};

  const urlOptions = {
    hostname: opt.name || '127.0.0.1',
    protocol: opt.https ? 'https' : 'http',
    port: opt.port || 3000,
    slashes: true
  };

  return url.format(urlOptions);
};

export default service;
