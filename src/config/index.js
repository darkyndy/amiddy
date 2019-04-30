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
    e.messageTemplate = 'failed-to-read-json';
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

  throw ` Cannot resolve config file: ${pathToResolve}\n cwd: ${cwd}`;
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

  return privateApi.loadJSONConfigFile(absolutePath);
};


// only for testing
export {privateApi};

export default service;
