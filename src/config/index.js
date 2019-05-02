import fs from 'fs';
import path from 'path';
import stripComments from 'strip-json-comments';


import debug from '../debug';


const privateApi = {};

/**
 * Synchronously read file contents.
 *
 * @param {String} filePath The filename to read.
 * @returns {String} The file contents, with the BOM removed.
 */
privateApi.readFile = (filePath) => (
  fs.readFileSync(filePath, 'utf8').replace(/^\ufeff/u, '')
);

/**
 * Loads a JSON configuration from a file.
 *
 * @param {String} filePath - The filename to load.
 * @returns {Object} config - The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 */
privateApi.loadJSONConfigFile = (filePath) => {
  debug.log(`Loading JSON config file: ${filePath}`);

  try {
    return JSON.parse(stripComments(privateApi.readFile(filePath)));
  } catch (e) {
    debug.log(`Error reading JSON file: ${filePath}`);
    e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
    e.messageData = {
      message: e.message,
      path: filePath,
    };
    throw e;
  }
};

/**
 * Test if the provided filePath represents a file
 *
 * @param {String} filePath
 * @returns {Boolean}
 */
privateApi.isFile = (filePath) => (
  fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()
);

/**
 * Test if the provided filePath represents a file
 *
 * @param {String} pathToResolve
 * @returns {String}
 * @throws {Error}
 */
privateApi.getAbsolutePath = (pathToResolve) => {
  const cwd = process.cwd();

  const absolutePath = path.isAbsolute(pathToResolve) ?
    pathToResolve : path.resolve(cwd, pathToResolve);

  if (privateApi.isFile(absolutePath)) {
    return absolutePath;
  }

  throw Error(` Cannot resolve config file: ${pathToResolve}\n cwd: ${cwd}`);
};

/**
 * Test if the provided config object is valid
 *
 * @param {Object} configObj
 * @throws {Error}
 */
privateApi.validate = (configObj) => {
  if (!configObj.vhost) {
    throw Error('Missing `vhost` property');
  }
  if (!configObj.vhost.name) {
    throw Error('Missing `vhost.name` property');
  }

  if (!configObj.source) {
    throw Error('Missing `source` property');
  }
  if (!configObj.source.name) {
    throw Error('Missing `source.name` property');
  }

  if (!configObj.deps) {
    throw Error('Missing `deps` property');
  }

  if (!Array.isArray(configObj.deps)) {
    throw Error('`deps` property should be an array');
  }

};

/**
 * Test if the provided config object is valid
 *
 * @param {Object} configObj
 * @throws {Error}
 */
privateApi.setDefaults = (configObj) => {
  configObj.vhost.https = configObj.vhost.https || false;
  const vhostHttps = configObj.vhost.https;
  if (!configObj.vhost.port) {
    vhostHttps ?
      configObj.vhost.port = 443 :
      configObj.vhost.port = 80;
  }

  configObj.source.https = configObj.source.https || false;
  const sourceHttps = configObj.source.https;
  if (!configObj.source.port) {
    sourceHttps ?
      configObj.source.port = 443 :
      configObj.source.port = 80;
  }

};


const service = {};

/**
 * Get configuration. If no path is provided will use `.amiddy` file
 *  that should be at the same level with package.json
 *
 * @param {String} [pathToResolve]
 * @returns {Object}
 */
service.get = (pathToResolve) => {
  const path = pathToResolve || '.amiddy';
  const absolutePath = privateApi.getAbsolutePath(path);

  const configObj = privateApi.loadJSONConfigFile(absolutePath);

  privateApi.validate(configObj);

  privateApi.setDefaults(configObj);

  return configObj;
};


// only for testing
export {privateApi};

export default service;
