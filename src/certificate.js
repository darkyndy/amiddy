import selfsigned from 'selfsigned';

/**
 * Generate certificate
 * @returns {Object}
 */
function generate() {
  return selfsigned.generate(null, {
    extensions: [
      {
        cA: true,
        name: 'basicConstraints',
      },
    ],
  });
}


export default {
  generate,
};
