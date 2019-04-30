
import chalk from 'chalk';


/**
 * Private api for logging
 *
 * @protected
 * @const {Object}
 */
const privateApi = {};

/**
 * Map of method name and background color to use
 *
 * @const {Object}
 */
privateApi.methodBg = {
  DELETE: chalk.bgRed,
  GET: chalk.bgGreen,
  HEAD: chalk.bgCyanBright,
  PATCH: chalk.bgCyan,
  POST: chalk.bgBlue,
  PUT: chalk.bgBlueBright,
};

/**
 * Map of status code and color.
 *
 * @const {Object}
 */
privateApi.statusColor = {
  5: chalk.red,
  4: chalk.redBright,
  3: chalk.yellow,
  2: chalk.green,
};

/**
 * Map of colors for different type of messages
 *
 * @const {Object}
 */
privateApi.messageColors = {
  error: {
    category: chalk.bgRed.black,
    text: chalk.red,
  },
  success: {
    category: chalk.bgGreen.black,
    text: chalk.green,
  },
};

/**
 * Log message
 *
 * @param {String} message
 * @param {String} [category]
 * @param {String} type
 */
privateApi.message = (message, category, type) => {
  const color = privateApi.messageColors[type];

  const categoryLog = category ? color.category(`[${category}]`) : '';
  console.log(`${categoryLog} ${color.text(message)}`); // eslint-disable-line no-console
};

/**
 * Log method name
 *
 * @param {String} name - method name
 * @returns {String}
 */
privateApi.method = (name) => {
  const bgColor = privateApi.methodBg[name] || chalk.bgMagenta;

  return bgColor.black(` ${name} `);
};

/**
 * Log status code
 *
 * @param {String} code - status code
 * @returns {String}
 */
privateApi.status = (code) => {
  const codePrefix = Math.floor(code / 100);

  const color = codePrefix[codePrefix] || chalk.magenta;

  return color(` ${code} `);
};

/**
 * Log time for execution
 *
 * @param {Number} start - start time in ms
 * @param {Number} now - current time in ms
 * @returns {String}
 */
privateApi.time = (start, now) => {
  const time = now - start;
  let str = time.toString();
  let unit = 'ms';

  if (time > 1000) {
    const seconds = time / 1000;
    const fractionDigit = seconds > 100 ?
      0 : seconds > 10 ?
        1 : 2;
    str = seconds.toFixed(fractionDigit);
    unit = 's';
  }

  return chalk.gray(`${str.padStart(5, ' ')} ${unit.padStart(2, ' ')} `);
};


const service = {};

/**
 * Log response
 *
 * @param {Object} data - request data
 * @param {Object} res - response data
 */
service.response = (data, res) => {
  const now = Date.now();
  const msgParts = [
    privateApi.method(data.method),
    privateApi.status(res.statusCode),
    privateApi.time(data.startTime, now),
    data.uri,
  ];

  console.log(msgParts.join('')); // eslint-disable-line no-console
};

/**
 * Log error
 *
 * @param {String} message
 * @param {String} [category]
 */
service.error = (message, category) => {
  privateApi.message(message, category, 'error');
};

/**
 * Log success
 *
 * @param {String} message
 * @param {String} [category]
 */
service.success = (message, category) => {
  privateApi.message(message, category, 'success');
};

// only for testing
export {privateApi};

export default service;
