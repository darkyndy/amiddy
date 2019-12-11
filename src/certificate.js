import selfsigned from 'selfsigned';

const privateApi = {};

/**
 * Get DNS name that will be used as value for altNames
 *
 * @param {String} vhostName
 * @return {String} altName
 */
privateApi.getAltName = (vhostName) => {
  const parts = vhostName.split('.');
  const partsLen = parts.length;

  if (partsLen <= 2) {
    return vhostName;
  }

  const [, ...relevantParts] = parts;

  return `*.${relevantParts.join('.')}`;
};

const service = {};

/**
 * Generate certificate
 * @param {String} vhostName
 * @param {Object} [selfsignedConf]
 * @return {Object}
 */
service.generate = (vhostName, selfsignedConf) => {
  const conf = selfsignedConf || {};
  const selfsignedAttrs = conf.attrs || [
    {
      name: 'commonName',
      value: 'amiddy',
    },
    {
      name: 'organizationName',
      value: 'amiddy',
    },
  ];
  const selfsignedOpts = conf.opts || {
    algorithm: 'sha256',
    days: 365,
    extensions: [
      {
        cA: false,
        critical: true,
        name: 'basicConstraints',
      },
      {
        dataEncipherment: true,
        digitalSignature: true,
        keyCertSign: true,
        keyEncipherment: true,
        name: 'keyUsage',
        nonRepudiation: true,
      },
      {
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        name: 'extKeyUsage',
        serverAuth: true,
        timeStamping: true
      },
      {
        altNames: [
          {
            type: 2, // DNS
            value: privateApi.getAltName(vhostName),
          },
        ],
        name: 'subjectAltName',
      },
      {
        name: 'subjectKeyIdentifier',
      },
      {
        name: 'authorityKeyIdentifier',
      },
      {
        client: true,
        email: true,
        emailCA: true,
        name: 'nsCertType',
        objCA: true,
        objsign: true,
        server: true,
        sslCA: true,
      }
    ],
    keySize: 2048,
  };

  return selfsigned.generate(selfsignedAttrs, selfsignedOpts);
};


// only for testing
export {privateApi};

export default service;
