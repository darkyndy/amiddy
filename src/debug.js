
let isActive = false;

const service = {};

service.activate = () => {
  isActive = true;
};

/**
 * Log debug messages
 *
 * @param {String} msg
 */
service.log = (msg) => {
  isActive && console.debug(msg); // eslint-disable-line no-console
};

/**
 * Log debug messages
 *
 * @param {...String} msgs
 */
service.block = (...msgs) => {
  isActive && msgs.forEach(
    (msg) => {
      console.debug(msg); // eslint-disable-line no-console
    }
  );
};

export default service;
