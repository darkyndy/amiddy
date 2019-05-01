
// testing file
import proxyUtils from '../../src/proxy/utils';

describe('proxy-utils', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });

  describe('buildUrl', () => {
    beforeEach(() => {
      testSpecificMocks.options = {
        https: true,
        name: '127.0.0.2',
        port: 3030,
      };
    });

    it('returns formatted url based on provided options', () => {
      expect(proxyUtils.buildUrl(testSpecificMocks.options))
        .toBe('https://127.0.0.2:3030');
    });

    it('returns formatted url based on defaults when options is not provided', () => {
      expect(proxyUtils.buildUrl())
        .toBe('http://127.0.0.1:3000');
    });

    it('returns formatted url based on provided options and defaults when options contains partial data', () => {
      testSpecificMocks.options.name = undefined;
      expect(proxyUtils.buildUrl(testSpecificMocks.options))
        .toBe('https://127.0.0.1:3030');
    });
  });

  describe('getDependency', () => {
    beforeEach(() => {
      testSpecificMocks.deps = [
        {
          name: '127.0.0.2',
          patterns: [
            '/no-match/**',
            '/hmm/**',
          ],
        },
        null,
        {
          name: '127.0.0.3',
        },
        {
          name: '127.0.0.4',
          patterns: [
            '/projects/*',
            '/idea/**',
          ],
        },
        {
          name: '127.0.0.5',
          patterns: [
            '/projects/**',
          ],
        },
      ];
      testSpecificMocks.reqUrl = 'https://darkyndy.com/projects/amiddy';
    });

    it('returns the first dependency that could resolve the request url if there is a pattern match', () => {
      expect(proxyUtils.getDependency(testSpecificMocks.deps, testSpecificMocks.reqUrl))
        .toEqual(
          testSpecificMocks.deps[3]
        );
    });


    it('returns undefined if there is no pattern match', () => {
      testSpecificMocks.reqUrl = 'https://darkyndy.com/project/amiddy';
      expect(proxyUtils.getDependency(testSpecificMocks.deps, testSpecificMocks.reqUrl))
        .toBe(
          undefined
        );
    });

  });

  describe('extendOptions', () => {
    beforeAll(() => {
      jest.spyOn(proxyUtils, 'buildUrl').mockReturnValue('proxyUtils::buildurl');
    });
    beforeEach(() => {
      testSpecificMocks.proxyOptions = {
        _initial: 'value',
        target: '127.0.0.1',
      };
      testSpecificMocks.ssl = {
        cert: 'cert',
        private: 'private',
      };
      testSpecificMocks.dependency = {
        name: '127.0.0.4',
        patterns: [
          '/projects/*',
          '/idea/**',
        ],
      };
    });

    afterEach(() => {
      proxyUtils.buildUrl.mockClear();
    });
    afterAll(() => {
      proxyUtils.buildUrl.mockRestore();
    });

    it('nothing happens when dependency has falsy value', () => {
      testSpecificMocks.dependency = undefined;
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          target: '127.0.0.1',
        }
      );
    });

    it('prepares url for target', () => {
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(proxyUtils.buildUrl).toHaveBeenCalledWith(
        testSpecificMocks.dependency
      );
    });

    it('updates by reference target from proxy options', () => {
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          target: proxyUtils.buildUrl(),
        }
      );
    });

    it('does not update/add ssl on proxy options when dependency has secure connection and ssl argument has falsy value', () => {
      testSpecificMocks.dependency.https = true;
      testSpecificMocks.ssl = undefined;
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          target: proxyUtils.buildUrl(),
        }
      );
    });

    it('updates/adds by reference ssl from proxy options when dependency has secure connection and ssl argument has truthy value', () => {
      testSpecificMocks.dependency.https = true;
      proxyUtils.extendOptions(testSpecificMocks.proxyOptions, testSpecificMocks.ssl, testSpecificMocks.dependency);

      expect(testSpecificMocks.proxyOptions).toEqual(
        {
          _initial: 'value',
          ssl: {
            cert: testSpecificMocks.ssl.cert,
            key: testSpecificMocks.ssl['private'],
          },
          target: proxyUtils.buildUrl(),
        }
      );
    });

  });

});
