import selfsigned from 'selfsigned';

/**
 * Generate certificate
 * @param {Object} [selfsignedConf]
 * @return {Object}
 */
function generate(selfsignedConf) {
  const conf = selfsignedConf || {};
  const selfsignedAttrs = conf.attrs || null;
  const selfsignedOpts = conf.opts || {
    extensions: [
      {
        cA: true,
        name: 'basicConstraints',
      },
    ],
  };

  return selfsigned.generate(selfsignedAttrs, selfsignedOpts);
}


export default {
  generate,
};
