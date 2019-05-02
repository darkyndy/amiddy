
// testing file
import config, {privateApi} from '../../src/config/index';


import path from 'path';


import debug from '../../src/debug';


// mocks
jest.mock('path', () => (
  {
    isAbsolute: jest.fn().mockReturnValue(true),
    resolve: jest.fn().mockReturnValue('path::resolve'),
  }
));

jest.mock('../../src/debug', () => (
  {
    log: jest.fn(),
  }
));


describe('config', () => {
  let testSpecificMocks;

  beforeEach(() => {
    testSpecificMocks = {};
  });


  describe('privateApi.readFile', () => {

    it('returns content of the file as string when file exists', () => {
      expect(privateApi.readFile('__tests__/__fixtures__/config.json')).toMatchSnapshot();
    });

    it('throws error when file does not exists', () => {
      expect(() => {
        privateApi.readFile('__tests__/__fixtures__/noap.json');
      }).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.loadJSONConfigFile', () => {

    afterEach(() => {
      debug.log.mockClear();
    });

    it('logs debug message with the file path', () => {
      privateApi.loadJSONConfigFile('__tests__/__fixtures__/config.json');

      expect(debug.log).toHaveBeenCalledWith(
        'Loading JSON config file: __tests__/__fixtures__/config.json'
      );
    });

    it('logs debug message with the file path and error message if there was a problem', () => {
      try {
        privateApi.loadJSONConfigFile('__tests__/__fixtures__/invalid.json');
      } catch (e) {
      }

      expect(
        debug.log.mock.calls
      ).toEqual(
        [
          [
            'Loading JSON config file: __tests__/__fixtures__/invalid.json',
          ],
          [
            'Error reading JSON file: __tests__/__fixtures__/invalid.json',
          ],
        ]
      );
    });

    it('returns content of the file as object when file exists and is valid', () => {
      expect(privateApi.loadJSONConfigFile('__tests__/__fixtures__/config.json')).toMatchSnapshot();
    });

    it('throws error when file exists but does not have valid json', () => {
      expect(() => {
        privateApi.loadJSONConfigFile('__tests__/__fixtures__/invalid.json');
      }).toThrowErrorMatchingSnapshot();
    });

    it('throws error when file does not exists', () => {
      expect(() => {
        privateApi.loadJSONConfigFile('__tests__/__fixtures__/noap.json');
      }).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.isFile', () => {

    it('returns true when provided path as string represents a file', () => {
      expect(privateApi.isFile('__tests__/__fixtures__/config.json')).toBe(true);
    });

    it('returns false when provided path as string is a folder', () => {
      expect(privateApi.isFile('__tests__/__fixtures__')).toBe(false);
    });

    it('returns false when provided path as string is invalid', () => {
      expect(privateApi.isFile('__tests__/__fixtures__/noap.json')).toBe(false);
    });

  });

  describe('privateApi.getAbsolutePath', () => {
    beforeAll(() => {
      jest.spyOn(process, 'cwd').mockReturnValue('process::cwd');
      jest.spyOn(privateApi, 'isFile').mockReturnValue(true);
    });
    beforeEach(() => {
      testSpecificMocks.pathToResolve = 'path/to/resolve';
    });

    afterEach(() => {
      path.isAbsolute.mockClear();
      path.resolve.mockClear();
      process.cwd.mockClear();
      privateApi.isFile.mockClear();
    });
    afterAll(() => {
      process.cwd.mockRestore();
      privateApi.isFile.mockRestore();
    });

    it('determines current working directory of the Node.js process', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        process.cwd
      ).toHaveBeenCalledWith();
    });

    it('determines if provided path is absolute', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        path.isAbsolute
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve
      );
    });

    it('tries to resolve path when is not absolute', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        path.resolve
      ).toHaveBeenCalledWith(
        'process::cwd',
        testSpecificMocks.pathToResolve,
      );
    });

    it('determines if we are working with a file based on absolute path (path is absolute)', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('determines if we are working with a file based on absolute path (path is relative)', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        'path::resolve',
      );
    });

    it('returns absolute path when it represents a file (path is absolute)', () => {
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('returns absolute path when it represents a file (path is relative)', () => {
      path.isAbsolute.mockReturnValueOnce(false);
      privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);

      expect(
        privateApi.isFile
      ).toHaveBeenCalledWith(
        'path::resolve',
      );
    });

    it('throws error when the path does not represents a file', () => {
      privateApi.isFile.mockReturnValueOnce(false);

      expect(
        () => {
          privateApi.getAbsolutePath(testSpecificMocks.pathToResolve);
        }
      ).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.validate', () => {
    beforeEach(() => {
      testSpecificMocks.configObj = {
        deps: [
          {
            name: '127.0.0.2',
            patterns: [
              '/images/**',
            ],
            port: 3000,
          },
          {
            name: '127.0.0.1',
            patterns: [
              '/api/**',
            ],
            port: 8080,
          },
        ],
        proxy: {
          ws: true,
        },
        source: {
          name: '127.0.0.1',
          port: 3000,
        },
        vhost: {
          name: 'http://github.com',
          port: 80,
        },
      };
    });

    it('no error is thrown when config object is valid', () => {
      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).not.toThrow();
    });

    it('throws error when missing `vhost`', () => {
      testSpecificMocks.configObj.vhost = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when missing `vhost.name`', () => {
      testSpecificMocks.configObj.vhost.name = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when missing `source`', () => {
      testSpecificMocks.configObj.source = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when missing `source.name`', () => {
      testSpecificMocks.configObj.source.name = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when missing `deps`', () => {
      testSpecificMocks.configObj.deps = undefined;

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

    it('throws error when `deps` is not an array', () => {
      testSpecificMocks.configObj.deps = {};

      expect(
        () => {
          privateApi.validate(testSpecificMocks.configObj);
        }
      ).toThrowErrorMatchingSnapshot();
    });

  });

  describe('privateApi.setDefaults', () => {
    beforeEach(() => {
      testSpecificMocks.configObj = {
        proxy: {
          ws: true,
        },
        source: {
          name: '127.0.0.1',
        },
        vhost: {
          name: 'http://github.com',
        },
      };
    });

    it('adds missing properties for source & vhost (https has falsy value)', () => {
      privateApi.setDefaults(testSpecificMocks.configObj);

      expect(testSpecificMocks.configObj).toEqual(
        {
          proxy: {
            ws: true,
          },
          source: {
            https: false,
            name: '127.0.0.1',
            port: 80,
          },
          vhost: {
            https: false,
            name: 'http://github.com',
            port: 80,
          },
        }
      );
    });

    it('adds missing properties for source & vhost (https has truthy value)', () => {
      testSpecificMocks.configObj.source.https = true;
      testSpecificMocks.configObj.vhost.https = true;
      privateApi.setDefaults(testSpecificMocks.configObj);

      expect(testSpecificMocks.configObj).toEqual(
        {
          proxy: {
            ws: true,
          },
          source: {
            https: true,
            name: '127.0.0.1',
            port: 443,
          },
          vhost: {
            https: true,
            name: 'http://github.com',
            port: 443,
          },
        }
      );
    });

    it('no chane is applied as object contained all values', () => {
      testSpecificMocks.configObj.source.https = false;
      testSpecificMocks.configObj.source.port = 3000;
      testSpecificMocks.configObj.vhost.https = true;
      testSpecificMocks.configObj.vhost.port = 8080;
      privateApi.setDefaults(testSpecificMocks.configObj);

      expect(testSpecificMocks.configObj).toEqual(
        {
          proxy: {
            ws: true,
          },
          source: {
            https: false,
            name: '127.0.0.1',
            port: 3000,
          },
          vhost: {
            https: true,
            name: 'http://github.com',
            port: 8080,
          },
        }
      );
    });

  });

  describe('get', () => {
    beforeAll(() => {
      jest.spyOn(privateApi, 'setDefaults').mockReturnValue(undefined);
      jest.spyOn(privateApi, 'validate').mockReturnValue(undefined);
      jest.spyOn(privateApi, 'getAbsolutePath').mockReturnValue('/absolute/path/to/file');
      jest.spyOn(privateApi, 'loadJSONConfigFile').mockReturnValue(
        {
          data: 'confiObj',
        }
      );
    });
    beforeEach(() => {
      testSpecificMocks.pathToResolve = 'path/to/resolve';
    });

    afterEach(() => {
      privateApi.setDefaults.mockClear();
      privateApi.validate.mockClear();
      privateApi.getAbsolutePath.mockClear();
      privateApi.loadJSONConfigFile.mockClear();
    });
    afterAll(() => {
      privateApi.setDefaults.mockRestore();
      privateApi.validate.mockRestore();
      privateApi.getAbsolutePath.mockRestore();
      privateApi.loadJSONConfigFile.mockRestore();
    });

    it('uses `.amiddy` as file when path has falsy value', () => {
      config.get();

      expect(
        privateApi.getAbsolutePath
      ).toHaveBeenCalledWith(
        '.amiddy',
      );
    });

    it('retrieves absolute path to file', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.getAbsolutePath
      ).toHaveBeenCalledWith(
        testSpecificMocks.pathToResolve,
      );
    });

    it('loads json file', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.loadJSONConfigFile
      ).toHaveBeenCalledWith(
        privateApi.getAbsolutePath(),
      );
    });

    it('validates config object', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.validate
      ).toHaveBeenCalledWith(
        {
          data: 'confiObj',
        },
      );
    });

    it('set defaults on config object', () => {
      config.get(testSpecificMocks.pathToResolve);

      expect(
        privateApi.setDefaults
      ).toHaveBeenCalledWith(
        {
          data: 'confiObj',
        },
      );
    });

    it('returns config object if is valid', () => {
      expect(
        config.get(testSpecificMocks.pathToResolve)
      ).toEqual(
        {
          data: 'confiObj',
        },
      );
    });

    it('throws error if config object is not valid', () => {
      privateApi.validate.mockImplementationOnce(
        () => {
          throw 'Throw';
        }
      );

      expect(
        () => {
          config.get(testSpecificMocks.pathToResolve);
        }
      ).toThrow('Throw');
    });

  });

});
