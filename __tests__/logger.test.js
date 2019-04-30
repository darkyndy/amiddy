// testing file
import logger, {privateApi} from '../src/logger';


describe('logger', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('success', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'message').mockReturnValue('message');
    });
    beforeEach(() => {
      testSpecificMocks.message = 'message for logging';
      testSpecificMocks.category = 'group';
    });

    afterEach(() => {
      privateApi.message.mockClear();
    });
    afterAll(() => {
      privateApi.message.mockRestore();
    });

    it('prepares message for logging', () => {
      logger.success(testSpecificMocks.message, testSpecificMocks.category);

      expect(privateApi.message).toHaveBeenCalledWith(
        testSpecificMocks.message,
        testSpecificMocks.category,
        'success',
      );
    });
  });

});
