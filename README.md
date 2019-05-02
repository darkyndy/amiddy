<p align="center">
  <a href="https://travis-ci.org/darkyndy/amiddy">
    <img
      alt="Travis Status"
      src="https://travis-ci.org/darkyndy/amiddy.svg?branch=master"
    />
  </a>
  <a href="https://codecov.io/gh/darkyndy/amiddy">
    <img
      alt="Coverage Status"
      src="https://codecov.io/gh/darkyndy/amiddy/branch/master/graph/badge.svg"
    />
  </a>
  <a href="https://snyk.io/test/github/darkyndy/amiddy?targetFile=package.json">
    <img
      alt="Known Vulnerabilities"
      src="https://snyk.io/test/github/darkyndy/amiddy/badge.svg?targetFile=package.json"
      data-canonical-src="https://snyk.io/test/github/darkyndy/amiddy?targetFile=package.json"
      style="max-width:100%;"
    />
  </a>
  <a href="https://david-dm.org/darkyndy/amiddy">
    <img
      alt="dependencies status"
      src="https://david-dm.org/darkyndy/amiddy/status.svg"
    />
  </a>
  <a href="https://david-dm.org/darkyndy/amiddy?type=dev">
    <img
      alt="devDependencies status"
      src="https://david-dm.org/darkyndy/amiddy/dev-status.svg"
    />
  </a>
  <a href="https://www.npmjs.com/package/amiddy">
    <img
      alt="npm Downloads"
      src="https://img.shields.io/npm/dm/amiddy.svg?maxAge=57600"
    />
  </a>
  <a href="https://github.com/darkyndy/amiddy/blob/master/LICENSE">
    <img
      alt="MIT License"
      src="https://img.shields.io/npm/l/amiddy.svg"
    />
  </a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fdarkyndy%2Famiddy?ref=badge_shield">
    <img
      alt="FOSSA Status"
      src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fdarkyndy%2Famiddy.svg?type=shield"
    />
  </a>
  <br/>
  <a href="https://www.patreon.com/paul_comanici">
    <img
      alt="support the author"
      src="https://img.shields.io/badge/patreon-support%20the%20author-blue.svg"
    />
  </a>
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=T645WN5RWR6WS&source=url">
    <img
      alt="donate"
      src="https://img.shields.io/badge/paypal-donate-blue.svg"
    />
  </a>
</p>


# amiddy
Middleware package that makes development much simpler.
> Note: Documentation needs to be improved, visit IT repo as you may find better docs. 


## Installation
```sh
npm install --save-dev amiddy
```
Or if you are using [yarn](https://yarnpkg.com/en/)
```sh
yarn add --dev amiddy
```

## Usage
Add new script in `package.json`. Example:
```
"scripts": {
  "start-amiddy": "node amiddy"
}
```
After that start the server by running `npm run start-amiddy`

## Configuration

### Via `.amiddy` (Recommended)
You need to have at project root folder a file named `.amiddy` that contains valid json.
You just need to create a file with this name, complete json configuration and you can start the server.  

### Via CLI
Using `--config` or `-c` arguments you can provide path to the configuration file.
Example: `npm run start-amiddy --config=../path/to/file.json`

### Options
Abstract example:
```json
{
  "deps": [
    {
      "name": "127.0.0.2",
      "https": false,
      "port": 80,
      "patterns": [
        "/images/**"
      ]
    },
    {
      "name": "169.169.255.224",
      "https": false,
      "port": 8080,
      "patterns": [
        "/api/**"
      ]
    }
  ],
  "selfsigned": {
    "attrs": [
      {
        "name": "commonName",
        "value": "example.com"
      }
    ],
      "opts": {
      "days": 365
    }
  },
  "source": {
    "name": "127.0.0.1",
    "https": false,
    "port": 80
  },
  "proxy": {
    "changeOrigin": false,
    "ws": true
  },
  "vhost": {
    "name": "example.com",
    "https": false,
    "port": 80
  }
}
```
Are grouped in sections

#### deps
Array that has one or more objects where each object represents a dependency.
Every dependency should have patters that will resolve.

#### source
Source server, usually is your local server.

#### proxy
Proxy configuration.

#### vhost
vhost to use.

## Command Line Options

### `--config`, `-c`
Allows you to set the configuration file.

### `--debug`, `-d`
Allows you to see debug logs. Useful to see what is the configuration that was loaded.

## License

The MIT License (MIT)
