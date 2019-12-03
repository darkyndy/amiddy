import selfsigned from 'selfsigned';

// testing file
import certificate from '../src/certificate';


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

  describe('generate', () => {
    beforeEach(() => {

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
    });

    it('generates self signed certificate using defaults when configuration is not provided', () => {
      certificate.generate();

      expect(
        selfsigned.generate
      ).toHaveBeenCalledWith(
        null,
        {
          extensions: [
            {
              cA: true,
              name: 'basicConstraints',
            },
          ],
        },
      );
    });

    it('generates self signed certificate using configuration provided', () => {
      certificate.generate(testSpecificMocks.selfsignedConf);

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
