
import config from './config';
import debug from './debug';
import {
  createServer,
} from './server';


const privateApi = {};

/**
 * Map with accepted arguments that should have value
 *
 * @type {Object}
 */
privateApi.argsMapWithVal = {
  c: 'config',
  config: 'config',
};

/**
 * Map with accepted arguments that do not require to have value
 *
 * @type {Object}
 */
privateApi.argsMapWithoutVal = {
  d: 'debug',
  debug: 'debug',
};

/**
 * Extract arguments that can be used
 *
 * @param {Array<String>} args
 * @return {Object} argsMap
 */
privateApi.extractArgs = (args) => {
  const acceptedArgsWithVal = Object.keys(privateApi.argsMapWithVal);
  const argWithValRegExp = new RegExp(
    `^\\s?--?(${acceptedArgsWithVal.join('|')})=(.*)`
  );
  const acceptedArgsWithoutVal = Object.keys(privateApi.argsMapWithoutVal);
  const argWithoutValRegExp = new RegExp(
    `^\\s?--?(${acceptedArgsWithoutVal.join('|')}).*`
  );

  return args
    .reduce(
      (acc, arg) => {
        let matches = arg.match(argWithValRegExp);

        if (matches && matches.length === 3) {
          const argKey = privateApi.argsMapWithVal[matches[1].trim()];
          const argVal = matches[2].trim();
          if (argKey && argVal) {
            acc[argKey] = argVal;
          }
        } else {
          matches = arg.match(argWithoutValRegExp);
          if (matches && matches.length === 2) {
            const argKey = privateApi.argsMapWithoutVal[matches[1].trim()];
            acc[argKey] = true;
          }
        }

        return acc;
      },
      {}
    );


};


const service = {};

/**
 * Parse arguments from cli and setup
 */
service.run = () => {
  // extract arguments that are useful
  const args = process.argv.slice(2);
  // create object with arguments
  const filteredArgs = privateApi.extractArgs(args);

  if (filteredArgs.hasOwnProperty('debug')) {
    debug.activate();
  }
  debug.block('\nUsing options:', filteredArgs);

  const configObj = config.get(filteredArgs.config);
  debug.block('\nUsing configuration:', JSON.stringify(configObj));

  createServer(configObj);

};


export default service;
