
// testing file
import certificate from '../src/certificate';


import selfsigned from 'selfsigned';


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

  describe('generate', () => {
    afterEach(() => {
      selfsigned.generate.mockClear();
    });

    it('generates self signed certificate', () => {
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

    it('returns self signed certificate', () => {
      expect(
        certificate.generate()
      ).toEqual(
        selfsigned.generate()
      );
    });

  });

});
