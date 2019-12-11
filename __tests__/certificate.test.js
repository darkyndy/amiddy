import selfsigned from 'selfsigned';

// testing file
import certificate, {privateApi} from '../src/certificate';


// mocks
jest.mock('selfsigned', () => (
  {
    generate: jest.fn().mockReturnValue(
      {
        cert: 'cert',
        private: 'private',
      }
    ),
  }
));


describe('server', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('privateApi.getAltName', () => {
    beforeEach(() => {
      testSpecificMocks.vhostName = 'darkyndy.example.com';
    });

    it('returns DNS name that will be used as value for altNames (use-case: sub-domain)', () => {
      expect(
        privateApi.getAltName(testSpecificMocks.vhostName)
      ).toEqual('*.example.com');
    });

    it('returns DNS name that will be used as value for altNames (use-case: domain)', () => {
      testSpecificMocks.vhostName = 'example.com';

      expect(
        privateApi.getAltName(testSpecificMocks.vhostName)
      ).toEqual('example.com');
    });

    it('returns DNS name that will be used as value for altNames (use-case: localhost)', () => {
      testSpecificMocks.vhostName = 'localhost';

      expect(
        privateApi.getAltName(testSpecificMocks.vhostName)
      ).toEqual('localhost');
    });

  });

  describe('generate', () => {
    beforeEach(() => {
      jest.spyOn(privateApi, 'getAltName').mockReturnValue('*.dns.name');
    });
    beforeEach(() => {
      testSpecificMocks.vhostName = 'darkyndy.example.com';
      testSpecificMocks.selfsignedConf = {
        attrs: [
          {
            name: 'commonName',
            value: 'darkyndy.com',
          },
        ],
        opts: {
          days: 365,
        },
      };
    });

    afterEach(() => {
      selfsigned.generate.mockClear();
      privateApi.getAltName.mockClear();
    });
    afterAll(() => {
      privateApi.getAltName.mockRestore();
    });

    it('generates self signed certificate using defaults when configuration is not provided', () => {
      certificate.generate(testSpecificMocks.vhostName);

      expect(
        selfsigned.generate
      ).toHaveBeenCalledWith(
        [
          {
            name: 'commonName',
            value: 'amiddy',
          },
          {
            name: 'organizationName',
            value: 'amiddy',
          },
        ],
        {
          algorithm: 'sha256',
          days: 365,
          extensions: [
            {
              cA: false,
              critical: true,
              name: 'basicConstraints'
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
                  type: 2,
                  value: '*.dns.name'
                },
              ],
              name: 'subjectAltName',
            },
            {
              name: 'subjectKeyIdentifier'
            },
            {
              name: 'authorityKeyIdentifier'
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
        },
      );
    });

    it('generates self signed certificate using defaults when configuration is not provided', () => {
      certificate.generate(testSpecificMocks.vhostName);

      expect(
        privateApi.getAltName
      ).toHaveBeenCalledWith(
        testSpecificMocks.vhostName
      );
    });

    it('generates self signed certificate using configuration provided', () => {
      certificate.generate(testSpecificMocks.vhostName, testSpecificMocks.selfsignedConf);

      expect(
        selfsigned.generate
      ).toHaveBeenCalledWith(
        testSpecificMocks.selfsignedConf.attrs,
        testSpecificMocks.selfsignedConf.opts,
      );
    });

    it('returns self signed certificate', () => {
      expect(
        certificate.generate(testSpecificMocks.selfsignedConf)
      ).toEqual(
        selfsigned.generate()
      );
    });

  });

});
