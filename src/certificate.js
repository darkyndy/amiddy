import selfsigned from 'selfsigned';

/**
 * Generate certificate
 * @returns {Object}
 */
function generate() {
  return selfsigned.generate(null, {
    extensions: [
      {
        name: 'basicConstraints',
        cA: true
      },
    ],
  });
}


export default {
  generate,
};
