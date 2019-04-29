import express from 'express';
import http from 'http';
import https from 'https';


import logger from './logger';
import certificate from './certificate';
import {
  createProxyMiddleware
} from './proxy';


/**
 * Create server
 *
 * @param {Object} config
 */
function createServer(config) {
  let server;

  const app = express();
  const vhostConf = config.vhost;
  const isHttps = vhostConf.https;
  const protocol = isHttps ? 'https' : 'http';
  const ssl = isHttps ? certificate.generate() : null;

  app.use(createProxyMiddleware(config, ssl));

  // remove `x-powered-by` header
  app.disable('x-powered-by');

  if (isHttps) {
    server = https.createServer({
      key: ssl.private,
      cert: ssl.cert,
    }, app);
  } else {
    server = http.createServer(app);
  }


  const message = `Open: ${protocol}://${vhostConf.name}:${vhostConf.port}`;
  server.listen(vhostConf.port, function () {
    logger.success('');
    logger.success('Started', 'server-start');
    logger.success(message, 'server-start');
    logger.success('');
  });
}

export {
  createServer,
};
